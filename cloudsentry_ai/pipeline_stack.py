from aws_cdk import (
    Stack,
    pipelines as pipelines,
    aws_codepipeline as codepipeline,
    aws_codebuild as codebuild,
    SecretValue
)
from constructs import Construct
from cloudsentry_ai.cloudsentry_ai_stack import CloudsentryAiStack
import aws_cdk as cdk

class PipelineStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 1. Define the Source (GitHub)
        # We use CodeStar Connections. You MUST create this connection manually in AWS Console first!
        # Context: CodePipeline -> Settings -> Connections -> Create Connection (GitHub)
        # Then replace the ARN below or pass it via context/secrets.
        git_connection_arn = "arn:aws:codeconnections:us-east-1:736047917925:connection/753a970b-bf83-461c-972e-3e971efd2897"

        source_step = pipelines.CodePipelineSource.connection(
            "notvikke/cloudsentry-ai",
            "main",
            connection_arn=git_connection_arn
        )

        # 2. Define the Build Step (Synth)
        synth_step = pipelines.ShellStep(
            "Synth",
            input=source_step,
            commands=[
                "npm install -g aws-cdk",
                "pip install -r requirements.txt",
                "cdk synth"
            ]
        )

        # 3. Create the Pipeline
        pipeline = pipelines.CodePipeline(
            self,
            "CloudSentryPipeline",
            synth=synth_step,
            cross_account_keys=False,
            docker_enabled_for_synth=True,
        )

        # 4. Add the Application Stage
        # This deploys the actual CloudSentryAiStack
        deploy_stage = CloudsentryAppStage(self, "Deploy")
        pipeline.add_stage(deploy_stage)

class CloudsentryAppStage(cdk.Stage):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        
        CloudsentryAiStack(self, "CloudsentryAiStack")
