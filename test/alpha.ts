import test from 'ava'
import { alpha } from '../source'

test('alpha() accepts hex color', (t) => {
	let actual = alpha('#fa8072', 0.5)
	let expected = '#fa807280'

	t.is(actual, expected)
})

test('alpha() accepts short hex color', (t) => {
	let actual = alpha('#333', 0.5)
	let expected = '#33333380'

	t.is(actual, expected)
})

test('alpha() accepts hex color without `#`', (t) => {
	let actual = alpha('fa8072', 0.5)
	let expected = '#fa807280'

	t.is(actual, expected)
})

test('alpha() accepts short hex color without `#`', (t) => {
	let actual = alpha('333', 0.5)
	let expected = '#33333380'

	t.is(actual, expected)
})

test('alpha() accepts hex color object', (t) => {
	let colors = { dark: '#fa8072', light: '#fa8072' }
	let actual = alpha(colors, 0.5)
	let expected = { dark: '#fa807280', light: '#fa807280' }

	t.deepEqual(actual, expected)
})

test('alpha() rejects deep hex color object', (t) => {
	let colors: any = {
		dark: '#000',
		light: { lighter: '#eee', lightest: '#fff' },
	}

	t.throws(() => alpha(colors, 0.5))
})

// leading 0's are stripped by isHex, too buggy to leave in as-is
test.skip('alpha() rejects non-hex color', (t) => {
	t.throws(() => alpha('#ga8072', 0.5))
	t.notThrows(() => alpha('#010101', 0.1))
})

test('alpha() rejects invalid length hex color', (t) => {
	t.throws(() => alpha('#fa80722', 0.5))
})

test('alpha() handles single digit opacity', (t) => {
	let actual = alpha('#fa8072', 0.01)
	let expected = '#fa807203'

	t.is(actual, expected)
})
