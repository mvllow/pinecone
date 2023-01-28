import escapeStringRegexp from 'escape-string-regexp';

export function replaceJsonValues(
	body: string,
	searchFor: string,
	replaceWith: string,
) {
	const escapedSearchFor = escapeStringRegexp(`"${searchFor}"`);
	const formattedSearch = new RegExp(escapedSearchFor, 'g');
	const formattedReplace = '"' + replaceWith + '"';

	try {
		return body.replace(formattedSearch, formattedReplace);
	} catch (error: unknown) {
		console.error(error);
		return '';
	}
}
