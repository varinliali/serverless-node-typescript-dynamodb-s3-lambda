import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { getPluginsForAuthKey } from '../helpers/get-plugins-for-auth-key'

export const getPlugins: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']

  getPluginsForAuthKey(key)
    .then((plugins) => {
      const response = {
        body: JSON.stringify({
          // input: event,
          plugins
        }),
        statusCode: 200
      }
      cb(null, response)
    })
    .catch((err) => {
      // console.log('err', err)
      cb(err)
    })

}
