import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { writeToS3 } from '../helpers/s3-helpers'
import { validateAccessToPlugin } from '../helpers/validate-access-to-plugin'

export const createPlugin: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  const body = JSON.parse(event.body)
  const encodedFile = body.plugin
  const decodedFile = Buffer.from(encodedFile, 'base64')
  const fileName = body.fileName
  const fileSize = decodedFile.byteLength

  // Size validation
  if (fileSize > +process.env.MAX_SIZE_LIMIT) {
    return cb(null, {
      body: JSON.stringify('File size is too big'),
      statusCode: 403
    })
  }

  validateAccessToPlugin(key, fileName)
    .then(() => {
      return writeToS3({
        Bucket: process.env.BUCKET,
        Key: `plugins/${fileName.split('-')[0]}/${fileName}.zip`
      })
    })
    .then((data) => {
      const response = {
        body: JSON.stringify({
          // input: event,
          body: JSON.stringify(data),
          message: 'uploaded successfully'
        }),
        isBase64Encoded: false,
        statusCode: 200
      }
      cb(null, response)
    })
    .catch((err) => {
      // console.log('err', err)
      cb(err)
    })

}
