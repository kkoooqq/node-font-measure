'use strict'

let m = require('./')
let a = require('assert')


// console.log(fm({fontFamily: 'Roboto', fontSize: 64, origin: 'top'}))

console.log(m('Roboto'))
a.deepEqual(m('Roboto'), {
	top: 0,
	bottom: 1.3125,
	lineHeight: 1.3125,

	ascent: 0.28125,
	descent: 1.234375,

	baseline: 1.046875,
	alphabetic: 1.046875,

	median: 0.65625,
	middle: 0.65625,

	family: 'Roboto'
})
