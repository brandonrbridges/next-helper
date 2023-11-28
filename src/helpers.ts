import fs from 'fs'
import path from 'path'

export const findComponentDirectory = async (
	root: string
): Promise<string | null> => {
	try {
		const entries = fs.readdirSync(root, { withFileTypes: true })

		for (const entry of entries) {
			if (entry.isDirectory()) {
				if (entry.name === 'node_modules') {
					continue
				}

				if (entry.name === 'components') {
					return path.join(root, entry.name)
				} else {
					const subDirectoryPath = path.join(root, entry.name)
					const found = await findComponentDirectory(subDirectoryPath)

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

export const generateComponentContent = (name: string): string => {
	return `
import React from 'react'

const ${name} = () => {
  return <div>${name}</div>
}

export default ${name}
  `
}

export const generateIndexContent = (name: string): string => {
	return `export { default } from './${name}'`
}
