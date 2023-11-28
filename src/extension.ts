// VS Code
import * as vscode from 'vscode'

// Commands
import { createComponentCommand } from './commands/createComponent'

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(createComponentCommand)
}

export function deactivate() {}
