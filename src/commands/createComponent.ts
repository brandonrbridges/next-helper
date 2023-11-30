// VS Code
import * as vscode from 'vscode'

// Node
import fs from 'fs'
import path from 'path'

// Utils
import {
	detectLanguage,
	detectStyleType,
	findDirectory,
} from '../utils/fs.utils'

// Helpers
import { generateComponentContent, generateIndexContent } from '../helpers'

export const createComponentCommand = vscode.commands.registerCommand(
	'nextjs-essentials.createComponent',
	async () => {
		// Configurations
		const config = vscode.workspace.getConfiguration('nextjs-essentials')
		const createStyleFiles = config.get('createStyleFiles')

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
		const directory = await findDirectory(root, 'components')

		if (!directory) {
			vscode.window.showErrorMessage('No components directory found.')
			return
		}

		fs.mkdirSync(path.join(directory, `/${name}`))

		const language = await detectLanguage()
		const extension = language === 'typescript' ? 'tsx' : 'jsx'

		const componentFileName = `${name}.${extension}`

		const componentFile = await generateComponentContent(name)
		const componentFilePath = path.join(
			directory,
			`/${name}/${componentFileName}`
		)

		fs.writeFileSync(componentFilePath, componentFile)

		const indexFileName = extension === 'tsx' ? 'index.ts' : 'index.js'

		const indexFile = generateIndexContent(name)
		const indexFilePath = path.join(directory, `/${name}/${indexFileName}`)

		fs.writeFileSync(indexFilePath, indexFile)

		if (createStyleFiles) {
			const styleType = await detectStyleType()

			const styleFile = `._component {}`
			const styleFilePath = path.join(
				directory,
				`/${name}/${name}.module.${styleType}`
			)

			fs.writeFileSync(styleFilePath, styleFile)
		}

		const openPath = vscode.Uri.file(componentFilePath)

		vscode.workspace.openTextDocument(openPath).then((doc) => {
			vscode.window.showTextDocument(doc)
		})
	}
)
