import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { writeToS3 } from '../helpers/s3-helpers'
import { validateAccessToPlugin } from '../helpers/validate-access-to-plugin'

export const createOrUpdatePlugin: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  const body = Buffer.from(event.body, 'base64').toString()
  const payload = JSON.parse(body)
  const encodedFile = payload.data
  // console.log('base64', encodedFile)
  const decodedFile = Buffer.from(encodedFile, 'binary')
  console.log('after', decodedFile)
  const plugin = payload.plugin
  const fileSize = decodedFile.byteLength
  const slug = plugin.split('-')[0]

  // Size validation
  if (fileSize > +process.env.MAX_SIZE_LIMIT) {
    return cb(null, {
      body: JSON.stringify(`File size ${fileSize} is too big, Max file size is ${process.env.MAX_SIZE_LIMIT}`),
      statusCode: 403
    })
  }

  validateAccessToPlugin(key, slug)
    .then(() => {
      return writeToS3({
        Bucket: process.env.BUCKET,
        Body: decodedFile,
        Key: `plugins/${slug}/${plugin}.zip`
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
