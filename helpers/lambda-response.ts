
export function lambdaResponse (body: any, statusCode = 200) {
  return {
    body: JSON.stringify(body),
    statusCode,
    isBase64Encoded: false
  }
}
