FeiRuoMouse
============
此为自用脚本，框架已有，如有需求请自行添加自定义命令或脚本

 - 支持e10s window。
 - 鼠标手势与拖拽管理。
 - 完全自定义鼠标操作。
 - 完全自定义事件执行命令。
 - 支持自定义脚本。
 - 选项即时生效。
 - 配置文件位置：【chrome\lib\\_FeiRuoMouse.js】
 
 ![](1.png)
 
 ![](2.png)
 
 ![](3.png)
 
选项说明书：
--------------

- 请先看图片。
- 还原默认值：还原默认值。
- 自定义命令：打开配置文件，对自定义事件命令进行编辑（增加，删除）。
 
事件编辑，添加窗口：
--------------

- 键盘辅助键：三个键盘辅助键，可以任意组合。
- 作为排除键：在达到命令生效的条件时，同时按下所选定辅助键（组合），这个命令将不生效（即排除）
- 鼠标手势和鼠标拖拽切换之后，提示，事件和条件的内容也会改变，请仔细。

配置文件，自定义命令：
--------------

- 1、请以obj形式添加；
- 2、label：说明文字，读取标识，必须！
- 3、Type：拖拽的目标；
- 4、command：自定义行为 请以 function(event){} 函数形式，自定义脚本直接置于函数内
- 示例：

		{
		label: "转到页面顶部",	//命令的说明文字
		command: function(event) {//此处为自定义命令，event为通过鼠标和辅助键等判断之后传回的，监听事件event,自定义脚本直接置于函数内
				var doc = event.target.ownerDocument;
				var win = doc.defaultView;
				goDoCommand('cmd_scrollTop');
			}
		},{
		label: "当前标签打开图片",	//命令的说明文字
		Type: "Image",//拖拽图片时的命令
		command: function(event) {//此处为自定义命令，event为通过鼠标和辅助键等判断之后传回的，监听事件event,自定义脚本直接置于函数内
				loadURI(event.dataTransfer.getData("application/x-moz-file-promise-url"));
			}
		}