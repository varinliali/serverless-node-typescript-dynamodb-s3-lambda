import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { createPlugin } from './api/create-plugin'
import { downloadPlugin } from './api/download-plugin'
import { getPlugins } from './api/get-plugins'

export const handle: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  if (!key) {
    return cb('Access denied, please set the x-api-key header')
  }

  if (event.httpMethod === 'POST') {
    createPlugin(event, context, cb)
  } else if (event.path.includes('download')) {
    downloadPlugin(event, context, cb)
  } else {
    getPlugins(event, context, cb)
  }

}
