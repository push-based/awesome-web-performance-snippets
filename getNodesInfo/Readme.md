## Description

Gets estimations for DOM nodes that are part of the layout of the body or specific DOM node.

Will include:

- Summary (number of DOM nodes, number of nodes that will be processed by the browser, number of DOM nodes that are not processed by the browser (hidden nodes)).
- Summary for DOM nodes that can be excluded from layout by applying display: none in addition to other hiding mechanisms.

> IMPORTANT: If you use this script as bookmarklet it will always get information for document.body. If used from console directly any DOM element can be passed.

## Usage

Can be run as bookmarklet: yes (but it will always start from document.body)
Can be run in console: yes

To run it as bookmarklet:

- Minify code using for example https://javascript-minifier.com/
- Wrap result in `javascript:(minification_result)();`
- Create new bookmark and paste wrapped result in URL field.

## Input

- Root node for the calculations (default is document.body)

## Features

- Provides information about DOM size of the body or specific DOM element.
- Summary will include next information about DOM nodes:
  - Total number of DOM nodes
  - Number of DOM nodes that are part of the layouting process (will be included in recalculate styles work)
  - Number of DOM nodes that are excluded from the layouting process (display: none; for example)
  - Detailed information aboud DOM nodes that are hidden but still part of layouting process (visibility: hidden, opacity: 0 etc.)
