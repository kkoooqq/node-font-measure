# font-measure [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges)

Calculate font metrics: baseline, height, line-height, top, bottom, middle, width. Like canvas2d `textMetrics` but with complete data.

![font-measure](https://raw.githubusercontent.com/dy/font-measure/master/preview.png)

## Usage

[![npm install font-measure](https://nodei.co/npm/font-measure.png?mini=true)](https://npmjs.org/package/font-measure/)

```js
let measure = requrie('font-measure')

measure('Roboto')

/*
{
	height: 1,
	lineHeight: 1,

}
 */

```

### `measure(font)`

Get object with measure data for the character / text string.

### `measure.text(string, font?)`

Get object with measure data for a character or text

#### `options`

Property | Default | Meaning
---|---|---
`font` | `sans-serif` | CSS font string or object with font params: `family`, `size` etc.


## See also

* [optical-properties](https://github.com/dy/optical-properties) − calculate image/character optical center and bounding box.
* [detect-kerning](https://github.com/dy/detect-kerning) − calculate kerning pairs for a font.

## Related

There are many text / font measuring packages for the moment, but they don't satisfy basic quality requirements.


## License

(c) 2018 Dima Yv. MIT License

Development supported by plot.ly.
