import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import { getFileContent } from '../helpers/s3-helpers'
import { validateAccessToPlugin } from '../helpers/validate-access-to-plugin'

export const downloadPlugin: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const key = event.headers['x-api-key']
  const slug = event.pathParameters.plugin
  const pluginName = slug.split('-')[0]

  validateAccessToPlugin(key, pluginName)
    .then(() => {
      const filePath = `plugins/${pluginName}/${slug}.zip`
      const params = {
        Bucket: process.env.BUCKET,
        Key: filePath
      }
      return getFileContent(params)
    })
    .then((result) => {
      const { Body, ...rest } = result

      const response = {
        body: result.Body,//JSON.stringify(result),
        headers: {
          'Content-Disposition': `attachment; filename=${slug}.zip`,
          'Content-Length': result.ContentLength,
          'Content-Type': result.ContentType,
          'ETag': result.ETag,
          'Last-Modified': result.LastModified
        },
        isBase64Encoded: true,
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
