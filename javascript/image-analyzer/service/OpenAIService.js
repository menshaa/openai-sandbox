const OpenAI = require("openai");
const {
  IMAGES,
  COLORS,
  IMAGE_ANALYZER_PROMPT,
  EXIT_INSTRUCTION_MESSAGE,
  DEFAULT_SYSTEM_PROMPT,
} = require("../constants");

class OpenAIService {
  constructor(rl) {
    this.rl = rl;
    this.openAIClient = new OpenAI();
    this.messages = [];
  }

  init() {
    this.promptUserForImage();
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

  async promptAI(imageId) {
    const { url: imageUrl } = IMAGES.find((image) => image.id === imageId);
    this.messages = [
      {
        role: "system",
        content: DEFAULT_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image",
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ];

    const response = await this.generateAIResponse();
    console.log(`${COLORS.GREEN}AI: ${COLORS.RESET}${response}\n\n`);
    this.promptUserForImage();
  }

  setDefaultMessagesPayload(name) {
    this.userName = name;
    this.messages = DEFAULT_MESSAGES_PAYLOAD(name);
  }

  promptUserForImage() {
    let formattedMessage = `${COLORS.CYAN}SYSTEM: ${COLORS.RESET}${IMAGE_ANALYZER_PROMPT} ${COLORS.YELLOW}${EXIT_INSTRUCTION_MESSAGE}\n`;
    IMAGES.forEach((image, index) => {
      formattedMessage += `${COLORS.GREEN}(${index + 1}) ${
        image.description
      }\n${COLORS.RESET}`;
    });

    this.rl.question(
      `${formattedMessage}\n${COLORS.BLUE}Answer: ${COLORS.RESET}`,
      (userResponse) => {
        userResponse = userResponse.trim().toLowerCase();
        if (userResponse === "exit") {
          this.endProgram();
        }
        if (
          userResponse === "" ||
          isNaN(userResponse) ||
          !Number.isInteger(Number(userResponse)) ||
          (Number(userResponse) < 1 && Number(userResponse) > IMAGES.length)
        ) {
          console.log(
            `${COLORS.CYAN}SYSTEM: ${COLORS.RESET}Invalid selection.`
          );
          this.promptUserForImage();
        } else {
          this.promptAI(Number(userResponse));
        }
      }
    );
  }
}

module.exports = OpenAIService;
