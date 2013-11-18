// ==UserScript==
// @name            showLocationModEx.uc.js
// @charset         UTF-8
// @description     地址栏执行javascript:
// ==/UserScript==
(location == "chrome://browser/content/browser.xul")&&eval("gURLBar.handleCommand=" + gURLBar.handleCommand.toString().replace("!mayInheritPrincipal","0"))