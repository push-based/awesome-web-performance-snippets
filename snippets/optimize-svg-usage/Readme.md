# Optimize SVG usage

## Description

This scripts mimics the usage of [ngx-fast-svg](https://github.com/push-based/ngx-fast-svg) and it's impact.

## How to use it

1. Count DOM nodes od all SVG elements  
`console.log('Number of SVG elements inc content', document.querySelectorAll('svg, svg *').length)`  
1.1. Additionally measure Layouting cost [full-relayout](https://github.com/push-based/awesome-web-performance-snippets/tree/main/snippets/full-relayout) 
2. run script  
3. Remeasure 1. and 1.1.   

<!-- START-HOW_TO[bookmark,console-tab,sources-tab,chromium] -->
auto generated content here
<!-- END-HOW_TO -->
