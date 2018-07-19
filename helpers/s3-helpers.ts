import { AWSError, S3 } from 'aws-sdk'
import { CreateBucketOutput, GetObjectOutput, HeadObjectOutput, ListObjectsV2Output,
  PutObjectOutput } from 'aws-sdk/clients/s3'
import { PromiseResult } from 'aws-sdk/lib/request'

const s3: S3 = new S3()
const BUCKET_NAME: string = process.env.BUCKET_NAME

export function appendToFile (params): Promise<PutObjectOutput> {
  const { Body, ...rest } = params
  return getFileContent(rest)
    .then((res: GetObjectOutput): Promise<string> => {
      // convert buffer to string
      const content = res.Body.toString()
      return Promise.resolve(content.concat(Body))
    })
    .then((res: string) => {
      return writeToS3({ ...params, Body: res })
    })
}

export function createOrAppendToFile (fileName: string, dataToWrite: string, shouldAppend: boolean):
  Promise<PutObjectOutput> {
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

export function checkFileExists (params): Promise<boolean> {
  return s3.headObject(params).promise()
    .then((results: HeadObjectOutput) => {
      return Promise.resolve(true)
    }).catch((headErr) => {
      if (headErr.code === 'NotFound') {
        return Promise.resolve(false)
      } else {
        return Promise.reject(headErr)
      }
    })
}

export function writeToS3 (params): Promise<PutObjectOutput> {
  return s3.putObject(params).promise()
}

export function getFileContent (params): Promise<GetObjectOutput> {
  return s3.getObject(params).promise()
}

export function findFilesThatHavePrefix (prefix): Promise<ListObjectsV2Output> {
  return listObjects({ Prefix: prefix, Bucket: BUCKET_NAME })
}

export function listObjects (params): Promise<ListObjectsV2Output> {
  return s3.listObjectsV2(params).promise()
}

export function createBucket (bucketName): Promise<CreateBucketOutput> {
  return s3.createBucket({ Bucket: bucketName }).promise()
}
