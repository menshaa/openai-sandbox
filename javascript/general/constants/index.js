const COLORS = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  CYAN: "\x1b[36m",
};
const DEFAULT_SYSTEM_PROMPT = (userName) =>
  `You are a helpful assistant. Keep your answers short and precise. The user's name is ${userName}`;
const DEFAULT_ERROR_MESSAGE =
  "Unable to generate a response at the moment. Please try again later.";
const DEFAULT_MESSAGES_PAYLOAD = (userName) => [
  {
    role: "system",
    content: DEFAULT_SYSTEM_PROMPT(userName),
  },
];

const INITIAL_AI_MESSAGE = "Please enter your name: ";
const EXIT_INSTRUCTION_MESSAGE = `(type 'exit' to quit): `;
const AI_RESPONSE_TYPE_PROMPT = `Would you like AI to respond in stream? (y/n)\n`;

module.exports = {
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_MESSAGES_PAYLOAD,
  DEFAULT_ERROR_MESSAGE,
  INITIAL_AI_MESSAGE,
  EXIT_INSTRUCTION_MESSAGE,
  COLORS,
  AI_RESPONSE_TYPE_PROMPT,
};
