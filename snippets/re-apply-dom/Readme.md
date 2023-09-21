# Re apply DOM nodes

## Description

This snippet removed all dom nodes from the body and adds it again after 350ms.

It can be used to test lazy loading of images and other improvements on the dom structure without reloading the page.
## How to use it

1. start recording 
2. execute script one or multiple times
3. stop recording

Use case: add correct lazy loading to images 

1. load the page and wait until network is saddeled
2. execute the script and count the loaded images
<img width="216" alt="loading-lazy_before" src="https://user-images.githubusercontent.com/10064416/206700058-8270f18b-5316-45a0-8e1f-1a5b203bdee3.PNG">
3. modify the HTML and add lazy loading wherever it fit's. Here we used the "check images usage" snippet to do it
<img width="595" alt="loading1" src="https://user-images.githubusercontent.com/10064416/206700054-a322b91d-5977-43f9-be50-ea55c3286a42.PNG">
4. execute the script and count the loaded images
<img width="283" alt="loading-lazy_after" src="https://user-images.githubusercontent.com/10064416/206700055-4b6f34b9-6735-4907-901a-c31f59246ae6.PNG">
<!-- START-HOW_TO[bookmark,console-tab,sources-tab,chromium] -->


| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-bookmarks) |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-chromium.md)       |      ✔    |
    


### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {const bi = document.body.innerHTML;
document.body.innerHTML = '';
setTimeout(() => document.body.innerHTML = bi, 350);
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

const bi = document.body.innerHTML;
document.body.innerHTML = '';
setTimeout(() => document.body.innerHTML = bi, 350);

``` 




</details>




<!-- END-HOW_TO -->






































































































# Credits

Author: _Michael Hladky - push-based.io_  
Source: _[github.com/push-based/web-performance-tools](www.github.com/push-based/web-performance-tools)_  
