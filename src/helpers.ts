// VS Code
import * as vscode from 'vscode'

// Utils
import { detectStyleType } from './utils/fs.utils'

export const generateComponentContent = async (
	name: string
): Promise<string> => {
	const config = vscode.workspace.getConfiguration('nextjs-essentials')
	const createStyleFiles = config.get('createStyleFiles')

	const extension = await detectStyleType()

	return `import React from 'react'

${createStyleFiles && `import styles from './${name}.module.${extension}'`}

const ${name} = () => {
  return <div className={${
		createStyleFiles && `styles._component`
	}}>${name}</div>
}

export default ${name}
`
}

export const generateIndexContent = (name: string): string => {
	return `export { default } from './${name}'`
}

export const generatePageContent = (name: string): string => {
	const functionName = name.at(0)?.toUpperCase() + name.slice(1)

	return `import React from 'react'
	
export default function ${functionName}() {
	return (
		<div>
			${name}
		</div>
	)
}
`
}
