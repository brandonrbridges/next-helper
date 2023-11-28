// VS Code
import * as vscode from 'vscode'

// Node
import fs from 'fs'
import path from 'path'

// Helpers
import {
	findComponentDirectory,
	generateComponentContent,
	generateIndexContent,
} from './helpers'

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "nextjs-essentials" is now active!'
	)

	let createComponent = vscode.commands.registerCommand(
		'nextjs-essentials.createComponent',
		async () => {
			const name = await vscode.window.showInputBox({
				placeHolder: 'Component name',
				prompt: 'Enter component name',
				validateInput: (text) => {
					return text && /^[A-Z][A-Za-z]*$/.test(text)
						? null
						: 'Component name must be in PascalCase'
				},
			})

			if (!name) {
				vscode.window.showErrorMessage('Component creation cancelled.')
				return
			}

			const folders = vscode.workspace.workspaceFolders

			if (!folders) {
				vscode.window.showErrorMessage('No workspace folder found.')
				return
			}

			const root = folders[0].uri.fsPath
			const directory = await findComponentDirectory(root)

			if (!directory) {
				vscode.window.showErrorMessage('No components directory found.')
				return
			}

			const componentFile = generateComponentContent(name)
			const componentFilePath = path.join(directory, `/${name}/${name}.tsx`)

			const indexFile = generateIndexContent(name)
			const indexFilePath = path.join(directory, `/${name}/index.ts`)

			fs.mkdirSync(path.join(directory, `/${name}`))

			fs.writeFileSync(componentFilePath, componentFile)
			fs.writeFileSync(indexFilePath, indexFile)

			const openPath = vscode.Uri.file(componentFilePath)

			vscode.workspace.openTextDocument(openPath).then((doc) => {
				vscode.window.showTextDocument(doc)
			})
		}
	)

	context.subscriptions.push(createComponent)
}

export function deactivate() {}
