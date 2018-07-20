
import { QueryOutput } from 'aws-sdk/clients/dynamodb'
import { getDynamoDBRecord } from './dynamodb-helpers'

export function getAuthKey (secret: string): Promise<QueryOutput> {
  return getDynamoDBRecord('secret', secret)
}
