import escapeStringRegexp from 'escape-string-regexp';

export function removeWordFromString(body: string, wordToRemove: string) {
	const escapedWordToRemove = escapeStringRegexp(wordToRemove);
	const sandwichedItalic = new RegExp(`\\s${escapedWordToRemove}\\s`, 'g'); // Eg. " italic "
	const endItalic = new RegExp(`\\s?${escapedWordToRemove}\\s?`, 'g'); // Eg. " italic", "italic ", "italic"

	return body.replace(sandwichedItalic, '').replace(endItalic, '');
}
