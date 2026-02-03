import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { fetchAuthSession } from 'aws-amplify/auth';

export async function simulateThreat() {
    console.log("Simulating Threat...");

    try {
        const session = await fetchAuthSession();
        if (!session.credentials) throw new Error("No credentials");

        const ebClient = new EventBridgeClient({
            region: "us-east-1",
            credentials: session.credentials
        });

        // Simulate a "StopLogging" event (HIGH Risk)
        const eventDetail = {
            eventVersion: "1.08",
            userIdentity: {
                type: "IAMUser",
                principalId: "AIDAEXAMPLEUSER",
                arn: "arn:aws:iam::123456789012:user/hacker",
                accountId: "123456789012",
                accessKeyId: "AKIAEXAMPLEKEY",
                userName: "hacker"
            },
            eventTime: new Date().toISOString(),
            eventSource: "cloudtrail.amazonaws.com",
            eventName: "StopLogging",
            awsRegion: "us-east-1",
            sourceIPAddress: "192.0.2.1", // Suspicious IP
            userAgent: "aws-cli/1.18.147 Python/2.7.18 Linux/4.14.133-113.105.amzn2.x86_64 botocore/1.17.44",
            requestParameters: {
                name: "all-trails"
            },
            responseElements: null,
            requestID: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
            eventID: "c1d2e3f4-g5h6-7890-i1j2-k3l4m5n6o7p8",
            eventType: "AwsApiCall",
            recipientAccountId: "123456789012"
        };

        const command = new PutEventsCommand({
            Entries: [
                {
                    Source: "custom.simulation",
                    DetailType: "AWS API Call via CloudTrail",
                    Detail: JSON.stringify(eventDetail),
                    EventBusName: "default"
                }
            ]
        });

        const response = await ebClient.send(command);
        console.log("Event sent:", response);
        return { success: true, message: "Threat Simulated: CloudTrail StopLogging" };
    } catch (error) {
        console.error("Error sending event:", error);
        return { success: false, message: "Failed to simulate threat" };
    }
}

export async function remediateThreat(action: string, resourceId?: string) {
    // Basic mapping check
    if (!action.includes("StopLogging") && !action.includes("CloudTrail")) {
        // Allow it to proceed for "CloudTrail Logging Disabled" or similar
    }

    // Always map to EnableCloudTrail for this demo
    const lambdaAction = "EnableCloudTrail";

    try {
        const session = await fetchAuthSession();
        if (!session.credentials) throw new Error("No credentials");

        const lambdaClient = new LambdaClient({
            region: "us-east-1",
            credentials: session.credentials
        });

        const command = new InvokeCommand({
            FunctionName: "CloudsentryAiStack-RemediatorLambda",
            Payload: JSON.stringify({ action: lambdaAction, resource_id: resourceId })
        });

        const response = await lambdaClient.send(command);
        const payload = JSON.parse(new TextDecoder().decode(response.Payload));

        if (payload.status === "SUCCESS") {
            return { success: true, message: payload.message };
        } else {
            return { success: false, message: `Remediation Failed: ${payload.message}` };
        }
    } catch (error) {
        console.error("Remediation error:", error);
        return { success: false, message: "Failed to invoke remediation." };
    }
}
