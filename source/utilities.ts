import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import {dedent} from 'ts-dedent';

/**
 * VSCode package.json section.
 * @example { "contributes": { "themes": [...] } }
 */
export type PackageTheme = {
	label: string;
	uiTheme: 'vs' | 'vs-dark';
	path: string;
};

/**
 * VSCode theme file.
 */
export type Theme = {
	[key: string]: unknown;
	name?: string;
	type?: 'light' | 'dark';
	colors?: Record<string, string>;
	tokenColors?: unknown[];
	semanticHighlighting?: boolean;
	semanticTokenColors?: Record<string, unknown>;
};

const formatMessage = (message: string) =>
	dedent(message.replace(/\t/g, '    '));

export const styles = {
	item: (message: string) => `    ${chalk.dim('-')} ${chalk.magenta(message)}`,
	string: (message: string) => chalk.yellow(`"${message}"`),
	url: (message: string) => chalk.magenta(message),
};

export const log = {
	list(title: string, items: string[]) {
		console.log(title);
		for (const item of items) {
			console.log(styles.item(item));
		}

		console.log();
	},
	warn(message: string) {
		console.log(
			chalk(chalk.yellow.inverse(' Warn '), '%s\n'),
			formatMessage(message),
		);
	},
	error(message: string) {
		console.log(
			chalk(chalk.red.inverse(' Error '), '%s\n'),
			formatMessage(message),
		);
	},
};

export const toRelativePath = (to: string) => path.join(process.cwd(), to);

export const readToString = (file: string) => {
	try {
		return fs.readFileSync(toRelativePath(file), 'utf8');
	} catch (error: unknown) {
		log.error(`Unable to read file, ${toRelativePath(file)}`);
		throw new Error(error as string);
	}
};

export const readToJson = <T>(file: string): T => {
	try {
		const contents = fs
			.readFileSync(toRelativePath(file), 'utf8')
			.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
				g ? '' : m,
			);

		return JSON.parse(contents) as T;
	} catch (error: unknown) {
		log.error(`Unable to read file, ${toRelativePath(file)}`);
		throw new Error(error as string);
	}
};

export const writeToFile = (where: string, what: string) => {
	try {
		fs.writeFileSync(where, what, 'utf8');
	} catch (error: unknown) {
		log.error(`Unable to write file, ${where}`);
		throw new Error(error as string);
	}
};

export const makeDirectory = (where: string) => {
	try {
		fs.mkdirSync(path.dirname(where), {recursive: true});
	} catch (error: unknown) {
		log.error(`Unable to make directory, ${path.dirname(where)}`);
		throw new Error(error as string);
	}
};

export const importFresh = async <T>(
	modulePath: string,
): Promise<T | Record<string, unknown> | undefined> => {
	const freshModulePath = `${modulePath}?update=${Date.now()}`;

	try {
		const freshModule = (await import(freshModulePath)) as {default: T};
		return freshModule.default;
	} catch {
		return undefined;
	}
};
