## Description

Gets information about all components in the page or specific component type

## Usage

Can be run as bookmarklet: yes
Can be run in console: yes

To run it as bookmarklet:

- Minify code using for example https://javascript-minifier.com/
- Wrap result in `javascript:(minification_result)();`
- Create new bookmark and paste wrapped result in URL field.

## Input

- Mode: summary/component
- For summary
  - Prefixes, separated with comma (ex: mat,cdk,app etc)
  - Apply summary to DOM (yes/no)
- For component
  - Component name
  - Apply summary to DOM (yes/no)

## Features

- Provides summary for all component instances and DOM on the page.
- Provides summary for specific component type
- Optionally applies summary element with amount of total/visible/hidden DOM nodes to an element.
