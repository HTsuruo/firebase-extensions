import { pubsub, logger } from 'firebase-functions/v1'
import { v1 } from '@google-cloud/firestore'
import { HttpsError } from 'firebase-functions/v1/https'
import * as dayjs from 'dayjs'
import 'dayjs/plugin/timezone'
// import { Storage } from '@google-cloud/storage'

const client = new v1.FirestoreAdminClient()
// const storage = new Storage()

// ref. https://firebase.google.com/docs/firestore/solutions/schedule-export?hl=en
exports.backupTransaction = pubsub
  .schedule(`'${process.env.SCHEDULE!}'`)
  .onRun(async (context) => {
    const projectId = process.env.PROJECT_ID!
    const databaseName = client.databasePath(projectId, '(default)')
    const bucketName = process.env.BUCKET_NAME ?? process.env.STORAGE_BUCKET
    let outputUriPrefix = `gs://${bucketName}`

    const prefixPath = process.env.PREFIX_PATH
    if (prefixPath) {
      outputUriPrefix += `/${prefixPath}`
    }
    outputUriPrefix += `/${formatTimestamp(context.timestamp)}`

    try {
      // await createBucketIfNotFound(bucketName)
      await client.exportDocuments({
        name: databaseName,
        collectionIds: process.env.COLLECTION_IDS?.split(','),
        outputUriPrefix: outputUriPrefix,
      })
      logger.info(
        `✅ Backup ${databaseName} to ${outputUriPrefix} successfully.`
      )
    } catch (error) {
      logger.error(error, { structuredData: true })
      throw new HttpsError('internal', '🚨 Backup operation failed.')
    }
  })

// `exportDocuments`APIで`outputUriPrefix`が未指定の場合に生成される形式に準拠しフォーマットする
function formatTimestamp(timestamp: string) {
  return dayjs(timestamp)
    .tz(process.env.TIME_ZONE)
    .format('YYYY-MM-DDTHH:mm:ss_SSS')
}

// TODO(tsuruoka): `firebase shell`を利用してもLocal Emulatorで`pubsub`関数を実行できないため、
// 仕方なく作成した動作確認用のHTTPS関数(bug?)
//
// exports.backupTransactionHttps = https.onRequest(async (_req, resp) => {
//   const projectId = process.env.PROJECT_ID!
//   const databaseName = client.databasePath(projectId, '(default)')
//   const bucketName = process.env.BUCKET_NAME ?? process.env.STORAGE_BUCKET
//   let outputUriPrefix = `gs://${bucketName}`
//   const prefixPath = process.env.PREFIX_PATH
//   if (prefixPath) {
//     outputUriPrefix += `/${prefixPath}`
//   }
//   outputUriPrefix += `/${new Date().toISOString()}`

//   try {
//     // await createBucketIfNotFound(bucketName)
//     await client.exportDocuments({
//       name: databaseName,
//       collectionIds: process.env.COLLECTION_IDS?.split(','),
//       outputUriPrefix: outputUriPrefix,
//     })
//     logger.info(`✅ Backup ${databaseName} to ${outputUriPrefix} successfully.`)
//     resp.sendStatus(200)
//   } catch (error) {
//     logger.error(error, { structuredData: true })
//     throw new HttpsError('internal', '🚨 Backup operation failed.')
//   }
// })

// TODO(tsuruoka): バケット作成のAPIを叩いているはずが`ApiError: Not Implemented`となり作成できないのでPending

// Check if the bucket exists and create it if not
//
// The reason why we need to use googleapis instead of firebase-admin SDK is
// Cloud Storage for Firebase does not support `Bucket` APIs.
// ref. https://firebase.google.com/docs/emulator-suite/connect_storage#differences_from_google_cloud_storage
// async function createBucketIfNotFound(bucketName: string) {
//   const bucket = storage.bucket(bucketName)
//   const [exists] = await bucket.exists()
//   if (!exists) {
//     const [bucket] = await storage.createBucket(bucketName, {
//       location: process.env.LOCATION,
//       coldline: true,
//     })
//     logger.info(`${bucket.name} created with coldline in ${location}`)
//   }
// }
