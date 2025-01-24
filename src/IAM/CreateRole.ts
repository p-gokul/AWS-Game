import {
  AttachRolePolicyCommand,
  CreateRoleCommand,
  IAMClient,
  GetRoleCommand,
} from "@aws-sdk/client-iam";

import type { GetRoleCommandOutput } from "@aws-sdk/client-iam";

const iamClient = new IAMClient({});

const createLambdaRole = async (roleName: string) => {
  let existingRoleArn: string | undefined;

  try {
    const getRoleCommand = new GetRoleCommand({ RoleName: roleName });
    const getRoleResponse: GetRoleCommandOutput = await iamClient.send(
      getRoleCommand
    );
    existingRoleArn = getRoleResponse.Role?.Arn;
  } catch (error: any) {
    if (error.name === "NoSuchEntity") {
      // Role does not exist; we'll create it below
    } else {
      // Some other error occurred; rethrow
      throw error;
    }
  }

  // 2. If the role already exists, just return its ARN
  if (existingRoleArn) {
    console.log(
      `Role '${roleName}' already exists with ARN: ${existingRoleArn}`
    );
    return existingRoleArn;
  }

  const command = new CreateRoleCommand({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: {
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    }),
    Description: "Role for my test Lambda function",
  });

  const response = await iamClient.send(command);

  const roleArn = response.Role?.Arn;

  if (!roleArn) {
    throw new Error("Failed to create role or retrieve Role ARN");
  }
  console.log("Created role: ", roleName, ", and ARN is:: ", roleArn);

  const attachPolicyCommand = new AttachRolePolicyCommand({
    RoleName: roleName,
    PolicyArn:
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  });

  await iamClient.send(attachPolicyCommand);

  return roleArn;
};

export { createLambdaRole };
