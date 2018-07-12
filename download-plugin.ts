import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { getFileContent } from './helpers/s3-helpers'
import { validateAccessToPlugin } from './helpers/validate-access-to-plugin'

export const downloadPlugin: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  const plugin = event.pathParameters.plugin

  if (!key) {
    return cb('Access denied, please set the x-api-key header')
  }

  validateAccessToPlugin(key, plugin)
    .then(() => {
      const filePath = `plugins/${plugin.split('-')[0]}/${plugin}.zip`
      console.log('key', key)
      console.log('filePath', filePath)
      const params = {
        Bucket: process.env.BUCKET,
        Key: filePath
      }
      return getFileContent(params)
    })
    .then((result) => {
      const { Body, ...rest } = result
      console.log('got file', rest)

      const response = {
        body: JSON.stringify(result),
        headers: {
          'Content-Disposition': `attachment; filename=${plugin}.zip`,
          'Content-Length': result.ContentLength,
          'Content-Type': result.ContentType,
          'ETag': result.ETag,
          'Last-Modified': result.LastModified
        },
        isBase64Encoded: false,
        statusCode: 200
        // input: event
      }
      cb(null, response)
    })
    .catch((err) => {
      // console.log('err', err)
      cb(err)
    })

}
