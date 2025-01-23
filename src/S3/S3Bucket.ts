import {
  CreateBucketCommand,
  ListBucketsCommand,
  S3Client,
  DeleteBucketCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import chalk from "chalk";

import dotenv from "dotenv";
dotenv.config();

const log = console.log;

const client = new S3Client({});

const MAX_BUCKETS = process.env.MAX_BUCKETS;
const BUCKET_REGION = process.env.BUCKET_REGION;

const createS3Bucket = async (bucketName: string) => {
  const { Location } = await client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );
  log(
    chalk.underline.green.bold(`Bucket created with the location::`),
    chalk.hex("#40a8c4")(Location)
  );
};

const listS3Buckets = async () => {
  const input = {
    MaxBuckets: Number(MAX_BUCKETS),
    BucketRegion: BUCKET_REGION,
  };

  const command = new ListBucketsCommand(input);
  const response = await client.send(command);

  const returnedBuckets = response.Buckets;

  log(chalk.underline.hex("#08ffc8")("\nList of Buckets are::\n"));

  returnedBuckets?.forEach((bucket) => {
    log(chalk.cyan.bold(bucket.Name));
  });
};

const deleteS3Bucket = async ({ BucketName }: { BucketName: string }) => {
  const input = {
    Bucket: BucketName,
  };
  const command = new DeleteBucketCommand(input);
  await client.send(command);

  log(
    chalk.red.underline.bold("Successfully Deleted the Bucket ::"),
    chalk.hex("#fffbe0")(BucketName)
  );
};

const listObjectsCommand = async ({ BucketName }: { BucketName: string }) => {
  const input = {
    Bucket: BucketName,
  };

  const command = new ListObjectsCommand(input);
  const response = await client.send(command);

  const ReturnedObjectsArray = response.Contents?.map((content) => content.Key);

  log(
    chalk.underline.hex("#c3bef0")("\nObjects of ") +
      chalk.underline.bold.hex("#01ecd5").bold(BucketName) +
      chalk.underline.hex("#c3bef0")(" bucket are::\n")
  );

  ReturnedObjectsArray?.forEach((object) => {
    log(chalk.hex("#49b47e")(object));
  });
};

const deleteObjectCommand = async ({
  BucketName,
  ObjectName,
}: {
  BucketName: string;
  ObjectName: string;
}) => {
  const input = {
    Bucket: BucketName,
    Key: ObjectName,
  };
  const command = new DeleteObjectCommand(input);
  await client.send(command);

  log(
    chalk.red.bold(
      `Successfully deleted the object: ${ObjectName} from bucket: ${BucketName}`
    )
  );
};

export {
  createS3Bucket,
  listS3Buckets,
  deleteS3Bucket,
  listObjectsCommand,
  deleteObjectCommand,
};
