# AWS Setup Guide for YugiAI

This guide will walk you through setting up AWS services for your Yu-Gi-Oh! TCG Rulings Assistant application.

## 1. AWS Account Setup

1. If you don't have an AWS account, create one at [aws.amazon.com](https://aws.amazon.com/)
2. Once logged in, make sure you're in the desired region (e.g., `us-east-1`)

## 2. Setup IAM User for API Access

1. Navigate to the IAM dashboard
2. Click on "Users" and then "Create user"
3. Enter a name (e.g., `yugiai-api-user`) and click "Next"
4. Select "Attach policies directly"
5. Search for and attach these policies:
   - `AmazonBedrockFullAccess`
   - `AWSLambda_FullAccess` (if you plan to use Lambda)
6. Click "Next" and then "Create user"
7. On the user details page, go to "Security credentials"
8. Click "Create access key"
9. Select "Application running outside AWS" and click "Next"
10. (Optional) Add a description tag
11. Download the CSV file containing your access key and secret
12. Update your `.env.local` file with these credentials

## 3. Configure AWS Bedrock

1. Navigate to the AWS Bedrock console
2. Click on "Model access" in the left sidebar
3. Click "Manage model access"
4. Select the models you want to use:
   - Anthropic Claude 3
   - Google Gemini
   - DeepSeek
5. Click "Save changes"

## 4. (Optional) AWS Lambda Setup

If you want to deploy your API as a serverless function:

1. Navigate to the Lambda console
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `yugiai-judge-function`
5. Runtime: Node.js 18.x
6. Architecture: x86_64
7. Click "Create function"
8. In the "Code" tab, upload a ZIP file containing:
   - Your compiled API handler code
   - Node.js dependencies
9. Set environment variables:
   - `AWS_REGION`: Your AWS region
   - `AI_MODEL`: Your chosen model ID
10. In the "Configuration" tab:
    - Increase timeout to at least 15 seconds
    - Increase memory to at least 512 MB
11. Set up API Gateway as a trigger to expose your Lambda function

## 5. Deploy Your Next.js Application

You have several options for deploying your Next.js app:

### Option 1: AWS Amplify
1. Connect your repository to AWS Amplify
2. Follow the setup wizard to configure build settings
3. Set environment variables

### Option 2: Vercel
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository in Vercel
3. Set environment variables in the Vercel dashboard

### Option 3: Manual Deployment to EC2/ECS
1. Build your Next.js app: `npm run build`
2. Deploy the `.next` folder and required files to your server
3. Set up environment variables
4. Configure a reverse proxy