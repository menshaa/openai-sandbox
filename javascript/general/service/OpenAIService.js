const OpenAI = require("openai");

const {
  DEFAULT_MESSAGES_PAYLOAD,
  INITIAL_AI_MESSAGE,
  EXIT_INSTRUCTION_MESSAGE,
  COLORS,
} = require("../constants");
class OpenAIService {
  constructor(rl) {
    this.rl = rl;
    this.openAIClient = new OpenAI();
    this.messages = [];
    this.userName;
  }

  init() {
    const isInitialAIResponse = true;
    this.promptName(INITIAL_AI_MESSAGE, isInitialAIResponse);
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
      const {
        message: { content },
      } = choice || { message: {} };

      return content;
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
    console.log(`${COLORS.GREEN}AI: Salam!`);
    this.rl.close();
    process.exit();
  }

  promptName(messageFromAI, isInitialAIResponse = false) {
    const formattedMessage = `${messageFromAI} ${EXIT_INSTRUCTION_MESSAGE(
      this.userName
    )}`;
    this.rl.question(
      `${COLORS.GREEN}AI: ${formattedMessage}`,
      async (userResponse) => {
        if (userResponse.trim() === "") {
          console.log(
            `${COLORS.RED}AI: You've submitted an empty response. Please try again.`
          );
          this.promptName(messageFromAI);
        } else if (userResponse.trim().toLowerCase() === "exit") {
          this.endProgram();
        } else {
          if (isInitialAIResponse) this.setDefaultMessagesPayload(userResponse);
          else this.appendMessagesProperty(userResponse, "user");
          const generatedResponse = await this.generateAIResponse();
          this.appendMessagesProperty(generatedResponse, "assistant");
          this.promptName(generatedResponse);
        }
      }
    );
  }

  setDefaultMessagesPayload(name) {
    this.userName = name;
    this.messages = DEFAULT_MESSAGES_PAYLOAD(name);
  }
}

module.exports = OpenAIService;
