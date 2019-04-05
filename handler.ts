import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { lambdaResponse } from './helpers/lambda-response'

export const handle: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  cb(null, lambdaResponse({ message: 'hello there' }, 200))

}
