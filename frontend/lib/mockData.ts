export interface SecurityFinding {
    id: string;
    timestamp: string;
    risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    reason: string;
    detail: string;
    action_summary?: string;
}

export const MOCK_FINDINGS: SecurityFinding[] = [
    {
        id: "evt-123456",
        timestamp: new Date().toISOString(), // Just now
        risk: "CRITICAL",
        reason: "User 'root' disabled CloudTrail logging for the entire account.",
        detail: "StopLogging action indicates potential cover-up attempt.",
        action_summary: "CloudTrail Logging Disabled"
    },
    {
        id: "evt-789012",
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
        risk: "HIGH",
        reason: "User 'dev-user' created a Security Group 0.0.0.0/0 ingress.",
        detail: "AuthorizeSecurityGroupIngress allows open access to the internet.",
        action_summary: "Open Security Group Created"
    },
    {
        id: "evt-345678",
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        risk: "LOW",
        reason: "User 'backup-bot' initiated S3 Glacier Restore.",
        detail: "RestoreObject action is standard operational procedure.",
        action_summary: "S3 Object Restore"
    },
    {
        id: "evt-901234",
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
        risk: "MEDIUM",
        reason: "User 'intern' attached AdministratorAccess to a minimal role.",
        detail: "AttachRolePolicy significantly escalates privileges.",
        action_summary: "Privilege Escalation Attempt"
    },
    {
        id: "evt-567890",
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 24 hours ago
        risk: "LOW",
        reason: "System performed automatic snapshot of RDS DB.",
        detail: "CreateDBSnapshot via automated backup.",
        action_summary: "Routine Database Snapshot"
    }
];
