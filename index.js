'use strict'

var extend = require('object-assign')

module.exports = measure

measure.canvas = document.createElement('canvas')
measure.cache = {}

function measure (font, o) {
	if (!o) o = {}

	if (typeof font === 'string' || Array.isArray(font)) {
		o.family = font
	}

	var family = Array.isArray(o.family) ? o.family.join(', ') : o.family
	if (!family) throw Error('`family` must be defined')

	var fs = o.size || o.fontSize || o.em || 48
	var font = fs + 'px ' + family
	var origin = o.origin || 'top'

	if (measure.cache[family]) {
		// return more precise values if cache has them
		if (fs <= measure.cache[family].em) {
			return origin === 'top' ? measure.cache[family] : applyOrigin(measure.cache[family], origin)
		}
	}

	var canvas = o.canvas || measure.canvas
	var ctx = canvas.getContext('2d')
	var chars = extend({
		upper: 'H',
		lower: 'x',
		descent: 'p',
		ascent: 'h',
		tittle: 'i',
		overshoot: 'O'
	}, o.chars)
	var l = Math.ceil(fs * 1.5)
	canvas.height = l
	canvas.width = l * .5
	ctx.font = font


	// measure line-height
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillStyle = 'black'
	ctx.fillText(chars.upper, 0, 0)
	var topPx = firstTop(ctx.getImageData(0, 0, l, l))
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'bottom'
	ctx.fillText(chars.upper, 0, l)
	var bottomPx = firstTop(ctx.getImageData(0, 0, l, l))
	var lineHeight = l - bottomPx + topPx

	// measure baseline
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'alphabetic'
	ctx.fillText(chars.upper, 0, l)
	var baselinePx = firstTop(ctx.getImageData(0, 0, l, l))
	var baseline = l - baselinePx - 1 + topPx

	// measure median
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'middle'
	ctx.fillText(chars.upper, 0, l * .5)
	var medianPx = firstTop(ctx.getImageData(0, 0, l, l))
	var median = l - medianPx - 1 + topPx - l * .5

	// measure hanging
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'hanging'
	ctx.fillText(chars.upper, 0, l * .5)
	var hangingPx = firstTop(ctx.getImageData(0, 0, l, l))
	var hanging = l - hangingPx - 1 + topPx - l * .5

	// measure ideographic
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'ideographic'
	ctx.fillText(chars.upper, 0, l)
	var ideographicPx = firstTop(ctx.getImageData(0, 0, l, l))
	var ideographic = l - ideographicPx - 1 + topPx

	// measure cap
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillText(chars.upper, 0, 0)
	var upper = firstTop(ctx.getImageData(0, 0, l, l))

	// measure x
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillText(chars.lower, 0, 0)
	var lower = firstTop(ctx.getImageData(0, 0, l, l))

	// measure tittle
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillText(chars.tittle, 0, 0)
	var tittle = firstTop(ctx.getImageData(0, 0, l, l))

	// measure ascent
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillText(chars.ascent, 0, 0)
	var ascent = firstTop(ctx.getImageData(0, 0, l, l))

	// measure descent
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillText(chars.descent, 0, 0)
	var descent = firstBottom(ctx.getImageData(0, 0, l, l))

	// measure overshoot
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'top'
	ctx.fillText(chars.overshoot, 0, 0)
	var overshootPx = firstBottom(ctx.getImageData(0, 0, l, l))
	var overshoot = overshootPx - baseline

	var result = {
		top: 0,
		bottom: lineHeight,
		lineHeight: lineHeight,

		baseline: baseline,
		alphabetic: baseline,

		xHeight: (baseline - lower),
		capHeight: (baseline - upper),

		lower: lower,
		upper: upper,

		ascent: ascent,
		descent: descent,
		tittle: tittle,
		overshoot: overshoot,

		ideographic: ideographic,
		hanging: hanging,
		median: median,
		middle: median
	}

	for (var name in result) {
		result[name] /= fs
	}
	result.em = fs
	measure.cache[family] = result

	result = applyOrigin(result, origin)

	return result
}

function applyOrigin(obj, origin) {
	var res = {}
	if (typeof origin === 'string') origin = obj[origin]
	for (var name in obj) {
		if (name === 'em') continue
		res[name] = obj[name] - origin
	}
	return res
}

function firstTop(iData) {
	var l = iData.height
	var data = iData.data
	for (var i = 3; i < data.length; i+=4) {
		if (data[i] !== 0) {
			return Math.floor((i - 3) *.25 / l)
		}
	}
}

function firstBottom(iData) {
	var l = iData.height
	var data = iData.data
	for (var i = data.length - 1; i > 0; i -= 4) {
		if (data[i] !== 0) {
			return Math.floor((i - 3) *.25 / l)
		}
	}
}
