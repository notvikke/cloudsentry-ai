// Sample security findings for demo mode
import { SecurityFinding } from './mockData';

export const DEMO_FINDINGS: SecurityFinding[] = [
    {
        id: 'demo-001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        risk: 'HIGH',
        reason: 'S3 bucket "customer-data-prod" has public read access enabled, exposing sensitive data to unauthorized parties.',
        detail: 'GetBucketAcl',
        action_summary: 'Modified S3 bucket ACL to allow public access'
    },
    {
        id: 'demo-002',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        risk: 'CRITICAL',
        reason: 'IAM user "admin-legacy" has not rotated access keys in 367 days, significantly increasing the risk of credential compromise.',
        detail: 'GetAccessKeyLastUsed',
        action_summary: 'Long-term IAM access key detected without rotation'
    },
    {
        id: 'demo-003',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
        risk: 'MEDIUM',
        reason: 'Security group sg-0a1b2c3d allows unrestricted SSH (0.0.0.0/0) access, creating a potential attack vector.',
        detail: 'AuthorizeSecurityGroupIngress',
        action_summary: 'Added SSH ingress rule allowing global access'
    },
    {
        id: 'demo-004',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        risk: 'HIGH',
        reason: 'RDS instance "production-db" is not encrypted at rest, violating data protection compliance requirements.',
        detail: 'CreateDBInstance',
        action_summary: 'Created unencrypted RDS database instance'
    },
    {
        id: 'demo-005',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        risk: 'CRITICAL',
        reason: 'CloudTrail logging is disabled for region us-west-1, eliminating audit trail visibility and compliance records.',
        detail: 'StopLogging',
        action_summary: 'Disabled CloudTrail logging for management events'
    },
    {
        id: 'demo-006',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        risk: 'MEDIUM',
        reason: 'Lambda function "data-processor" has overly permissive IAM role with wildcard (*) permissions on sensitive resources.',
        detail: 'UpdateFunctionConfiguration',
        action_summary: 'Updated Lambda execution role with elevated permissions'
    },
    {
        id: 'demo-007',
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 1.25 days ago
        risk: 'LOW',
        reason: 'KMS key rotation is not enabled for key alias/app-encryption, reducing cryptographic key security over time.',
        detail: 'DisableKeyRotation',
        action_summary: 'Disabled automatic key rotation for KMS key'
    },
    {
        id: 'demo-008',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
        risk: 'MEDIUM',
        reason: 'VPC Flow Logs are not enabled for vpc-abc123, limiting network traffic visibility and forensic capabilities.',
        detail: 'CreateVpc',
        action_summary: 'Created VPC without flow logging enabled'
    }
];
