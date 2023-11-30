// VS Code
import * as vscode from 'vscode'

// Node
import fs from 'fs'
import path from 'path'

export const findDirectory = async (
	root: string,
	directory: string
): Promise<string | null> => {
	try {
		const entries = fs.readdirSync(root, { withFileTypes: true })

		for (const entry of entries) {
			if (entry.isDirectory()) {
				if (entry.name === 'node_modules') {
					continue
				}

				if (entry.name === '.next') {
					continue
				}

				if (entry.name === directory) {
					return path.join(root, entry.name)
				} else {
					const subDirectoryPath = path.join(root, entry.name)
					const found = await findDirectory(subDirectoryPath, directory)

					if (found) {
						return found
					}
				}
			}
		}

		return null
	} catch (error) {
		console.error(`Error finding component directory: ${error}`)

		return null
	}
}

export const detectLanguage = async (): Promise<
	'typescript' | 'javascript' | null
> => {
	const tsFiles = await vscode.workspace.findFiles('**/*.ts')
	const jsFiles = await vscode.workspace.findFiles('**/*.js')

	if (tsFiles.length > 0) {
		return 'typescript'
	} else if (jsFiles.length > 0) {
		return 'javascript'
	} else {
		return null
	}
}

export const detectStyleType = async (): Promise<string | null> => {
	const scssFiles = await vscode.workspace.findFiles('**/*.scss')
	const cssFiles = await vscode.workspace.findFiles('**/*.css')

	if (scssFiles.length > 0) {
		return 'scss'
	} else if (cssFiles.length > 0) {
		return 'css'
	} else {
		return null
	}
}
