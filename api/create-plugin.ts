import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { lambdaResponse } from '../helpers/lambda-response'
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
    const message = `File size ${fileSize} is too big, Max file size is ${process.env.MAX_SIZE_LIMIT}`
    const response = lambdaResponse(message, 403)
    return cb(null, response)
  }

  validateAccessToPlugin(key, slug)
    .then(() => {
      return checkFileExists({ Bucket: process.env.BUCKET, Key: `plugins/${slug}/${plugin}.zip` })
    }).then((exists: boolean) => {
      if (payload.overwrite || !exists) {
        return writeToS3({
          Body: decodedFile,
          Bucket: process.env.BUCKET,
          Key: `plugins/${slug}/${plugin}.zip`
        })
      } else {
        const message = 'file already exists, set the overwrite option to true if you want to overwrite it'
        cb(null, lambdaResponse(message, 403))
      }
    })
    .then((data) => {
      const response = lambdaResponse({ message: 'file uploaded successfully', ...data }, 200)
      cb(null, response)
    })
    .catch((err) => {
      // console.log('err', err)
      cb(err.message)
    })

}
