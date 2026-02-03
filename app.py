#!/usr/bin/env python3
import os
import aws_cdk as cdk
from cloudsentry_ai.pipeline_stack import PipelineStack

app = cdk.App()

# We deploy the PIPELINE stack, which in turn deploys the application stack
PipelineStack(app, "CloudSentryPipelineStack",
    env=cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION')),
)

app.synth()
