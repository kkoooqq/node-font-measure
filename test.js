'use strict'

let m = require('./')
let a = require('assert')

a.deepEqual(m('Roboto'), {
	top: 0,
	bottom: 1.3125,
	lower: 0.515625,
	upper: 0.328125,
	xHeight: 0.53125,
	alphabetic: 1.046875,
	baseline: 1.046875,
	capHeight: 0.71875,
	median: 0.65625,
	middle: 0.65625,
	ascent: 0.28125,
	descent: 0.328125,
	hanging: 0.21875,
	ideographic: 1,
	lineHeight: 1.3125,
	tittle: 0.28125,
	overshoot: 0
})
