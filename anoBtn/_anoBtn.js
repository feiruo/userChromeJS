/**********************************************************************************
 *此处为按钮设置
 *************************************************************************************/
var anobtnset = {
	//※必须设置	按钮位置，0为可移动，1为地址栏图标，2为以前的自定义定位方式
	Icon_Pos: 0,

	//自定义定位方式：	按钮与哪个id相邻，alltabs-button，back-button等
	intags: "tabbrowser-tabs",

	//自定义定位方式：	按钮与目标id关系，之前（before）或者之后(after)
	orientation: "before",

	//按钮图标
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABmElEQVRIic3Vz2ddURAH8I+IqqonKqqioiKLyiKqIqKqqqoi3iKL6qKriKguKp56qioekUVVFhEVVfef7eLMbY/z7i8N1S/jcmfm+z0zd+Zc/gMsYQs7hW1hdB3iFTzDBhYb/Dewiae4O5R0NZ47eNgTuxgxLzCLZyfWcRqBS/FuIcT2NFcxwj6+osIEtyJvDvsRNMVB2BRXmWATFrCNi8g/llo3h8MIKO207UQFlnEeOWcaKj5pEajwOSrq6/NmlrOeOzY6yGu7xKMege2sipe5o609tX3R/R1qvMpyDmVt6mpPhaMB5KXAhTRRnQI/cB/3BpAv43WR+7uCc80CPyNxCHb9GdUK33LntEWgCvEnWMNYmqgj3C4ExkXeJHfudQg0VXUgta7GzRDN48a5wEoP6VWU/wEPipOPoj2XRc5qEedjh8BMsTiBO+EryU8aYq1F+V2VfJLa+Rxv8b0lrnUh3/QIDLH3beSkuT2+BvlMtlxdIn1XR5NNzI9uJx5LV3Uf8Zn0U/pr1Av2Tpq0ibQHu+ZH9t/jF5XwjtYY3gV/AAAAAElFTkSuQmCC",

	//菜单弹出方向，不设置就默认,参考 https://developer.mozilla.org/en-US/docs/XUL/PopupGuide/Positioning
	position: "",
};

/**********************************************************************************
 *child:[  ]内为当前菜单的下一级菜单配置,支持多级
 *text 为运行参数，如果无需参数，直接删除text属性
 *这里是菜单配置:
 *配置与addmenu一样，但仅支持本脚本菜单位置，具体请参照；https://github.com/ywzhaiqi/userChromeJS/tree/master/addmenuPlus
 *-------------------------------
 *{}, 为分隔条
 *-------------------------------
 *目录枚举添加请注意：
 *1、斜杠"/"或"\"开头为相对配置文件夹，注意：Linux路径区分大小写！！！！
 *2、根据文件名全名字符(包括扩展名)排除或筛选;
 *3、关系为：先排除再枚举。
 *4、注意：配对模式为 test循环模式正则！！！注意正则全局"g"的使用！！test()继承正则表达式的lastIndex属性，表达式在匹配全局标志g的时候须注意。
 *5、留空表示不进行该行为。
 *6、在文件夹上左键点击为打开文件夹
 *************************************************************************************/
var anomenu = [ //下面添加菜单
	{
		label: '外部程序',
		//枚举文件夹内的所有文件，当做可执行文件加入菜单，斜杠"/"或"\"开头为相对配置文件夹，注意：Linux路径区分大小写！！！！
		MapFolder: '/chrome/tools',
		//枚举的文件，需要注意:此处不使用"g"全局模式，可以匹配所有文件,
		Filter: /\.(exe|lnk|bat|xls|xlsx|txt|doc|docx|jpg|wps)$/i,
		//排除文件
		Exclude: /\.(dat|reg|sample|config|db|log|dll|json|zip|rar|ini)$|7za\.exe|UpdataS\.bat|wget\.exe/i,
		//是否枚举子目录内的文件，值代表子目录深度，多少级的子目录，0为根目录（即不枚举子目录）
		Directories: 2,
		//枚举目录,仅当Dirs>1时生效。
		FilterDirs: "", //枚举目录
		//枚举目录,仅当Dirs>1时生效。留空表示不进行该行为。
		ExcludeDirs: /tmp|temp|ConFile|msdll/i,
		//菜单图标
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAbklEQVQ4je3TXwqAIAzAYe+VsP32pvc/QuQx7KmIAm39eYkGwz3IB24zhCdDRBIwmVn1JDCJSFqhK8gWW6HeZVWN+3Opzayehnr5HqSq8eyAmk/zTvuHPgV59ggYDtDNT1u2UAbKBWgEsrclzZgBLQgC98zNgUMAAAAASUVORK5CYII=",
		child: [ //没有目录级数限制，文件夹枚举和原有菜单移动在子菜单也适用
			{
				label: "IE打开",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSklEQVQ4jZXTv2sUQRwF8E88UYlg5WEhiqWIhREbIWVqOwkRUh6oqU/E/0KREBBUsJBwVmn9gXokXFJJCiN4pWKnp4lYnJ4W+x0Yhj1yLjwWZua977z3dpnsaaKF1xjgFzZweRzhEM5hAbfRDdIL3Ij1+1itI5/HQ3zBH/wNjPAO13E0hrRL8hw+ZKQ6DPEobF0qJ7/fh5zjLk4l8kE8KA58w+PwfAtv8Tvb/475JHAWn7LNPdzEMRzGEZxBpxiylgSuFuo/0cN6hi52Isx0bjcJtP/DewlNvCkW+3HdZwU6NdAKz3nnmzgZtzsQmMLxSD7hBLzCS2xnAiM8VVU7HWFeiSz6+BjvO/AVS5H6sLDyWVXfFn7U2JwRiV+LSU8mDG6AxdRAD/fQiECXo55x5H6QG0lgNhJu4yJOq/6255nQSPWhreBCBAr+AcklnGDMJaPHAAAAAElFTkSuQmCC",
				tooltiptext: "左键：IE打开当前页\r\n中键：打开 Internet Explorer\r\n右键：IE隐私打开当前页",
				//显示条件
				condition: "nolink",
				//自添加属性
				onclick: function(e) {
					var Path = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
					switch (e.button) {
						case 0:
							addMenu.exec(Path, addMenu.convertText("%u"));
							break;
						case 1:
							addMenu.exec(Path, "");
							break;
						case 2:
							e.preventDefault();
							addMenu.exec(Path, " -private " + addMenu.convertText("%u"));
							break;
					}
				}
			}, {
				label: "测试配置1",
				text: "-no-remote -profile ProfileTest",
				exec: Services.dirsvc.get("ProfD", Ci.nsILocalFile).path + "\\..\\firefox.exe",
			}, {
				label: "测试配置2",
				text: "-no-remote -profile ProfileTest",
				exec: "\\..\\firefox.exe",
			}, {
				label: "配置文件夹",
				exec: Services.dirsvc.get("ProfD", Ci.nsILocalFile).path,
			}, {}, // 分隔条
			{
				label: " 启动 Internet Explorer",
				exec: "C:\\Program Files\\Internet Explorer\\iexplore.exe"
			}, {
				label: " Internet Explorer 打开此页",
				text: "%u",
				exec: "C:\\Program Files\\Internet Explorer\\iexplore.exe"
			},
		]
	}, {
		label: "我的电脑",
		text: "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}",
		exec: "C:\\Windows\\explorer.exe",
	}, {
		label: "常用功能",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgUlEQVQ4jdVTwQ2AIAx0A0ZwFD/3Ilc6EqMxkiPow9SACphoTGxyj9K7a9rQYTgEGaKILlcgQzzyiwDgamLDSdQTdA1fMJBpgz1aXkPJO43SXFKLlxdEdBbROavt+TcGj0d4bPDzHdQOBoDLD817PxYEUtPd70tqqnTom5CaADjTrW77Ai0wH7nFAAAAAElFTkSuQmCC",
		child: [{
			label: "打开文件",
			oncommand: "BrowserOpenFileWindow();",
			image: "chrome://browser/skin/places/query.png"
		}, {
			label: "隐私浏览",
			oncommand: "OpenBrowserWindow({private: true});",
			image: "chrome://browser/skin/Privacy-16.png"
		}, {}, {
			label: "遥测数据",
			oncommand: "getBrowser().selectedTab = getBrowser().addTab ('about:telemetry')",
			image: "chrome://browser/skin/Geolocation-16.png"
		}, {
			label: "关于about",
			oncommand: "gBrowser.selectedTab = gBrowser.addTab('about:about');",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcElEQVQ4jdWTQQ6AIAwE+drs33gxaMIJL2oMIKnVi5v0QNIObboN4SIgAgmIwSNglVSB5AJ4f41AklQNkbvxJBVj8QnpOpCUn0Bco5oAs6QfAtqC9j107N1KR4ChY/eVLkZAb6qZvvBBeXVoh2Pbtjdof7mCLHWekwAAAABJRU5ErkJggg=="
		}, {
			label: "权限管理",
			oncommand: "getBrowser().selectedTab = getBrowser().addTab ('about:permissions')",
			image: "chrome://mozapps/skin/passwordmgr/key.png"
		}, {
			label: "故障排除",
			oncommand: "getBrowser().selectedTab = getBrowser().addTab ('about:support')",
			image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzklEQVQ4jc1SyQnDMBDcDhSBtXqmBD8MtrQflWAICGlfLsUluASX5BJSgktwXgH5iBKCIRnQZ9kZaUYD8HeopBeEcSTkmTQvpHkh5JkwjpX0IktudGhXxO1Bnhsd2kOyUdyliwZjbwvvbOGdwdinwkZxlyXXGMrtBTWG8lCkxlCmzzQYewAAg7HPzUjzYgvvwOp43w0BYOsfAMAW3q12dbwDIU/fChDytPf2qYU0q1chVtILutyu2RBP+cZTivREJb2wKgzbKlsVhrdV/gkeMqXAlXes4XwAAAAASUVORK5CYII="
		}, {
			label: "帮助支持",
			oncommand: "getBrowser().selectedTab = getBrowser().addTab ('http://support.mozilla.org/zh-CN/products/firefox')",
			image: "chrome://global/skin/icons/information-16.png"
		}, {
			label: "安全模式",
			oncommand: "safeModeRestart();",
			image: "chrome://mozapps/skin/extensions/alerticon-warning.png",
		}, ]
	}, {
		label: '谷歌站內搜索',
		oncommand: function() {
			gBrowser.loadURI("javascript:q%20=%20%22%22%20+%20(window.getSelection%20?%20window.getSelection()%20:%20document.getSelection%20?%20document.getSelection()%20:%20document.selection.createRange().text);%20if%20(!q)%20q%20=%20prompt(%22%E8%AF%B7%E8%BE%93%E5%85%A5%E5%85%B3%E9%94%AE%E8%AF%8D:%22,%20%22%22);%20if%20(q!=null)%20{var%20qlocation=%22%20%22;qlocation=('http://www.google.com/search?num=30&amp;hl=zh-CN&amp;newwindow=1&amp;q='+q+'&amp;sitesearch='+location.host+'');window.open(qlocation);}%20void%200")
		}
	},

	//移动 工具 菜单
	{
		id: "tools-menu",
		label: "工具菜单",
		accesskey: "",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcElEQVQ4jdWTQQ6AIAwE+drs33gxaMIJL2oMIKnVi5v0QNIObboN4SIgAgmIwSNglVSB5AJ4f41AklQNkbvxJBVj8QnpOpCUn0Bco5oAs6QfAtqC9j107N1KR4ChY/eVLkZAb6qZvvBBeXVoh2Pbtjdof7mCLHWekwAAAABJRU5ErkJggg==",
	}, {
		id: "charsetMenu",
		label: "字符编码",
		accesskey: "",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhUlEQVQ4jdWSsQ2AMAwEr6TMQJQMlAGyQ5SakgEyCgNQMgYFFHERmRAiaOA7v30vSzb8QSOwvgmYgdg6bIEdCFJ3wAa4rOdbYYBevEHNnEJKcO6bgue1oWGACVgq2/rqWgJPlYCgjTzEiGfv4KuQQeq+BS6FONIJu1ZYK5Ke6LFW0ht/XAcCHjHf2jnyJAAAAABJRU5ErkJggg==",
	}, {
		label: "书签管理",
		oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABS0lEQVQ4jY1SzUoCURi9IL5CVJuEKAoShNk5ejnnPEQEQgQiGESrgt4gaC0qhSHVoh96ETe+SJt2peBt802MMlNz4YO55/vOz3cZ53KOpIGkYDXIm8s8ANYlBZILkgtJoV6vrxUWIDky5zeS7/Z9V9T9wNznjUZjF8Aeybmk4L3fzyO1SA5JTrP2Jnmb4CSnJIcAWqtxk/qSNGk2mxuJQBzHm5Imkr7TsyRHLiEB6AKoRVFUzlsviqIygBqArhmF3wQkn5xzpQLPVCL5kk6wJenTgP5/bJJ9S/0Rx/Gmc8457301tdd5HlnSRTLnva8uNQGcmUCvgPtpVvPGBC7/SHAlKQC4zmq+msChJaqQ7JPsAagYdmQzz1kJHqx5THJMcpZ6lxnJewAndh9nJeis/FBB0qPVEg6gnbdjx5J0JG0nuPd+B0Cb5HiV/AOStMNZrdTkSAAAAABJRU5ErkJggg=="
	}, {
		label: "打开选项",
		oncommand: "openPreferences();",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABR0lEQVQ4jY2SP0sDQRDFr1UEUTRW+Q7iieGO7N57z8I/WJvSxlJrQS2sbSz9BulESGUEQRtbGwULrdKJaCEE03g2k3DGu1wWlllm5/dm9rFBMGIB2JPUIvkpqQVgd1T9YNVqtQWSbUlpzj4vFSB5JSkl+QKgUa/XZwDskPyRlAJYLBs7lfTqnJs3wU1JPcvf92Mcx5V/ApIurUsjk/u2iW4sPli8yBN4N4G5TG7gAcnnOI4rdn7Le/+HpDSKotkcgZ5zbimKogkT6P6BkySJMp2SIp+SJNmwuusi+LQIDsNwmuSj1R2Wws65FQBTYRhOAtiS9GR1d0EQBAGA5SIYwFHeZyJ5672v9k1r2sVZEUzyi2SXZBvAwbDrHUmp975K8tlcP+7DANaL/BieYN97X5V0MjZsAtsF71wrhbMiJJskOxZXx2V/AYbjyhDulDKPAAAAAElFTkSuQmCC"
	}, {
		label: "附加组件",
		oncommand: "BrowserOpenAddonsMgr();",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfElEQVQ4jc2SSwqFQAwE+14KSWWn1/YqosfwrRzEEeNv8RqyCZki3RnpSwFDRCwRsQBD1q+0Dq2V9SVJZtYB034oK2Ays05PHm8hZT13b69m5e5tsXPkq/J5klcFyEJMAa83uKo/BNw5I9AUwMuPNAvogfkBYAT6u9Yr/QBtWNOEJkNI4gAAAABJRU5ErkJggg=="
	}, {
		label: "参数设置",
		oncommand: "toOpenWindowByType('pref:pref', 'About:config');",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABC0lEQVQ4jZWTTUrEUBCEc6DZyIC7pPurQVAh4F2EgAreRQKjSzE4Ki4H/J0jCAoeJC58Ay9vEuP0sruruqvozrKecPcJsJTUSmqBpbtP+no7AZwCdzE4JpG0AE6GwLcpaF3rIXtIwVUofJnZgaRLYBbVZ8AcOAQ+Qu95Fk1oJLVmVo7JNLO9QPC4YRhwNUYgqe4YmximaO0p8A6s8jzfjTYgNjZLDYsmvUaNq576L26IAHiONnsbJBiSUBTFjqQn4AWYrvPu7h0JiYnzMROBi43rBK4lte5+NEbg7vuB4D5OHofkt5mVkmozI1m7NrMS+AzDzlJTbv57ypIWQ/oqSc0fz9QA1ZjMrd75B1lk19vKzwu4AAAAAElFTkSuQmCC"
	}, {
		label: "错误控制台",
		oncommand: "toJavaScriptConsole();",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4jY2SURGDMBBEIwEJSHm7CpCAhEqoAyRUAhIqIRKQgAT60WMmTRPam8kMOXIve3tJqQhgsH0HqPJEfkhXISnbPjqAQ1LuFgOj7SMOPs/vev+Xgt66VFCraK2mB5I2SRswA2Mtv2wDGIDJ9ippL299SNolbbYXYOIzJttL/D9sr7XR5wi78os2xl7/NA7PjRw9wNfhlFJqAKa68Fb09hNQGPoG2V7DuK8RdhTwMYVqpPkK8Osp/+vB3C0OP3ILICkDtyYkPJgDNoQvJWA9n3Fctpy1LyNPBAjW0Ns9AAAAAElFTkSuQmCC"
	}, {
		label: "关于浏览器",
		oncommand: "openAboutDialog();",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACK0lEQVQ4jc2RQUsbQRTHh7DZ7JiZ7CQZw+w6klmjm1yCmE1KaSLIghcPUgs5hPSQD+AHkCLFHnroqYcGeqilVE9NkSAhBw+yJ/FQSiiylPdpphdj1dj22gd/mOH9/z/evEHofytx727eOlv/CpuEkNMoioxkMlnDGH/d2Nh4PG32ej2Ry+VeIYQyD6bz+fxzzjk4jrOfzWavarXaO621cduzubnZI4ScIoTmZgCu637xPA+KxSJ4ngdKqTOM8dtUKuVPPVEUMdd1J9ls9sWd8MHBgek4Tuz7PpTLZfB9H5RSP9fX1z8NBoMcQgi1220ipXxWqVROOOc/giD4PUWz2XQdxwHP88DzPFhZWblaW1s70VrfeW+1Wt1bXFy8FELAwsLCzX7Q6uqqXygUQEoJUkoolUoXh4eHjxBCmUQisWsYRogQQkqpnhAChBCwtLS0dQPodrsyn8/DtMk5h3Q6PUmlUhMp5Xmn03mKEEKMsY/z8/PAOYdGo/HkBhDHsSmEuOScw1TFYvFie3v7zWg0qriuO2ea5h6lFDjnIIT4PhwO2Z1FBkGwb9s2MMaAMQaUUrBt+zyZTB4bhvHNsizIZDJg2za0Wq29mW8cj8dCKXVGKQVKKRBCAGMMlmUBxhgIIUApheXl5WEcx7kZwDXEr9frx+l0GjDGMwqC4HMURerB8LS01uzo6Chst9svwzB8H4bhh52dndf9fn9La83+Gr4HSmitrWsZf/L9AnXzp979k0QwAAAAAElFTkSuQmCC"
	}, {
		label: "重启浏览器",
		oncommand: "Services.appinfo.invalidateCachesOnRestart() || Application.restart();",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABgklEQVQ4jX1Su0pDQRC9hVjEVysBX8FCiKTZIsgumznnH2wikUQR9EsEwVrBwkrBXoPGSvATJIrxFcR8gkVAr81svIk3LizsnnmdOTNRNOSUSqUVknG4AA6H+fYdEVkDcEKyrYF7JL/0fSEii6mBJOdI1pNVScZq8wDeNMmniCz3BXvvZ0g+a1BbRLadc7P5fH40+BSLxUmSx5qkKyJLyep1NVxaayf+a5HkkRba6vWswa/GmCnFqgBaoQXFRgDsA/gmGfcYADhVYFsrVAY1EJFpADcJ/KBHCcA7ydh7P6P/B2V0q4kdyQ/F7kgeACgnE3RJxkGwMDIR2Q2CDU5G8fIwBvfqtJMQLAbwQnJV8d82ggZB1SBqyq0ow5r+j0OCda3wZIzJKFYm2dR2moGuMSZD8lH9N5I6XCVWdTxt/oVCYQzAufpd9xmdc7nEqrZEZNNam42iKLLWZknWwl6QbDvncn8qiMg8ycaQ/sNteO8X0nf0N1EVwBmAjjLq6H8jzf8HTUH5xYEpCK8AAAAASUVORK5CYII="
	}, {
		id: "appmenu-quit",
		label: "退出浏览器",
		class: "menuitem-iconic",
		oncommand: "Application.quit();",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACtElEQVQ4jY2ST0gUYRjGn9m1Yb/d+WZ3/u/MzsqMMy4uC0ogDawEkuDBhCCQlAg9SBety4aXooiQPRh0bUnKQ38gKOlkFpGEWmQEJRsVKaXW6qpdlDp0mC4aW2L1Xj543uf3vu/3fh/w92gEcB5A9T98O6O5uTnEcdxkJBLxo9Fo4X85DcBZAPt6enpCyWTyhWmaK5Zl3drKtwMYAEB2kISQBCFkihDygxAymcvlZNd1p13XLafT6eGuri6ZEPKJEPKdEHLHMIxwJR+klN6RZbkcj8eXPc8rjI6OxhzHeeo4Trm2tvZaoVAINzQ03Nc07bMoil8ppRd/0ZIkHRZFcS2RSCy2tLTc3djYUFpbWyO2bT+3LKvsuu51AJidnU17nvfEMIwFQRCWFEXZu13ghqZp5bq6uuLY2Fj91hJjyWRyxjTNck1Nzc3tZoODgwcty/qoquqaJEkX0NTURGVZnlFVdbWxsfHqtnFgYIDquv5SEIRv1dXVt7d13/f3ZDKZcUVRVlVVvQfP80xZlouyLK+n0+nTlYvp7u4+lc1mp/r7+49U6qlUaliSpHVN0ybQ29urKYryShCEdcMw8pXGYrHIbm5uxn3fD/z21pp2SxCEdV3XH8D3/SrTNMcppSuxWOxxR0dHcLdPAgCZTCYei8WKlNKy4zhXAADZbPYMx3Gr4XB4mef5k38rwHHcpUgksszz/Ep7e/tRAMDIyIiTSCResyy7yLLsQiAQOAGA/YONVlVVDYZCoS8sy352XffR3Nxc9Fe2r6/vWDQaXQoEAgvBYLDEMMxDAOcA9APIA5gOBoPLDMMsqqr6Pp/PH9gxXi6XO67r+hsAJQAlhmFWAaxtnSWGYUq2bc8MDQ0d2vWOExMT+9va2i7btv2M5/l3lNIPoii+TaVSk52dnUPz8/P1lf6fdmi4VMHjbpAAAAAASUVORK5CYII="
	}
]