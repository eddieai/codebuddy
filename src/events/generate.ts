import * as vscode from "vscode";
import { EventGenerator } from "./event-generator";
import { formatText } from "../utils";

export class GenerateCode extends EventGenerator {
  constructor(action: string, context: vscode.ExtensionContext) {
    super(action, context);
  }

  generatePrompt() {
    const PROMPT = `
        I want you to act as a code assistant for a senior engineer. Your goal is to generate high quality, optimized, self-documenting and runnable code which can answer my question. My question could be just one coding question, or a code snippet with question as inline-comment.
        Your reply should have and only have one single code block. Do NOT add any text or notes or explanations. Write outputs, explanations, texts, notes as code comments inside the only code block. When you write a code block, include the language in the very begining like "\`\`\`python". Never use markdown, never use markdown headings or markdown headers. Never add any plain text outside the code block.
        In the code block, please include runnable code(Python or bash or Javascript or C++), understandable code comments as well as code output. Whenever you write a code block you include the language after the opening ticks.Do NOT add any text or notes or explanations.Write outputs, explanations, texts, notes as code comments inside the only code block.Never use markdown, never use markdown headings or markdown headers.Never add any plain text outside the code block.
        After each code line which generates output, must display the output result as comment block from a new line.The new comment line of output should start with "Output:".Do NOT add any text or notes or explanations.Write outputs, explanations, texts, notes as code comments inside the only code block.Never use markdown, never use markdown headings or markdown headers.Never add any plain text outside the code block.

        My question is:
`;
    return PROMPT;
  }

  formatResponse(comment: string): string {
    return formatText(comment);
  }

  createPrompt(selectedCode: string): string {
    const prompt = this.generatePrompt();
    const fullPrompt = `${prompt} \n ${selectedCode}`;
    return fullPrompt;
  }
}
