import { S3 } from 'aws-sdk'

const s3 = new S3()
const BUCKET_NAME = process.env.BUCKET_NAME

export function appendToFile (params) {
  const { Body, ...rest } = params
  return getFileContent(rest)
        .then((res) => {
            // convert buffer to string
          const content = res.Body.toString()
          console.log('got existing file content', content)
          return Promise.resolve(content.concat(Body))
        })
        .then((res) => {
          console.log('writing concatinated results', res)
          return writeToS3({ ...params, Body: res })
        })
}

export function appendOrCreateFile (fileName, dataToWrite, shouldAppend) {
  const params = {
    Body: dataToWrite,
    Bucket: BUCKET_NAME,
    Key: fileName
        // ACL: 'public-read'
  }

  if (shouldAppend) {
    return appendToFile(params)
  } else {
    return writeToS3(params)
  }
}

export function checkFileExists (params) {
  return s3.headObject(params).promise()
        .then((results) => {
          console.log('found existing file', results)
          return Promise.resolve(true)
        }).catch((headErr) => {
          if (headErr.code === 'NotFound') {
            console.log('no file found, new one will be created')
            return Promise.resolve(false)
          } else {
            return Promise.reject(headErr)
          }
        })
}

export function writeToS3 (params) {
  console.log('writing to s3', params)
  return s3.putObject(params).promise()
}

export function getFileContent (params) {
  return s3.getObject(params).promise()
}

export function findFilesThatHavePrefix (prefix) {
  return listObjects({ Prefix: prefix, Bucket: BUCKET_NAME })
}

export function listObjects (params) {
  return s3.listObjectsV2(params).promise()
}

export function createBucket (bucketName) {
  return s3.createBucket({ Bucket: bucketName }).promise()
}