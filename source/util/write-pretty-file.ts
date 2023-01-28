import fs from 'node:fs';
import process from 'node:process';
import prettier from 'prettier';

/**
 * Write prettier file
 *
 * @param filePath starts from root
 * @param fileContents
 * @param parser parser used by prettier
 *
 */
export async function writePrettyFile(
	filePath: string,
	fileContents: string,
	parser = 'json',
) {
	try {
		await prettier.resolveConfig(process.cwd()).then((options) => {
			const formattedContents = prettier.format(fileContents, {
				...options,
				parser,
			});

			fs.writeFileSync(filePath, formattedContents, 'utf8');
		});
	} catch (error: unknown) {
		console.error(error);
	}
}
