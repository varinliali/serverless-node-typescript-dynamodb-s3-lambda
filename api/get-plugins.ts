import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { getPluginsForAuthKey } from '../helpers/get-plugins-for-auth-key'
import { lambdaResponse } from '../helpers/lambda-response'

export const getPlugins: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key: string = event.headers['x-api-key']

  getPluginsForAuthKey(key)
    .then((plugins) => {
      console.log('plugins', plugins)
      const response = lambdaResponse(plugins, 200)
      cb(null, response)
    })
    .catch((err) => {
      // console.log('err', err)
      cb(err)
    })

}
