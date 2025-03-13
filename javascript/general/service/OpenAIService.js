const OpenAI = require("openai");

const {
  DEFAULT_MESSAGES_PAYLOAD,
  INITIAL_AI_MESSAGE,
  EXIT_INSTRUCTION_MESSAGE,
  COLORS,
  DEFAULT_ERROR_MESSAGE,
  AI_RESPONSE_TYPE_PROMPT,
} = require("../constants");
const { delay } = require("../utils");
class OpenAIService {
  constructor(rl) {
    this.rl = rl;
    this.openAIClient = new OpenAI();
    this.messages = [];
    this.userName = "Name";
  }

  init() {
    this.promptAIResponseType();
  }

  async generateAIResponse() {
    try {
      const response = await this.openAIClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.messages,
        max_tokens: 100,
      });
      const { choices } = response || {};
      const [choice] = choices || [];
      return choice.message.content;
    } catch (error) {
      return DEFAULT_ERROR_MESSAGE;
    }
  }

  async generateAIResponseStream() {
    try {
      const stream = await this.openAIClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.messages,
        max_tokens: 100,
        stream: true,
      });
      return stream;
    } catch (error) {
      return DEFAULT_ERROR_MESSAGE;
    }
  }

  appendMessagesProperty(message, role) {
    this.messages.push({
      role,
      content: message,
    });
  }

  endProgram() {
    console.log(`${COLORS.CYAN}SYSTEM: ${COLORS.RESET}Salam!`);
    this.rl.close();
    process.exit();
  }

  async promptAIStream(messageFromAI, isInitialAIResponse = false) {
    if (isInitialAIResponse) {
      console.log(`${COLORS.CYAN}SYSTEM: ${COLORS.RESET}${messageFromAI}`);
    }

    this.rl.question(
      `${COLORS.BLUE}${this.userName}: ${COLORS.RESET}`,
      async (userResponse) => {
        if (userResponse.trim() === "") {
          console.log(
            `${COLORS.GREEN}AI: ${COLORS.RED}You've submitted an empty response. Please try again.`
          );
          this.promptAIStream(messageFromAI);
        } else if (userResponse.trim().toLowerCase() === "exit") {
          this.endProgram();
        } else {
          if (isInitialAIResponse) this.setDefaultMessagesPayload(userResponse);
          else this.appendMessagesProperty(userResponse, "user");

          const stream = await this.generateAIResponseStream();

          let accumulatedResponse = "";
          process.stdout.write(`${COLORS.GREEN}AI: ${COLORS.RESET}`);
          for await (const chunk of stream) {
            const content = chunk?.choices?.[0]?.delta?.content;
            if (content !== undefined) {
              process.stdout.write(`${content}`);
              accumulatedResponse += content;

              await delay();
            }
          }

          // Ensure a clean line break after the stream finishes
          process.stdout.write(
            ` ${COLORS.YELLOW}${EXIT_INSTRUCTION_MESSAGE} \n`
          );

          // Save the assistant's full response and loop again
          this.appendMessagesProperty(accumulatedResponse, "assistant");
          this.promptAIStream(accumulatedResponse);
        }
      }
    );
  }

  promptAI(messageFromAI, isInitialAIResponse = false) {
    const prompter = isInitialAIResponse
      ? `${COLORS.CYAN}SYSTEM: ${COLORS.RESET}`
      : `${COLORS.GREEN}AI: ${COLORS.RESET}`;

    let formattedMessage = `${prompter} ${messageFromAI}`;
    if (!isInitialAIResponse) {
      formattedMessage += ` ${COLORS.YELLOW}${EXIT_INSTRUCTION_MESSAGE}`;
    }
    formattedMessage += `\n${COLORS.BLUE}${this.userName}:${COLORS.RESET} `;
    this.rl.question(formattedMessage, async (userResponse) => {
      if (userResponse.trim() === "") {
        console.log(
          `${COLORS.GREEN}AI: ${COLORS.RESET}You've submitted an empty response. Please try again.`
        );
        this.promptAI(messageFromAI);
      } else if (userResponse.trim().toLowerCase() === "exit") {
        this.endProgram();
      } else {
        if (isInitialAIResponse) this.setDefaultMessagesPayload(userResponse);
        else this.appendMessagesProperty(userResponse, "user");
        const generatedResponse = await this.generateAIResponse();
        this.appendMessagesProperty(generatedResponse, "assistant");
        this.promptAI(generatedResponse);
      }
    });
  }

  setDefaultMessagesPayload(name) {
    this.userName = name;
    this.messages = DEFAULT_MESSAGES_PAYLOAD(name);
  }

  promptAIResponseType() {
    const isInitialAIResponse = true;
    const formattedMessage = `${INITIAL_AI_MESSAGE} ${COLORS.YELLOW}${EXIT_INSTRUCTION_MESSAGE}`;

    this.rl.question(
      `${COLORS.CYAN}SYSTEM: ${COLORS.RESET}${AI_RESPONSE_TYPE_PROMPT}`,
      (userResponse) => {
        userResponse = userResponse.trim().toLowerCase();
        if (userResponse === "" || !["y", "n"].includes(userResponse)) {
          console.log(`${COLORS.CYAN}SYSTEM: ${COLORS.RESET}Invalid command.`);
          this.promptAIResponseType();
        } else if (userResponse === "y") {
          this.promptAIStream(formattedMessage, isInitialAIResponse);
        } else {
          this.promptAI(formattedMessage, isInitialAIResponse);
        }
      }
    );
  }
}

module.exports = OpenAIService;
