import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

const closeInput = () => {
  rl.close();
};

export { input, closeInput };
