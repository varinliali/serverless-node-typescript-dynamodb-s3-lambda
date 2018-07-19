import { DynamoDB } from 'aws-sdk'
import { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb'

const dynamoDB: DocumentClient = new DynamoDB.DocumentClient()

export function getAuthKey (secret: string): Promise<QueryOutput> {
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
