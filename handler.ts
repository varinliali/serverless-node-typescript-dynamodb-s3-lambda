import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { getItemsWhereFieldContainsItem } from './helpers/dynamodb-helpers'

export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  getItemsWhereFieldContainsItem('plugins', 'penguin', 'potato')
  .then((res) => {
    console.log('w00t', res)

    const response = {
      body: JSON.stringify({
        input: event,
        results: JSON.stringify(res)
      }),
      statusCode: 200
    }
    cb(null, response)
  })
  .catch((err) => {
    console.log('err', err)
    cb(err)
  })

}
