import escapeStringRegexp from 'escape-string-regexp'
import { log } from './pretty-log.js'

export function replaceJsonValues(
	body: string,
	searchFor: string,
	replaceWith: string
) {
	let escapedSearchFor = escapeStringRegexp(`"${searchFor}"`)
	let formattedSearch = new RegExp(escapedSearchFor, 'g')
	let formattedReplace = '"' + replaceWith + '"'
	let result = ''

	try {
		result = body.replace(formattedSearch, formattedReplace)
	} catch (error) {
		log.error(error)
	}
	return result
}
