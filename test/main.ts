import fs from 'node:fs';
import process from 'node:process';
import test from 'ava';
import {temporaryDirectory} from 'tempy';
import {readPackage} from 'read-pkg';
import {writePackage} from 'write-pkg';
import {restore, stub} from 'sinon';
import pinecone from '../source/index.js';
import {
	readToJson,
	readToString,
	toRelativePath,
	writeToFile,
	type Theme,
} from '../source/utilities.js';

test.before(async () => {
	const temporary = temporaryDirectory();
	const pkg = await readPackage({normalize: false});

	await writePackage(temporary, {...pkg} as any);

	stub(console, 'log');
	stub(process, 'cwd').callsFake(() => temporary);

	await pinecone('init');
});

test.after(() => {
	restore();
});

test('creates default config', async (t) => {
	await pinecone();

	const theme1 = readToJson<Record<string, any>>(
		'./themes/caffe-color-theme.json',
	);
	const theme2 = readToJson<Record<string, any>>(
		'./themes/caffe-latte-color-theme.json',
	);

	t.is(theme1['colors']?.['editor.background'], '#36261b');
	t.is(theme2['colors']?.['editor.background'], '#faf8f6');
});

test('replaces prefixed values', async (t) => {
	await pinecone();

	const theme1 = readToString(`/themes/caffe-color-theme.json`);
	const theme2 = readToString(`/themes/caffe-latte-color-theme.json`);

	t.notRegex(theme1, /\$\w/g);
	t.notRegex(theme2, /\$\w/g);
});

test('includes non-italic variants', async (t) => {
	await pinecone('', {includeNonItalicVariants: true});

	const theme1 = readToString(`/themes/caffe-no-italics-color-theme.json`);
	const theme2 = readToString(
		`/themes/caffe-latte-no-italics-color-theme.json`,
	);

	t.notRegex(theme1, /fontStyle.*?italic/g);
	t.notRegex(theme2, /fontStyle.*?italic/g);
	// Ensure scope names are left unmodified
	t.regex(theme2, /markup\.italic\.markdown/g);
});

test('removes empty values', async (t) => {
	await pinecone();

	const theme = readToJson<Theme>(`./themes/caffe-latte-color-theme.json`);
	t.is(theme.colors?.['badge.background'], undefined);
});

test('removes unused themes and syncs package.json contributes', async (t) => {
	const extraThemePath = toRelativePath('./themes/extra-color-theme.json');
	writeToFile(extraThemePath, '{}');

	await pinecone('', {tidy: true});

	const pkg = await readPackage();

	t.is(pkg.contributes.themes[0].label, 'Caffè');
	t.false(fs.existsSync(extraThemePath));
});
