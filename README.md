# serverless-node-typescript-dynamodb-s3-lambda
starter template for an AWS lambda with serverless framework, typescript, S3 &amp; DynamoDB integration

#### This Project was bootstraped using serverless framework using the aws-nodejs-typescript template by running ``` sls create -t aws-nodejs-typescript ```

# Development workflow
- use ```npm start``` to run the project in offline mode and test it locally
- use ```npm run-script deploy``` to deploy the lambda as --region eu-central-1 & --stage live
- use ```npm run-script undeploy``` to delete the lambda and all related resources created by serverless
- use ```npm run-script build``` to generate an output zipfile in build/ directory that you can manually upload to AWS Lambda

# Serverless introduction & AWS Setup

1. See https://serverless.com/framework/docs/providers/aws/guide/installation/ for installation
1. Create an IAM Role for your serverless lambda & Setup your AWS credentials https://serverless.com/framework/docs/providers/aws/guide/credentials/
1. use ```sls deploy``` to deploy the application
1. you can setup the environment, region and role for deployment either via the CLI flags or from the serverless.yaml file
1. environment variables are configured in the serverless.yaml file
1. if you want to just get a zip file without deploying you can use `sls package`
1. Dynamic variables can be set in the yaml file either by passing them to the CLI flags or by inheriting them from different files based on the enviornment, see https://serverless.com/framework/docs/providers/aws/guide/variables/

# Running offline
`yarn install`
`sls offline start`
