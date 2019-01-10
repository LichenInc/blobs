<p align="center">
    <img src="https://svgsaur.us/?t=blobs&f=Comic_Sans_MS,cursive,sans-serif&s=100&w=260&h=90&y=85&o=b&c=222" />
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/blobs">
        <img src="https://img.shields.io/npm/v/blobs.svg" />
    </a>
    <a href="https://bundlephobia.com/result?p=blobs">
        <img src="https://img.shields.io/bundlephobia/min/blobs.svg" />
    </a>
</p>

## Install

```shell
$ npm install blobs
```

## Usage

&nbsp;

<img align="left" height="288" src="https://user-images.githubusercontent.com/9319710/50946063-b73d2180-1465-11e9-9f4e-fb80ebb31f92.png" />

<img align="right" height="288" src="https://user-images.githubusercontent.com/9319710/50946064-b73d2180-1465-11e9-827d-afeab9bddbc9.png" />

```typescript
import blobs from "blobs";

const svg = blobs({
    size: 288,
    complexity: 0.2,
    contrast: 0.4,
    color: "pink",
    stroke: {
        color: "red",
        width: 2,
    },
    guides: true,
});
```

## Options

#### Required

Name           | Type       | Description
-------------- | ---------- | ---------------------------------------------
`size`         | `number`   | Bounding box dimensions (in pixels)
`complexity`   | `number`   | Shape complexity (number of points)
`contrast`     | `number`   | Shape contrast (randomness of point position)


#### Optional

Name           | Type       | Default    | Description
-------------- | ---------- | ---------- | -------------------------------------
`color`        | `string?`  | `none`     | Fill color
`stroke`       | `object?`  | `...`      | Stroke options
`stroke.color` | `string`   | `none`     | Stroke color
`stroke.width` | `number`   | `0`        | Stroke width (in pixels)
`seed`         | `string?`  | _`random`_ | Value to seed random number generator
`guides`       | `boolean?` | `false`    | Render points, handles and stroke

_Guides will use stroke color and width if defined. Otherwise, they default to `black` stroke with width of `1`._

## License

[MIT](./LICENSE)
