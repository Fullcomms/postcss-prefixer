# postcss-prefixer
A [PostCSS] plugin to prefix css selectors.

````css
/* source css file */

#selector { /* content */ }

.selector { /* content */ }

.selector:hover { /* content */ }

.selector__element { /* content */ }
````

````css
/* output css file prefixed with "prfx__" */

#prfx__selector { /* content */ }

.prfx__selector { /* content */ }

.prfx__selector:hover { /* content */ }

.prfx__selector__element { /* content */ }
````

## Usage

`npm i --save https://github.com/Fullcomms/postcss-prefixer`

> Refer to [PostCSS Usage] on how to use it with your preferred build tool but see example below for use with Laravel Mix.

#### Laravel Mix Example
```js
const prefixer = require('postcss-prefixer');

mix.options({
    postCss: [
        prefixer({
            prefix: 'prefix-',
            include: [/^\.selector-(.+)$/, '.included']
        })
    ]
});
```

#### Options
| Name           | Description                                |
|------------------|--------------------------------------------|
|`prefix` (string) | prefix value to be used                    |
|`ignore` (array)  | list of selectors to ignore, accepts regex |
|`include` (array) | list of selectors to include, accepts regex|


## Credits

 Plugin based on [postcss-class-prefix](https://github.com/thompsongl/postcss-class-prefix) create by [thompsongl](https://github.com/thompsongl). Forked & modified by [Danny](https://github.com/DannyFullComms) for [FullComms](https://github.com/Fullcomms)
