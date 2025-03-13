const COLORS = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  CYAN: "\x1b[36m",
};

const IMAGES = [
  {
    id: 1,
    description: "Mountain",
    url: "https://fastly.picsum.photos/id/905/536/354.jpg?hmac=YdxFK-q3l-LJ4RyfeNN2arXtLlduNrnggTPGzNP2bwI",
  },
  {
    id: 2,
    description: "Dog",
    url: "https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0",
  },
  {
    id: 3,
    description: "Walruses",
    url: "https://fastly.picsum.photos/id/1084/536/354.jpg?grayscale&hmac=Ux7nzg19e1q35mlUVZjhCLxqkR30cC-CarVg-nlIf60",
  },
  {
    id: 4,
    description: "Tea Pots",
    url: "https://fastly.picsum.photos/id/1060/536/354.jpg?blur=2&hmac=0zJLs1ar00sBbW5Ahd_4zA6pgZqCVavwuHToO6VtcYY",
  },
];
const EXIT_INSTRUCTION_MESSAGE = `(type 'exit' to quit): `;
const IMAGE_ANALYZER_PROMPT =
  "Please select an image that you would like AI to analyze (type the number)";

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful assistant. Your object is to analyze images and provide good feedback about it.";

module.exports = {
  IMAGES,
  COLORS,
  IMAGE_ANALYZER_PROMPT,
  EXIT_INSTRUCTION_MESSAGE,
  DEFAULT_SYSTEM_PROMPT,
};
