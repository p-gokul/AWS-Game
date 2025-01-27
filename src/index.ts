import { input, closeInput } from "./utils/input";
import { handleError } from "./utils/handleError";
import chalk from "chalk";
import { launchInstance } from "./EC2/EC2_Instance";
import { createLambdaFunction } from "./Lambda/LambdaFunction";
import { DynamoDBActions } from "./DynamoDB/DynamoDBActions";
import { S3BucketActions } from "./S3/S3BucketActions";

const actions = [
  "Exit",
  "S3 Bucket Operations",
  "DynamoDB Operations",
  "EC2 Instance Creation",
  "AWS Lambda Creation",
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
        S3BucketActions();
      } else if (action === "2") {
        DynamoDBActions();
      } else if (action === "3") {
        launchInstance();
      } else if (action === "4") {
        createLambdaFunction();
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

main();
