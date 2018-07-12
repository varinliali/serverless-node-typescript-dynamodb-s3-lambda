import { getAuthKey } from './get-auth-key'

export function validateAccessToPlugin (key: string, plugin: string) {
  return getAuthKey(key)
    .then((results) => {
      const isAdmin = results.Items[0].isAdmin
      const plugins = results.Items[0].plugins.values
      if (isAdmin || plugins.includes(plugin)) {
        return Promise.resolve(true)
      } else {
        return Promise.reject('Provided x-api-key does not have access to requested plugin')
      }
    })
}
