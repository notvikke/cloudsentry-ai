from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_lambda as _lambda,
    aws_events as events,
    aws_events_targets as targets,
    aws_iam as iam,
    aws_stepfunctions as sfn,
    aws_stepfunctions_tasks as sfn_tasks,
    aws_dynamodb as dynamodb,
    aws_sns as sns,
    aws_cognito as cognito,
    aws_cognito as cognito,
    aws_s3 as s3,
    aws_sqs as sqs,
    aws_cloudwatch as cloudwatch,
    CfnOutput
)
from constructs import Construct

class CloudsentryAiStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 1. The Detector Lambda (The Ear)
        detector_lambda = _lambda.Function(
            self, "DetectorLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="detector.handler",
            code=_lambda.Code.from_asset("lambda"),
            description="Analyzes AWS events for security risks",
            timeout=Duration.seconds(30), # AI models can take time
            tracing=_lambda.Tracing.ACTIVE # Enable X-Ray Tracing
        )


        
        # Grant Bedrock permissions
        detector_lambda.add_to_role_policy(iam.PolicyStatement(
            actions=["bedrock:InvokeModel"],
            resources=[
                "arn:aws:bedrock:us-east-1::foundation-model/*",
                "arn:aws:bedrock:us-east-1:*:inference-profile/*"
            ]
        ))

        # --- Step Functions Workflow ---
        
        # Task 1: Analyze Event
        analyze_task = sfn_tasks.LambdaInvoke(
            self, "AnalyzeEvent",
            lambda_function=detector_lambda,
            output_path="$.Payload" # Pass the Lambda's return value to the next state
        )

        # --- Phase 5: Storage & Notifications ---
        
        # 4. DynamoDB Table (Memory)
        table = dynamodb.Table(
            self, "SecurityFindings",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            removal_policy=RemovalPolicy.DESTROY # For dev only
        )
        
        # 5. SNS Topic (Voice)
        topic = sns.Topic(self, "SecurityAlertsTopic", display_name="CloudSentry Alerts")
        
        # --- Step Functions Workflow Steps ---
        
        # Step: Store Finding (DynamoDB)
        store_finding = sfn_tasks.DynamoPutItem(
            self, "Store Finding",
            table=table,
            item={
                "id": sfn_tasks.DynamoAttributeValue.from_string(sfn.JsonPath.string_at("$.original_event.id")),
                "timestamp": sfn_tasks.DynamoAttributeValue.from_string(sfn.JsonPath.string_at("$.original_event.time")),
                "risk_level": sfn_tasks.DynamoAttributeValue.from_string(sfn.JsonPath.string_at("$.risk_level")),
                "analysis": sfn_tasks.DynamoAttributeValue.from_string(sfn.JsonPath.json_to_string(sfn.JsonPath.object_at("$.full_analysis"))),
                "event": sfn_tasks.DynamoAttributeValue.from_string(sfn.JsonPath.json_to_string(sfn.JsonPath.object_at("$.original_event")))
            },
            result_path=sfn.JsonPath.DISCARD # Don't overwrite the input
        )
        
        # Step: Send Alert (SNS)
        send_alert = sfn_tasks.SnsPublish(
            self, "Send Alert",
            topic=topic,
            message=sfn.TaskInput.from_object({
                "mode": "HIGH RISK ALERT",
                "analysis": sfn.JsonPath.object_at("$.full_analysis"),
                "event": sfn.JsonPath.object_at("$.original_event")
            }),
            subject="CloudSentry: HIGH RISK Detected"
        )
        
        # Workflow Logic
        high_risk_chain = store_finding.next(send_alert)
        low_risk_chain = store_finding
        
        choice_state = sfn.Choice(self, "Is High Risk?")
        
        # Condition: If risk_level is HIGH or CRITICAL
        condition_high = sfn.Condition.or_(
            sfn.Condition.string_equals("$.risk_level", "HIGH"),
            sfn.Condition.string_equals("$.risk_level", "CRITICAL")
        )
        
        choice_state.when(condition_high, high_risk_chain)
        choice_state.otherwise(low_risk_chain)
        
        # State Machine Definition
        definition = analyze_task.next(choice_state)
        
        state_machine = sfn.StateMachine(
            self, "SecurityAnalysisWorkflow",
            definition=definition,
            timeout=Duration.minutes(5)
        )

        # 6. Remediator Lambda (The Shield)
        remediator_lambda = _lambda.Function(
            self, "RemediatorLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="remediator.handler",
            code=_lambda.Code.from_asset("lambda"),
            description="Executes automated security remediation",
            timeout=Duration.seconds(30),
            tracing=_lambda.Tracing.ACTIVE # Enable X-Ray Tracing
        )
        
        # Grant Permissions to Fix Things
        remediator_lambda.add_to_role_policy(iam.PolicyStatement(
            actions=["cloudtrail:StartLogging", "cloudtrail:ListTrails", "cloudtrail:DescribeTrails"],
            resources=["*"]
        ))

        # 2. EventBridge Rule (The Trigger)
        # Listens for S3 CreateBucket via CloudTrail
        # Note: You must have CloudTrail enabled in your account for this to work
        # 2. EventBridge Rule (The Trigger)
        # Listens for S3 CreateBucket via CloudTrail
        # Note: You must have CloudTrail enabled in your account for this to work
        rule = events.Rule(
            self, "S3CreateBucketRule",
            event_pattern=events.EventPattern(
                source=["aws.s3", "aws.cloudtrail", "aws.ec2", "custom.simulation"],
                detail_type=["AWS API Call via CloudTrail"],
                detail={
                    "eventName": [
                        "CreateBucket",
                        "StopLogging",
                        "DeleteTrail",
                        "AuthorizeSecurityGroupIngress"
                    ]
                }
            )
        )

        # --- NEW FEATURES: S3 & SQS ---

        # Feature 1: SSQ Dead Letter Queue (Reliability)
        # If the Step Function fails to trigger, the event goes here.
        dlq = sqs.Queue(
            self, "ThreatDetectionDLQ",
            retention_period=Duration.days(14)
        )

        # 3. Connect Rule -> State Machine (NOT Lambda)
        # Added DLQ to ensure no events are lost
        rule.add_target(targets.SfnStateMachine(state_machine, dead_letter_queue=dlq))

        # Feature 2: S3 Evidence Locker (Storage)
        # Stores full JSON payloads of CRITICAL/HIGH risks for forensics
        evidence_bucket = s3.Bucket(
            self, "EvidenceLocker",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY, # For dev only (would use RETAIN in prod)
            auto_delete_objects=True # For dev only
        )
        
        # Give Lambda permission to write to this bucket
        evidence_bucket.grant_write(detector_lambda)
        
        # Pass Bucket Nmae to Lambda
        detector_lambda.add_environment("EVIDENCE_BUCKET_NAME", evidence_bucket.bucket_name)

        CfnOutput(self, "EvidenceBucketName", value=evidence_bucket.bucket_name)
        CfnOutput(self, "DLQUrl", value=dlq.queue_url)

        # 7. Authentication (Cognito)
        user_pool = cognito.UserPool(
            self, "CloudSentryUserPool",
            self_sign_up_enabled=True,
            sign_in_aliases=cognito.SignInAliases(email=True),
            auto_verify=cognito.AutoVerifiedAttrs(email=True),
            password_policy=cognito.PasswordPolicy(
                min_length=8,
                require_digits=True,
                require_lowercase=True,
                require_uppercase=True
            ),
            removal_policy=RemovalPolicy.DESTROY # Dev only
        )

        user_pool_client = user_pool.add_client(
            "CloudSentryClient",
            user_pool_client_name="CloudSentryFrontend",
            generate_secret=False # Required for web apps
        )

        # Outputs
        CfnOutput(self, "UserPoolId", value=user_pool.user_pool_id)
        CfnOutput(self, "UserPoolClientId", value=user_pool_client.user_pool_client_id)

        # 8. Identity Pool (Bridge to AWS Services)
        identity_pool = cognito.CfnIdentityPool(
            self, "CloudSentryIdentityPool",
            allow_unauthenticated_identities=False,
            cognito_identity_providers=[
                cognito.CfnIdentityPool.CognitoIdentityProviderProperty(
                    client_id=user_pool_client.user_pool_client_id,
                    provider_name=user_pool.user_pool_provider_name
                )
            ]
        )
        
        CfnOutput(self, "IdentityPoolId", value=identity_pool.ref)

        # 9. IAM Roles for Identity Pool
        # Authenticated Role
        authenticated_role = iam.Role(
            self, "CloudSentryAuthRole",
            assumed_by=iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    "StringEquals": {
                        "cognito-identity.amazonaws.com:aud": identity_pool.ref
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                },
                "sts:AssumeRoleWithWebIdentity"
            )
        )

        # Grant Permissions to the Authenticated Role
        # Allow putting events to EventBridge (Simulate Threat)
        authenticated_role.add_to_policy(iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions=["events:PutEvents"],
            resources=["*"] # In production, restrict to specific Event Bus ARN
        ))
        
        # Allow invoking Remediator Lambda (Remediate Threat)
        remediator_lambda.grant_invoke(authenticated_role)
        
        # Allow reading DynamoDB Findings (Real-time Data)
        table.grant_read_data(authenticated_role)
        
        # Allow reading DynamoDB Findings (Real-time Data) (Already in place? No, need to add)
        table.grant_read_data(authenticated_role)

        # Attach Role to Identity Pool
        cognito.CfnIdentityPoolRoleAttachment(
            self, "IdentityPoolRoleAttachment",
            identity_pool_id=identity_pool.ref,
            roles={
                "authenticated": authenticated_role.role_arn
            }
        )

        # --- FEATURE: CloudWatch Dashboard (Observability) ---
        dashboard = cloudwatch.Dashboard(
            self, "CloudSentryDashboard",
            dashboard_name="CloudSentry-CISO-Dashboard"
        )

        dashboard.add_widgets(
            cloudwatch.GraphWidget(
                title="Threat Detection Volume",
                left=[detector_lambda.metric_invocations()],
                right=[detector_lambda.metric_errors()],
                width=12
            ),
            cloudwatch.GraphWidget(
                title="AI Analysis Latency",
                left=[detector_lambda.metric_duration()],
                width=12
            ),
            cloudwatch.SingleValueWidget(
                title="Critical Risks Detected",
                metrics=[
                    cloudwatch.Metric(
                        namespace='CloudSentry/Security',
                        metric_name='SecurityRiskDetected',
                        dimensions_map={'RiskLevel': 'CRITICAL'}
                    ),
                    cloudwatch.Metric(
                        namespace='CloudSentry/Security',
                        metric_name='SecurityRiskDetected',
                        dimensions_map={'RiskLevel': 'HIGH'}
                    )
                ],
                width=6
            ),
            cloudwatch.SingleValueWidget(
                title="Failed/Dropped Events (DLQ)",
                metrics=[dlq.metric_approximate_number_of_messages_visible()],
                width=6
            )
        )

        CfnOutput(self, "DashboardURL", 
            value=f"https://console.aws.amazon.com/cloudwatch/home?region={self.region}#dashboards:name=CloudSentry-CISO-Dashboard"
        )
