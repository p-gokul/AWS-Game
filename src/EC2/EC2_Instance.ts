import {
  EC2Client,
  RunInstancesCommand,
  VolumeType,
  _InstanceType,
  AuthorizeSecurityGroupIngressCommand,
  AuthorizeSecurityGroupEgressCommand,
  CreateSecurityGroupCommand,
  AllocateAddressCommand,
  AssociateAddressCommand,
  waitUntilInstanceRunning,
} from "@aws-sdk/client-ec2";

const ec2client = new EC2Client({});

const createSecurityGroup = async () => {
  const input = {
    Description: "Security Group of EC2 Instance",
    GroupName: "Test Group",
  };

  const command = new CreateSecurityGroupCommand(input);
  const response = await ec2client.send(command);

  if (!response.GroupId) {
    throw new Error("Failed to create Security Group: GroupId is undefined");
  }

  console.log("Security Group created with GroupId:", response.GroupId);

  return response.GroupId;
};

const attachInBoundRules = async (groupId: string) => {
  const input = {
    GroupId: groupId,
    IpPermissions: [
      {
        FromPort: 22,
        IpProtocol: "tcp",
        ToPort: 22,
        IpRanges: [
          { CidrIp: "0.0.0.0/0", Description: "Allow SSH from anywhere" },
        ],
      },
      {
        FromPort: 80,
        IpProtocol: "tcp",
        ToPort: 80,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Allow HTTP traffic from anywhere",
          },
        ],
      },
    ],
  };

  const command = new AuthorizeSecurityGroupIngressCommand(input);
  await ec2client.send(command);
};

const attachOutBoundRules = async (groupId: string) => {
  const input = {
    GroupId: groupId,
    IpPermissions: [
      {
        FromPort: 22,
        IpProtocol: "tcp",
        ToPort: 22,
        IpRanges: [
          { CidrIp: "0.0.0.0/0", Description: "Allow SSH from anywhere" },
        ],
      },
      {
        FromPort: 80,
        IpProtocol: "tcp",
        ToPort: 80,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Allow HTTP traffic from anywhere",
          },
        ],
      },
    ],
  };

  const command = new AuthorizeSecurityGroupEgressCommand(input);
  await ec2client.send(command);
};

const createInstance = async (groupId: string) => {
  try {
    const params = {
      ImageId: "ami-053e5b2b49d1b2a82",
      InstanceType: _InstanceType.t2_micro,
      MaxCount: 1,
      MinCount: 1,
      SecurityGroupIds: [groupId],
      BlockDeviceMappings: [
        {
          DeviceName: "/dev/sdh",
          Ebs: {
            VolumeSize: 8,
            VolumeType: VolumeType.gp2,
            DeleteOnTermination: true,
          },
        },
      ],
    };

    const command = new RunInstancesCommand(params);

    const data = await ec2client.send(command);

    const instanceId = data.Instances?.[0].InstanceId;

    if (!instanceId) {
      throw new Error("Failed to launche instance. Instance Id not defned.");
    }

    console.log("Instance launched with instance id: ", instanceId);
    return instanceId;
  } catch (error) {
    console.error("Error launching EC2 instance", error);
    throw error;
  }
};

const allocateElasticIp = async () => {
  const command = new AllocateAddressCommand({
    Domain: "vpc",
  });
  const response = await ec2client.send(command);

  if (!response.AllocationId || !response.PublicIp) {
    throw new Error("Failed to allocate Elastic Ip");
  }

  console.log("Elastic Ip allocated is :: ", response.PublicIp);

  return { allocationId: response.AllocationId, publicIp: response.PublicIp };
};

const associateElasticIp = async ({
  instanceId,
  allocationId,
}: {
  instanceId: string;
  allocationId: string;
}) => {
  const command = new AssociateAddressCommand({
    InstanceId: instanceId,
    AllocationId: allocationId,
  });

  const response = await ec2client.send(command);

  console.log("Elastic Ip assoicated with Instance:: ", response);
};

const launchInstance = async () => {
  try {
    const groupId = await createSecurityGroup();
    await attachInBoundRules(groupId);
    await attachOutBoundRules(groupId);
    const instanceId = await createInstance(groupId);

    // Wait until the instance is in the 'running' state
    await waitUntilInstanceRunning(
      { client: ec2client, maxWaitTime: 300 },
      { InstanceIds: [instanceId] }
    );

    const { allocationId, publicIp } = await allocateElasticIp();
    await associateElasticIp({ instanceId, allocationId });
    console.log("Instance is accessible via Public Ip:: ", publicIp);
  } catch (error) {
    console.log("Error during EC2 instance setup:: ", error);
  }
};

export { launchInstance };
