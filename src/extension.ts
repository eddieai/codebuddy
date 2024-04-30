import * as vscode from "vscode";
import { OLA_ACTIONS, USER_MESSAGE } from "./constant";
import { Comments } from "./events/comment";
import { ExplainCode } from "./events/explain";
import { FixError } from "./events/fixError";
import { OptimizeCode } from "./events/optimize";
import { RefactorCode } from "./events/refactor";
import { ReviewCode } from "./events/review";
import { CodeActionsProvider } from "./providers/code-actions-provider";
import { GroqWebViewProvider } from "./providers/groq-web-view-provider";
import { ChatManager } from "./services/chat-manager";
import { GeminiWebViewProvider } from "./providers/gemini-web-view-provider";

export async function activate(context: vscode.ExtensionContext) {
  const { comment, review, refactor, optimize, fix, explain } = OLA_ACTIONS;
  const getComment = new Comments(`${USER_MESSAGE} generates the code comments...`, context);
  const generateOptimizeCode = new OptimizeCode(`${USER_MESSAGE} optimizes the code...`, context);
  const generateRefactoredCode = new RefactorCode(`${USER_MESSAGE} refactors the code...`, context);
  const explainCode = new ExplainCode(`${USER_MESSAGE} explains the code...`, context);
  const generateReview = new ReviewCode(`${USER_MESSAGE} reviews the code...`, context);

  const actionMap = {
    [comment]: () => getComment.execute(),
    [review]: () => generateReview.execute(),
    [refactor]: () => generateRefactoredCode.execute(),
    [optimize]: () => generateOptimizeCode.execute(),
    [fix]: (errorMessage: string) =>
      new FixError(`${USER_MESSAGE} finds a solution to the error...`, context, errorMessage).execute(),
    [explain]: () => explainCode.execute(),
  };

  const subscriptions = Object.entries(actionMap).map(([action, handler]) =>
    vscode.commands.registerCommand(action, handler)
  );

  const selectedGenerativeAiModel = vscode.workspace.getConfiguration().get<string>("generativeAi.option");

  const quickFix = new CodeActionsProvider();
  const quickFixCodeAction = vscode.languages.registerCodeActionsProvider({ scheme: "file", language: "*" }, quickFix);

  // Todo: move each generative Ai view providers to different files
  if (selectedGenerativeAiModel === "Gemini") {
    const geminiWebViewProvider = new GeminiWebViewProvider(
      context.extensionUri,
      "groq.llama3.apiKey",
      "llama3-70b-8192",
      context
    );

    const registerGeminiWebViewProvider = vscode.window.registerWebviewViewProvider(
      GeminiWebViewProvider.viewId,
      geminiWebViewProvider
    );

    const chatManager = new ChatManager("groq.llama3.apiKey", "llama3-70b-8192", context);
    const chatWithOla = chatManager.registerChatCommand();

    context.subscriptions.push(...subscriptions, quickFixCodeAction, registerGeminiWebViewProvider, chatWithOla);
  }

  if (selectedGenerativeAiModel === "Grok") {
    const groqWebViewProvider = new GroqWebViewProvider(
      context.extensionUri,
      "groq.llama3.apiKey",
      "llama3-70b-8192",
      context
    );
    const registerGroqWebViewProvider = vscode.window.registerWebviewViewProvider(
      GroqWebViewProvider.viewId,
      groqWebViewProvider
    );

    const chatManager = new ChatManager("groq.llama3.apiKey", "llama3-70b-8192", context);
    const chatWithOla = chatManager.registerChatCommand();

    context.subscriptions.push(...subscriptions, quickFixCodeAction, registerGroqWebViewProvider, chatWithOla);
  }
}
