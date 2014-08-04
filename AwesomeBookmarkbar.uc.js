// ==UserScript==
// @name           		AwesomeBookmarkbar.uc.js
// @description   		智能书签工具栏
// @author         		feiruo
// @compatibility  		Firefox 24.0
// @charset				UTF-8
// @include				chrome://browser/content/browser.xul
// @id 					[73FCA65B]
// @startup      		window.AwesomeBookmarkbar.init();
// @shutdown     		window.AwesomeBookmarkbar.onDestroy();
// @reviewURL			http://bbs.kafan.cn/thread-1726260-1-1.html
// @homepageURL			https://github.com/feiruo/userChromeJS
// @note         		点击地址栏显示书签工具栏。
// @note         		地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏。
// @note       		  	左键点击书签后自动隐藏书签工具栏。
// @version      		0.2.1 	去除鼠标移到地址栏自动显示书签工具栏
// @version      		0.2 	增加鼠标移到地址栏自动显示书签工具栏，移出隐藏
// ==/UserScript== 
(function() {
	if (window.AwesomeBookmarkbar) {
		window.AwesomeBookmarkbar.onDestroy();
		delete window.AwesomeBookmarkbar;
	}

	var PersonalToolbar = document.getElementById("PersonalToolbar");

	var placesCommands = document.getElementById("placesCommands");

	var AwesomeBookmarkbar = {};

	AwesomeBookmarkbar.init = function() {
		setTimeout(function() {
			setToolbarVisibility(PersonalToolbar, PersonalToolbar.collapsed);
		}, 500);
		setToolbarVisibility(PersonalToolbar, PersonalToolbar.collapsed);
		this.addListener(this.hideToolbar, this.cHideToolbar, this.mShowToolbar, this.mHideToolbar, this.keyHide);
	};

	AwesomeBookmarkbar.onDestroy = function() {
		this.removeListener(this.hideToolbar, this.cHideToolbar, this.mShowToolbar, this.mHideToolbar, this.keyHide);
	};

	AwesomeBookmarkbar.addListener = function(obj, cHideToolbar, mShowToolbar, mHideToolbar, keyHide) {
		PersonalToolbar.addEventListener("command", obj, false);
		PersonalToolbar.addEventListener("click", obj, false);
		placesCommands.addEventListener("command", obj, false);

		gURLBar.addEventListener('click', cHideToolbar, false);

		PersonalToolbar.addEventListener('mouseover', mShowToolbar, false);

		PersonalToolbar.addEventListener('mouseout', mHideToolbar, false);

		gURLBar.addEventListener('mouseout', mHideToolbar, false);

		gURLBar.addEventListener('keydown', keyHide, false);
	};

	AwesomeBookmarkbar.removeListener = function(obj, cHideToolbar, mShowToolbar, mHideToolbar, keyHide) {
		PersonalToolbar.removeEventListener("command", obj, false);
		PersonalToolbar.removeEventListener("click", obj, false);
		placesCommands.removeEventListener("command", obj, false);

		gURLBar.removeEventListener('click', cHideToolbar, false);

		PersonalToolbar.removeEventListener('mouseover', mShowToolbar, false);

		PersonalToolbar.removeEventListener('mouseout', mHideToolbar, false);

		gURLBar.removeEventListener('mouseout', mHideToolbar, false);

		gURLBar.removeEventListener('keydown', keyHide, false);
	};

	AwesomeBookmarkbar.hideToolbar = function(e) {
		if (e.button == 2 || (e.button == 0 && !(e.metaKey || e.shiftKey || e.ctrlKey))) return;
		PersonalToolbar.collapsed = true;
	};

	AwesomeBookmarkbar.cHideToolbar = function(e) {
		if (e.button == 0) {
			PersonalToolbar.collapsed = false;
		}
	};

	AwesomeBookmarkbar.mShowToolbar = function(e) {
		PersonalToolbar.setAttribute('collapsed', 'false');
	};

	AwesomeBookmarkbar.mHideToolbar = function(e) {
		PersonalToolbar.setAttribute('collapsed', 'true');
	};

	AwesomeBookmarkbar.keyHide = function(e) {
		if (window.event ? e.keyCode : e.which)
			PersonalToolbar.collapsed = true;
	};

	AwesomeBookmarkbar.init();
	window.AwesomeBookmarkbar = AwesomeBookmarkbar;

})();