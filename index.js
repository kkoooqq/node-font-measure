'use strict'

module.exports = measureFont
measureFont.font = measureFont
measureFont.text = measureText


var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
var l = canvas.height = 100
canvas.width = l * .5

document.body.appendChild(canvas)
var fs = 64


function measureFont (family) {
	// measure line-height
	ctx.clearRect(0, 0, l, l)

	ctx.font = fontString(family)

	ctx.textBaseline = 'top'
	ctx.fillStyle = 'black'
	ctx.fillText('x', 0, 0)

	var topH = firstTop(ctx.getImageData(0, 0, l, l))

	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'bottom'
	ctx.fillText('x', 0, l)

	var botH = firstTop(ctx.getImageData(0, 0, l, l))
	var lineHeight = l - botH + topH

	// measure baseline

	ctx.clearRect(0, 0, l, l)
	ctx.textBaseline = 'alphabetic'
	ctx.fillText('x', 0, l)
	var baseH = firstTop(ctx.getImageData(0, 0, l, l))

	var baseline = l - baseH + topH

	ctx.clearRect(0, 0, l, l)

	// typical overshoot is 1.5%

	return {
		// xHeight: measureText(, ),
		baseline: baseline / fs,
		alphabetic: baseline / fs,
		// capHeight,
		// ascent,
		// descent,
		// overshoot,
		// tittle,
		// top,
		// bottom,
		lineHeight: lineHeight / fs
		// median,
		// middle,
		// hanging
	}
}

function measureText (char, font) {
	ctx.clearRect(0, 0, l, l)
}

function fontString (family) {
	family = Array.isArray(family) ? family.join(', ') : family
	return fs + 'px ' + family
}

function firstTop(iData) {
	var data = iData.data
	for (var i = 3; i < data.length; i+=4) {
		var px = data[i]
		if (data[i] !== 0) {
			return Math.floor((i - 3) / 4.0 / l)
		}
	}
}
