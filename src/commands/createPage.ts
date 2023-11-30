// VS Code
import * as vscode from 'vscode'

// Node
import fs from 'fs'
import path from 'path'

// Utils
import { detectLanguage, findDirectory } from '../utils/fs.utils'

// Helpers
import { generatePageContent } from '../helpers'

export const createPageCommand = vscode.commands.registerCommand(
	'nextjs-essentials.createPage',
	async () => {
		const name = await vscode.window.showInputBox({
			placeHolder: 'Page name (lowercase)',
			prompt: 'Enter page name',
			validateInput: (text) => {
				return text && /^[a-z][A-Za-z\/]*$/.test(text)
					? null
					: 'Page name must be in kebab-case or folder structure (e.g., about or product/detail)'
			},
		})

		if (!name) {
			vscode.window.showErrorMessage('Page creation cancelled.')
			return
		}

		const choice = await vscode.window.showQuickPick(['app', 'pages'], {
			placeHolder: 'Select directory',
			canPickMany: false,
		})

		if (!choice) {
			vscode.window.showErrorMessage('Directory selection cancelled.')
			return
		}

		const folders = vscode.workspace.workspaceFolders

		if (!folders) {
			vscode.window.showErrorMessage('No workspace folder found.')
			return
		}

		const root = folders[0].uri.fsPath
		const directory = await findDirectory(root, choice)

		if (!directory) {
			vscode.window.showErrorMessage(`No ${choice} directory found.`)
			return
		}

		const language = await detectLanguage()

		const extension = language === 'typescript' ? 'tsx' : 'jsx'

		const pageFile = generatePageContent(name)

		let pagePath: string = ''

		if (choice === 'app') {
			pagePath = path.join(directory, `${name}/page.${extension}`)

			fs.mkdirSync(path.join(directory, `/${name}`))
			fs.writeFileSync(pagePath, pageFile)
		}

		if (choice === 'pages') {
			pagePath = path.join(directory, `${name}.${extension}`)

			fs.writeFileSync(pagePath, pageFile)
		}

		const openPath = vscode.Uri.file(pagePath)

		vscode.workspace.openTextDocument(openPath).then((doc) => {
			vscode.window.showTextDocument(doc)
		})
	}
)
