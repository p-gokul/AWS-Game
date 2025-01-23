import { createS3Bucket, listS3Buckets } from "./S3/S3Bucket";
import { input, closeInput } from "./utils/input";
import { handleError } from "./utils/handleError";

const main = async () => {
  try {
    const action = await input(
      "What would you like to do ??\n(1) Create S3 Bucket \n(2) List S3 Buckets \n"
    );

    if (action === "1") {
      const bucketName = await input("\nEnter the name of the S3 Bucket:: ");
      await createS3Bucket(bucketName);
    } else if (action === "2") {
      await listS3Buckets();
    } else {
      console.log("Invalid Choice. Please enter 1 or 2");
    }
  } catch (error) {
    handleError("An error occurred during the process", error);
  } finally {
    closeInput();
  }
};

main();
