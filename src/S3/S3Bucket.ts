import {
  CreateBucketCommand,
  ListBucketsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// const bucketName = "s3-bucket-by-gokul-2";

const createS3Bucket = async (bucketName: string) => {
  const client = new S3Client({});

  const { Location } = await client.send(
    new CreateBucketCommand({
      Bucket: bucketName,
    })
  );
  console.log(`Bucket created with the location ${Location}`);
};

const listS3Buckets = async () => {
  const client = new S3Client({});
  const input = {
    MaxBuckets: Number("10"),
    BucketRegion: "ap-northeast-3",
  };

  const command = new ListBucketsCommand(input);
  const response = await client.send(command);

  console.log("The returned response of list buckets is", response);
};

export { createS3Bucket, listS3Buckets };
