import { DynamoDB } from 'aws-sdk'

const dynamoDB = new DynamoDB.DocumentClient()

export function getItemsWhereFieldContainsItem (field: string, item: string, primaryKey: string) {
  console.log('table', process.env.DYNAMODB_TABLE)
  const params = {
    ExpressionAttributeNames: {
      '#field': field,
      '#secret': 'secret'
    },
    ExpressionAttributeValues: {
      ':item': item,
      ':primaryKey': primaryKey
    },
    FilterExpression: 'contains(#field, :item)',
    KeyConditionExpression: '#secret = :primaryKey',
    TableName: process.env.DYNAMODB_TABLE
  }
  return dynamoDB.query(params).promise()
}
