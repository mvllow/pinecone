import { log } from './pretty-log'

type Color = string | { [key: string]: string }
type Transparency = number

function expandHex(color: string) {
	color = color.replace('#', '')
	color = `#${color}${color}`
	return color
}

export const alpha = (color: Color, transparency: Transparency) => {
	//
	if (typeof color === 'object') {
		let newValue: any = {}
		for (let key in color) {
			newValue[key] = alpha(color[key], transparency)
		}
		return newValue
	} else {
		if ((!color.includes('#') && color.length === 3) || color.length === 6) {
			log.throw('alpha()', 'Expected valid hex code', 'Maybe try `#fa8072`')
		}
		if (color.length === 4) {
			color = expandHex(color)
		}
		let hex = Math.round(transparency * 255).toString(16)
		let opacity = hex.length === 1 ? `0${hex}` : hex // eg. convert 5% from 0xd to 0x0d
		if (opacity.length !== 2) opacity = ''
		return color + opacity
	}
}
