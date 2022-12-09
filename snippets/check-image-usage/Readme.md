# Check image usage

## Description

List all image resources (also background images in styles) and checks if they are used correctly.

It checks:
- asset format (url vs. inline base64/svg)
- loading technique
- viewport position
- [transferesize](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming) 

## How to use it

General usage description for all supported techniques can be found in the following table.

| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-bookmarks)         |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-chromium.md)       |      ✔    | 

<img width="595" alt="loading1" src="https://user-images.githubusercontent.com/10064416/206700419-3c8e4ced-a75a-44c1-bc4f-b00294a5de22.PNG">

# Credits

The network part is borrowed from:
Author: _Joan León_  
Source: _[github.com/csswizardry/ct](https://github.com/csswizardry/ct)_  

Additional loading checks are implemented by:
Author: _Michael Hladky - push-based.io_  
Source: _[github.com/push-based/web-performance-tools](www.github.com/push-based/web-performance-tools)_  

