import * as vscode from "vscode";
import { EventGenerator } from "./event-generator";
import { formatText } from "../utils";

export class ExplainCode extends EventGenerator {
  constructor(action: string, context: vscode.ExtensionContext) {
    super(action, context);
  }

  generatePrompt() {
    const PROMPT = `
    Please provide a detailed explanation of the given code.
    In your explanation, please:
    - Give an overview of what the code does, and what is the programming language / library / framework used
    - Then, inside a code block, explain the original code step by step. Do the step by step explanation as inline comments of original code, and put all code inside one code block only. Explain any complex or non-obvious parts of the code in simple terms.
    - Then, add additional explanation, for example:
        - if applicable, Discuss the input and output of the code, if applicable
        - if applicable, Describe any important algorithms or data structures used, as well as the time complexity and space complexity
        - if applicable, Highlight any potential improvements or corrections of the code
        The above additioanl explanations are optional. If not applicable, no need to show them.
    Please format your response with clear headings and bullet points where appropriate for better readability.
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
