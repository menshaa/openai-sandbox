require("dotenv").config();
const readline = require("readline");
const { OpenAIService } = require("./service");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const openAIService = new OpenAIService(rl);
  openAIService.init();
}

main().then();
