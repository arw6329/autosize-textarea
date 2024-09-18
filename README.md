# @arw6329/autosize-textarea

Automatically resize a textarea's width and height to fit its content

## Features

- Automatically resize both width and height
- Works on user input and assignment to `textarea.value`
- Works with both `box-sizing: content-box` and `border-box`

## Usage

Pass textarea to `autosize()`:

```js
import { autosize } from '@arw6329/autosize-textarea'

autosize(document.querySelector('#my-textarea'))
```
