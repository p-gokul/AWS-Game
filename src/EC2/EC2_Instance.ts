import {
  EC2Client,
  RunInstancesCommand,
  VolumeType,
  _InstanceType,
} from "@aws-sdk/client-ec2";

const ec2client = new EC2Client({});

const launchInstance = async () => {
  try {
    const params = {
      ImageId: "ami-053e5b2b49d1b2a82",
      InstanceType: _InstanceType.t2_micro,
      MaxCount: 1,
      MinCount: 1,
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

    console.log(
      "The received response after creation of EC2 instance is:: ",
      data
    );
  } catch (error) {
    console.error("Error launching EC2 instance", error);
  }
};

export { launchInstance };
