# Check Header

## Description

You can fins a detailed description in Harrys repository called [ct](https://github.com/csswizardry/ct#readme).

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {(function () {
    var ct = document.createElement('style');
    ct.innerText = "\n    /*!==========================================================================\n   #CT.CSS\n   ========================================================================== */\n\n/*!\n * ct.css \u2013 Let\u2019s take a look inside your <head>\u2026\n *\n * \u00A9 Harry Roberts 2021 \u2013 twitter.com/csswizardry\n */\n\n\n\n\n\n/**\n * It\u2019s slightly easier to remember topics than it is colours. Set up some\n * custom properties for use later on.\n */\n\nhead {\n  --ct-is-problematic: solid;\n  --ct-is-affected: dashed;\n  --ct-notify: #0bce6b;\n  --ct-warn: #ffa400;\n  --ct-error: #ff4e42;\n}\n\n\n\n\n\n/**\n * Show the <head> and set up the items we might be interested in.\n */\n\nhead,\nhead script,\nhead script:not([src])[async],\nhead script:not([src])[defer],\nhead style, head [rel=\"stylesheet\"],\nhead script ~ meta[http-equiv=\"content-security-policy\"],\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  display: block;\n}\n\nhead script,\nhead style, head [rel=\"stylesheet\"],\nhead title,\nhead script ~ meta[http-equiv=\"content-security-policy\"],\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  margin: 5px;\n  padding: 5px;\n  border-width: 5px;\n  background-color: white;\n  color: #333;\n}\n\nhead ::before,\nhead script, head style {\n  font: 16px/1.5 monospace, monospace;\n  display: block;\n}\n\nhead ::before {\n  font-weight: bold;\n}\n\n\n\n\n\n/**\n * External Script and Style\n */\n\nhead script[src],\nhead link[rel=\"stylesheet\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script[src]::before {\n    content: \"[Blocking Script \u2013 \" attr(src) \"]\"\n  }\n\n  head link[rel=\"stylesheet\"]::before {\n    content: \"[Blocking Stylesheet \u2013 \" attr(href) \"]\"\n  }\n\n\n\n\n\n/**\n * Inline Script and Style.\n */\n\nhead style:not(:empty),\nhead script:not(:empty) {\n  max-height: 5em;\n  overflow: auto;\n  background-color: #ffd;\n  white-space: pre;\n  border-color: var(--ct-notify);\n  border-style: var(--ct-is-problematic);\n}\n\n  head script:not(:empty)::before {\n    content: \"[Inline Script] \";\n  }\n\n  head style:not(:empty)::before {\n    content: \"[Inline Style] \";\n  }\n\n\n\n\n\n/**\n * Blocked Title.\n *\n * These selectors are generally more complex because the Key Selector (`title`)\n * depends on the specific conditions of preceding JS--we can\u2019t cast a wide net\n * and narrow it down later as we can when targeting elements directly.\n */\n\nhead script[src]:not([async]):not([defer]):not([type=module]) ~ title,\nhead script:not(:empty) ~ title {\n  display: block;\n  border-style: var(--ct-is-affected);\n  border-color: var(--ct-error);\n}\n\n  head script[src]:not([async]):not([defer]):not([type=module]) ~ title::before,\n  head script:not(:empty) ~ title::before {\n    content: \"[<title> blocked by JS] \";\n  }\n\n\n\n\n\n/**\n * Blocked Scripts.\n *\n * These selectors are generally more complex because the Key Selector\n * (`script`) depends on the specific conditions of preceding CSS--we can\u2019t cast\n * a wide net and narrow it down later as we can when targeting elements\n * directly.\n */\n\nhead [rel=\"stylesheet\"]:not([media=\"print\"]):not(.ct) ~ script,\nhead style:not(:empty) ~ script {\n  border-style: var(--ct-is-affected);\n  border-color: var(--ct-warn);\n}\n\n  head [rel=\"stylesheet\"]:not([media=\"print\"]):not(.ct) ~ script::before,\n  head style:not(:empty) ~ script::before {\n    content: \"[JS blocked by CSS \u2013 \" attr(src) \"]\";\n  }\n\n\n\n\n\n/**\n * Using both `async` and `defer` is redundant (an anti-pattern, even). Let\u2019s\n * flag that.\n */\n\nhead script[src][src][async][defer] {\n  display: block;\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script[src][src][async][defer]::before {\n    content: \"[async and defer is redundant: prefer defer \u2013 \" attr(src) \"]\";\n  }\n\n\n\n\n\n/**\n * Async and defer simply do not work on inline scripts. It won\u2019t do any harm,\n * but it\u2019s useful to know about.\n */\nhead script:not([src])[async],\nhead script:not([src])[defer] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script:not([src])[async]::before {\n    content: \"The async attribute is redundant on inline scripts\"\n  }\n\n  head script:not([src])[defer]::before {\n    content: \"The defer attribute is redundant on inline scripts\"\n  }\n\n\n\n\n\n/**\n * Third Party blocking resources.\n *\n * Expect false-positives here\u2026 it\u2019s a crude proxy at best.\n *\n * Selector-chaining (e.g. `[src][src]`) is used to bump up specificity.\n */\n\nhead script[src][src][src^=\"//\"],\nhead script[src][src][src^=\"http\"],\nhead [rel=\"stylesheet\"][href^=\"//\"],\nhead [rel=\"stylesheet\"][href^=\"http\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-error);\n}\n\n  head script[src][src][src^=\"//\"]::before,\n  head script[src][src][src^=\"http\"]::before {\n    content: \"[Third Party Blocking Script \u2013 \" attr(src) \"]\";\n  }\n\n  head [rel=\"stylesheet\"][href^=\"//\"]::before,\n  head [rel=\"stylesheet\"][href^=\"http\"]::before {\n    content: \"[Third Party Blocking Stylesheet \u2013 \" attr(href) \"]\";\n  }\n\n\n\n\n\n/**\n * Mid-HEAD CSP disables the Preload Scanner\n */\n\nhead script ~ meta[http-equiv=\"content-security-policy\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-error);\n}\n\n  head script ~ meta[http-equiv=\"content-security-policy\"]::before {\n    content: \"[Meta CSP defined after JS]\"\n  }\n\n\n\n\n\n/**\n * Charset should appear as early as possible\n */\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\nhead > meta[charset]:not(:nth-child(-n+5))::before {\n  content: \"[Charset should appear as early as possible]\";\n}\n\n\n\n\n\n/**\n * Hide all irrelevant or non-matching scripts and styles (including ct.css).\n *\n * We\u2019re done!\n */\n\nlink[rel=\"stylesheet\"][media=\"print\"],\nlink[rel=\"stylesheet\"].ct, style.ct,\nscript[async], script[defer], script[type=module] {\n  display: none;\n}\n    ";
    ct.classList.add('ct');
    document.head.appendChild(ct);
}());
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

(function () {
    var ct = document.createElement('style');
    ct.innerText = "\n    /*!==========================================================================\n   #CT.CSS\n   ========================================================================== */\n\n/*!\n * ct.css \u2013 Let\u2019s take a look inside your <head>\u2026\n *\n * \u00A9 Harry Roberts 2021 \u2013 twitter.com/csswizardry\n */\n\n\n\n\n\n/**\n * It\u2019s slightly easier to remember topics than it is colours. Set up some\n * custom properties for use later on.\n */\n\nhead {\n  --ct-is-problematic: solid;\n  --ct-is-affected: dashed;\n  --ct-notify: #0bce6b;\n  --ct-warn: #ffa400;\n  --ct-error: #ff4e42;\n}\n\n\n\n\n\n/**\n * Show the <head> and set up the items we might be interested in.\n */\n\nhead,\nhead script,\nhead script:not([src])[async],\nhead script:not([src])[defer],\nhead style, head [rel=\"stylesheet\"],\nhead script ~ meta[http-equiv=\"content-security-policy\"],\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  display: block;\n}\n\nhead script,\nhead style, head [rel=\"stylesheet\"],\nhead title,\nhead script ~ meta[http-equiv=\"content-security-policy\"],\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  margin: 5px;\n  padding: 5px;\n  border-width: 5px;\n  background-color: white;\n  color: #333;\n}\n\nhead ::before,\nhead script, head style {\n  font: 16px/1.5 monospace, monospace;\n  display: block;\n}\n\nhead ::before {\n  font-weight: bold;\n}\n\n\n\n\n\n/**\n * External Script and Style\n */\n\nhead script[src],\nhead link[rel=\"stylesheet\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script[src]::before {\n    content: \"[Blocking Script \u2013 \" attr(src) \"]\"\n  }\n\n  head link[rel=\"stylesheet\"]::before {\n    content: \"[Blocking Stylesheet \u2013 \" attr(href) \"]\"\n  }\n\n\n\n\n\n/**\n * Inline Script and Style.\n */\n\nhead style:not(:empty),\nhead script:not(:empty) {\n  max-height: 5em;\n  overflow: auto;\n  background-color: #ffd;\n  white-space: pre;\n  border-color: var(--ct-notify);\n  border-style: var(--ct-is-problematic);\n}\n\n  head script:not(:empty)::before {\n    content: \"[Inline Script] \";\n  }\n\n  head style:not(:empty)::before {\n    content: \"[Inline Style] \";\n  }\n\n\n\n\n\n/**\n * Blocked Title.\n *\n * These selectors are generally more complex because the Key Selector (`title`)\n * depends on the specific conditions of preceding JS--we can\u2019t cast a wide net\n * and narrow it down later as we can when targeting elements directly.\n */\n\nhead script[src]:not([async]):not([defer]):not([type=module]) ~ title,\nhead script:not(:empty) ~ title {\n  display: block;\n  border-style: var(--ct-is-affected);\n  border-color: var(--ct-error);\n}\n\n  head script[src]:not([async]):not([defer]):not([type=module]) ~ title::before,\n  head script:not(:empty) ~ title::before {\n    content: \"[<title> blocked by JS] \";\n  }\n\n\n\n\n\n/**\n * Blocked Scripts.\n *\n * These selectors are generally more complex because the Key Selector\n * (`script`) depends on the specific conditions of preceding CSS--we can\u2019t cast\n * a wide net and narrow it down later as we can when targeting elements\n * directly.\n */\n\nhead [rel=\"stylesheet\"]:not([media=\"print\"]):not(.ct) ~ script,\nhead style:not(:empty) ~ script {\n  border-style: var(--ct-is-affected);\n  border-color: var(--ct-warn);\n}\n\n  head [rel=\"stylesheet\"]:not([media=\"print\"]):not(.ct) ~ script::before,\n  head style:not(:empty) ~ script::before {\n    content: \"[JS blocked by CSS \u2013 \" attr(src) \"]\";\n  }\n\n\n\n\n\n/**\n * Using both `async` and `defer` is redundant (an anti-pattern, even). Let\u2019s\n * flag that.\n */\n\nhead script[src][src][async][defer] {\n  display: block;\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script[src][src][async][defer]::before {\n    content: \"[async and defer is redundant: prefer defer \u2013 \" attr(src) \"]\";\n  }\n\n\n\n\n\n/**\n * Async and defer simply do not work on inline scripts. It won\u2019t do any harm,\n * but it\u2019s useful to know about.\n */\nhead script:not([src])[async],\nhead script:not([src])[defer] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script:not([src])[async]::before {\n    content: \"The async attribute is redundant on inline scripts\"\n  }\n\n  head script:not([src])[defer]::before {\n    content: \"The defer attribute is redundant on inline scripts\"\n  }\n\n\n\n\n\n/**\n * Third Party blocking resources.\n *\n * Expect false-positives here\u2026 it\u2019s a crude proxy at best.\n *\n * Selector-chaining (e.g. `[src][src]`) is used to bump up specificity.\n */\n\nhead script[src][src][src^=\"//\"],\nhead script[src][src][src^=\"http\"],\nhead [rel=\"stylesheet\"][href^=\"//\"],\nhead [rel=\"stylesheet\"][href^=\"http\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-error);\n}\n\n  head script[src][src][src^=\"//\"]::before,\n  head script[src][src][src^=\"http\"]::before {\n    content: \"[Third Party Blocking Script \u2013 \" attr(src) \"]\";\n  }\n\n  head [rel=\"stylesheet\"][href^=\"//\"]::before,\n  head [rel=\"stylesheet\"][href^=\"http\"]::before {\n    content: \"[Third Party Blocking Stylesheet \u2013 \" attr(href) \"]\";\n  }\n\n\n\n\n\n/**\n * Mid-HEAD CSP disables the Preload Scanner\n */\n\nhead script ~ meta[http-equiv=\"content-security-policy\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-error);\n}\n\n  head script ~ meta[http-equiv=\"content-security-policy\"]::before {\n    content: \"[Meta CSP defined after JS]\"\n  }\n\n\n\n\n\n/**\n * Charset should appear as early as possible\n */\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\nhead > meta[charset]:not(:nth-child(-n+5))::before {\n  content: \"[Charset should appear as early as possible]\";\n}\n\n\n\n\n\n/**\n * Hide all irrelevant or non-matching scripts and styles (including ct.css).\n *\n * We\u2019re done!\n */\n\nlink[rel=\"stylesheet\"][media=\"print\"],\nlink[rel=\"stylesheet\"].ct, style.ct,\nscript[async], script[defer], script[type=module] {\n  display: none;\n}\n    ";
    ct.classList.add('ct');
    document.head.appendChild(ct);
}());

``` 




</details>




<!-- END-HOW_TO -->











# Credits

Author: _Harry Roberts_  
Source: _[github.com/csswizardry/ct](https://github.com/csswizardry/ct)_  
