import {
  createS3Bucket,
  listS3Buckets,
  deleteS3Bucket,
  listObjectsCommand,
  deleteObjectCommand,
} from "./S3/S3Bucket";
import { input, closeInput } from "./utils/input";
import { handleError } from "./utils/handleError";
import chalk from "chalk";
import { launchInstance } from "./EC2/EC2_Instance";

const actions = [
  "Exit",
  "Create S3 Bucket",
  "List S3 Bucket(s)",
  "Delete S3 Bucket",
  "List Bucket Objects",
  "Delete Bucket Object",
];

const main = async () => {
  try {
    while (true) {
      const prefix = chalk
        .hex("#f96d00")
        .bgHex("#455d7a")
        .bold.underline("\nWhat would you like to do ??\n");
      const prompt = actions
        .map((action, index) => chalk.yellow(`(${index}) ${action} \n`))
        .join("");
      const action = await input(prefix.concat(prompt) + "\n");

      if (action === "1") {
        const bucketName = await input(
          chalk
            .hex("#c7b198")
            .underline.bold("\nEnter the name of the S3 Bucket:\n")
        );
        await createS3Bucket(bucketName);
      } else if (action === "2") {
        await listS3Buckets();
      } else if (action === "3") {
        const BucketName = await input(
          chalk.red.underline.bold("\nEnter the bucket name to delete::") +
            chalk.hex("#41a7b3")(" Only empty buckets can be deleted)* \n")
        );
        await deleteS3Bucket({ BucketName });
      } else if (action === "4") {
        const BucketName = await input(
          chalk.magenta.bold(
            "\nPlease enter the bucket name to list out its objects. \n"
          )
        );
        await listObjectsCommand({ BucketName });
      } else if (action === "5") {
        await listS3Buckets();
        const BucketName = await input(
          chalk
            .hex("#bcfff2")
            .underline.bold(
              "\nPlease enter the bucket name from the above list to see it objects::\n"
            )
        );
        await listObjectsCommand({ BucketName });
        const ObjectName = await input(
          chalk
            .hex("#fffde8")
            .underline.bold(
              "\nPlease enter the name of the object from the above list to delete the object::\n"
            )
        );
        await deleteObjectCommand({ BucketName, ObjectName });
      } else if (action === "0") {
        console.log(chalk.red.bold.italic("Exiting the program..."));
        break;
      } else {
        console.log(
          chalk.red.bold.italic(
            "Invalid Choice. Please enter 1, 2, 3, or 0 to exit."
          )
        );
      }
    }
  } catch (error) {
    handleError("An error occurred during the process", error);
  } finally {
    closeInput();
  }
};

// main();
launchInstance();
