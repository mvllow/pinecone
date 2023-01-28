export type Options = {
	/**
	 * Path to pinecone theme file
	 * Append "-color-theme" to your source file for VSCode intellisense
	 * @default './themes/_pinecone-color-theme.json'
	 */
	source: string;
	/**
	 * Directory for generated themes
	 *
	 * @default './themes'
	 */
	output: string;
	/**
	 * Variable prefix
	 *
	 * @default '$'
	 */
	prefix: string;
	/**
	 * Rebuild themes on change
	 *
	 * @default false
	 */
	watch: boolean;
	/**
	 * Remove non-pinecone themes
	 *
	 * @default false
	 */
	tidy?: boolean;
	/**
	 * Generate additional variants with no italics
	 *
	 * @default false
	 */
	includeNonItalicVariants?: boolean;
};

export type Config = {
	/** @deprecated Moved to `options.source` */
	source?: never;
	/** @deprecated Moved to `options.output` */
	output?: never;
	/** @deprecated Moved to `options.prefix` */
	prefix?: never;
	options: Options;
	variants: Record<string, {name: string; type: 'light' | 'dark'}>;
	colors: Record<string, string | Record<string, string>>;
};

export type UserConfig = Partial<Config>;
export type UserOptions = Partial<Options>;
