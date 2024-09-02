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
    - Give an overview of what the code does
    - Explain step by step each major section of the code. Explain any complex or non-obvious parts of the code in simple terms.
    - Discuss the input and output of the code, if applicable
    - Describe any important algorithms or data structures used
    - Highlight any best practices or potential improvements
    - Mention any libraries or frameworks being used and their significance
    - Point out any potential edge cases or limitations
    - If relevant, suggest how this code might be tested or debugged
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
