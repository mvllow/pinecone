import fs from 'node:fs';
import process from 'node:process';
import test from 'ava';
import pinecone from '../source/index.js';
import {readJson} from '../source/util/read-json.js';
import type {PackageTheme, Theme} from '../source/types/themes.js';
import {writePrettyFile} from '../source/util/write-pretty-file.js';

test.before(async () => {
	await pinecone('init');
});

test.after(async () => {
	try {
		fs.rmSync(process.cwd() + '/themes', {recursive: true});
	} catch (error: unknown) {
		console.error(error);
	}

	try {
		fs.unlinkSync(process.cwd() + '/pinecone.config.js');
	} catch (error: unknown) {
		console.error(error);
	}

	const packageJson = readJson<Record<string, unknown>>('package.json');
	const cleanedPackageJson = {...packageJson, contributes: undefined};

	await writePrettyFile(
		'package.json',
		JSON.stringify(cleanedPackageJson, null, 2),
		'json-stringify',
	);
});

test.serial('creates default config', async (t) => {
	await pinecone();

	const theme1 = readJson<Record<string, any>>(
		'./themes/caffe-color-theme.json',
	);
	const theme2 = readJson<Record<string, any>>(
		'./themes/caffe-latte-color-theme.json',
	);

	t.is(theme1['colors']?.['editor.background'], '#36261b');
	t.is(theme2['colors']?.['editor.background'], '#faf8f6');
});

test('replaces prefixed values', async (t) => {
	await pinecone();

	const theme1 = fs.readFileSync(
		process.cwd() + `/themes/caffe-color-theme.json`,
		'utf8',
	);
	const theme2 = fs.readFileSync(
		process.cwd() + `/themes/caffe-latte-color-theme.json`,
		'utf8',
	);

	t.notRegex(theme1, /\$\w/g);
	t.notRegex(theme2, /\$\w/g);
});

test('includes non-italic variants', async (t) => {
	await pinecone('', {includeNonItalicVariants: true});

	const theme1 = fs.readFileSync(
		process.cwd() + `/themes/caffe-no-italics-color-theme.json`,
		'utf8',
	);
	const theme2 = fs.readFileSync(
		process.cwd() + `/themes/caffe-latte-no-italics-color-theme.json`,
		'utf8',
	);

	t.notRegex(theme1, /fontStyle.*?italic/g);
	t.notRegex(theme2, /fontStyle.*?italic/g);
});

test('removes empty values', async (t) => {
	await pinecone();

	const theme = readJson<Theme>(`./themes/caffe-latte-color-theme.json`);
	t.is(theme.colors?.['badge.background'], undefined);
});

test('updates package.json contributes', async (t) => {
	await pinecone('', {tidy: true});

	const packageJson = readJson<{
		[key: string]: unknown;
		contributes: {themes: PackageTheme[]};
	}>('package.json');

	t.is(packageJson?.contributes?.themes?.[0]?.label, 'Caffè');
});
