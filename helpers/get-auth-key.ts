import { DynamoDB } from 'aws-sdk'

const dynamoDB = new DynamoDB.DocumentClient()

export function getAuthKey (secret: string) {
  const params = {
    ExpressionAttributeNames: {
      '#secret': 'secret'
    },
    ExpressionAttributeValues: {
      ':secret': secret
    },
      // FilterExpression: 'contains(#field, :item)',
    KeyConditionExpression: '#secret = :secret',
    TableName: process.env.DYNAMODB_TABLE
  }
  return dynamoDB.query(params).promise()
}
