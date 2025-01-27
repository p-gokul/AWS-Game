import { handleError } from "../utils/handleError";
import { input, closeInput } from "../utils/input";
import { createTable, deleteTable, listTables } from "./DynamoDB";
import chalk from "chalk";

const actions = ["Exit", "Create Table", "List Tables", "Delete Table"];

const DynamoDBActions = async () => {
  try {
    while (true) {
      const prefix =
        "\n\nWhat operations of DynamoDB would you like to do??\n\n";
      const prompt = actions
        .map((action, index) => `(${index}) ${action}\n`)
        .join("");
      const action = await input(prefix.concat(prompt) + "\n\n");

      if (action === "1") {
        const tableName = await input("\nPlease enter the table name: ");
        await createTable(tableName);
      } else if (action === "2") {
        await listTables();
      } else if (action === "3") {
        console.log("\nList of Tables are::\n");
        await listTables();
        console.log(
          "\nPlease enter the table name from the above list to delete::\n"
        );
        const tableName = await input("\nPlease enter the table name: ");
        await deleteTable(tableName);
        console.log(`\nTable ${tableName} deleted successfully.`);
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

export { DynamoDBActions };
