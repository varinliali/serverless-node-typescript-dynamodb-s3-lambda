import { QueryOutput } from 'aws-sdk/clients/dynamodb'
import { getAuthKey } from './get-auth-key'

export function getPluginsForAuthKey (key: string): Promise<string[]> {
  return getAuthKey(key)
    .then((results: QueryOutput | any) => {
      const plugins = results.Items[0].plugins.values
      return Promise.resolve(plugins)
    })
}
