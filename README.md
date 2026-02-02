# CloudSentry AI

> AI-Powered AWS Security Monitoring & Autonomous Remediation

CloudSentry AI is an intelligent security monitoring system that uses AWS Bedrock (Claude Sonnet 4) to detect and automatically remediate security threats in your AWS environment.

## 🚀 Features

- **Real-Time Threat Detection**: Monitors CloudTrail events using EventBridge
- **AI-Powered Analysis**: Uses Claude Sonnet 4 to evaluate security risks
- **Autonomous Remediation**: Automatically fixes security issues (S3 buckets, IAM, Security Groups)
- **Next.js Dashboard**: Modern, responsive web interface with real-time updates
- **Admin vs Demo Mode**: Live AWS data for admins, sample data for demos
- **AWS Cognito Authentication**: Secure user management

## 🏗️ Architecture

```
CloudTrail → EventBridge → Detector Lambda (Bedrock AI) → DynamoDB
                ↓
         Remediator Lambda → AWS APIs (Fix Issues)
                ↓
           Next.js Dashboard (Amplify)
```

## 📦 Tech Stack

### Backend (AWS CDK - Python)
- AWS CloudTrail
- Amazon EventBridge
- AWS Lambda (Python 3.11)
- Amazon Bedrock (Claude Sonnet 4)
- Amazon DynamoDB
- AWS IAM

### Frontend
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- AWS Amplify (Auth)
- Framer Motion
- Recharts

## 🛠️ Setup

### Prerequisites
- AWS Account
- AWS CLI configured
- Node.js 18+
- Python 3.11+
- AWS CDK

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Cloudsentry-AI
```

2. **Install backend dependencies**
```bash
pip install -r requirements.txt
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Configure environment variables**
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_REGION=your_region
NEXT_PUBLIC_IDENTITY_POOL_ID=your_identity_pool_id
NEXT_PUBLIC_DYNAMODB_TABLE=your_table_name
```

5. **Deploy AWS infrastructure**
```bash
cdk bootstrap
cdk deploy --all
```

6. **Run frontend locally**
```bash
cd frontend
npm run dev
```

## 🎯 Usage

### For Admins
- Login with `vikastro911@gmail.com`
- View real AWS security findings
- Trigger manual threat simulations
- See "Live Mode" indicator

### For Recruiters/Demos
- Visit `/demo` route (no login required)
- OR sign up with any email
- View sample security data
- See "Demo Mode" indicator

## 🚀 Deployment

### Frontend (AWS Amplify)
```bash
# Automatically deployed via AWS Amplify from GitHub
# Production: https://main.xxxxx.amplifyapp.com
# Staging: https://dev.xxxxx.amplifyapp.com
```

### Infrastructure (AWS CodePipeline)
```bash
# Automatically deployed when pushing to main branch
git push origin main
```

## 📊 Monitored Security Issues

- ✅ S3 bucket ACL changes
- ✅ IAM policy modifications
- ✅ Security group rule changes
- ✅ Long-term access key usage
- ✅ RDS public accessibility
- ✅ CloudTrail disabled events

## 🔐 Security Features

- **AI Risk Scoring**: 4-tier system (LOW, MEDIUM, HIGH, CRITICAL)
- **Automated Remediation**: Reverts dangerous changes
- **Audit Trail**: All actions logged to DynamoDB
- **Role-Based Access**: Admin sees real data, others see demos
- **AWS Cognito**: Secure authentication with MFA support

## 📝 License

MIT

## 👤 Author

**Vikas Tro**
- Email: vikastro911@gmail.com
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- AWS Bedrock team for Claude Sonnet 4 access
- AWS CDK team for infrastructure as code
- Next.js team for the amazing framework
