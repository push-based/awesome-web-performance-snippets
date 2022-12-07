## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-timings).

<small>_This relies on the above script_</small>

_Run First And Third Party Script Info in the console first, then run this_

[Calculate Load Times - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#timing_resource_loading_phases)

<details><summary><a href='https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#coping_with_cors' target="_blank">Info on CORS (why some values are 0)</a></summary>



<p>

> Note: The properties which are returned as 0 by default when loading a resource from a domain other than the one of the web page itself: redirectStart, redirectEnd, domainLookupStart, domainLookupEnd, connectStart, connectEnd, secureConnectionStart, requestStart, and responseStart.

</p>
</details>
<br>

[More Info on TAO header - Akamai Developer Resources](https://developer.akamai.com/blog/2018/06/13/how-add-timing-allow-origin-headers-improve-site-performance-measurement)

## Usage

