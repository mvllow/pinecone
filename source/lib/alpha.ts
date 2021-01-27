type Color = string | { [key: string]: string }
type Transparency = number

/**
 * Convert decimal to two digit hex value
 */
function convertDecimalToHex(decimal: number) {
	let hex = Math.round(decimal * 255).toString(16)

	if (hex.length === 1) {
		hex = `0${hex}`
	} else if (hex.length !== 2) {
		hex = ''
	}

	return hex
}

export const alpha = (color: Color, transparency: Transparency) => {
	if (typeof color === 'object') {
		let colors: typeof color = {}
		for (let key in color) {
			if (typeof color[key] === 'object') {
				throw new Error('Nested color objects are not allowed')
			}

			Object.assign(colors, { [key]: alpha(color[key], transparency) })
		}
		return colors
	} else {
		let workingColor = color.replace('#', '')

		if (workingColor.length === 3) {
			workingColor = `#${workingColor.repeat(2)}`
		} else if (workingColor.length === 6) {
			workingColor = `#${workingColor}`
		} else {
			throw new Error('Invalid hex color length')
		}

		let opacity = convertDecimalToHex(transparency)

		return workingColor + opacity
	}
}
