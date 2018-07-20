import { DynamoDB } from 'aws-sdk'
import { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb'

const dynamoDB: DocumentClient = new DynamoDB.DocumentClient()

export function getDynamoDBRecord (attributeName: string, attributeValue: string): Promise<QueryOutput> {
  const params = {
    ExpressionAttributeNames: {
      [`#${attributeName}`]: attributeName
    },
    ExpressionAttributeValues: {
      [`:${attributeName}`]: attributeValue
    },
        // FilterExpression: 'contains(#field, :item)',
    KeyConditionExpression: `#${attributeName} = :${attributeName}`,
    TableName: process.env.DYNAMODB_TABLE
  }
  return dynamoDB.query(params).promise()
}
