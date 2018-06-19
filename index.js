'use strict'

module.exports = measure

var canvas = measure.canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
var chars = {
	upper: 'H',
	lower: 'x',
	descent: 'p',
	ascent: 'h',
	tittle: 'i',
	overshoot: 'O'
}

var l = canvas.height = 100
canvas.width = l * .5
var fs = 64


function measure (family) {
	family = Array.isArray(family) ? family.join(', ') : family
	ctx.font = fs + 'px ' + family

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
	var baseline = l - baselinePx + topPx

	// measure median
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'middle'
	ctx.fillText(chars.upper, 0, l * .5)
	var medianPx = firstTop(ctx.getImageData(0, 0, l, l))
	var median = l - medianPx + topPx - l * .5

	// measure hanging
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'hanging'
	ctx.fillText(chars.upper, 0, l * .5)
	var hangingPx = firstTop(ctx.getImageData(0, 0, l, l))
	var hanging = l - hangingPx + topPx - l * .5

	// measure ideographic
	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'ideographic'
	ctx.fillText(chars.upper, 0, l)
	var ideographicH = firstTop(ctx.getImageData(0, 0, l, l))
	var ideographic = l - hangingPx + topPx

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
	var descent = l - firstBottom(ctx.getImageData(0, 0, l, l))

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

	var origin = 'top'
	var originValue = result[origin]
	for (var name in result) {
		result[name] = result[name] - originValue
		result[name] /= fs
	}

	return result
}

function firstTop(iData) {
	var data = iData.data
	for (var i = 3; i < data.length; i+=4) {
		var px = data[i]
		if (data[i] !== 0) {
			return Math.floor((i - 3) *.25 / l)
		}
	}
}

function firstBottom(iData) {
	var data = iData.data
	for (var i = data.length - 1; i > 0; i -= 4) {
		var px = data[i]
		if (data[i] !== 0) {
			return Math.floor((i - 3) *.25 / l)
		}
	}
}
