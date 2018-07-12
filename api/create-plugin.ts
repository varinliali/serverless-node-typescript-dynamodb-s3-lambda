import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { writeToS3 } from '../helpers/s3-helpers'
import { validateAccessToPlugin } from '../helpers/validate-access-to-plugin'

export const createOrUpdatePlugin: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  const payload = JSON.parse(event.body)
  const encodedFile = payload.data
  const decodedFile = Buffer.from(encodedFile, 'base64')
  const slug = payload.slug
  const fileSize = decodedFile.byteLength
  const pluginName = slug.split('-')[0]

  // Size validation
  if (fileSize > +process.env.MAX_SIZE_LIMIT) {
    return cb(null, {
      body: JSON.stringify(`File size ${fileSize} is too big, Max file size is ${process.env.MAX_SIZE_LIMIT}`),
      statusCode: 403
    })
  }

  validateAccessToPlugin(key, pluginName)
    .then(() => {
      return writeToS3({
        Bucket: process.env.BUCKET,
        Key: `plugins/${pluginName}/${slug}.zip`
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
