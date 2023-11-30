// VS Code
import * as vscode from 'vscode'

// Commands
import { createComponentCommand } from './commands/createComponent'
import { createPageCommand } from './commands/createPage'

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(createComponentCommand)
	context.subscriptions.push(createPageCommand)
}

export function deactivate() {}
