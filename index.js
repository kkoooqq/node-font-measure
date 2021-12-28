module.exports = measure

measure.cache = {}

function measure(font, o) {
    if (!o) o = {}

    if (typeof font === 'string' || Array.isArray(font)) {
        o.family = font
    }

    const family = Array.isArray(o.family) ? o.family.join(', ') : o.family
    if (!family) throw Error('`family` must be defined')

    const fs = o.size || o.fontSize || o.em || 48
    const weight = o.weight || o.fontWeight || ''
    const style = o.style || o.fontStyle || ''
    var font = [style, weight, fs].join(' ') + 'px ' + family
    const origin = o.origin || 'top'

    if (measure.cache[family]) {
        // return more precise values if cache has them
        if (fs <= measure.cache[family].em) {
            return applyOrigin(measure.cache[family], origin)
        }
    }

    const l = Math.ceil(fs * 1.5)
    const height = l
    const width = l * .5

    const {createCanvas, loadImage} = require('canvas')
    measure.canvas = createCanvas(width, height)

    const canvas = o.canvas || measure.canvas
    const ctx = canvas.getContext('2d')
    const chars = {
        upper: o.upper !== undefined ? o.upper : 'H',
        lower: o.lower !== undefined ? o.lower : 'x',
        descent: o.descent !== undefined ? o.descent : 'p',
        ascent: o.ascent !== undefined ? o.ascent : 'h',
        tittle: o.tittle !== undefined ? o.tittle : 'i',
        overshoot: o.overshoot !== undefined ? o.overshoot : 'O',
        text: o.text !== undefined ? o.text : 'mmmmmmmmmmlli',
    }
    ctx.font = font

    const char = 'H'
    const result = {
        top: 0,
    }

    // measure line-height
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'black'
    ctx.fillText(char, 0, 0)
    const topPx = firstTop(ctx.getImageData(0, 0, l, l))
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'bottom'
    ctx.fillText(char, 0, l)
    const bottomPx = firstTop(ctx.getImageData(0, 0, l, l))
    result.lineHeight =
        result.bottom = l - bottomPx + topPx

    // measure baseline
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(char, 0, l)
    const baselinePx = firstTop(ctx.getImageData(0, 0, l, l))
    const baseline = l - baselinePx - 1 + topPx
    result.baseline =
        result.alphabetic = baseline

    // measure median
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'middle'
    ctx.fillText(char, 0, l * .5)
    const medianPx = firstTop(ctx.getImageData(0, 0, l, l))
    result.median =
        result.middle = l - medianPx - 1 + topPx - l * .5

    // measure hanging
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'hanging'
    ctx.fillText(char, 0, l * .5)
    const hangingPx = firstTop(ctx.getImageData(0, 0, l, l))
    result.hanging = l - hangingPx - 1 + topPx - l * .5

    // measure ideographic
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'ideographic'
    ctx.fillText(char, 0, l)
    const ideographicPx = firstTop(ctx.getImageData(0, 0, l, l))
    result.ideographic = l - ideographicPx - 1 + topPx

    // measure cap
    if (chars.upper) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.upper, 0, 0)
        result.upper = firstTop(ctx.getImageData(0, 0, l, l))
        result.capHeight = (result.baseline - result.upper)
    }

    // measure x
    if (chars.lower) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.lower, 0, 0)
        result.lower = firstTop(ctx.getImageData(0, 0, l, l))
        result.xHeight = (result.baseline - result.lower)
    }

    // measure tittle
    if (chars.tittle) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.tittle, 0, 0)
        result.tittle = firstTop(ctx.getImageData(0, 0, l, l))
    }

    // measure ascent
    if (chars.ascent) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.ascent, 0, 0)
        result.ascent = firstTop(ctx.getImageData(0, 0, l, l))
    }

    // measure descent
    if (chars.descent) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.descent, 0, 0)
        result.descent = firstBottom(ctx.getImageData(0, 0, l, l))
    }

    // measure overshoot
    if (chars.overshoot) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.overshoot, 0, 0)
        const overshootPx = firstBottom(ctx.getImageData(0, 0, l, l))
        result.overshoot = overshootPx - baseline
    }

    // measure text
    if (chars.text) {
        result.text = ctx.measureText(chars.text)
    }

    // normalize result
    for (let name in result) {
        if (typeof result[name] === 'number') {
            result[name] /= fs
        }
    }

    result.em = fs
    measure.cache[family] = result

    return applyOrigin(result, origin)
}

function applyOrigin(obj, origin) {
    const result = {}
    if (typeof origin === 'string') origin = obj[origin]
    for (let name in obj) {
        if (name === 'em') continue

        result[name] = obj[name]
        if (typeof obj[name] === 'number') {
            result[name] = result[name] - origin
        }
    }
    return result
}

function firstTop(iData) {
    const l = iData.height
    const data = iData.data
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) {
            return Math.floor((i - 3) * .25 / l)
        }
    }
}

function firstBottom(iData) {
    const l = iData.height
    const data = iData.data
    for (let i = data.length - 1; i > 0; i -= 4) {
        if (data[i] !== 0) {
            return Math.floor((i - 3) * .25 / l)
        }
    }
}
