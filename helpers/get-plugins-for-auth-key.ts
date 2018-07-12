import { getAuthKey } from './get-auth-key'

export function getPluginsForAuthKey (key) {
  return getAuthKey(key)
    .then((results) => {
      const plugins = results.Items[0].plugins.values
      return Promise.resolve(plugins)
    })
}
