import { createS3Bucket, listS3Buckets, deleteS3Bucket } from "./S3/S3Bucket";
import { input, closeInput } from "./utils/input";
import { handleError } from "./utils/handleError";

const actions = [
  "Exit",
  "Create S3 Bucket",
  "List S3 Bucket",
  "Delete S3 Bucket",
];

const main = async () => {
  try {
    while (true) {
      const prefix = "What would you like to do ??\n";
      const prompt = actions
        .map((action, index) => `(${index}) ${action} \n`)
        .join("");
      const action = await input(prefix.concat(prompt));

      if (action === "1") {
        const bucketName = await input("\nEnter the name of the S3 Bucket:: ");
        await createS3Bucket(bucketName);
      } else if (action === "2") {
        const maxBuckets = await input(
          "\n Enter the number of buckets to display::  ( Default: 5 )"
        );
        await listS3Buckets({
          maxBuckets: maxBuckets ? parseInt(maxBuckets) : undefined,
        });
      } else if (action === "3") {
        const BucketName = await input(
          "\nEnter the bucket name to delete:: (Only empty buckets can be deleted)* \n"
        );
        await deleteS3Bucket({ BucketName });
      } else if (action === "0") {
        console.log("Exiting the program...");
        break; // Break the loop and exit the program
      } else {
        console.log("Invalid Choice. Please enter 1, 2, 3, or 0 to exit.");
      }
    }
  } catch (error) {
    handleError("An error occurred during the process", error);
  } finally {
    closeInput();
  }
};

main();
