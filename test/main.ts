import fs from 'node:fs';
import test from 'ava';
import {readPackage} from 'read-pkg';
import {writePackage} from 'write-pkg';
import pinecone from '../source/index.js';
import {
	readToJson,
	readToString,
	toRelativePath,
	type Theme,
} from '../source/utilities.js';

test.before(async () => {
	await pinecone('init');
});

test.after(async () => {
	try {
		fs.rmSync(toRelativePath('/themes'), {recursive: true});
	} catch (error: unknown) {
		console.error(error);
	}

	try {
		fs.unlinkSync(toRelativePath('/pinecone.config.js'));
	} catch (error: unknown) {
		console.error(error);
	}

	const pkg = await readPackage({normalize: false});
	await writePackage({...pkg, contributes: undefined} as any);
});

test.serial('creates default config', async (t) => {
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
});

test('removes empty values', async (t) => {
	await pinecone();

	const theme = readToJson<Theme>(`./themes/caffe-latte-color-theme.json`);
	t.is(theme.colors?.['badge.background'], undefined);
});

test('updates package.json contributes', async (t) => {
	await pinecone('', {tidy: true});

	const pkg = await readPackage();
	t.is(pkg.contributes.themes[0].label, 'Caffè');
});
