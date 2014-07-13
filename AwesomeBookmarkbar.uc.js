// ==UserScript==
// @name           AwesomeBookmarkbar
// @description    智能书签工具栏
// @homepage       https://github.com/feiruo/userchromejs/
// @author         feiruo
// @charset        utf-8
// @version        0.2
// @compatibility  Firefox 24.0
// @note           0.2 增加鼠标移到地址栏自动显示书签工具栏，移出隐藏
// @note           点击地址栏显示书签工具栏。
// @note           地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏。
// @note           左键点击书签后自动隐藏书签工具栏。
// ==/UserScript== 
(function() {
	var PTBar = document.getElementById("PersonalToolbar");
	var placesCommands = document.getElementById("placesCommands");

	setToolbarVisibility(PTBar, PTBar.collapsed);

	function hideToolbar(e) {
		if (e.button == 2 || (e.button == 0 && !(e.metaKey || e.shiftKey || e.ctrlKey))) return;
		PTBar.collapsed = true;
	}

	PTBar.addEventListener("command", hideToolbar, false);
	PTBar.addEventListener("click", hideToolbar, false);
	placesCommands.addEventListener("command", hideToolbar, false);

	gURLBar.addEventListener('click', function(e) {
		if (e.button == 0) {
			PTBar.collapsed = false;
		}
	}, false);

	PTBar.addEventListener('mouseover', function(e) {
		PTBar.setAttribute('collapsed', 'false');
	}, false);

	PTBar.addEventListener('mouseout', function(e) {
		PTBar.setAttribute('collapsed', 'true');
	}, false);

	gURLBar.addEventListener('mouseover', function(e) {
		PTBar.setAttribute('collapsed', 'false');
	}, false);

	gURLBar.addEventListener('mouseout', function(e) {
		PTBar.setAttribute('collapsed', 'true');
	}, false);

	gURLBar.addEventListener('keydown', function(e) {
		if (window.event ? e.keyCode : e.which)
			PTBar.collapsed = true;
	}, false);

})();