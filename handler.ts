import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { lambdaResponse } from './helpers/lambda-response'

export const handle: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  // if (!key) {
  //   return cb('Access denied, please set the x-api-key header')
  // }

  cb(null, lambdaResponse({ message: 'hello there' }, 200))

}
