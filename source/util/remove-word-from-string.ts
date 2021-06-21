import escapeStringRegexp from 'escape-string-regexp'

export function removeWordFromString(body: string, wordToRemove: string) {
	let result = body
	let escapedWordToRemove = escapeStringRegexp(wordToRemove)
	let sandwichedItalic = new RegExp(`\\s${escapedWordToRemove}\\s`, 'g') // eg. " italic "
	let endItalic = new RegExp(`\\s?${escapedWordToRemove}\\s?`, 'g') // eg. " italic", "italic ", "italic"

	result = result.replace(sandwichedItalic, ' ')
	result = result.replace(endItalic, '')

	return result
}
