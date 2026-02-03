import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { SecurityFinding } from "./mockData";
import { fetchAuthSession } from 'aws-amplify/auth';

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE!;

export async function getRealTimeFindings(): Promise<SecurityFinding[]> {
    try {
        const session = await fetchAuthSession();
        if (!session.credentials) {
            console.warn("No credentials found");
            return [];
        }

        const client = new DynamoDBClient({
            region: "us-east-1",
            credentials: session.credentials
        });
        const docClient = DynamoDBDocumentClient.from(client);

        const command = new ScanCommand({
            TableName: TABLE_NAME,
        });

        const response = await docClient.send(command);
        const items = response.Items || [];

        return items.map((item: Record<string, any>) => {
            // Parse the JSON strings stored in DynamoDB
            let analysis = { reasoning: "No analysis provided", action_summary: "Unknown Event" };
            let event = { detail: { eventName: "Unknown" } };

            try {
                if (item.analysis) analysis = JSON.parse(item.analysis);
                if (item.event) event = JSON.parse(item.event);
            } catch (e) {
                console.error("Failed to parse finding data", e);
            }

            return {
                id: item.id || 'unknown',
                timestamp: item.timestamp || new Date().toISOString(),
                risk: item.risk_level || 'LOW', // Map risk_level to risk
                reason: analysis.reasoning,
                detail: event.detail?.eventName || "Event Detected",
                action_summary: analysis.action_summary
            } as SecurityFinding;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort newest first

    } catch (error) {
        console.error("Error fetching findings:", error);
        return [];
    }
}
