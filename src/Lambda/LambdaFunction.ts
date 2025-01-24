import {
  LambdaClient,
  CreateFunctionCommand,
  waitUntilFunctionActive,
} from "@aws-sdk/client-lambda";
import path from "path";
import AdmZip from "adm-zip";

import { createLambdaRole } from "../IAM/CreateRole";

const lambdaClient = new LambdaClient({});

function getZippedLambdaCode(): Buffer {
  const filePath = path.resolve(__dirname, "index.mjs");

  const zip = new AdmZip();

  zip.addLocalFile(filePath);

  const zipBuffer = zip.toBuffer();

  return zipBuffer;
}

const createLambdaFunction = async () => {
  const roleName = "MyTestLambdaRole";
  const roleArn = await createLambdaRole(roleName);

  const lambdaZip = getZippedLambdaCode();
  const command = new CreateFunctionCommand({
    FunctionName: "MyTestLambda",
    Runtime: "nodejs18.x",
    Handler: "index.handler",
    Role: roleArn,
    Code: {
      ZipFile: lambdaZip,
    },
    Description: " A simple lambda function created via AWS SDK",
    Timeout: 3,
    MemorySize: 128,
  });

  const response = await lambdaClient.send(command);
  console.log("Lambda function created:: ", response.FunctionArn);

  // Wait until the function is fully active
  await waitUntilFunctionActive(
    { client: lambdaClient, maxWaitTime: 60 },
    { FunctionName: "MyTestLambda" }
  );
  console.log("Lambda function is active and ready.");
};

export { createLambdaFunction };
