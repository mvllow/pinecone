/**
 * VSCode theme object found in package.json
 *
 * @example { "contributes": { "themes": [...] } }
 */
export type PackageTheme = {
	label: string;
	uiTheme: 'vs' | 'vs-dark';
	path: string;
};

/**
 * VSCode color theme file
 */
export type Theme = {
	[key: string]: unknown;
	name?: string;
	type?: 'light' | 'dark';
	/**
	 * @example bg: '#000' or bg: { dark: '#000', light: '#fff' }
	 */
	colors?: Record<string, string>;
	tokenColors?: unknown[];
	semanticHighlighting?: boolean;
	semanticTokenColors?: Record<string, unknown>;
};
