import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const createTable = async (tableName: string) => {
  const command = new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: "Food Name",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Food Name",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  await client.send(command);
  console.log(`Table ${tableName} created successfully.`);
};

const listTables = async () => {
  const command = new ListTablesCommand({});

  const response = await client.send(command);

  const tableArray = response.TableNames;

  console.log("\nList of Tables are:\n");
  tableArray?.forEach((table) => {
    console.log(table);
  });
};

const deleteTable = async (tableName: string) => {
  const command = new DeleteTableCommand({
    TableName: tableName,
  });

  await client.send(command);
};

export { createTable, listTables, deleteTable };
