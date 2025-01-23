import {
  CreateBucketCommand,
  ListBucketsCommand,
  S3Client,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
dotenv.config();

const client = new S3Client({});

const MAX_BUCKETS = process.env.MAX_BUCKETS;
const BUCKET_REGION = process.env.BUCKET_REGION;

const createS3Bucket = async (bucketName: string) => {
  const { Location } = await client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );
  console.log(`Bucket created with the location ${Location}`);
};

const listS3Buckets = async ({ maxBuckets = Number(MAX_BUCKETS) }) => {
  const input = {
    MaxBuckets: Number(maxBuckets),
    BucketRegion: BUCKET_REGION,
  };

  const command = new ListBucketsCommand(input);
  const response = await client.send(command);

  console.log("The returned response of list buckets is", response);
};

const deleteS3Bucket = async ({ BucketName }: { BucketName: string }) => {
  const input = {
    Bucket: BucketName,
  };
  const command = new DeleteBucketCommand(input);
  await client.send(command);

  console.log("Successfully Deleted the Bucket :: ", BucketName);
};

export { createS3Bucket, listS3Buckets, deleteS3Bucket };
