import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { checkFileExists, writeToS3 } from '../helpers/s3-helpers'
import { validateAccessToPlugin } from '../helpers/validate-access-to-plugin'

export const createOrUpdatePlugin: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key: string = event.headers['x-api-key']
  const body: string = Buffer.from(event.body, 'base64').toString()
  const payload: any = JSON.parse(body)
  const encodedFile: string = payload.data
  // console.log('base64', encodedFile)
  const decodedFile: Buffer = Buffer.from(encodedFile, 'binary')
  // console.log('after', decodedFile)
  const plugin: string = payload.plugin
  const fileSize: number = decodedFile.byteLength
  const slug: string = plugin.split('-')[0]

  // Size validation
  if (fileSize > +process.env.MAX_SIZE_LIMIT) {
    return cb(null, {
      body: JSON.stringify(`File size ${fileSize} is too big, Max file size is ${process.env.MAX_SIZE_LIMIT}`),
      statusCode: 403
    })
  }

  validateAccessToPlugin(key, slug)
    .then(() => {
      return checkFileExists({ Bucket: process.env.BUCKET, Key: `plugins/${slug}/${plugin}.zip` })
    }).then((exists: boolean) => {
      if (payload.overwrite || !exists) {
        return writeToS3({
          Bucket: process.env.BUCKET,
          Body: decodedFile,
          Key: `plugins/${slug}/${plugin}.zip`
        })
      } else {
        cb(null, {
          body: 'file already exists, set the overwrite option to true if you want to overwrite it',
          statusCode: 403
        })
      }
    })
    .then((data) => {
      const response = {
        body: JSON.stringify({
          message: 'fileuploaded successfully',
          ...data
        }),
        isBase64Encoded: false,
        statusCode: 200
      }
      cb(null, response)
    })
    .catch((err) => {
      // console.log('err', err)
      cb(err.message)
    })

}
