import { QueryOutput } from 'aws-sdk/clients/dynamodb'
import { getAuthKey } from './get-auth-key'

export function validateAccessToPlugin (key: string, plugin: string): Promise<boolean> {
  return getAuthKey(key)
    .then((results: QueryOutput) => {
      const accessKey: any = results.Items[0]
      const isAdmin: boolean = accessKey.isAdmin
      const plugins: string = accessKey.plugins.values
      if (isAdmin || plugins.includes(plugin)) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(`the Provided x-api-key: ${key} does not have access to the requested plugin: ${plugin}`)
      }
    })
}
