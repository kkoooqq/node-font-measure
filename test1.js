const fontList = require('font-list')
const m = require('./')

!(async () => {
    const fonts = await fontList.getFonts({disableQuoting: true})
    fonts.push('sans-serif', 'serif', 'monospace')

    const fontAndWidth = {}
    for (const font of fonts) {
        let res = m(font, {fontSize: 64})
        fontAndWidth[font] = res.text.width
    }

    const existsFontNames = []
    for (const [fontName, width] of Object.entries(fontAndWidth)) {
        if (
            width !== fontAndWidth['sans-serif'].width
            && width !== fontAndWidth['serif'].width
            && width !== fontAndWidth['monospace'].width
        ) {
            console.log(fontName, width)
            existsFontNames.push(fontName)
        }
    }

    console.log(existsFontNames)
})()
