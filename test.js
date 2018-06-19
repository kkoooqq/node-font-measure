'use strict'

let m = require('./')
let a = require('assert')

let fix = {
	alphabetic: 1.03125,
	ascent: 0.28125,
	baseline: 1.03125,
	bottom: 1.3125,
	capHeight: 0.703125,
	descent: 1.234375,
	hanging: 0.203125,
	ideographic: 1.296875,
	lineHeight: 1.3125,
	lower: 0.515625,
	median: 0.640625,
	middle: 0.640625,
	overshoot: 0.015625,
	tittle: 0.28125,
	top: 0,
	upper: 0.328125,
	xHeight: 0.515625
}

a.deepEqual(m('Roboto', {fontSize: 64}), fix)
a.equal(m('Roboto', {fontSize: 64, origin: 'baseline'}).baseline, 0)
