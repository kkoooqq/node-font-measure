'use strict'

let m = require('./')
let a = require('assert')

a.deepEqual(m('Roboto'), {
	lineHeight: 1.3125,

	baseline: 1.046875,
	alphabetic: 1.046875
})
