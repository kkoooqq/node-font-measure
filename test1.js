const fontList = require('font-list')
const m = require('./')

!(async () => {
    const fonts = await fontList.getFonts({disableQuoting: true})
    fonts.push('sans-serif', 'serif', 'monospace')

    for (const font of fonts) {
        let res = m(font, {fontSize: 64})
        console.log(font, res.text)
    }
})()
