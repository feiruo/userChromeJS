// ==UserScript==
// @name 			QrCreator.uc.js
// @description		生成二维码。
// @author			lastdream2013
// @include			chrome://browser/content/browser.xul
// @charset			UTF-8
// @inspect         window.QrCreator
// @startup         window.QrCreator.init(true);
// @shutdown        window.QrCreator.init();
// @homepageURL		https://github.com/lastdream2013/userChrome
// @downloadURL		https://raw.githubusercontent.com/feiruo/userChrome/master/QrCreator.uc.js
// @reviewURL		http://bbs.kafan.cn/thread-1525489-1-1.html
// @note            生成二维码。
// @version        2015.10.30 - 0.3 mody feiruo QRreader
// @version        2015.05.30 - 0.2 mody feiruo E10s
// @version        2013.06.13 - 0.1 first release
// ==/UserScript==
(function() {
	userChrome.import("lib/jsqrcode.min.js", "UChrm");
	var QrCreator = {
		debug: true,
		init: function(isAlert) {
			if ($("QRCodeDecode_Menu"))
				$("QRCodeDecode_Menu").parentNode.removeChild($("QRCodeDecode_Menu"));
			if ($("QRCreator_Menu"))
				$("QRCreator_Menu").parentNode.removeChild($("QRCreator_Menu"));
			if (!isAlert) return;
			var ins = $("context-openlinkintab");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "QRCreator_Menu",
				label: "生成QR码",
				tooltiptext: "左键：自动模式\n右键：自定文字",
				onclick: "QrCreator.QRCreator_MenuClick(event);",
				class: "menuitem-iconic",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzUlEQVQ4jaWOQYqFMBBE+xgewBO4ceEiIAQaBBHxPjlrFkKWucGbxaf/T/zGYZiCoqraoozwTwhACIHjOCoCt94YQvgM7PterVou762OAGzbRkufvr0H1nWt1stsvtURgGVZvmh3Q6sjPEBVUdWnymvAe4/3ntKX+UkFYJ5nTJ98masXtOCcwzl3m00FYJqmLxrMt1QAxnGs/mz5N30PDMNAS0vedQSg7/vqBWW++mtXYoyoKl3XVQQqvd5UlRgjknMmpcR5nn9iSomcMz9lng2NV0gSXAAAAABJRU5ErkJggg==",
			}), ins);
			ins.parentNode.insertBefore($C("menuitem", {
				id: "QRCodeDecode_Menu",
				label: "解析QR码",
				tooltiptext: "尝试解析图像QR码",
				hidden: true,
				onclick: "QrCreator.QRCodeDecode_MenuClick(event);",
				class: "menuitem-iconic",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWSzWnDQBBGH2kiLsAnIfXhQzoKGBZcgHpxBWpBPqoAGdSCrJfTbix5V4Zk4GNmvvlddvCfgiqQsOdnY5HMJaYpGfulQa74uXCbt2qQm1Sa+GLvrbj3tN8NHg8/ICH6JX7L4TTp/e4BdBx1HD1A0Y/6E3SaxK7zBHq9+pXRWy7iBNp1Ytvq5eIZNATPkBB9Q1jFDMFv0LYVm0arSuvaGyRY1wk5zqrSphH7XofBI3iEZDsMKzvGn2Hfi8vy9nSLN7Es4jwXk3N/vxo2z/un/HYDN6f8F/kB7L2cwHXEHwAAAAAASUVORK5CYII=",
			}), ins);
			$("contentAreaContextMenu").addEventListener("popupshowing", this.QRoptionsChangeLabel, false);
		},

		QRCodeDecode_MenuClick: function(event) {
			var src
			if (gContextMenu.target.nodeName == 'CANVAS' || gContextMenu.target.localName == "canvas")
				src = gContextMenu.target.toDataURL();
			else
				src = gContextMenu.imageURL || gContextMenu.bgImageURL;
			qrcode.decode(src);
			qrcode.callback = QrCreator.QRCodeDecode_Func;
		},

		QRCodeDecode_Func: function(data) {
			if (/^(https?|ftp|file):\/\/[-_.~*'()|a-zA-Z0-9;:\/?,@&=+$%#]*[-_.~*)|a-zA-Z0-9;:\/?@&=+$%#]$/.test(data)) {
				var f = confirm("QR码为网络地址，确认打开?" + '\n\n' + data);
				if (f == true)
					return gBrowser.selectedTab = gBrowser.addTab(data);
			} else if (data == "error decoding QR Code") {
				var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
				var ctx = canvas.getContext('2d');
				var img = new Image();
				img.onload = function() {
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);
					var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
					var Decode = new QRCodeDecode();
					try {
						var decoded = Decode.decodeImageData(imagedata, canvas.width, canvas.height);
						QrCreator.QRCodeDecode_Func(decoded);
					} catch (e) {
						alert("该图像不包含有效的QR码或无法读取它。 :(");
					}
				};
				img.src = src;
			} else {
				var r = confirm("QR代码值（按OK键将其复制到剪贴板）：" + '\n\n' + data);
				if (r == true) {
					try {
						Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(data);
					} catch (e) {
						alert(e);
						console.log(e)
					}
				}
			}
		},

		QRCreator_MenuClick: function(event) {
			var cont = window.content || gBrowser.selectedBrowser.contentWindowAsCPOW;
			if (cont.document.getElementById('qrCreatorimageboxid'))
				return;
			var target_data = '';
			var altText = "QR码内容[网址]";

			if (event.button == 0) {
				if (gContextMenu) {
					if (gContextMenu.isTextSelected) {
						target_data = cont.getSelection().toString();
						altText = "QR码内容[文本]";
					} else if (gContextMenu.onLink) {
						target_data = gContextMenu.linkURL;
					} else if (gContextMenu.onImage) {
						target_data = gContextMenu.target.src;
					} else if ((cont.document.location == "about:blank" || cont.document.location == "about:newtab")) {
						altText = "QR码内容[文本]";
						target_data = prompt("请输入文本创建一个QR码（长度不超过250字节）：", "");
					} else {
						target_data = cont.document.location;
					}
				}
			} else if (event.button == 2) {
				altText = "QR码内容[文本]";
				target_data = prompt("请输入文本创建一个QR码（长度不超过250字节）：", "");
				event.stopPropagation();
				event.preventDefault();
			}
			this.QRCommand(target_data, altText);
		},

		QRconvertFromUnicode: function(charset, str) {
			try {
				var unicodeConverter = Components
					.classes["@mozilla.org/intl/scriptableunicodeconverter"]
					.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				unicodeConverter.charset = charset;
				str = unicodeConverter.ConvertFromUnicode(str);
				return str + unicodeConverter.Finish();
			} catch (ex) {
				return null;
			}
		},

		CreateQR: function(text, typeNumber, errorCorrectLevel) {
			for (var type = 4; type <= 40; type += 1) {
				try {
					var qr = this.QRCodeEcode(type, 'L');
					qr.addData("" + this.QRconvertFromUnicode("UTF-8", text));
					qr.make();

					return qr.createImgTag();
				} catch (err) {}
			}

			return null;
		},

		QRcheckLength: function(arg) {
			if (arg) {
				if (arg.length == 0) {
					alert("没有要转化为二维码的内容！");
					return false;
				} else if (arg.length > 250) {
					alert("要转化为二维码的数据超长了！(大于250字节)");
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},

		QRPopupImage: function(src, alt) {
			var imgnode = content.document.getElementById('qrCreatorimageboxid');
			if (imgnode) {
				imgnode.parentNode.removeChild(imgnode);
			}

			var img_node = content.document.createElement("img");
			img_node.setAttribute('style', '-moz-box-shadow: 0 0 4px #000000');
			with(img_node.style) {
				position = 'fixed';
				left = '-moz-calc(50% - 183px)';
				top = '-moz-calc(50% - 183px)';
				zIndex = 99999;
				width = "160px";
				height = "160px";
				border = '1px solid rgba(0,0,0,.5)';
				borderRadius = '3px';
				background = 'white';
			}
			img_node.setAttribute('id', 'qrCreatorimageboxid');
			img_node.setAttribute('src', src);
			img_node.setAttribute('alt', alt || "");
			img_node.setAttribute('title', img_node.getAttribute('alt'));

			content.document.body.appendChild(img_node);

			function ImgDrag(node) {
				var IsMousedown,
					LEFT,
					TOP,
					img_node = node;
				img_node.onmousedown = function(e) {
					IsMousedown = true;
					e = e || event;
					LEFT = e.clientX - img_node.offsetLeft;
					TOP = e.clientY - img_node.offsetTop;
					return false;
				}

				content.document.addEventListener("mousemove", function(e) {
					e = e || event;
					if (IsMousedown) {
						img_node.style.left = e.clientX - LEFT + "px";
						img_node.style.top = e.clientY - TOP + "px";
					}
				}, false);

				content.document.addEventListener("mouseup", function() {
					IsMousedown = false;
				}, false);
			}
			ImgDrag(img_node);
			content.document.addEventListener('click', function(e) {
				if (img_node && e.button == 0 && e.target != img_node) {
					img_node.parentNode.removeChild(img_node);
					this.removeEventListener("click", arguments.callee, true);
				}
			}, true);
		},

		QRCommand: function(target_data, altText) {
			if (!this.QRcheckLength(target_data)) return;
			var src = this.CreateQR(target_data);
			var alt = altText + ': ' + target_data;
			if (window.content)
				this.QRPopupImage(src, alt);
			else {
				var E10SFunc = this.QRPopupImage.toString().replace(/^function.*{|}$/g, "");
				gBrowser.selectedBrowser.messageManager.loadFrameScript("data:application/x-javascript;charset=UTF-8,(function(src, alt){" + escape(E10SFunc) + "})('" + src + "','" + alt + "');", true);
			}
		},

		QRoptionsChangeLabel: function(event) {
			var url = window.content ? content.document.location : gBrowser.selectedBrowser.contentWindowAsCPOW.document.location;
			var labelText;
			if (gContextMenu) {
				$('QRCodeDecode_Menu').hidden = !(gContextMenu.onImage || gContextMenu.bgImageURL || gContextMenu.target.nodeName == 'CANVAS' || gContextMenu.target.localName == "canvas");
				if (gContextMenu.isTextSelected) {
					labelText = "选区文本";
				} else if (gContextMenu.onLink) {
					labelText = "链接地址";
				} else if (gContextMenu.onImage) {
					labelText = "图象地址";
				} else if (url == "about:blank" || url == "about:newtab") {
					labelText = "手工输入";
				} else {
					labelText = "当前网址";
				}
				var currentEntry = $("QRCreator_Menu");
				if (currentEntry) {
					let LABELTEXT = "生成二维码 : " + labelText;
					currentEntry.setAttribute("label", LABELTEXT);
				}
			}
		},
	};

	QrCreator.QRCodeEcode = function() {
		//---------------------------------------------------------------------
		// qrcode
		//---------------------------------------------------------------------
		/**
		 * qrcode
		 * @param typeNumber 1 to 10
		 * @param errorCorrectLevel 'L','M','Q','H'
		 */
		var qrcode = function(typeNumber, errorCorrectLevel) {
			var PAD0 = 0xEC;
			var PAD1 = 0x11;
			var _typeNumber = typeNumber;
			var _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
			var _modules = null;
			var _moduleCount = 0;
			var _dataCache = null;
			var _dataList = new Array();
			var _this = {};
			var makeImpl = function(test, maskPattern) {
				_moduleCount = _typeNumber * 4 + 17;
				_modules = function(moduleCount) {
					var modules = new Array(moduleCount);
					for (var row = 0; row < moduleCount; row += 1) {
						modules[row] = new Array(moduleCount);
						for (var col = 0; col < moduleCount; col += 1) {
							modules[row][col] = null;
						}
					}
					return modules;
				}(_moduleCount);
				setupPositionProbePattern(0, 0);
				setupPositionProbePattern(_moduleCount - 7, 0);
				setupPositionProbePattern(0, _moduleCount - 7);
				setupPositionAdjustPattern();
				setupTimingPattern();
				setupTypeInfo(test, maskPattern);
				if (_typeNumber >= 7) {
					setupTypeNumber(test);
				}
				if (_dataCache == null) {
					_dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
				}
				mapData(_dataCache, maskPattern);
			};
			var setupPositionProbePattern = function(row, col) {
				for (var r = -1; r <= 7; r += 1) {
					if (row + r <= -1 || _moduleCount <= row + r) continue;
					for (var c = -1; c <= 7; c += 1) {
						if (col + c <= -1 || _moduleCount <= col + c) continue;
						if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
							_modules[row + r][col + c] = true;
						} else {
							_modules[row + r][col + c] = false;
						}
					}
				}
			};
			var getBestMaskPattern = function() {
				var minLostPoint = 0;
				var pattern = 0;
				for (var i = 0; i < 8; i += 1) {
					makeImpl(true, i);
					var lostPoint = QRUtil.getLostPoint(_this);
					if (i == 0 || minLostPoint > lostPoint) {
						minLostPoint = lostPoint;
						pattern = i;
					}
				}
				return pattern;
			};
			var setupTimingPattern = function() {
				for (var r = 8; r < _moduleCount - 8; r += 1) {
					if (_modules[r][6] != null) {
						continue;
					}
					_modules[r][6] = (r % 2 == 0);
				}
				for (var c = 8; c < _moduleCount - 8; c += 1) {
					if (_modules[6][c] != null) {
						continue;
					}
					_modules[6][c] = (c % 2 == 0);
				}
			};
			var setupPositionAdjustPattern = function() {
				var pos = QRUtil.getPatternPosition(_typeNumber);
				for (var i = 0; i < pos.length; i += 1) {
					for (var j = 0; j < pos.length; j += 1) {
						var row = pos[i];
						var col = pos[j];
						if (_modules[row][col] != null) {
							continue;
						}
						for (var r = -2; r <= 2; r += 1) {
							for (var c = -2; c <= 2; c += 1) {
								if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
									_modules[row + r][col + c] = true;
								} else {
									_modules[row + r][col + c] = false;
								}
							}
						}
					}
				}
			};
			var setupTypeNumber = function(test) {
				var bits = QRUtil.getBCHTypeNumber(_typeNumber);
				for (var i = 0; i < 18; i += 1) {
					var mod = (!test && ((bits >> i) & 1) == 1);
					_modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
				}
				for (var i = 0; i < 18; i += 1) {
					var mod = (!test && ((bits >> i) & 1) == 1);
					_modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
				}
			};
			var setupTypeInfo = function(test, maskPattern) {
				var data = (_errorCorrectLevel << 3) | maskPattern;
				var bits = QRUtil.getBCHTypeInfo(data);
				// vertical
				for (var i = 0; i < 15; i += 1) {
					var mod = (!test && ((bits >> i) & 1) == 1);
					if (i < 6) {
						_modules[i][8] = mod;
					} else if (i < 8) {
						_modules[i + 1][8] = mod;
					} else {
						_modules[_moduleCount - 15 + i][8] = mod;
					}
				}
				// horizontal
				for (var i = 0; i < 15; i += 1) {
					var mod = (!test && ((bits >> i) & 1) == 1);
					if (i < 8) {
						_modules[8][_moduleCount - i - 1] = mod;
					} else if (i < 9) {
						_modules[8][15 - i - 1 + 1] = mod;
					} else {
						_modules[8][15 - i - 1] = mod;
					}
				}
				// fixed module
				_modules[_moduleCount - 8][8] = (!test);
			};
			var mapData = function(data, maskPattern) {
				var inc = -1;
				var row = _moduleCount - 1;
				var bitIndex = 7;
				var byteIndex = 0;
				var maskFunc = QRUtil.getMaskFunction(maskPattern);
				for (var col = _moduleCount - 1; col > 0; col -= 2) {
					if (col == 6) col -= 1;
					while (true) {
						for (var c = 0; c < 2; c += 1) {
							if (_modules[row][col - c] == null) {
								var dark = false;
								if (byteIndex < data.length) {
									dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
								}
								var mask = maskFunc(row, col - c);
								if (mask) {
									dark = !dark;
								}
								_modules[row][col - c] = dark;
								bitIndex -= 1;
								if (bitIndex == -1) {
									byteIndex += 1;
									bitIndex = 7;
								}
							}
						}
						row += inc;
						if (row < 0 || _moduleCount <= row) {
							row -= inc;
							inc = -inc;
							break;
						}
					}
				}
			};
			var createBytes = function(buffer, rsBlocks) {
				var offset = 0;
				var maxDcCount = 0;
				var maxEcCount = 0;
				var dcdata = new Array(rsBlocks.length);
				var ecdata = new Array(rsBlocks.length);
				for (var r = 0; r < rsBlocks.length; r += 1) {
					var dcCount = rsBlocks[r].dataCount;
					var ecCount = rsBlocks[r].totalCount - dcCount;
					maxDcCount = Math.max(maxDcCount, dcCount);
					maxEcCount = Math.max(maxEcCount, ecCount);
					dcdata[r] = new Array(dcCount);
					for (var i = 0; i < dcdata[r].length; i += 1) {
						dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
					}
					offset += dcCount;
					var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
					var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
					var modPoly = rawPoly.mod(rsPoly);
					ecdata[r] = new Array(rsPoly.getLength() - 1);
					for (var i = 0; i < ecdata[r].length; i += 1) {
						var modIndex = i + modPoly.getLength() - ecdata[r].length;
						ecdata[r][i] = (modIndex >= 0) ? modPoly.get(modIndex) : 0;
					}
				}
				var totalCodeCount = 0;
				for (var i = 0; i < rsBlocks.length; i += 1) {
					totalCodeCount += rsBlocks[i].totalCount;
				}
				var data = new Array(totalCodeCount);
				var index = 0;
				for (var i = 0; i < maxDcCount; i += 1) {
					for (var r = 0; r < rsBlocks.length; r += 1) {
						if (i < dcdata[r].length) {
							data[index] = dcdata[r][i];
							index += 1;
						}
					}
				}
				for (var i = 0; i < maxEcCount; i += 1) {
					for (var r = 0; r < rsBlocks.length; r += 1) {
						if (i < ecdata[r].length) {
							data[index] = ecdata[r][i];
							index += 1;
						}
					}
				}
				return data;
			};
			var createData = function(typeNumber, errorCorrectLevel, dataList) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
				var buffer = qrBitBuffer();
				for (var i = 0; i < dataList.length; i += 1) {
					var data = dataList[i];
					buffer.put(data.getMode(), 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
					data.write(buffer);
				}
				// calc num max data.
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i += 1) {
					totalDataCount += rsBlocks[i].dataCount;
				}
				if (buffer.getLengthInBits() > totalDataCount * 8) {
					throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')');
				}
				// end code
				if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
					buffer.put(0, 4);
				}
				// padding
				while (buffer.getLengthInBits() % 8 != 0) {
					buffer.putBit(false);
				}
				// padding
				while (true) {
					if (buffer.getLengthInBits() >= totalDataCount * 8) {
						break;
					}
					buffer.put(PAD0, 8);
					if (buffer.getLengthInBits() >= totalDataCount * 8) {
						break;
					}
					buffer.put(PAD1, 8);
				}
				return createBytes(buffer, rsBlocks);
			};
			_this.addData = function(data) {
				var newData = qr8BitByte(data);
				_dataList.push(newData);
				_dataCache = null;
			};
			_this.isDark = function(row, col) {
				if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
					throw new Error(row + ',' + col);
				}
				return _modules[row][col];
			};
			_this.getModuleCount = function() {
				return _moduleCount;
			};
			_this.make = function() {
				makeImpl(false, getBestMaskPattern());
			};
			_this.createTableTag = function(cellSize, margin) {
				cellSize = cellSize || 2;
				margin = (typeof margin == 'undefined') ? cellSize * 4 : margin;
				var qrHtml = '';
				qrHtml += '<table style="';
				qrHtml += ' border-width: 0px; border-style: none;';
				qrHtml += ' border-collapse: collapse;';
				qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
				qrHtml += '">';
				qrHtml += '<tbody>';
				for (var r = 0; r < _this.getModuleCount(); r += 1) {
					qrHtml += '<tr>';
					for (var c = 0; c < _this.getModuleCount(); c += 1) {
						qrHtml += '<td style="';
						qrHtml += ' border-width: 0px; border-style: none;';
						qrHtml += ' border-collapse: collapse;';
						qrHtml += ' padding: 0px; margin: 0px;';
						qrHtml += ' width: ' + cellSize + 'px;';
						qrHtml += ' height: ' + cellSize + 'px;';
						qrHtml += ' background-color: ';
						qrHtml += _this.isDark(r, c) ? '#000000' : '#ffffff';
						qrHtml += ';';
						qrHtml += '"/>';
					}
					qrHtml += '</tr>';
				}
				qrHtml += '</tbody>';
				qrHtml += '</table>';
				return qrHtml;
			};
			_this.createImgTag = function(cellSize, margin) {
				cellSize = cellSize || 4;
				margin = (typeof margin == 'undefined') ? cellSize * 4 : margin;
				var size = _this.getModuleCount() * cellSize + margin * 2;
				var min = margin;
				var max = size - margin;
				return createImgTag(size, size, function(x, y) {
					if (min <= x && x < max && min <= y && y < max) {
						var c = Math.floor((x - min) / cellSize);
						var r = Math.floor((y - min) / cellSize);
						return _this.isDark(r, c) ? 0 : 1;
					} else {
						return 1;
					}
				});
			};
			return _this;
		};
		//---------------------------------------------------------------------
		// qrcode.stringToBytes
		//---------------------------------------------------------------------
		qrcode.stringToBytes = function(s) {
			var bytes = new Array();
			for (var i = 0; i < s.length; i += 1) {
				var c = s.charCodeAt(i);
				bytes.push(c & 0xff);
			}
			return bytes;
		};
		//---------------------------------------------------------------------
		// qrcode.createStringToBytes
		//---------------------------------------------------------------------
		/**
		 * @param unicodeData base64 string of byte array.
		 * [16bit Unicode],[16bit Bytes], ...
		 * @param numChars
		 */
		qrcode.createStringToBytes = function(unicodeData, numChars) {
			// create conversion map.
			var unicodeMap = function() {
				var bin = base64DecodeInputStream(unicodeData);
				var read = function() {
					var b = bin.read();
					if (b == -1) throw new Error();
					return b;
				};
				var count = 0;
				var unicodeMap = {};
				while (true) {
					var b0 = bin.read();
					if (b0 == -1) break;
					var b1 = read();
					var b2 = read();
					var b3 = read();
					var k = String.fromCharCode((b0 << 8) | b1);
					var v = (b2 << 8) | b3;
					unicodeMap[k] = v;
					count += 1;
				}
				if (count != numChars) {
					throw new Error(count + ' != ' + numChars);
				}
				return unicodeMap;
			}();
			var unknownChar = '?'.charCodeAt(0);
			return function(s) {
				var bytes = new Array();
				for (var i = 0; i < s.length; i += 1) {
					var c = s.charCodeAt(i);
					if (c < 128) {
						bytes.push(c);
					} else {
						var b = unicodeMap[s.charAt(i)];
						if (typeof b == 'number') {
							if ((b & 0xff) == b) {
								// 1byte
								bytes.push(b);
							} else {
								// 2bytes
								bytes.push(b >>> 8);
								bytes.push(b & 0xff);
							}
						} else {
							bytes.push(unknownChar);
						}
					}
				}
				return bytes;
			};
		};
		//---------------------------------------------------------------------
		// QRMode
		//---------------------------------------------------------------------
		var QRMode = {
			MODE_NUMBER: 1 << 0,
			MODE_ALPHA_NUM: 1 << 1,
			MODE_8BIT_BYTE: 1 << 2,
			MODE_KANJI: 1 << 3
		};
		//---------------------------------------------------------------------
		// QRErrorCorrectLevel
		//---------------------------------------------------------------------
		var QRErrorCorrectLevel = {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		};
		//---------------------------------------------------------------------
		// QRMaskPattern
		//---------------------------------------------------------------------
		var QRMaskPattern = {
			PATTERN000: 0,
			PATTERN001: 1,
			PATTERN010: 2,
			PATTERN011: 3,
			PATTERN100: 4,
			PATTERN101: 5,
			PATTERN110: 6,
			PATTERN111: 7
		};
		//---------------------------------------------------------------------
		// QRUtil
		//---------------------------------------------------------------------
		var QRUtil = function() {
			var PATTERN_POSITION_TABLE = [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[6, 22, 38],
				[6, 24, 42],
				[6, 26, 46],
				[6, 28, 50],
				[6, 30, 54],
				[6, 32, 58],
				[6, 34, 62],
				[6, 26, 46, 66],
				[6, 26, 48, 70],
				[6, 26, 50, 74],
				[6, 30, 54, 78],
				[6, 30, 56, 82],
				[6, 30, 58, 86],
				[6, 34, 62, 90],
				[6, 28, 50, 72, 94],
				[6, 26, 50, 74, 98],
				[6, 30, 54, 78, 102],
				[6, 28, 54, 80, 106],
				[6, 32, 58, 84, 110],
				[6, 30, 58, 86, 114],
				[6, 34, 62, 90, 118],
				[6, 26, 50, 74, 98, 122],
				[6, 30, 54, 78, 102, 126],
				[6, 26, 52, 78, 104, 130],
				[6, 30, 56, 82, 108, 134],
				[6, 34, 60, 86, 112, 138],
				[6, 30, 58, 86, 114, 142],
				[6, 34, 62, 90, 118, 146],
				[6, 30, 54, 78, 102, 126, 150],
				[6, 24, 50, 76, 102, 128, 154],
				[6, 28, 54, 80, 106, 132, 158],
				[6, 32, 58, 84, 110, 136, 162],
				[6, 26, 54, 82, 110, 138, 166],
				[6, 30, 58, 86, 114, 142, 170]
			];
			var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
			var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
			var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
			var _this = {};
			var getBCHDigit = function(data) {
				var digit = 0;
				while (data != 0) {
					digit += 1;
					data >>>= 1;
				}
				return digit;
			};
			_this.getBCHTypeInfo = function(data) {
				var d = data << 10;
				while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
					d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15)));
				}
				return ((data << 10) | d) ^ G15_MASK;
			};
			_this.getBCHTypeNumber = function(data) {
				var d = data << 12;
				while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
					d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18)));
				}
				return (data << 12) | d;
			};
			_this.getPatternPosition = function(typeNumber) {
				return PATTERN_POSITION_TABLE[typeNumber - 1];
			};
			_this.getMaskFunction = function(maskPattern) {
				switch (maskPattern) {
					case QRMaskPattern.PATTERN000:
						return function(i, j) {
							return (i + j) % 2 == 0;
						};
					case QRMaskPattern.PATTERN001:
						return function(i, j) {
							return i % 2 == 0;
						};
					case QRMaskPattern.PATTERN010:
						return function(i, j) {
							return j % 3 == 0;
						};
					case QRMaskPattern.PATTERN011:
						return function(i, j) {
							return (i + j) % 3 == 0;
						};
					case QRMaskPattern.PATTERN100:
						return function(i, j) {
							return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
						};
					case QRMaskPattern.PATTERN101:
						return function(i, j) {
							return (i * j) % 2 + (i * j) % 3 == 0;
						};
					case QRMaskPattern.PATTERN110:
						return function(i, j) {
							return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
						};
					case QRMaskPattern.PATTERN111:
						return function(i, j) {
							return ((i * j) % 3 + (i + j) % 2) % 2 == 0;
						};
					default:
						throw new Error('bad maskPattern:' + maskPattern);
				}
			};
			_this.getErrorCorrectPolynomial = function(errorCorrectLength) {
				var a = qrPolynomial([1], 0);
				for (var i = 0; i < errorCorrectLength; i += 1) {
					a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
				}
				return a;
			};
			_this.getLengthInBits = function(mode, type) {
				if (1 <= type && type < 10) {
					// 1 - 9
					switch (mode) {
						case QRMode.MODE_NUMBER:
							return 10;
						case QRMode.MODE_ALPHA_NUM:
							return 9;
						case QRMode.MODE_8BIT_BYTE:
							return 8;
						case QRMode.MODE_KANJI:
							return 8;
						default:
							throw new Error('mode:' + mode);
					}
				} else if (type < 27) {
					// 10 - 26
					switch (mode) {
						case QRMode.MODE_NUMBER:
							return 12;
						case QRMode.MODE_ALPHA_NUM:
							return 11;
						case QRMode.MODE_8BIT_BYTE:
							return 16;
						case QRMode.MODE_KANJI:
							return 10;
						default:
							throw new Error('mode:' + mode);
					}
				} else if (type < 41) {
					// 27 - 40
					switch (mode) {
						case QRMode.MODE_NUMBER:
							return 14;
						case QRMode.MODE_ALPHA_NUM:
							return 13;
						case QRMode.MODE_8BIT_BYTE:
							return 16;
						case QRMode.MODE_KANJI:
							return 12;
						default:
							throw new Error('mode:' + mode);
					}
				} else {
					throw new Error('type:' + type);
				}
			};
			_this.getLostPoint = function(qrcode) {
				var moduleCount = qrcode.getModuleCount();
				var lostPoint = 0;
				// LEVEL1
				for (var row = 0; row < moduleCount; row += 1) {
					for (var col = 0; col < moduleCount; col += 1) {
						var sameCount = 0;
						var dark = qrcode.isDark(row, col);
						for (var r = -1; r <= 1; r += 1) {
							if (row + r < 0 || moduleCount <= row + r) {
								continue;
							}
							for (var c = -1; c <= 1; c += 1) {
								if (col + c < 0 || moduleCount <= col + c) {
									continue;
								}
								if (r == 0 && c == 0) {
									continue;
								}
								if (dark == qrcode.isDark(row + r, col + c)) {
									sameCount += 1;
								}
							}
						}
						if (sameCount > 5) {
							lostPoint += (3 + sameCount - 5);
						}
					}
				};
				// LEVEL2
				for (var row = 0; row < moduleCount - 1; row += 1) {
					for (var col = 0; col < moduleCount - 1; col += 1) {
						var count = 0;
						if (qrcode.isDark(row, col)) count += 1;
						if (qrcode.isDark(row + 1, col)) count += 1;
						if (qrcode.isDark(row, col + 1)) count += 1;
						if (qrcode.isDark(row + 1, col + 1)) count += 1;
						if (count == 0 || count == 4) {
							lostPoint += 3;
						}
					}
				}
				// LEVEL3
				for (var row = 0; row < moduleCount; row += 1) {
					for (var col = 0; col < moduleCount - 6; col += 1) {
						if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) {
							lostPoint += 40;
						}
					}
				}
				for (var col = 0; col < moduleCount; col += 1) {
					for (var row = 0; row < moduleCount - 6; row += 1) {
						if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) {
							lostPoint += 40;
						}
					}
				}
				// LEVEL4
				var darkCount = 0;
				for (var col = 0; col < moduleCount; col += 1) {
					for (var row = 0; row < moduleCount; row += 1) {
						if (qrcode.isDark(row, col)) {
							darkCount += 1;
						}
					}
				}
				var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
				lostPoint += ratio * 10;
				return lostPoint;
			};
			return _this;
		}();
		//---------------------------------------------------------------------
		// QRMath
		//---------------------------------------------------------------------
		var QRMath = function() {
			var EXP_TABLE = new Array(256);
			var LOG_TABLE = new Array(256);
			// initialize tables
			for (var i = 0; i < 8; i += 1) {
				EXP_TABLE[i] = 1 << i;
			}
			for (var i = 8; i < 256; i += 1) {
				EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
			}
			for (var i = 0; i < 255; i += 1) {
				LOG_TABLE[EXP_TABLE[i]] = i;
			}
			var _this = {};
			_this.glog = function(n) {
				if (n < 1) {
					throw new Error('glog(' + n + ')');
				}
				return LOG_TABLE[n];
			};
			_this.gexp = function(n) {
				while (n < 0) {
					n += 255;
				}
				while (n >= 256) {
					n -= 255;
				}
				return EXP_TABLE[n];
			};
			return _this;
		}();
		//---------------------------------------------------------------------
		// qrPolynomial
		//---------------------------------------------------------------------
		function qrPolynomial(num, shift) {
			if (typeof num.length == 'undefined') {
				throw new Error(num.length + '/' + shift);
			}
			var _num = function() {
				var offset = 0;
				while (offset < num.length && num[offset] == 0) {
					offset += 1;
				}
				var _num = new Array(num.length - offset + shift);
				for (var i = 0; i < num.length - offset; i += 1) {
					_num[i] = num[i + offset];
				}
				return _num;
			}();
			var _this = {};
			_this.get = function(index) {
				return _num[index];
			};
			_this.getLength = function() {
				return _num.length;
			};
			_this.multiply = function(e) {
				var num = new Array(_this.getLength() + e.getLength() - 1);
				for (var i = 0; i < _this.getLength(); i += 1) {
					for (var j = 0; j < e.getLength(); j += 1) {
						num[i + j] ^= QRMath.gexp(QRMath.glog(_this.get(i)) + QRMath.glog(e.get(j)));
					}
				}
				return qrPolynomial(num, 0);
			};
			_this.mod = function(e) {
				if (_this.getLength() - e.getLength() < 0) {
					return _this;
				}
				var ratio = QRMath.glog(_this.get(0)) - QRMath.glog(e.get(0));
				var num = new Array(_this.getLength());
				for (var i = 0; i < _this.getLength(); i += 1) {
					num[i] = _this.get(i);
				}
				for (var i = 0; i < e.getLength(); i += 1) {
					num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
				}
				// recursive call
				return qrPolynomial(num, 0).mod(e);
			};
			return _this;
		};
		//---------------------------------------------------------------------
		// QRRSBlock
		//---------------------------------------------------------------------
		var QRRSBlock = function() {
			var RS_BLOCK_TABLE = [
				// L
				// M
				// Q
				// H
				// 1
				[1, 26, 19],
				[1, 26, 16],
				[1, 26, 13],
				[1, 26, 9],
				// 2
				[1, 44, 34],
				[1, 44, 28],
				[1, 44, 22],
				[1, 44, 16],
				// 3
				[1, 70, 55],
				[1, 70, 44],
				[2, 35, 17],
				[2, 35, 13],
				// 4
				[1, 100, 80],
				[2, 50, 32],
				[2, 50, 24],
				[4, 25, 9],
				// 5
				[1, 134, 108],
				[2, 67, 43],
				[2, 33, 15, 2, 34, 16],
				[2, 33, 11, 2, 34, 12],
				// 6
				[2, 86, 68],
				[4, 43, 27],
				[4, 43, 19],
				[4, 43, 15],
				// 7
				[2, 98, 78],
				[4, 49, 31],
				[2, 32, 14, 4, 33, 15],
				[4, 39, 13, 1, 40, 14],
				// 8
				[2, 121, 97],
				[2, 60, 38, 2, 61, 39],
				[4, 40, 18, 2, 41, 19],
				[4, 40, 14, 2, 41, 15],
				// 9
				[2, 146, 116],
				[3, 58, 36, 2, 59, 37],
				[4, 36, 16, 4, 37, 17],
				[4, 36, 12, 4, 37, 13],
				// 10
				[2, 86, 68, 2, 87, 69],
				[4, 69, 43, 1, 70, 44],
				[6, 43, 19, 2, 44, 20],
				[6, 43, 15, 2, 44, 16],
				// 11
				[4, 101, 81],
				[1, 80, 50, 4, 81, 51],
				[4, 50, 22, 4, 51, 23],
				[3, 36, 12, 8, 37, 13],
				// 12
				[2, 116, 92, 2, 117, 93],
				[6, 58, 36, 2, 59, 37],
				[4, 46, 20, 6, 47, 21],
				[7, 42, 14, 4, 43, 15],
				// 13
				[4, 133, 107],
				[8, 59, 37, 1, 60, 38],
				[8, 44, 20, 4, 45, 21],
				[12, 33, 11, 4, 34, 12],
				// 14
				[3, 145, 115, 1, 146, 116],
				[4, 64, 40, 5, 65, 41],
				[11, 36, 16, 5, 37, 17],
				[11, 36, 12, 5, 37, 13],
				// 15
				[5, 109, 87, 1, 110, 88],
				[5, 65, 41, 5, 66, 42],
				[5, 54, 24, 7, 55, 25],
				[11, 36, 12],
				// 16
				[5, 122, 98, 1, 123, 99],
				[7, 73, 45, 3, 74, 46],
				[15, 43, 19, 2, 44, 20],
				[3, 45, 15, 13, 46, 16],
				// 17
				[1, 135, 107, 5, 136, 108],
				[10, 74, 46, 1, 75, 47],
				[1, 50, 22, 15, 51, 23],
				[2, 42, 14, 17, 43, 15],
				// 18
				[5, 150, 120, 1, 151, 121],
				[9, 69, 43, 4, 70, 44],
				[17, 50, 22, 1, 51, 23],
				[2, 42, 14, 19, 43, 15],
				// 19
				[3, 141, 113, 4, 142, 114],
				[3, 70, 44, 11, 71, 45],
				[17, 47, 21, 4, 48, 22],
				[9, 39, 13, 16, 40, 14],
				// 20
				[3, 135, 107, 5, 136, 108],
				[3, 67, 41, 13, 68, 42],
				[15, 54, 24, 5, 55, 25],
				[15, 43, 15, 10, 44, 16],
				// 21
				[4, 144, 116, 4, 145, 117],
				[17, 68, 42],
				[17, 50, 22, 6, 51, 23],
				[19, 46, 16, 6, 47, 17],
				// 22
				[2, 139, 111, 7, 140, 112],
				[17, 74, 46],
				[7, 54, 24, 16, 55, 25],
				[34, 37, 13],
				// 23
				[4, 151, 121, 5, 152, 122],
				[4, 75, 47, 14, 76, 48],
				[11, 54, 24, 14, 55, 25],
				[16, 45, 15, 14, 46, 16],
				// 24
				[6, 147, 117, 4, 148, 118],
				[6, 73, 45, 14, 74, 46],
				[11, 54, 24, 16, 55, 25],
				[30, 46, 16, 2, 47, 17],
				// 25
				[8, 132, 106, 4, 133, 107],
				[8, 75, 47, 13, 76, 48],
				[7, 54, 24, 22, 55, 25],
				[22, 45, 15, 13, 46, 16],
				// 26
				[10, 142, 114, 2, 143, 115],
				[19, 74, 46, 4, 75, 47],
				[28, 50, 22, 6, 51, 23],
				[33, 46, 16, 4, 47, 17],
				// 27
				[8, 152, 122, 4, 153, 123],
				[22, 73, 45, 3, 74, 46],
				[8, 53, 23, 26, 54, 24],
				[12, 45, 15, 28, 46, 16],
				// 28
				[3, 147, 117, 10, 148, 118],
				[3, 73, 45, 23, 74, 46],
				[4, 54, 24, 31, 55, 25],
				[11, 45, 15, 31, 46, 16],
				// 29
				[7, 146, 116, 7, 147, 117],
				[21, 73, 45, 7, 74, 46],
				[1, 53, 23, 37, 54, 24],
				[19, 45, 15, 26, 46, 16],
				// 30
				[5, 145, 115, 10, 146, 116],
				[19, 75, 47, 10, 76, 48],
				[15, 54, 24, 25, 55, 25],
				[23, 45, 15, 25, 46, 16],
				// 31
				[13, 145, 115, 3, 146, 116],
				[2, 74, 46, 29, 75, 47],
				[42, 54, 24, 1, 55, 25],
				[23, 45, 15, 28, 46, 16],
				// 32
				[17, 145, 115],
				[10, 74, 46, 23, 75, 47],
				[10, 54, 24, 35, 55, 25],
				[19, 45, 15, 35, 46, 16],
				// 33
				[17, 145, 115, 1, 146, 116],
				[14, 74, 46, 21, 75, 47],
				[29, 54, 24, 19, 55, 25],
				[11, 45, 15, 46, 46, 16],
				// 34
				[13, 145, 115, 6, 146, 116],
				[14, 74, 46, 23, 75, 47],
				[44, 54, 24, 7, 55, 25],
				[59, 46, 16, 1, 47, 17],
				// 35
				[12, 151, 121, 7, 152, 122],
				[12, 75, 47, 26, 76, 48],
				[39, 54, 24, 14, 55, 25],
				[22, 45, 15, 41, 46, 16],
				// 36
				[6, 151, 121, 14, 152, 122],
				[6, 75, 47, 34, 76, 48],
				[46, 54, 24, 10, 55, 25],
				[2, 45, 15, 64, 46, 16],
				// 37
				[17, 152, 122, 4, 153, 123],
				[29, 74, 46, 14, 75, 47],
				[49, 54, 24, 10, 55, 25],
				[24, 45, 15, 46, 46, 16],
				// 38
				[4, 152, 122, 18, 153, 123],
				[13, 74, 46, 32, 75, 47],
				[48, 54, 24, 14, 55, 25],
				[42, 45, 15, 32, 46, 16],
				// 39
				[20, 147, 117, 4, 148, 118],
				[40, 75, 47, 7, 76, 48],
				[43, 54, 24, 22, 55, 25],
				[10, 45, 15, 67, 46, 16],
				// 40
				[19, 148, 118, 6, 149, 119],
				[18, 75, 47, 31, 76, 48],
				[34, 54, 24, 34, 55, 25],
				[20, 45, 15, 61, 46, 16]
			];
			var qrRSBlock = function(totalCount, dataCount) {
				var _this = {};
				_this.totalCount = totalCount;
				_this.dataCount = dataCount;
				return _this;
			};
			var _this = {};
			var getRsBlockTable = function(typeNumber, errorCorrectLevel) {
				switch (errorCorrectLevel) {
					case QRErrorCorrectLevel.L:
						return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
					case QRErrorCorrectLevel.M:
						return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
					case QRErrorCorrectLevel.Q:
						return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
					case QRErrorCorrectLevel.H:
						return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
					default:
						return undefined;
				}
			};
			_this.getRSBlocks = function(typeNumber, errorCorrectLevel) {
				var rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);
				if (typeof rsBlock == 'undefined') {
					throw new Error('bad rs block @ typeNumber:' + typeNumber +
						'/errorCorrectLevel:' + errorCorrectLevel);
				}
				var length = rsBlock.length / 3;
				var list = new Array();
				for (var i = 0; i < length; i += 1) {
					var count = rsBlock[i * 3 + 0];
					var totalCount = rsBlock[i * 3 + 1];
					var dataCount = rsBlock[i * 3 + 2];
					for (var j = 0; j < count; j += 1) {
						list.push(qrRSBlock(totalCount, dataCount));
					}
				}
				return list;
			};
			return _this;
		}();
		//---------------------------------------------------------------------
		// qrBitBuffer
		//---------------------------------------------------------------------
		var qrBitBuffer = function() {
			var _buffer = new Array();
			var _length = 0;
			var _this = {};
			_this.getBuffer = function() {
				return _buffer;
			};
			_this.get = function(index) {
				var bufIndex = Math.floor(index / 8);
				return ((_buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
			};
			_this.put = function(num, length) {
				for (var i = 0; i < length; i += 1) {
					_this.putBit(((num >>> (length - i - 1)) & 1) == 1);
				}
			};
			_this.getLengthInBits = function() {
				return _length;
			};
			_this.putBit = function(bit) {
				var bufIndex = Math.floor(_length / 8);
				if (_buffer.length <= bufIndex) {
					_buffer.push(0);
				}
				if (bit) {
					_buffer[bufIndex] |= (0x80 >>> (_length % 8));
				}
				_length += 1;
			};
			return _this;
		};
		//---------------------------------------------------------------------
		// qr8BitByte
		//---------------------------------------------------------------------
		var qr8BitByte = function(data) {
			var _mode = QRMode.MODE_8BIT_BYTE;
			var _data = data;
			var _bytes = qrcode.stringToBytes(data);
			var _this = {};
			_this.getMode = function() {
				return _mode;
			};
			_this.getLength = function(buffer) {
				return _bytes.length;
			};
			_this.write = function(buffer) {
				for (var i = 0; i < _bytes.length; i += 1) {
					buffer.put(_bytes[i], 8);
				}
			};
			return _this;
		};
		//=====================================================================
		// GIF Support etc.
		//
		//---------------------------------------------------------------------
		// byteArrayOutputStream
		//---------------------------------------------------------------------
		var byteArrayOutputStream = function() {
			var _bytes = new Array();
			var _this = {};
			_this.writeByte = function(b) {
				_bytes.push(b & 0xff);
			};
			_this.writeShort = function(i) {
				_this.writeByte(i);
				_this.writeByte(i >>> 8);
			};
			_this.writeBytes = function(b, off, len) {
				off = off || 0;
				len = len || b.length;
				for (var i = 0; i < len; i += 1) {
					_this.writeByte(b[i + off]);
				}
			};
			_this.writeString = function(s) {
				for (var i = 0; i < s.length; i += 1) {
					_this.writeByte(s.charCodeAt(i));
				}
			};
			_this.toByteArray = function() {
				return _bytes;
			};
			_this.toString = function() {
				var s = '';
				s += '[';
				for (var i = 0; i < _bytes.length; i += 1) {
					if (i > 0) {
						s += ',';
					}
					s += _bytes[i];
				}
				s += ']';
				return s;
			};
			return _this;
		};
		//---------------------------------------------------------------------
		// base64EncodeOutputStream
		//---------------------------------------------------------------------
		var base64EncodeOutputStream = function() {
			var _buffer = 0;
			var _buflen = 0;
			var _length = 0;
			var _base64 = '';
			var _this = {};
			var writeEncoded = function(b) {
				_base64 += String.fromCharCode(encode(b & 0x3f));
			};
			var encode = function(n) {
				if (n < 0) {
					// error.
				} else if (n < 26) {
					return 0x41 + n;
				} else if (n < 52) {
					return 0x61 + (n - 26);
				} else if (n < 62) {
					return 0x30 + (n - 52);
				} else if (n == 62) {
					return 0x2b;
				} else if (n == 63) {
					return 0x2f;
				}
				throw new Error('n:' + n);
			};
			_this.writeByte = function(n) {
				_buffer = (_buffer << 8) | (n & 0xff);
				_buflen += 8;
				_length += 1;
				while (_buflen >= 6) {
					writeEncoded(_buffer >>> (_buflen - 6));
					_buflen -= 6;
				}
			};
			_this.flush = function() {
				if (_buflen > 0) {
					writeEncoded(_buffer << (6 - _buflen));
					_buffer = 0;
					_buflen = 0;
				}
				if (_length % 3 != 0) {
					// padding
					var padlen = 3 - _length % 3;
					for (var i = 0; i < padlen; i += 1) {
						_base64 += '=';
					}
				}
			};
			_this.toString = function() {
				return _base64;
			};
			return _this;
		};
		//---------------------------------------------------------------------
		// base64DecodeInputStream
		//---------------------------------------------------------------------
		var base64DecodeInputStream = function(str) {
			var _str = str;
			var _pos = 0;
			var _buffer = 0;
			var _buflen = 0;
			var _this = {};
			_this.read = function() {
				while (_buflen < 8) {
					if (_pos >= _str.length) {
						if (_buflen == 0) {
							return -1;
						}
						throw new Error('unexpected end of file./' + _buflen);
					}
					var c = _str.charAt(_pos);
					_pos += 1;
					if (c == '=') {
						_buflen = 0;
						return -1;
					} else if (c.match(/^\s$/)) {
						// ignore if whitespace.
						continue;
					}
					_buffer = (_buffer << 6) | decode(c.charCodeAt(0));
					_buflen += 6;
				}
				var n = (_buffer >>> (_buflen - 8)) & 0xff;
				_buflen -= 8;
				return n;
			};
			var decode = function(c) {
				if (0x41 <= c && c <= 0x5a) {
					return c - 0x41;
				} else if (0x61 <= c && c <= 0x7a) {
					return c - 0x61 + 26;
				} else if (0x30 <= c && c <= 0x39) {
					return c - 0x30 + 52;
				} else if (c == 0x2b) {
					return 62;
				} else if (c == 0x2f) {
					return 63;
				} else {
					throw new Error('c:' + c);
				}
			};
			return _this;
		};
		//---------------------------------------------------------------------
		// gifImage (B/W)
		//---------------------------------------------------------------------
		var gifImage = function(width, height) {
			var _width = width;
			var _height = height;
			var _data = new Array(width * height);
			var _this = {};
			_this.setPixel = function(x, y, pixel) {
				_data[y * _width + x] = pixel;
			};
			_this.write = function(out) {
				//---------------------------------
				// GIF Signature
				out.writeString('GIF87a');
				//---------------------------------
				// Screen Descriptor
				out.writeShort(_width);
				out.writeShort(_height);
				out.writeByte(0x80); // 2bit
				out.writeByte(0);
				out.writeByte(0);
				//---------------------------------
				// Global Color Map
				// black
				out.writeByte(0x00);
				out.writeByte(0x00);
				out.writeByte(0x00);
				// white
				out.writeByte(0xff);
				out.writeByte(0xff);
				out.writeByte(0xff);
				//---------------------------------
				// Image Descriptor
				out.writeString(',');
				out.writeShort(0);
				out.writeShort(0);
				out.writeShort(_width);
				out.writeShort(_height);
				out.writeByte(0);
				//---------------------------------
				// Local Color Map
				//---------------------------------
				// Raster Data
				var lzwMinCodeSize = 2;
				var raster = getLZWRaster(lzwMinCodeSize);
				out.writeByte(lzwMinCodeSize);
				var offset = 0;
				while (raster.length - offset > 255) {
					out.writeByte(255);
					out.writeBytes(raster, offset, 255);
					offset += 255;
				}
				out.writeByte(raster.length - offset);
				out.writeBytes(raster, offset, raster.length - offset);
				out.writeByte(0x00);
				//---------------------------------
				// GIF Terminator
				out.writeString(';');
			};
			var bitOutputStream = function(out) {
				var _out = out;
				var _bitLength = 0;
				var _bitBuffer = 0;
				var _this = {};
				_this.write = function(data, length) {
					if ((data >>> length) != 0) {
						throw new Error('length over');
					}
					while (_bitLength + length >= 8) {
						_out.writeByte(0xff & ((data << _bitLength) | _bitBuffer));
						length -= (8 - _bitLength);
						data >>>= (8 - _bitLength);
						_bitBuffer = 0;
						_bitLength = 0;
					}
					_bitBuffer = (data << _bitLength) | _bitBuffer;
					_bitLength = _bitLength + length;
				};
				_this.flush = function() {
					if (_bitLength > 0) {
						_out.writeByte(_bitBuffer);
					}
				};
				return _this;
			};
			var getLZWRaster = function(lzwMinCodeSize) {
				var clearCode = 1 << lzwMinCodeSize;
				var endCode = (1 << lzwMinCodeSize) + 1;
				var bitLength = lzwMinCodeSize + 1;
				// Setup LZWTable
				var table = lzwTable();
				for (var i = 0; i < clearCode; i += 1) {
					table.add(String.fromCharCode(i));
				}
				table.add(String.fromCharCode(clearCode));
				table.add(String.fromCharCode(endCode));
				var byteOut = byteArrayOutputStream();
				var bitOut = bitOutputStream(byteOut);
				// clear code
				bitOut.write(clearCode, bitLength);
				var dataIndex = 0;
				var s = String.fromCharCode(_data[dataIndex]);
				dataIndex += 1;
				while (dataIndex < _data.length) {
					var c = String.fromCharCode(_data[dataIndex]);
					dataIndex += 1;
					if (table.contains(s + c)) {
						s = s + c;
					} else {
						bitOut.write(table.indexOf(s), bitLength);
						if (table.size() < 0xfff) {
							if (table.size() == (1 << bitLength)) {
								bitLength += 1;
							}
							table.add(s + c);
						}
						s = c;
					}
				}
				bitOut.write(table.indexOf(s), bitLength);
				// end code
				bitOut.write(endCode, bitLength);
				bitOut.flush();
				return byteOut.toByteArray();
			};
			var lzwTable = function() {
				var _map = {};
				var _size = 0;
				var _this = {};
				_this.add = function(key) {
					if (_this.contains(key)) {
						throw new Error('dup key:' + key);
					}
					_map[key] = _size;
					_size += 1;
				};
				_this.size = function() {
					return _size;
				};
				_this.indexOf = function(key) {
					return _map[key];
				};
				_this.contains = function(key) {
					return typeof _map[key] != 'undefined';
				};
				return _this;
			};
			return _this;
		};
		var createImgTag = function(width, height, getPixel, alt) {
			var gif = gifImage(width, height);
			for (var y = 0; y < height; y += 1) {
				for (var x = 0; x < width; x += 1) {
					gif.setPixel(x, y, getPixel(x, y));
				}
			}
			var b = byteArrayOutputStream();
			gif.write(b);
			var base64 = base64EncodeOutputStream();
			var bytes = b.toByteArray();
			for (var i = 0; i < bytes.length; i += 1) {
				base64.writeByte(bytes[i]);
			}
			base64.flush();
			var img = '';
			img += 'data:image/gif;base64,';
			img += base64;

			return img;
		};
		//---------------------------------------------------------------------
		// returns qrcode function.
		return qrcode;
	}();

	function ReedSolomon(n_ec_bytes) {
		this.logger = null;
		this.n_ec_bytes = n_ec_bytes;
		this.n_degree_max = 2 * n_ec_bytes;

		this.syndroms = [];

		this.gen_poly = null;
		this.initGaloisTables();
	}
	ReedSolomon.prototype = {

		/* ************************************************************
		 * ReedSolomon MAIN FUNCTIONS TO BE CALLED BY CLIENTS
		 * ************************************************************
		 */

		encode: function(msg) {
			// return parity bytes

			// Simulate a LFSR with generator polynomial for n byte RS code.

			if (this.gen_poly == null) {
				this.gen_poly = this.genPoly(this.n_ec_bytes);
			}

			var LFSR = new Array(this.n_ec_bytes + 1);
			var i;
			for (i = 0; i < this.n_ec_bytes + 1; i++) {
				LFSR[i] = 0;
			}

			for (i = 0; i < msg.length; i++) {
				var dbyte = msg[i] ^ LFSR[this.n_ec_bytes - 1];
				var j;
				for (j = this.n_ec_bytes - 1; j > 0; j--) {
					LFSR[j] = LFSR[j - 1] ^ this.gmult(this.gen_poly[j], dbyte);
				}
				LFSR[0] = this.gmult(this.gen_poly[0], dbyte);
			}

			var parity = [];
			for (i = this.n_ec_bytes - 1; i >= 0; i--) {
				parity.push(LFSR[i]);
			}
			return parity;
		},


		/* ************************************************************ */
		decode: function(bytes_in) {
			this.bytes_in = bytes_in;

			this.bytes_out = bytes_in.slice();

			var n_err = this.calculateSyndroms();
			if (n_err > 0) {
				this.correctErrors();
			} else {
				this.corrected = true;
			}

			return this.bytes_out.slice(0, this.bytes_out.length - this.n_ec_bytes);

		},


		/* ************************************************************
		 * ReedSolomon IMPLEMENTATION
		 * ************************************************************
		 */

		genPoly: function(nbytes) {
			var tp;
			var tp1;
			var genpoly;

			// multiply (x + a^n) for n = 1 to nbytes 

			tp1 = this.zeroPoly();
			tp1[0] = 1;

			var i;
			for (i = 0; i < nbytes; i++) {
				tp = this.zeroPoly();
				tp[0] = this.gexp[i]; // set up x+a^n 
				tp[1] = 1;
				genpoly = this.multPolys(tp, tp1);
				tp1 = this.copyPoly(genpoly);
			}

			if (this.logger) {
				this.logger.debug("RS genPoly: " + genpoly.join(","));
			}

			return genpoly;
		},


		/* ************************************************************ */
		calculateSyndroms: function() {
			this.syndroms = [];
			var sum;
			var n_err = 0;
			var i, j;
			for (j = 0; j < this.n_ec_bytes; j++) {
				sum = 0;
				for (i = 0; i < this.bytes_in.length; i++) {
					sum = this.bytes_in[i] ^ this.gmult(this.gexp[j], sum);
				}
				this.syndroms.push(sum);
				if (sum > 0) {
					n_err++;
				}
			}
			if (this.logger) {
				if (n_err > 0) {
					this.logger.debug("RS calculateSyndroms: <b>Errors found!</b> syndroms = " + this.syndroms.join(","));
				} else {
					this.logger.debug("RS calculateSyndroms: <b>No errors</b>");
				}
			}
			return n_err;
		},


		/* ************************************************************ */
		correctErrors: function() {

			this.berlekampMassey();
			this.findRoots();

			this.corrected = false;

			if (2 * this.n_errors > this.n_ec_bytes) {
				this.uncorrected_reason = "too many errors";
				if (this.logger) {
					this.logger.debug("RS correctErrors: <b>" + this.uncorrected_reason + "</b>");
				}
				return;
			}

			var e;
			for (e = 0; e < this.n_errors; e++) {
				if (this.error_locs[e] >= this.bytes_in.length) {
					this.uncorrected_reason = "corrections out of scope";
					if (this.logger) {
						this.logger.debug("RS correctErrors: <b>" + this.uncorrected_reason + "</b>");
					}
					return;
				}
			}

			if (this.n_errors === 0) {
				this.uncorrected_reason = "could not identify errors";
				if (this.logger) {
					this.logger.debug("RS correctErrors: <b>" + this.uncorrected_reason + "</b>");
				}
				return;
			}

			var r;
			for (r = 0; r < this.n_errors; r++) {

				var i = this.error_locs[r];

				// evaluate omega at alpha^(-i)
				var num = 0;
				var j;
				for (j = 0; j < this.n_degree_max; j++) {
					num ^= this.gmult(this.omega[j], this.gexp[((255 - i) * j) % 255]);

				}

				// evaluate psi' (derivative) at alpha^(-i) ; all odd powers disappear
				var denom = 0;
				for (j = 0; j < this.n_degree_max; j += 2) {
					denom ^= this.gmult(this.psi[j], this.gexp[((255 - i) * (j)) % 255]);
				}

				var err = this.gmult(num, this.ginv(denom));
				if (this.logger) {
					this.logger.debug("RS correctErrors: loc=" + (this.bytes_out.length - i - 1) + "  err = 0x0" + err.toString(16) + " = bin " + err.toString(2));
				}
				this.bytes_out[this.bytes_out.length - i - 1] ^= err;
			}

			this.corrected = true;
		},


		/* ************************************************************ */
		berlekampMassey: function() {

			/* initialize Gamma, the erasure locator polynomial */
			var gamma = this.zeroPoly();
			gamma[0] = 1;

			/* initialize to z */
			var D = this.copyPoly(gamma);
			this.mulZPoly(D);

			this.psi = this.copyPoly(gamma);
			var psi2 = new Array(this.n_degree_max);
			var k = -1;
			var L = 0;
			var i;
			var n;

			for (n = 0; n < this.n_ec_bytes; n++) {

				var d = this.computeDiscrepancy(this.psi, this.syndroms, L, n);

				if (d !== 0) {

					/* psi2 = psi - d*D */
					for (i = 0; i < this.n_degree_max; i++) {
						psi2[i] = this.psi[i] ^ this.gmult(d, D[i]);
					}

					if (L < (n - k)) {
						var L2 = n - k;
						k = n - L;
						/* D = scale_poly(ginv(d), psi); */
						for (i = 0; i < this.n_degree_max; i++) {
							D[i] = this.gmult(this.psi[i], this.ginv(d));
						}
						L = L2;
					}

					/* psi = psi2 */
					//for (i = 0; i < this.n_degree_max; i++) this.psi[i] = psi2[i];
					this.psi = this.copyPoly(psi2);
				}

				this.mulZPoly(D);
			}

			if (this.logger) {
				this.logger.debug("RS berlekampMassey: psi = " + this.psi.join(","));
			}

			/* omega */
			var om = this.multPolys(this.psi, this.syndroms);
			this.omega = this.zeroPoly();
			for (i = 0; i < this.n_ec_bytes; i++) {
				this.omega[i] = om[i];
			}

			if (this.logger) {
				this.logger.debug("RS berlekampMassey: omega = " + this.omega.join(","));
			}

		},


		/* ************************************************************ */
		findRoots: function() {
			this.n_errors = 0;
			this.error_locs = [];
			var sum;
			var r;
			for (r = 1; r < 256; r++) {
				sum = 0;
				/* evaluate psi at r */
				var k;
				for (k = 0; k < this.n_ec_bytes + 1; k++) {
					sum ^= this.gmult(this.gexp[(k * r) % 255], this.psi[k]);
				}
				if (sum === 0) {
					this.error_locs.push(255 - r);
					this.n_errors++;
				}
			}
			if (this.logger) {
				this.logger.debug("RS findRoots: errors=<b>" + this.n_errors + "</b> locations = " + this.error_locs.join(","));
			}
		},


		/* ************************************************************
		 * Polynome functions
		 * ************************************************************
		 */

		computeDiscrepancy: function(lambda, S, L, n) {
			var sum = 0;
			var i;
			for (i = 0; i <= L; i++) {
				sum ^= this.gmult(lambda[i], S[n - i]);
			}
			return sum;
		},

		/* ************************************************************ */
		copyPoly: function(src) {
			var dst = new Array(this.n_degree_max);
			var i;
			for (i = 0; i < this.n_degree_max; i++) {
				dst[i] = src[i];
			}
			return dst;
		},

		/* ************************************************************ */
		zeroPoly: function() {
			var poly = new Array(this.n_degree_max);
			var i;
			for (i = 0; i < this.n_degree_max; i++) {
				poly[i] = 0;
			}
			return poly;
		},

		/* ************************************************************ */
		mulZPoly: function(poly) {
			var i;
			for (i = this.n_degree_max - 1; i > 0; i--) {
				poly[i] = poly[i - 1];
			}
			poly[0] = 0;
		},

		/* ************************************************************ */
		/* polynomial multiplication */
		multPolys: function(p1, p2) {
			var dst = new Array(this.n_degree_max);
			var tmp1 = new Array(this.n_degree_max * 2);

			var i;
			for (i = 0; i < (this.n_degree_max * 2); i++) {
				dst[i] = 0;
			}

			for (i = 0; i < this.n_degree_max; i++) {
				var j;
				for (j = this.n_degree_max; j < (this.n_degree_max * 2); j++) {
					tmp1[j] = 0;
				}

				/* scale tmp1 by p1[i] */
				for (j = 0; j < this.n_degree_max; j++) {
					tmp1[j] = this.gmult(p2[j], p1[i]);
				}
				/* and mult (shift) tmp1 right by i */
				for (j = (this.n_degree_max * 2) - 1; j >= i; j--) {
					tmp1[j] = tmp1[j - i];
				}
				for (j = 0; j < i; j++) {
					tmp1[j] = 0;
				}

				/* add into partial product */
				for (j = 0; j < (this.n_degree_max * 2); j++) {
					dst[j] ^= tmp1[j];
				}
			}
			return dst;
		},


		/* ************************************************************
		 * Galois Field functions
		 * ************************************************************
		 */

		initGaloisTables: function() {

			var pinit = 0;
			var p1 = 1;
			var p2 = 0;
			var p3 = 0;
			var p4 = 0;
			var p5 = 0;
			var p6 = 0;
			var p7 = 0;
			var p8 = 0;

			this.gexp = new Array(512);
			this.glog = new Array(256);

			this.gexp[0] = 1;
			this.gexp[255] = this.gexp[0];
			this.glog[0] = 0;

			var i;
			for (i = 1; i < 256; i++) {
				pinit = p8;
				p8 = p7;
				p7 = p6;
				p6 = p5;
				p5 = p4 ^ pinit;
				p4 = p3 ^ pinit;
				p3 = p2 ^ pinit;
				p2 = p1;
				p1 = pinit;
				this.gexp[i] = p1 + p2 * 2 + p3 * 4 + p4 * 8 + p5 * 16 + p6 * 32 + p7 * 64 + p8 * 128;
				this.gexp[i + 255] = this.gexp[i];
			}

			for (i = 1; i < 256; i++) {
				var z;
				for (z = 0; z < 256; z++) {
					if (this.gexp[z] === i) {
						this.glog[i] = z;
						break;
					}
				}
			}

		},

		/* ************************************************************ */
		gmult: function(a, b) {
			if (a === 0 || b === 0) {
				return (0);
			}
			var i = this.glog[a];
			var j = this.glog[b];
			return this.gexp[i + j];
		},

		/* ************************************************************ */
		ginv: function(elt) {
			return (this.gexp[255 - this.glog[elt]]);
		}
	};

	function QRCodeDecode() {
		this.logger = null;
		this.debug_addText = true;
		this.debug_encodeWithErrorCorrection = true;
		this.debug_encodeBestMask = true;
		this.debug_addErrorCorrection = true;
		this.debug_setBlocks = true;
		this.debug_findModuleSize = true;
		this.debug_extractCodewords = true;
		this.debug_extractData = true;
		this.debug_correctErrors = true;
		this.debug_insane = false;
		this.image = null;
		this.image_top = 0;
		this.image_bottom = 0;
		this.image_left = 0;
		this.image_right = 0;
		this.n_modules = 0;
		this.module_size = 0;
		this.version = 0;
		this.functional_grade = 0;
		this.error_correction_level = 0;
		this.mask = 0;
		this.mask_pattern = [];
		this.n_block_ec_words = 0;
		this.block_indices = [];
		this.block_data_lengths = [];
	}
	QRCodeDecode.prototype = {
		/* ************************************************************
		 * QRCodeDecode CONSTANTS
		 * ************************************************************
		 */

		/** Mode according to ISO/IEC 18004:2006(E) Section 6.3 */
		MODE: {
			Numeric: 1,
			AlphaNumeric: 2,
			EightBit: 4,
			Terminator: 0
		},

		/** Error correction level according to ISO/IEC 18004:2006(E) Section 6.5.1 */
		ERROR_CORRECTION_LEVEL: {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		},
		encodeToCanvas: function(mode, text, version, ec_level, module_size, canvas, bg_rgb, module_rgb) {

			if (!bg_rgb) {
				bg_rgb = [0.98, 0.98, 1.0];
			}
			if (!module_rgb) {
				module_rgb = [0.3, 0.05, 0.05];
			}

			var ctx = canvas.getContext('2d');

			canvas.setBackground = function() {
				ctx.fillStyle = "rgb(" + Math.round(bg_rgb[0] * 255) + "," + Math.round(bg_rgb[1] * 255) + "," + Math.round(bg_rgb[2] * 255) + ")";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = "rgb(" + Math.round(module_rgb[0] * 255) + "," + Math.round(module_rgb[1] * 255) + "," + Math.round(module_rgb[2] * 255) + ")";
			};

			canvas.setDark = function(x, y, d) {
				ctx.fillRect(x, y, d, d);
			};

			this.encodeInit(version, ec_level, module_size, canvas);
			this.encodeAddText(mode, text);
			this.encode();
		},


		/*  ************************************************************ */
		/** Encode text into a QR Code in a pixel array
		 *
		 *  @param mode      Mode according to ISO/IEC 18004:2006(E) Section 6.3
		 *  @param text      The text to be encoded
		 *  @param version   Version according to ISO/IEC 18004:2006(E) Section 5.3.1
		 *  @param ec_level  Error correction level according to ISO/IEC 18004:2006(E) Section 6.5.1
		 */

		encodeToPixarray: function(mode, text, version, ec_level) {

			var n_modules = this.nModulesFromVersion(version) + 4 + 4;

			var pix = {};
			pix.width = n_modules;
			pix.height = n_modules;
			pix.arr = [];
			var i;
			for (i = 0; i < n_modules; i++) {
				pix.arr[i] = [];
			}

			pix.setBackground = function() {
				for (i = 0; i < n_modules; i++) {
					var j;
					for (j = 0; j < n_modules; j++) {
						this.arr[i][j] = false;
					}
				}
			};

			pix.setDark = function(x, y, d) {
				// Ignoring d, since a pixel array has d=1

				// TODO: Investigate why we have wrong X coordinate sometimes ???

				if (x > n_modules - 1) {
					return;
				}
				this.arr[x][y] = true;
			};

			pix.isDark = function(x, y, d) {
				// Ignoring d, since a pixel array has d=1

				if (x > this.n_modules - 1) {
					return false;
				}

				return pix.arr[x][y];
			};

			this.encodeInit(version, ec_level, 1, pix);
			this.encodeAddText(mode, text);
			this.encode();

			return pix;
		},


		/*  ************************************************************ */
		/** Prepare for encoding text to QR Code
		 *
		 *  @param version       Version according to ISO/IEC 18004:2006(E) Section 5.3.1
		 *  @param ec_level      Error correction level according to ISO/IEC 18004:2006(E) Section 6.5.1
		 *  @param module_size   Number of pixels per module
		 *  @param canvas        Canvas or pixel array
		 */
		encodeInit: function(version, ec_level, module_size, canvas) {

			this.version = version;
			this.error_correction_level = ec_level;
			this.module_size = module_size;
			this.n_modules = this.nModulesFromVersion(version);

			this.image = canvas;
			this.image_top = 4 * module_size;
			this.image_left = 4 * module_size;
			this.image.width = (4 + 4 + this.n_modules) * module_size;
			this.image.height = (4 + 4 + this.n_modules) * module_size;
			this.image.setBackground();

			this.bit_idx = 0;
			this.setBlocks();

			this.data = [];
			var i;
			for (i = 0; i < this.n_data_codewords; i++) {
				this.data[i] = 0;
			}

			this.pixels = [];
			for (i = 0; i < this.n_modules; i++) {
				this.pixels[i] = [];
			}

		},


		/*  ************************************************************ */
		/** Add text to a QR code
		 *
		 *  @param mode  Mode according to ISO/IEC 18004:2006(E) Section 6.3
		 *  @param text  The text to be encoded
		 */
		encodeAddText: function(mode, text) {
			this.addTextImplementation(mode, text);
		},


		/*  ************************************************************ */
		/** Encode this class to an image/canvas.
		 */
		encode: function() {
			this.addTextImplementation(this.MODE.Terminator, null);
			this.appendPadding();
			this.addErrorCorrection();
			this.encodeBestMask();
			this.pixelsToImage();
		},


		/* ************************************************************
		 * QRCodeDecode MAIN DECODE FUNCTIONS TO BE CALLED BY CLIENTS
		 * ************************************************************
		 */

		/**  Decode a pixel array */
		decodePixarray: function(pix) {
			return this.decodeImage(pix);
		},


		/*  ************************************************************ */
		/** Decode image data as QR Code
		 *
		 *  @param image_data    The image data (canvas.getContext('2d').getImageData, pixel array or similar)
		 *  @param image_width   The pixel width of the image
		 *  @param image_height  The pixel height of the image
		 */
		decodeImageData: function(image_data, image_width, image_height) {
			this.setImageData(image_data, image_width, image_height);
			return this.decode();
		},


		/*  ************************************************************ */
		/** Decode image data as QR Code
		 *
		 *  @param image_data    The image data (canvas.getContext('2d').getImageData, pixel array or similar)
		 *  @param image_width   The pixel width of the image
		 *  @param image_height  The pixel height of the image
		 *  @param left          Leftmost pixel of image
		 *  @param right         Rightmost pixel of image
		 *  @param top           Top pixel of image
		 *  @param bottom        Bottom pixel of image
		 *  @param max_version   Do not try to decode with version higher than this
		 */
		decodeImageDataInsideBordersWithMaxVersion: function(image_data, image_width, image_height, left, right, top, bottom, max_version) {
			this.setImageData(image_data, image_width, image_height);
			this.image_left = left;
			this.image_right = right;
			this.image_top = top;
			this.image_bottom = bottom;
			this.image_size = ((this.image_right - this.image_left + 1) + (this.image_bottom - this.image_top + 1)) / 2.0;
			this.max_version = max_version;
			return this.decodeInsideBordersWithMaxVersion();
		},


		/*  ************************************************************ */
		/** Set image data in preparation for decoding QR Code
		 *
		 *  @param image_data    The image data (canvas.getContext('2d').getImageData, pixel array or similar)
		 *  @param image_width   The pixel width of the image
		 *  @param image_height  The pixel height of the image
		 */

		setImageData: function(image_data, image_width, image_height) {

			image_data.min_col = 255;
			image_data.max_col = 0;
			var total = 0;
			var x, y;
			for (x = 0; x < image_width; x++) {
				for (y = 0; y < image_height; y++) {
					var p = x * 4 + y * image_width * 4;
					var v = 0.30 * image_data.data[p] + 0.59 * image_data.data[p + 1] + 0.11 * image_data.data[p + 2];
					total += v;
					if (v < image_data.min_col) {
						image_data.min_col = v;
					}
					if (v > image_data.max_col) {
						image_data.max_col = v;
					}
				}
			}

			if (image_data.max_col - image_data.min_col < 255 / 10) {
				throw ("Image does not have enough contrast (this.image_data.min_col=" + image_data.min_col + " this.image_data.max_col=" + image_data.max_col + ")");
			}
			image_data.threshold = total / (image_width * image_height);
			//image_data.threshold = (image_data.max_col+image_data.min_col)/2;

			image_data.getGray = function(x, y, d) {
				var n = 0;
				var i;
				for (i = x; i < x + d; i++) {
					var j;
					for (j = y; j < y + d; j++) {
						var p = i * 4 + j * this.width * 4;
						n = n + 0.30 * this.data[p] + 0.59 * this.data[p + 1] + 0.11 * this.data[p + 2];
					}
				}
				return n / d / d;
			};

			image_data.isDark = function(x, y, d) {
				var g = this.getGray(x, y, d);
				return g < this.threshold;
			};

			this.image = image_data;
		},


		/*  ************************************************************ */
		/** Decode a QR Code in an image.
		 *  The image MUST already have .getGray set
		 */
		decodeImage: function(image) {
			this.image = image;
			return this.decode();
		},


		/*  ************************************************************ */
		/** Decode a QR Code in an image which has already been set.
		 */
		decode: function() {
			this.findImageBorders();
			this.max_version = 40;
			this.decodeInsideBordersWithMaxVersion();
			return this.data;
		},


		/*  ************************************************************ */
		/** Decode a QR Code in an image which has already been set -
		 *  inside borders already defined
		 */
		decodeInsideBordersWithMaxVersion: function() {
			this.findModuleSize();
			this.setFunctionalPattern();
			this.extractCodewords();
			this.setBlocks();
			this.correctErrors();
			this.extractData();
			return this.data;
		},



		/* ************************************************************
		 * QRCodeDecode INTERNAL ENCODING FUNCTIONS
		 * ************************************************************
		 */

		addTextImplementation: function(mode, text) {

			function appendBits(bytes, pos, len, value) {
				var byteIndex = pos >>> 3;
				var shift = 24 - (pos & 7) - len;

				var v = value << shift;

				bytes[byteIndex + 2] = v & 0xFF;
				v = v >>> 8;
				bytes[byteIndex + 1] = v & 0xFF;
				v = v >>> 8;
				bytes[byteIndex] += v & 0xFF;
			}

			/* ************************************************************ */
			function getAlphaNum(qr, ch) {
				if (!qr.alphanum_rev.hasOwnProperty(ch)) {
					throw ("Invalid character for Alphanumeric encoding [" + ch + "]");
				}
				return qr.alphanum_rev[ch];
			}

			/* ************************************************************ */
			function addAlphaNum(qr, text) {
				var n = text.length;
				var n_count_bits = qr.nCountBits(qr.MODE.AlphaNumeric, qr.version);
				appendBits(qr.data, qr.bit_idx, n_count_bits, n);
				qr.bit_idx += n_count_bits;

				var i;
				for (i = 0; i < n - 1; i += 2) {
					var val = 45 * getAlphaNum(qr, text[i]) + getAlphaNum(qr, text[i + 1]);
					appendBits(qr.data, qr.bit_idx, 11, val);
					qr.bit_idx += 11;
				}
				if (n % 2) {
					appendBits(qr.data, qr.bit_idx, 6, getAlphaNum(qr, text[n - 1]));
					qr.bit_idx += 6;
				}
			}

			/* ************************************************************ */
			function add8bit(qr, text) {

				var n_count_bits = qr.nCountBits(qr.MODE.EightBit, qr.version);

				appendBits(qr.data, qr.bit_idx, n_count_bits, text.length);
				qr.bit_idx += n_count_bits;

				var i;
				for (i = 0; i < text.length; i++) {
					appendBits(qr.data, qr.bit_idx, 8, text[i].charCodeAt());
					qr.bit_idx += 8;
				}
			}

			/* ************************************************************ */
			function addNumeric(qr, text) {
				var n = text.length;
				var n_count_bits = qr.nCountBits(qr.MODE.Numeric, qr.version);
				appendBits(qr.data, qr.bit_idx, n_count_bits, n);
				qr.bit_idx += n_count_bits;

				var num = [];
				var val;
				var i;
				for (i = 0; i < n; i++) {
					var ch = text[i].charCodeAt() - 48;
					if ((ch < 0) || (ch > 9)) {
						throw ("Invalid character for Numeric encoding [" + text[i] + "]");
					}
					num.push(ch);
				}

				for (i = 0; i < n - 2; i += 3) {
					val = 100 * num[i] + 10 * num[i + 1] + num[i + 2];
					appendBits(qr.data, qr.bit_idx, 10, val);
					qr.bit_idx += 10;

				}
				if (n % 3 === 1) {
					val = num[n - 1];
					appendBits(qr.data, qr.bit_idx, 4, val);
					qr.bit_idx += 4;
				} else if (n % 3 === 2) {
					val = 10 * num[n - 2] + num[n - 1];
					appendBits(qr.data, qr.bit_idx, 7, val);
					qr.bit_idx += 7;
				}
			}


			/* ************************************************************
			 * addTextImplementation
			 */

			appendBits(this.data, this.bit_idx, 4, mode);
			this.bit_idx += 4;

			if (mode === this.MODE.AlphaNumeric) {
				addAlphaNum(this, text);
			} else if (mode === this.MODE.EightBit) {
				add8bit(this, text);
			} else if (mode === this.MODE.Numeric) {
				addNumeric(this, text);
			} else if (mode === this.MODE.Terminator) {
				return;
			} else {
				throw ("Unsupported ECI mode: " + mode);
			}

			if (this.debug_addText) {
				if (this.logger) {
					this.logger.debug("addTextImplementation data = " + this.data.join(","));
				}
			}

			if (this.debug_addText) {
				if (this.logger) {
					this.logger.debug("addTextImplementation bit_idx/8=" + this.bit_idx / 8 + " n=" + this.n_data_codewords);
				}
			}

			if (this.bit_idx / 8 > this.n_data_codewords) {
				throw ("Text too long for this EC version");
			}

		},


		/* ************************************************************ */
		appendPadding: function() {
			var i;
			for (i = Math.floor((this.bit_idx - 1) / 8) + 1; i < this.n_data_codewords; i += 2) {
				this.data[i] = 0xEC;
				this.data[i + 1] = 0x11;
			}
		},


		/* ************************************************************ */
		addErrorCorrection: function() {
			if (this.debug_addText) {
				if (this.logger) {
					this.logger.debug("addErrorCorrection data = " + this.data.join(","));
				}
			}

			var rs = new ReedSolomon(this.n_block_ec_words);
			if (this.debug_addErrorCorrection) {
				rs.logger = this.logger;
			}

			var bytes = [];

			var n = 0;
			var b;
			for (b = 0; b < this.block_data_lengths.length; b++) {

				var m = this.block_data_lengths[b];
				var bytes_in = this.data.slice(n, n + m);
				n += m;

				var i;
				for (i = 0; i < m; i++) {
					bytes[this.block_indices[b][i]] = bytes_in[i];
				}

				var bytes_out = rs.encode(bytes_in);

				for (i = 0; i < bytes_out.length; i++) {
					bytes[this.block_indices[b][m + i]] = bytes_out[i];
				}

			}

			if (this.debug_addErrorCorrection) {
				if (this.logger) {
					this.logger.debug("addErrorCorrection bytes = " + bytes.join(","));
				}
			}

			this.bytes = bytes;

		},


		/* ************************************************************ */
		calculatePenalty: function(mask) {

			// TODO: Verify all penalty calculations

			/* ************************************************************ */
			function penaltyAdjacent(qr) {
				var p = 0;
				var i;
				for (i = 0; i < qr.n_modules; i++) {
					var n_dark = [0, 0];
					var n_light = [0, 0];
					var rc;
					for (rc = 0; rc <= 1; rc++) {
						var j;
						for (j = 0; j < qr.n_modules; j++) {
							if (qr.pixels[rc * i + (1 - rc) * j][(1 - rc) * i + rc * j]) {
								if (n_light[rc] > 5) {
									p += (3 + n_light[rc] - 5);
								}
								n_light[rc] = 0;
								n_dark[rc]++;
							} else {
								if (n_dark[rc] > 5) {
									p += (3 + n_dark[rc] - 5);
								}
								n_light[rc]++;
								n_dark[rc] = 0;
							}
						}
						if (n_light[rc] > 5) {
							p += (3 + n_light[rc] - 5);
						}
						if (n_dark[rc] > 5) {
							p += (3 + n_dark[rc] - 5);
						}
					}
				}
				return p;
			}

			/* ************************************************************ */
			function penaltyBlocks(qr) {
				// Not clear from ISO standard, if blocks have to be rectangular?
				// Here we give 3 penalty to every 2x2 block, so odd shaped areas will have penalties as well as rectangles
				var p = 0;
				var i;
				for (i = 0; i < qr.n_modules - 1; i++) {
					var j;
					for (j = 0; j < qr.n_modules - 1; j++) {
						var b = 0;
						if (qr.pixels[i][j]) {
							b++;
						}
						if (qr.pixels[i + 1][j]) {
							b++;
						}
						if (qr.pixels[i][j + 1]) {
							b++;
						}
						if (qr.pixels[i + 1][j + 1]) {
							b++;
						}
						if ((b === 0) || (b === 4)) {
							p += 3;
						}
					}
				}
				return p;
			}

			/* ************************************************************ */
			function binFormat(b) {
				return ("00000000000000" + b.toString(2)).slice(-15);
			}

			/* ************************************************************ */
			function penaltyDarkLight(qr) {
				// we shift bits in one by one, and see if the resulting pattern match the bad one
				var p = 0;
				var bad = (128 - 1 - 2 - 32) << 4; // 4_ : 1D : 1L : 3D : 1L : 1D : 4x
				var badmask1 = 2048 - 1; // 4_ : 1D : 1L : 3D : 1L : 1D : 4L
				var badmask2 = badmask1 << 4; // 4L : 1D : 1L : 3D : 1L : 1D : 4_
				var patmask = 32768 - 1; // 4  +           7            + 4
				var i;
				for (i = 0; i < qr.n_modules - 1; i++) {
					var pat = [0, 0];
					var j;
					for (j = 0; j < qr.n_modules - 1; j++) {
						var rc;
						for (rc = 0; rc <= 1; rc++) {
							pat[rc] = (pat[rc] << 1) & patmask;
							if (qr.pixels[rc * i + (1 - rc) * j][(1 - rc) * i + rc * j]) {
								pat[rc]++;
							}
							if (qr.debug_insane) {
								qr.logger.debug(
									"PENALTY p=" + p +
									" x=" + (rc * i + (1 - rc) * j) +
									" y=" + ((1 - rc) * i + rc * j) +
									" pat=" + binFormat(pat[rc]) +
									" b1=" + binFormat(pat[rc] & badmask1) +
									" p2=" + binFormat(pat[rc] & badmask2) +
									" bad=" + binFormat(bad));
							}
							if (j >= 7 + 4) {
								if ((pat[rc] & badmask1) === bad) {
									p += 40;
								} else {
									if (j < qr.n_modules - 4 - 7) {
										if ((pat[rc] & badmask2) === bad) {
											p += 40;
										}
									}
								}
							}
						}
					}
				}
				return p;
			}

			/* ************************************************************ */
			function penaltyDark(qr) {
				var dark = 0;
				var i;
				for (i = 0; i < qr.n_modules - 1; i++) {
					var j;
					for (j = 0; j < qr.n_modules - 1; j++) {
						if (qr.pixels[i][j]) {
							dark++;
						}
					}
				}
				return 10 * Math.floor(Math.abs(dark / (qr.n_modules * qr.n_modules) - 0.5) / 0.05);
			}

			/* ************************************************************ */
			/* calculatePenalty
			 */

			var p_adjacent = penaltyAdjacent(this);
			var p_blocks = penaltyBlocks(this);
			var p_darkLight = penaltyDarkLight(this);
			var p_dark = penaltyDark(this);
			var p_total = p_adjacent + p_blocks + p_darkLight + p_dark;

			if (this.debug_encodeBestMask) {
				if (this.logger) {
					this.logger.debug("mask=" + mask + " penalty=" + p_total + " (" + p_adjacent + ", " + p_blocks + ", " + p_darkLight + ", " + p_dark + ")");
				}
			}

			return p_total;
		},


		/* ************************************************************ */
		encodeBestMask: function() {
			var best_mask = 0;
			var best_penalty = 999999;

			this.setFunctionalPattern();
			var mask;
			var i;
			var j;
			for (mask = 0; mask < 8; mask++) {
				for (i = 0; i < this.n_modules; i++) {
					for (j = 0; j < this.n_modules; j++) {
						this.pixels[i][j] = false;
					}
				}
				this.encodeFunctionalPatterns(mask);
				this.encodeData(mask);
				var penalty = this.calculatePenalty(mask);
				if (penalty < best_penalty) {
					best_penalty = penalty;
					best_mask = mask;
				}
			}

			if (this.debug_encodeBestMask) {
				if (this.logger) {
					this.logger.debug("best_mask=" + best_mask + " best_penalty=" + best_penalty);
				}
			}

			this.mask = best_mask;
			if (this.mask !== 7) {
				for (i = 0; i < this.n_modules; i++) {
					for (j = 0; j < this.n_modules; j++) {
						this.pixels[i][j] = false;
					}
				}
				this.encodeFunctionalPatterns(this.mask);
				this.encodeData(this.mask);
			}
		},


		/* ************************************************************ */
		encodeFunctionalPatterns: function(mask) {

			function encodeFinderPattern(qr, x, y) {

				var i, j;

				// Outer 7x7 black boundary
				for (i = 0; i <= 5; i++) {
					qr.pixels[x + i][y] = true;
					qr.pixels[x + 6][y + i] = true;
					qr.pixels[x + 6 - i][y + 6] = true;
					qr.pixels[x][y + 6 - i] = true;
				}

				// Inner 3*3 black box
				for (i = 2; i <= 4; i++) {
					for (j = 2; j <= 4; j++) {
						qr.pixels[x + i][y + j] = true;
					}
				}
			}

			/* ************************************************************ */
			function encodeVersionTopright(qr) {
				var pattern = qr.version_info[qr.version];
				var y;
				for (y = 0; y < 6; y++) {
					var x;
					for (x = qr.n_modules - 11; x < qr.n_modules - 11 + 3; x++) {
						if (pattern & 1) {
							qr.pixels[x][y] = true;
						}
						pattern /= 2;
					}
				}
			}

			/* ************************************************************ */
			function encodeVersionBottomleft(qr) {
				var pattern = qr.version_info[qr.version];
				var x;
				for (x = 0; x < 6; x++) {
					var y;
					for (y = qr.n_modules - 11; y < qr.n_modules - 11 + 3; y++) {
						if (pattern & 1) {
							qr.pixels[x][y] = true;
						}
						pattern /= 2;
					}
				}
			}

			/* ************************************************************ */
			function encodeTimingPattern(qr, horizontal) {
				var i;
				for (i = 8; i < qr.n_modules - 8; i += 2) {
					if (horizontal) {
						qr.pixels[i][6] = true;
					} else {
						qr.pixels[6][i] = true;
					}
				}

			}

			/* ************************************************************ */
			function encodeOneAlignmentPattern(qr, x, y) {

				// Outer 5x5 black boundary
				var i;
				for (i = 0; i <= 3; i++) {
					qr.pixels[x + i][y] = true;
					qr.pixels[x + 4][y + i] = true;
					qr.pixels[x + 4 - i][y + 4] = true;
					qr.pixels[x][y + 4 - i] = true;
				}

				// center black
				qr.pixels[x + 2][y + 2] = true;
			}

			/* ************************************************************ */
			function encodeAlignmentPatterns(qr) {
				var n = qr.alignment_patterns[qr.version].length;
				var i;
				for (i = 0; i < n; i++) {
					var j;
					for (j = 0; j < n; j++) {
						if (((i === 0) && (j === 0)) || ((i === 0) && (j === n - 1)) || ((i === n - 1) && (j === 0))) {
							continue;
						}
						encodeOneAlignmentPattern(qr, qr.alignment_patterns[qr.version][i] - 2, qr.alignment_patterns[qr.version][j] - 2);
					}
				}
			}

			/* ************************************************************ */
			function encodeFormatNW(qr, code) {
				var x = 8;
				var y;
				for (y = 0; y <= 5; y++) {
					if (code & 1) {
						qr.pixels[x][y] = true;
					}
					code /= 2;
				}
				if (code & 1) {
					qr.pixels[8][7] = true;
				}
				code /= 2;
				if (code & 1) {
					qr.pixels[8][8] = true;
				}
				code /= 2;
				if (code & 1) {
					qr.pixels[7][8] = true;
				}
				code /= 2;

				y = 8;
				for (x = 5; x >= 0; x--) {
					if (code & 1) {
						qr.pixels[x][y] = true;
					}
					code /= 2;
				}
			}

			/* ************************************************************ */
			function encodeFormatNESW(qr, code) {
				var y = 8;
				var x;
				for (x = qr.n_modules - 1; x > qr.n_modules - 1 - 8; x--) {
					if (code & 1) {
						qr.pixels[x][y] = true;
					}
					code /= 2;
				}
				x = 8;
				for (y = qr.n_modules - 7; y < qr.n_modules - 1; y++) {
					if (code & 1) {
						qr.pixels[x][y] = true;
					}
					code /= 2;
				}
			}

			/* ************************************************************
			 * encodeFunctionalPatterns
			 */

			encodeFinderPattern(this, 0, 0);
			encodeFinderPattern(this, 0, this.n_modules - 7);
			encodeFinderPattern(this, this.n_modules - 7, 0);

			if (this.version >= 7) {
				encodeVersionTopright(this);
				encodeVersionBottomleft(this);
			}
			encodeTimingPattern(this, true);
			encodeTimingPattern(this, false);
			if (this.version > 1) {
				encodeAlignmentPatterns(this);
			}
			var code = this.format_info[mask + 8 * this.error_correction_level];
			encodeFormatNW(this, code);
			encodeFormatNESW(this, code);
		},


		/* ************************************************************ */
		encodeData: function(qrmask) {

			function setMasked(pixels, mask, j, i, f) {

				var m;
				switch (mask) {
					case 0:
						m = (i + j) % 2;
						break;
					case 1:
						m = i % 2;
						break;
					case 2:
						m = j % 3;
						break;
					case 3:
						m = (i + j) % 3;
						break;
					case 4:
						m = (Math.floor(i / 2) + Math.floor(j / 3)) % 2;
						break;
					case 5:
						m = (i * j) % 2 + (i * j) % 3;
						break;
					case 6:
						m = ((i * j) % 2 + (i * j) % 3) % 2;
						break;
					case 7:
						m = ((i + j) % 2 + (i * j) % 3) % 2;
						break;
				}
				if (m === 0) {
					pixels[j][i] = !f;
				} else {
					pixels[j][i] = f;
				}
			}

			/* ************************************************************ */
			/* encodeData
			 */

			var writingUp = true;
			var n = 0;
			var v = this.bytes[n];
			var bitsWritten = 0;
			var mask = (1 << 7);
			var j;

			// Write columns in pairs, from right to left
			for (j = this.n_modules - 1; j > 0; j -= 2) {
				if (j === 6) {
					// Skip whole column with vertical alignment pattern;
					// saves time and makes the other code proceed more cleanly
					j--;
				}
				// Read alternatingly from bottom to top then top to bottom
				var count;
				for (count = 0; count < this.n_modules; count++) {
					var i = writingUp ? this.n_modules - 1 - count : count;
					var col;
					for (col = 0; col < 2; col++) {
						// Ignore bits covered by the function pattern
						if (!this.functional_pattern[j - col][i]) {
							setMasked(this.pixels, qrmask, j - col, i, v & mask);
							mask = (mask >>> 1);
							bitsWritten++;
							if (bitsWritten === 8) {
								bitsWritten = 0;
								mask = (1 << 7);
								n++;
								v = this.bytes[n];
							}
						}
					}
				}
				writingUp ^= true; // writingUp = !writingUp; // switch directions
			}

		},


		/* ************************************************************ */
		pixelsToImage: function() {
			var i, j;
			for (i = 0; i < this.n_modules; i++) {
				for (j = 0; j < this.n_modules; j++) {
					if (this.pixels[i][j]) {
						this.setDark(i, j);
					}
				}
			}
		},


		/* ************************************************************
		 * QRCodeDecode INTERNAL DECODING FUNCTIONS
		 * ************************************************************
		 */

		findImageBorders: function() {
			var i, j, n;
			var limit = 7;
			var skew_limit = 2;

			for (i = 0; i < this.image.width; i++) {
				n = 0;
				for (j = 0; j < this.image.height; j++) {
					n = n + this.image.isDark(i, j, 1);
				}
				if (n >= limit) {
					break;
				}
			}
			this.image_left = i;

			for (i = this.image.width - 1; i >= 0; i--) {
				n = 0;
				for (j = 0; j < this.image.height; j++) {
					n = n + this.image.isDark(i, j, 1);
				}
				if (n >= limit) {
					break;
				}
			}
			this.image_right = i;

			for (j = 0; j < this.image.height; j++) {
				n = 0;
				for (i = 0; i < this.image.width; i++) {
					n = n + this.image.isDark(i, j, 1);
				}
				if (n >= limit) {
					break;
				}
			}
			this.image_top = j;

			for (j = this.image.height - 1; j >= 0; j--) {
				n = 0;
				for (i = 0; i < this.image.width; i++) {
					n = n + this.image.isDark(i, j, 1);
				}
				if (n >= limit) {
					break;
				}
			}
			this.image_bottom = j;

			if (this.logger) {
				this.logger.debug("left=" + this.image_left + " right=" + this.image_right + " top=" + this.image_top + " bottom=" + this.image_bottom);
			}

			if ((this.image_right - this.image_left + 1 < 21) || (this.image_bottom - this.image_top + 1 < 21)) {
				throw ("Found no image data to decode");
			}

			if (Math.abs((this.image_right - this.image_left) - (this.image_bottom - this.image_top)) > skew_limit) {
				throw ("Image data is not rectangular");
			}

			this.image_size = ((this.image_right - this.image_left + 1) + (this.image_bottom - this.image_top + 1)) / 2.0;
			if (this.logger) {
				this.logger.debug("size=" + this.image_size);
			}
		},


		/* ************************************************************ */
		findModuleSize: function() {

			/* returns number of matches found
			 * perferct is 8*8 = 64
			 */
			function matchFinderPattern(qr, x, y, quiet_x, quiet_y, module_size) {
				var i, j;
				var n = 0;

				// Outer 7x7 black boundary
				for (i = 0; i <= 5; i++) {
					if (qr.isDarkWithSize(x + i, y, module_size)) {
						n = n + 1;
					}
					if (qr.isDarkWithSize(x + 6, y + i, module_size)) {
						n = n + 1;
					}
					if (qr.isDarkWithSize(x + 6 - i, y + 6, module_size)) {
						n = n + 1;
					}
					if (qr.isDarkWithSize(x, y + 6 - i, module_size)) {
						n = n + 1;
					}
				}

				// Intermediate 5*5 white
				for (i = 0; i <= 3; i++) {
					if (!qr.isDarkWithSize(x + i + 1, y + 1, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + 5, y + i + 1, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + 5 - i, y + 5, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + 1, y + 5 - i, module_size)) {
						n = n + 1;
					}
				}

				// Inner 3*3 black box
				for (i = 0; i <= 2; i++) {
					for (j = 0; j <= 2; j++) {
						if (qr.isDarkWithSize(3 + x, 3 + y, module_size)) {
							n = n + 1;
						}
					}
				}

				// quiet area 
				for (i = 0; i <= 6; i++) {
					if (!qr.isDarkWithSize(x + quiet_x, y + i, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + i, y + quiet_y, module_size)) {
						n = n + 1;
					}
				}

				// "bottom right" quiet area
				if (!qr.isDarkWithSize(x + quiet_x, y + quiet_y, module_size)) {
					n = n + 1;
				}

				return n;
			}


			/* ************************************************************ */
			function matchTimingPattern(qr, horizontal, n_modules, module_size) {
				var n = 0;
				var x0 = 6;
				var y0 = 8;
				var dx = 0;
				var dy = 1;
				if (horizontal) {
					x0 = 8;
					y0 = 6;
					dx = 1;
					dy = 0;
				}
				var consecutive = 5;
				var ok = [];
				var c;
				for (c = 0; c < consecutive; c++) {
					ok.push(1);
				}
				var black = true;
				var i;
				for (i = 0; i < n_modules - 8 - 8; i++) {
					var x = x0 + i * dx;
					var y = y0 + i * dy;
					//qr.logger.debug("matchTimingPattern x=" + x + " y=" + y);
					if (black === qr.isDarkWithSize(x, y, module_size)) {
						n++;
						ok.push(1);
					} else {
						ok.push(0);
					}
					black = !black;
					var last5 = 0;
					for (c = ok.length - consecutive; c < ok.length - 1; c++) {
						if (ok[c]) {
							last5 = last5 + 1;
						}
					}
					if (last5 < 3) {
						//if (qr.logger) qr.logger.debug("matchTimingPattern i=" + i + " no 3 correct in last 5");
						return 0;
					}
				}
				return n;
			}

			/* ************************************************************ */
			function matchOneAlignmentPattern(qr, x, y, module_size) {
				var n = 0;
				var i;

				// Outer 5x5 black boundary
				for (i = 0; i <= 3; i++) {
					if (qr.isDarkWithSize(x + i, y, module_size)) {
						n = n + 1;
					}
					if (qr.isDarkWithSize(x + 4, y + i, module_size)) {
						n = n + 1;
					}
					if (qr.isDarkWithSize(x + 4 - i, y + 4, module_size)) {
						n = n + 1;
					}
					if (qr.isDarkWithSize(x, y + 4 - i, module_size)) {
						n = n + 1;
					}
				}

				// Intermediate 3*3 white
				for (i = 0; i <= 1; i++) {
					if (!qr.isDarkWithSize(x + i + 1, y + 1, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + 3, y + i + 1, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + 3 - i, y + 3, module_size)) {
						n = n + 1;
					}
					if (!qr.isDarkWithSize(x + 1, y + 3 - i, module_size)) {
						n = n + 1;
					}
				}

				// center black
				if (qr.isDarkWithSize(x + 2, y + 2, module_size)) {
					n = n + 1;
				}

				return n;
			}

			/* ************************************************************ */
			function matchAlignmentPatterns(qr, version, module_size) {
				var a = 0;
				var n = qr.alignment_patterns[version].length;
				var i, j;
				for (i = 0; i < n; i++) {
					for (j = 0; j < n; j++) {
						if (((i === 0) && (j === 0)) || ((i === 0) && (j === n - 1)) || ((i === n - 1) && (j === 0))) {
							continue;
						}
						var na = matchOneAlignmentPattern(qr, qr.alignment_patterns[version][i] - 2, qr.alignment_patterns[version][j] - 2, module_size);
						if (na > 24) {
							a++;
						}
					}
				}
				return a;
			}

			/* ************************************************************ */
			function matchVersionCode(qr, pattern) {
				var v;
				for (v = 7; v <= 40; v++) {
					var hd = qr.hammingDistance(pattern, qr.version_info[v]);
					if (hd <= 3) {
						return [v, hd];
					}
				}
				return [0, 4];
			}

			/* ************************************************************ */
			function matchVersionTopright(qr, n_modules, module_size) {
				var factor = 1;
				var pattern = 0;
				var x, y;
				for (y = 0; y < 6; y++) {
					for (x = n_modules - 11; x < n_modules - 11 + 3; x++) {
						if (qr.isDarkWithSize(x, y, module_size)) {
							pattern += factor;
						}
						factor *= 2;
					}
				}
				return matchVersionCode(qr, pattern);
			}

			/* ************************************************************ */
			function matchVersionBottomleft(qr, n_modules, module_size) {
				var factor = 1;
				var pattern = 0;
				var x, y;
				for (x = 0; x < 6; x++) {
					for (y = n_modules - 11; y < n_modules - 11 + 3; y++) {
						if (qr.isDarkWithSize(x, y, module_size)) {
							pattern += factor;
						}
						factor *= 2;
					}
				}
				return matchVersionCode(qr, pattern);
			}

			/* ************************************************************ */
			function matchFormatCode(qr, pattern) {
				var f;
				for (f = 0; f < 32; f++) {
					var hd = qr.hammingDistance(pattern, qr.format_info[f]);
					if (hd <= 3) {
						return [f, hd];
					}
				}
				return [0, 4];
			}

			/* ************************************************************ */
			function matchFormatNW(qr, n_modules, module_size) {
				var factor = 1;
				var pattern = 0;
				var x = 8;
				var y;
				for (y = 0; y <= 5; y++) {
					if (qr.isDarkWithSize(x, y, module_size)) {
						pattern += factor;
					}
					factor *= 2;
				}
				if (qr.isDarkWithSize(8, 7, module_size)) {
					pattern += factor;
				}
				factor *= 2;
				if (qr.isDarkWithSize(8, 8, module_size)) {
					pattern += factor;
				}
				factor *= 2;
				if (qr.isDarkWithSize(7, 8, module_size)) {
					pattern += factor;
				}
				factor *= 2;
				y = 8;
				for (x = 5; x >= 0; x--) {
					if (qr.isDarkWithSize(x, y, module_size)) {
						pattern += factor;
					}
					factor *= 2;
				}
				return matchFormatCode(qr, pattern);
			}

			/* ************************************************************ */
			function matchFormatNESW(qr, n_modules, module_size) {
				var factor = 1;
				var pattern = 0;
				var x;
				var y = 8;
				for (x = n_modules - 1; x > n_modules - 1 - 8; x--) {
					if (qr.isDarkWithSize(x, y, module_size)) {
						pattern += factor;
					}
					factor *= 2;
				}
				x = 8;
				for (y = n_modules - 7; y < n_modules - 1; y++) {
					if (qr.isDarkWithSize(x, y, module_size)) {
						pattern += factor;
					}
					factor *= 2;
				}
				return matchFormatCode(qr, pattern);
			}

			/* ************************************************************ */
			function grade_finder_patterns(finder_pattern) {
				var g = 4;
				var i;
				for (i = 0; i < 3; i++) {
					g = g - (64 - finder_pattern[i]);
				}
				if (g < 0) {
					g = 0;
				}
				return g;
			}

			/* ************************************************************ */
			function grade_timing_patterns(timing_pattern, n) {
				var t = (timing_pattern[0] + timing_pattern[1]) / (2 * n);
				t = 1 - t;
				if (t >= 0.14) {
					return 0;
				}
				if (t >= 0.11) {
					return 1;
				}
				if (t >= 0.07) {
					return 2;
				}
				if (t >= 0.00001) {
					return 3;
				}
				return 4;
			}

			/* ************************************************************ */
			function grade_alignment_patterns(alignment_patterns, n) {
				var a = alignment_patterns / n;
				a = 1 - a;
				if (a >= 0.30) {
					return 0;
				}
				if (a >= 0.20) {
					return 1;
				}
				if (a >= 0.10) {
					return 2;
				}
				if (a >= 0.00001) {
					return 3;
				}
				return 4;
			}

			/* ************************************************************ */
			function matchVersion(qr, version) {
				var g;
				var grades = [];
				var n_modules = qr.nModulesFromVersion(version);
				var module_size = qr.image_size / n_modules;
				var finder_pattern = [0, 0, 0];
				finder_pattern[0] = matchFinderPattern(qr, 0, 0, 7, 7, module_size);
				if (finder_pattern[0] < 64 - 3) {
					return [version, 0]; // performance hack!
				}
				finder_pattern[1] = matchFinderPattern(qr, 0, n_modules - 7, 7, -1, module_size);
				if (finder_pattern[0] + finder_pattern[1] < 64 + 64 - 3) {
					return [version, 0]; // performance hack!
				}
				finder_pattern[2] = matchFinderPattern(qr, n_modules - 7, 0, -1, 7, module_size);
				if (qr.debug_findModuleSize) {
					if (qr.logger) {
						qr.logger.debug("matchVersion version=" + version +
							" finder0=" + finder_pattern[0] +
							" finder1=" + finder_pattern[1] +
							" finder2=" + finder_pattern[2]);
					}
				}

				g = grade_finder_patterns(finder_pattern);
				if (g < 1) {
					return [version, 0];
				} else {
					grades.push(g);
				}

				var version_topright = [0, 0];
				var version_bottomleft = [0, 0];
				if (version >= 7) {
					version_topright = matchVersionTopright(qr, n_modules, module_size);
					version_bottomleft = matchVersionBottomleft(qr, n_modules, module_size);

					if (qr.debug_findModuleSize) {
						if (qr.logger) {
							qr.logger.debug("matchVersion version=" + version +
								" version topright = " + version_topright[0] + " " + version_topright[1] +
								" version bottomleft = " + version_bottomleft[0] + " " + version_bottomleft[1]);
						}
					}

					var v1 = version;
					if (version_topright[1] < version_bottomleft[1]) {
						if (version_topright[1] < 4) {
							v1 = version_topright[0];
						}
					} else {
						if (version_bottomleft[1] < 4) {
							v1 = version_bottomleft[0];
						}
					}

					if (Math.abs(v1 - version) > 2) {
						if (qr.debug_findModuleSize) {
							if (qr.logger) {
								qr.logger.debug("matchVersion: format info " + v1 + " is very different from original version info " + version);
							}
						}
					}
					if (v1 !== version) {
						if (qr.debug_findModuleSize) {
							if (qr.logger) {
								qr.logger.debug("matchVersion: revising version to " + v1 + " from " + version);
							}
						}
						version = v1;
					}
					n_modules = qr.nModulesFromVersion(version);
					module_size = qr.image_size / n_modules;

					g = Math.round(((4 - version_topright[1]) + (4 - version_bottomleft[1])) / 2);
					if (g < 1) {
						return [version, 0];
					} else {
						grades.push(g);
					}
				}

				var timing_pattern = [0, 0];
				timing_pattern[0] = matchTimingPattern(qr, true, n_modules, module_size);
				timing_pattern[1] = matchTimingPattern(qr, false, n_modules, module_size);

				g = grade_timing_patterns(timing_pattern, n_modules - 8 - 8);
				if (g < 1) {
					return [version, 0];
				} else {
					grades.push(g);
				}

				var alignment_patterns = -3;
				if (version > 1) {
					alignment_patterns = matchAlignmentPatterns(qr, version, module_size);
				}

				if (qr.debug_findModuleSize) {
					if (qr.logger) {
						var fraction_alignment_patterns = 1;
						if (version > 1) {
							fraction_alignment_patterns = alignment_patterns /
								(qr.alignment_patterns[version].length * qr.alignment_patterns[version].length - 3);
						}
						qr.logger.debug("matchVersion version=" + version +
							" timing0=" + (timing_pattern[0] / (n_modules - 8 - 8)) +
							" timing1=" + (timing_pattern[1] / (n_modules - 8 - 8)) +
							" alignment=" + fraction_alignment_patterns);

					}
				}

				g = grade_alignment_patterns(alignment_patterns, qr.alignment_patterns[version].length * qr.alignment_patterns[version].length - 3);
				if (g < 1) {
					return [version, 0];
				} else {
					grades.push(g);
				}

				var format_NW = matchFormatNW(qr, n_modules, module_size);
				var format_NESW = matchFormatNESW(qr, n_modules, module_size);

				var format = 0;
				if (format_NW[1] < format_NESW[1]) {
					format = format_NW[0];
				} else {
					format = format_NESW[0];
				}

				var error_correction_level = Math.floor(format / 8);
				var mask = format % 8;

				if (qr.debug_findModuleSize) {
					if (qr.logger) {
						qr.logger.debug("matchVersion version=" + version +
							" format_NW =" + format_NW[0] + " " + format_NW[1] +
							" format_NESW =" + format_NESW[0] + " " + format_NESW[1] +
							" format = " + format +
							" ecl = " + error_correction_level +
							" mask = " + mask);
					}
				}

				g = Math.round(((4 - format_NW[1]) + (4 - format_NESW[1])) / 2);
				if (g < 1) {
					return [version, 0];
				} else {
					grades.push(g);
				}

				var grade = 4;
				var i;
				for (i = 0; i < grades.length; i++) {
					if (grades[i] < grade) {
						grade = grades[i];
					}
				}

				if (qr.debug_findModuleSize) {
					if (qr.logger) {
						var s = "";
						for (i = 0; i < grades.length; i++) {
							s = s + grades[i];
						}
						s = s + "->" + "<b>" + grade + "</b>";
						qr.logger.debug("matchVersion version=" + "<b>" + version + "</b>" + " grades(F(V)TAF): " + s);
					}
				}
				return [version, grade, error_correction_level, mask];
			}


			/* **************************************************
			 * findModuleSize 
			 */

			var best_match_so_far = [0, 0];
			var version;
			for (version = 1; version <= this.max_version; version++) {
				var match = matchVersion(this, version);
				if (match[1] > best_match_so_far[1]) {
					best_match_so_far = match;
				}
				if (match[1] === 4) {
					break;
				}
			}

			this.version = best_match_so_far[0];
			this.n_modules = this.nModulesFromVersion(this.version);
			this.module_size = this.image_size / this.n_modules;
			this.functional_grade = best_match_so_far[1];
			this.error_correction_level = best_match_so_far[2];
			this.mask = best_match_so_far[3];

			if (this.logger) {
				this.logger.debug(
					"findModuleSize<b>" +
					" version=" + this.version +
					" grade=" + this.functional_grade +
					" error_correction_level=" + this.error_correction_level +
					" mask=" + this.mask +
					"</b>");
			}

			if (this.functional_grade < 1) {
				throw ("Unable to decode a function pattern");
			}
		},


		/* ************************************************************ */
		extractCodewords: function() {

			function getUnmasked(qr, j, i) {

				var m;
				switch (qr.mask) {
					case 0:
						m = (i + j) % 2;
						break;
					case 1:
						m = i % 2;
						break;
					case 2:
						m = j % 3;
						break;
					case 3:
						m = (i + j) % 3;
						break;
					case 4:
						m = (Math.floor(i / 2) + Math.floor(j / 3)) % 2;
						break;
					case 5:
						m = (i * j) % 2 + (i * j) % 3;
						break;
					case 6:
						m = ((i * j) % 2 + (i * j) % 3) % 2;
						break;
					case 7:
						m = ((i + j) % 2 + (i * j) % 3) % 2;
						break;
				}

				var u;
				if (m === 0) {
					u = !qr.isDark(j, i);
				} else {
					u = qr.isDark(j, i);
				}
				if (qr.debug_insane) {
					if (qr.logger) {
						qr.logger.debug("getUnmasked i=" + i + " j=" + j + " m=" + m + " u=" + u);
					}
				}
				return u;
			}

			/* ************************************************************ */
			/* extractCodewords
			 */

			/*	Original Java version by Sean Owen
				Copyright 2007 ZXing authors
			*/

			this.codewords = [];
			var readingUp = true;
			var currentByte = 0;
			var factor = 128;
			var bitsRead = 0;
			var i, j, col, count;
			// Read columns in pairs, from right to left
			for (j = this.n_modules - 1; j > 0; j -= 2) {
				if (j === 6) {
					// Skip whole column with vertical alignment pattern;
					// saves time and makes the other code proceed more cleanly
					j--;
				}
				// Read alternatingly from bottom to top then top to bottom
				for (count = 0; count < this.n_modules; count++) {
					i = readingUp ? this.n_modules - 1 - count : count;
					for (col = 0; col < 2; col++) {
						// Ignore bits covered by the function pattern
						if (!this.functional_pattern[j - col][i]) {
							// Read a bit
							if (getUnmasked(this, j - col, i)) {
								currentByte += factor;
							}
							factor /= 2;
							// If we've made a whole byte, save it off
							if (factor < 1) {
								//if (this.logger) this.logger.debug("getUnmasked byte[" + this.codewords.length + "]=" + currentByte);
								this.codewords.push(currentByte);
								bitsRead = 0;
								factor = 128;
								currentByte = 0;
							}
						}
					}
				}
				readingUp ^= true; // readingUp = !readingUp; // switch directions
			}

			if (this.debug_extractCodewords) {
				if (this.logger) {
					this.logger.debug("getCodewords mask=" + this.mask + " length=" + this.codewords.length);
					this.logger.debug("getCodewords = " + this.codewords.join(","));
				}
			}

		},


		/* ************************************************************ */
		extractData: function() {

			var n_bits;

			function extract(qr, bytes, pos, len) {
				// http://stackoverflow.com/questions/3846711/extract-bit-sequences-of-arbitrary-length-from-byte-array-efficiently
				var shift = 24 - (pos & 7) - len;
				var mask = (1 << len) - 1;
				var byteIndex = pos >>> 3;

				return (((bytes[byteIndex] << 16) |
					(bytes[++byteIndex] << 8) |
					bytes[++byteIndex]
				) >> shift) & mask;
			}

			/* ************************************************************ */
			function extract8bit(qr, bytes) {

				var n_count_bits = qr.nCountBits(qr.MODE.EightBit, qr.version);

				var n = extract(qr, bytes, qr.bit_idx, n_count_bits);
				qr.bit_idx += n_count_bits;

				if (qr.debug_extractData) {
					if (qr.logger) {
						qr.logger.debug("extract charcount = " + n);
					}
				}

				var data = "";
				var i;
				for (i = 0; i < n; i++) {
					data += String.fromCharCode(extract(qr, bytes, qr.bit_idx, 8));
					qr.bit_idx += 8;
				}
				return data;
			}

			/* ************************************************************ */
			function extractAlphanum(qr, bytes) {
				var n_count_bits = qr.nCountBits(qr.MODE.AlphaNumeric, qr.version);
				var n = extract(qr, bytes, qr.bit_idx, n_count_bits);
				qr.bit_idx += n_count_bits;

				if (qr.debug_extractData) {
					if (qr.logger) {
						qr.logger.debug("extractAlphanum charcount = " + n);
					}
				}

				var data = "";
				var i;
				for (i = 0; i < Math.floor(n / 2); i++) {
					var x = extract(qr, bytes, qr.bit_idx, 11);
					data += qr.alphanum[Math.floor(x / 45)];
					data += qr.alphanum[x % 45];
					qr.bit_idx += 11;
				}
				if (n % 2) {
					data += qr.alphanum[extract(qr, bytes, qr.bit_idx, 6)];
					qr.bit_idx += 6;
				}
				return data;
			}


			/* ************************************************************ */
			function extractNumeric(qr, bytes) {
				var n_count_bits = qr.nCountBits(qr.MODE.Numeric, qr.version);
				var n = extract(qr, bytes, qr.bit_idx, n_count_bits);
				qr.bit_idx += n_count_bits;

				if (qr.debug_extractData) {
					if (qr.logger) {
						qr.logger.debug("extractNumeric charcount = " + n);
					}
				}

				var data = "";
				var x, c1, c2, c3;
				var i;
				for (i = 0; i < Math.floor(n / 3); i++) {
					x = extract(qr, bytes, qr.bit_idx, 10);
					qr.bit_idx += 10;
					c1 = Math.floor(x / 100);
					c2 = Math.floor((x % 100) / 10);
					c3 = x % 10;
					data += String.fromCharCode(48 + c1, 48 + c2, 48 + c3);
				}

				if (n % 3 === 1) {
					x = extract(qr, bytes, qr.bit_idx, 4);
					qr.bit_idx += 4;
					data += String.fromCharCode(48 + x);
				} else if (n % 3 === 2) {
					x = extract(qr, bytes, qr.bit_idx, 7);
					qr.bit_idx += 7;
					c1 = Math.floor(x / 10);
					c2 = x % 10;
					data += String.fromCharCode(48 + c1, 48 + c2);
				}
				return data;
			}

			/* **************************************************
			 * extractData 
			 */

			var bytes = this.bytes;
			n_bits = bytes.length * 8;

			if (this.debug_extractData) {
				if (this.logger) {
					this.logger.debug("extractData bytes in (" + bytes.length + ") = " + bytes.join(","));
				}
			}

			var i;
			for (i = 0; i < 4; i++) {
				bytes.push(0);
			}

			this.data = "";
			this.bit_idx = 0;

			while (this.bit_idx < n_bits - 4) {
				var mode = extract(this, bytes, this.bit_idx, 4);
				this.bit_idx += 4;
				if (this.debug_extractData) {
					if (this.logger) {
						this.logger.debug("extractData mode = " + mode);
					}
				}

				if (mode === this.MODE.Terminator) {
					break;
				} else if (mode === this.MODE.AlphaNumeric) {
					this.data += extractAlphanum(this, bytes);
				} else if (mode === this.MODE.EightBit) {
					this.data += extract8bit(this, bytes);
				} else if (mode === this.MODE.Numeric) {
					this.data += extractNumeric(this, bytes);
				} else {
					throw ("Unsupported ECI mode: " + mode);
				}
			}

			if (this.debug_extractData) {
				if (this.logger) {
					var b = [];
					for (i = 0; i < this.data.length; i++) {
						b.push(this.data[i].charCodeAt());
					}
					this.logger.debug("extractData data(" + b.length + ") = " + b.join(","));
				}
			}

		},

		/* ************************************************************ */
		correctErrors: function() {

			var rs = new ReedSolomon(this.n_block_ec_words);
			if (this.debug_correctErrors) {
				rs.logger = this.logger;
			}

			var errors = [];
			var bytes = [];
			var error_grade = 4;

			var b;
			for (b = 0; b < this.block_indices.length; b++) {
				var bytes_in = [];
				var i;
				for (i = 0; i < this.block_indices[b].length; i++) {
					bytes_in.push(this.codewords[this.block_indices[b][i]]);
				}
				var bytes_out = rs.decode(bytes_in);
				if (this.debug_correctErrors) {
					if (this.logger) {
						this.logger.debug("correctErrors in  = " + bytes_in.join(","));
						this.logger.debug("correctErrors out = " + bytes_out.join(","));
					}
				}
				if (!rs.corrected) {
					this.error_grade = 0;
					throw ("Unable to correct errors (" + rs.uncorrected_reason + ")");
				}
				bytes = bytes.concat(bytes_out);
				errors.push(rs.n_errors);
			}
			this.errors = errors;
			this.bytes = bytes;
			this.error_grade = this.gradeErrors(errors);
			if (this.logger) {
				this.logger.debug("error_grade=" + error_grade);
			}

		},


		/* ************************************************************ */
		gradeErrors: function(errors) {
			var ecw = this.n_block_ec_words;

			var max = 0;
			var i;
			for (i = 0; i < errors.length; i++) {
				if (errors[i] > max) {
					max = errors[i];
				}
			}

			var grade = 4;
			if (max > ecw / 2 - 1) {
				grade = 0;
			} else if (max > ecw / 2 - 2) {
				grade = 1;
			} else if (max > ecw / 2 - 3) {
				grade = 2;
			} else if (max > ecw / 2 - 4) {
				grade = 3;
			}

			return grade;
		},


		/* ************************************************************
		 * QRCodeDecode INTERNAL ENCODING / DECODING HELPER FUNCTIONS
		 * ************************************************************
		 */

		getDataCapacity: function(version, error_correction_level, mode) {

			var n_codewords = this.n_codewords[version];
			var n_ec_codewords = this.n_ec_codewords[version][error_correction_level];
			var n_data_codewords = n_codewords - n_ec_codewords;

			var bits = 8 * n_data_codewords;
			bits -= 4; // mode
			bits -= this.nCountBits(mode, version);

			var cap = 0;
			if (mode === this.MODE.AlphaNumeric) {
				cap = Math.floor(bits / 11) * 2;
				if (bits >= (cap / 2) * 11 + 6) {
					cap++;
				}
			} else if (mode === this.MODE.EightBit) {
				cap = Math.floor(bits / 8);
			} else if (mode === this.MODE.Numeric) {
				cap = Math.floor(bits / 10) * 3;
				if (bits >= (cap / 3) * 10 + 4) {
					if (bits >= (cap / 3) * 10 + 7) {
						cap++;
					}
					cap++;
				}
			} else {
				throw ("Unsupported ECI mode: " + mode);
			}
			return cap;

		},


		/* ************************************************************ */
		getVersionFromLength: function(error_correction_level, mode, length) {
			var v;
			for (v = 1; v <= 40; v++) {
				if (this.getDataCapacity(v, error_correction_level, mode) >= length) {
					return v;
				}
			}
			throw ("Text is too long, even for a version 40 QR Code");
		},


		/* ************************************************************ */
		setBlocks: function() {

			var n_codewords = this.n_codewords[this.version];
			var n_ec_codewords = this.n_ec_codewords[this.version][this.error_correction_level];
			this.n_data_codewords = n_codewords - n_ec_codewords;
			var ec_blocks = this.ec_blocks[this.version][this.error_correction_level];

			var n_blocks;
			var n_blocks_first;
			var n_blocks_second;
			var n_block_words_first;
			var n_block_words_second;

			var i, b;

			if (ec_blocks.length === 1) {
				n_blocks_first = ec_blocks[0];
				n_blocks_second = 0;
				n_blocks = n_blocks_first;
				n_block_words_first = this.n_data_codewords / n_blocks;
				n_block_words_second = 0;
			} else {
				n_blocks_first = ec_blocks[0];
				n_blocks_second = ec_blocks[1];
				n_blocks = n_blocks_first + n_blocks_second;
				n_block_words_first = Math.floor(this.n_data_codewords / n_blocks);
				n_block_words_second = n_block_words_first + 1;
			}

			this.n_block_ec_words = n_ec_codewords / n_blocks;

			if (this.debug_setBlocks) {
				if (this.logger) {
					this.logger.debug("setBlocks" +
						" n_blocks_first=" + n_blocks_first +
						" n_blocks_second=" + n_blocks_second +
						" n_blocks=" + n_blocks +
						" n_block_words_first=" + n_block_words_first +
						" n_block_words_second=" + n_block_words_second +
						" n_block_ec_words=" + this.n_block_ec_words +
						" total=" + (n_blocks_first * n_block_words_first + n_blocks_second * n_block_words_second + n_blocks * this.n_block_ec_words));
				}
			}

			this.block_data_lengths = [];
			for (b = 0; b < n_blocks_first; b++) {
				this.block_data_lengths[b] = n_block_words_first;
			}
			for (b = n_blocks_first; b < n_blocks; b++) {
				this.block_data_lengths[b] = n_block_words_second;
			}

			this.block_indices = [];
			for (b = 0; b < n_blocks; b++) {
				this.block_indices[b] = [];
			}

			var w = 0;

			for (i = 0; i < n_block_words_first; i++) {
				for (b = 0; b < n_blocks; b++) {
					this.block_indices[b].push(w);
					w++;
				}
			}

			for (b = n_blocks_first; b < n_blocks; b++) {
				this.block_indices[b].push(w);
				w++;
			}

			for (i = 0; i < this.n_block_ec_words; i++) {
				for (b = 0; b < n_blocks; b++) {
					this.block_indices[b].push(w);
					w++;
				}
			}

			if (this.debug_setBlocks) {
				if (this.logger) {
					for (b = 0; b < n_blocks; b++) {
						this.logger.debug("setBlocks block " + b + " (" + this.block_indices[b].length + "): " + this.block_indices[b].join(","));
					}
				}
			}
		},


		/* ************************************************************ */
		setFunctionalPattern: function() {

			function markSquare(qr, x, y, w, h) {
				var i, j;
				for (i = x; i < x + w; i++) {
					for (j = y; j < y + h; j++) {
						qr.functional_pattern[i][j] = true;
					}
				}
			}

			/* ************************************************************ */
			function markAlignment(qr) {
				var n = qr.alignment_patterns[qr.version].length;
				var i, j;
				for (i = 0; i < n; i++) {
					for (j = 0; j < n; j++) {
						if (((i === 0) && (j === 0)) || ((i === 0) && (j === n - 1)) || ((i === n - 1) && (j === 0))) {
							continue;
						}

						markSquare(qr,
							qr.alignment_patterns[qr.version][i] - 2,
							qr.alignment_patterns[qr.version][j] - 2,
							5, 5);
					}
				}
			}


			/* **************************************************
			 * setFunctionalPattern
			 */

			this.functional_pattern = [];
			var x, y;
			for (x = 0; x < this.n_modules; x++) {
				this.functional_pattern[x] = [];
				for (y = 0; y < this.n_modules; y++) {
					this.functional_pattern[x][y] = false;
				}
			}

			// Finder and Format
			markSquare(this, 0, 0, 9, 9);
			markSquare(this, this.n_modules - 8, 0, 8, 9);
			markSquare(this, 0, this.n_modules - 8, 9, 8);

			// Timing
			markSquare(this, 8, 6, this.n_modules - 8 - 8, 1);
			markSquare(this, 6, 8, 1, this.n_modules - 8 - 8);

			// Alignment
			markAlignment(this);

			// Version
			if (this.version >= 7) {
				markSquare(this, 0, this.n_modules - 11, 6, 3);
				markSquare(this, this.n_modules - 11, 0, 3, 6);
			}

			if (this.debug_insane) {
				if (this.logger) {
					for (y = 0; y < this.n_modules; y++) {
						var s = "";
						for (x = 0; x < this.n_modules; x++) {
							s += this.functional_pattern[x][y] ? "X" : "O";
						}
						this.logger.debug(s);
					}
				}
			}
		},


		/* ************************************************************ */
		nCountBits: function(mode, version) {
			if (mode === this.MODE.EightBit) {
				if (version < 10) {
					return 8;
				} else {
					return 16;
				}
			} else if (mode === this.MODE.AlphaNumeric) {
				if (version < 10) {
					return 9;
				} else if (version < 27) {
					return 11;
				} else {
					return 13;
				}
			} else if (mode === this.MODE.Numeric) {
				if (version < 10) {
					return 10;
				} else if (version < 27) {
					return 12;
				} else {
					return 14;
				}
			}
			throw ("Internal error: Unknown mode: " + mode);
		},


		/* ************************************************************ */
		nModulesFromVersion: function(version) {
			return 17 + 4 * version;
		},


		/* ************************************************************ */
		hammingDistance: function(a, b) {

			function nBits(n) {
				var c;
				for (c = 0; n; c++) {
					n &= n - 1; // clear the least significant bit set
				}
				return c;
			}
			var d = a ^ b;
			return nBits(d);
		},


		/* ************************************************************
		 * QRCodeDecode IMAGE FUNCTIONS
		 * ************************************************************
		 */

		isDarkWithSize: function(x, y, module_size) {
			return this.image.isDark(Math.round(this.image_left + x * module_size), Math.round(this.image_top + y * module_size), Math.round(module_size));
		},


		/* ************************************************************ */
		isDark: function(x, y) {
			return this.isDarkWithSize(x, y, this.module_size);

		},


		/* ************************************************************ */
		setDark: function(x, y) {
			this.image.setDark(this.image_left + x * this.module_size, this.image_top + y * this.module_size, this.module_size);

		},


		/* ************************************************************
		 * QRCodeDecode CONSTANTS
		 * ************************************************************
		 */

		alignment_patterns: [
			null, [],
			[6, 18],
			[6, 22],
			[6, 26],
			[6, 30],
			[6, 34],
			[6, 22, 38],
			[6, 24, 42],
			[6, 26, 46],
			[6, 28, 50],
			[6, 30, 54],
			[6, 32, 58],
			[6, 34, 62],
			[6, 26, 46, 66],
			[6, 26, 48, 70],
			[6, 26, 50, 74],
			[6, 30, 54, 78],
			[6, 30, 56, 82],
			[6, 30, 58, 86],
			[6, 34, 62, 90],
			[6, 28, 50, 72, 94],
			[6, 26, 50, 74, 98],
			[6, 30, 54, 78, 102],
			[6, 28, 54, 80, 106],
			[6, 32, 58, 84, 110],
			[6, 30, 58, 86, 114],
			[6, 34, 62, 90, 118],
			[6, 26, 50, 74, 98, 122],
			[6, 30, 54, 78, 102, 126],
			[6, 26, 52, 78, 104, 130],
			[6, 30, 56, 82, 108, 134],
			[6, 34, 60, 86, 112, 138],
			[6, 30, 58, 86, 114, 142],
			[6, 34, 62, 90, 118, 146],
			[6, 30, 54, 78, 102, 126, 150],
			[6, 24, 50, 76, 102, 128, 154],
			[6, 28, 54, 80, 106, 132, 158],
			[6, 32, 58, 84, 110, 136, 162],
			[6, 26, 54, 82, 110, 138, 166],
			[6, 30, 58, 86, 114, 142, 170]
		],


		/* ************************************************************ */
		version_info: [
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			0x07C94,
			0x085BC,
			0x09A99,
			0x0A4D3,
			0x0BBF6,
			0x0C762,
			0x0D847,
			0x0E60D,
			0x0F928,
			0x10B78,
			0x1145D,
			0x12A17,
			0x13532,
			0x149A6,
			0x15683,
			0x168C9,
			0x177EC,
			0x18EC4,
			0x191E1,
			0x1AFAB,
			0x1B08E,
			0x1CC1A,
			0x1D33F,
			0x1ED75,
			0x1F250,
			0x209D5,
			0x216F0,
			0x228BA,
			0x2379F,
			0x24B0B,
			0x2542E,
			0x26A64,
			0x27541,
			0x28C69
		],


		/* ************************************************************ */
		format_info: [
			0x5412,
			0x5125,
			0x5E7C,
			0x5B4B,
			0x45F9,
			0x40CE,
			0x4F97,
			0x4AA0,
			0x77C4,
			0x72F3,
			0x7DAA,
			0x789D,
			0x662F,
			0x6318,
			0x6C41,
			0x6976,
			0x1689,
			0x13BE,
			0x1CE7,
			0x19D0,
			0x0762,
			0x0255,
			0x0D0C,
			0x083B,
			0x355F,
			0x3068,
			0x3F31,
			0x3A06,
			0x24B4,
			0x2183,
			0x2EDA,
			0x2BED
		],


		/* ************************************************************ */
		n_codewords: [
			0,
			26,
			44,
			70,
			100,
			134,
			172,
			196,
			242,
			292,
			346,
			404,
			466,
			532,
			581,
			655,
			733,
			815,
			901,
			991,
			1085,
			1156,
			1258,
			1364,
			1474,
			1588,
			1706,
			1828,
			1921,
			2051,
			2185,
			2323,
			2465,
			2611,
			2761,
			2876,
			3034,
			3196,
			3362,
			3532,
			3706
		],


		/* ************************************************************ */
		n_ec_codewords: [
			null, [10, 7, 17, 13],
			[16, 10, 28, 22],
			[26, 15, 44, 36],
			[36, 20, 64, 52],
			[48, 26, 88, 72],
			[64, 36, 112, 96],
			[72, 40, 130, 108],
			[88, 48, 156, 132],
			[110, 60, 192, 160],
			[130, 72, 224, 192],
			[150, 80, 264, 224],
			[176, 96, 308, 260],
			[198, 104, 352, 288],
			[216, 120, 384, 320],
			[240, 132, 432, 360],
			[280, 144, 480, 408],
			[308, 168, 532, 448],
			[338, 180, 588, 504],
			[364, 196, 650, 546],
			[416, 224, 700, 600],
			[442, 224, 750, 644],
			[476, 252, 816, 690],
			[504, 270, 900, 750],
			[560, 300, 960, 810],
			[588, 312, 1050, 870],
			[644, 336, 1110, 952],
			[700, 360, 1200, 1020],
			[728, 390, 1260, 1050],
			[784, 420, 1350, 1140],
			[812, 450, 1440, 1200],
			[868, 480, 1530, 1290],
			[924, 510, 1620, 1350],
			[980, 540, 1710, 1440],
			[1036, 570, 1800, 1530],
			[1064, 570, 1890, 1590],
			[1120, 600, 1980, 1680],
			[1204, 630, 2100, 1770],
			[1260, 660, 2220, 1860],
			[1316, 720, 2310, 1950],
			[1372, 750, 2430, 2040]
		],


		/* ************************************************************ */
		ec_blocks: [
			[],
			[
				[1],
				[1],
				[1],
				[1]
			],
			[
				[1],
				[1],
				[1],
				[1]
			],
			[
				[1],
				[1],
				[2],
				[2]
			],
			[
				[2],
				[1],
				[4],
				[2]
			],
			[
				[2],
				[1],
				[2, 2],
				[2, 2]
			],
			[
				[4],
				[2],
				[4],
				[4]
			],
			[
				[4],
				[2],
				[4, 1],
				[2, 4]
			],
			[
				[2, 2],
				[2],
				[4, 2],
				[4, 2]
			],
			[
				[3, 2],
				[2],
				[4, 4],
				[4, 4]
			],
			[
				[4, 1],
				[2, 2],
				[6, 2],
				[6, 2]
			],
			[
				[1, 4],
				[4],
				[3, 8],
				[4, 4]
			],
			[
				[6, 2],
				[2, 2],
				[7, 4],
				[4, 6]
			],
			[
				[8, 1],
				[4],
				[12, 4],
				[8, 4]
			],
			[
				[4, 5],
				[3, 1],
				[11, 5],
				[11, 5]
			],
			[
				[5, 5],
				[5, 1],
				[11, 7],
				[5, 7]
			],
			[
				[7, 3],
				[5, 1],
				[3, 13],
				[15, 2]
			],
			[
				[10, 1],
				[1, 5],
				[2, 17],
				[1, 15]
			],
			[
				[9, 4],
				[5, 1],
				[2, 19],
				[17, 1]
			],
			[
				[3, 11],
				[3, 4],
				[9, 16],
				[17, 4]
			],
			[
				[3, 13],
				[3, 5],
				[15, 10],
				[15, 5]
			],
			[
				[17],
				[4, 4],
				[19, 6],
				[17, 6]
			],
			[
				[17],
				[2, 7],
				[34],
				[7, 16]
			],
			[
				[4, 14],
				[4, 5],
				[16, 14],
				[11, 14]
			],
			[
				[6, 14],
				[6, 4],
				[30, 2],
				[11, 16]
			],
			[
				[8, 13],
				[8, 4],
				[22, 13],
				[7, 22]
			],
			[
				[19, 4],
				[10, 2],
				[33, 4],
				[28, 6]
			],
			[
				[22, 3],
				[8, 4],
				[12, 28],
				[8, 26]
			],
			[
				[3, 23],
				[3, 10],
				[11, 31],
				[4, 31]
			],
			[
				[21, 7],
				[7, 7],
				[19, 26],
				[1, 37]
			],
			[
				[19, 10],
				[5, 10],
				[23, 25],
				[15, 25]
			],
			[
				[2, 29],
				[13, 3],
				[23, 28],
				[42, 1]
			],
			[
				[10, 23],
				[17],
				[19, 35],
				[10, 35]
			],
			[
				[14, 21],
				[17, 1],
				[11, 46],
				[29, 19]
			],
			[
				[14, 23],
				[13, 6],
				[59, 1],
				[44, 7]
			],
			[
				[12, 26],
				[12, 7],
				[22, 41],
				[39, 14]
			],
			[
				[6, 34],
				[6, 14],
				[2, 64],
				[46, 10]
			],
			[
				[29, 14],
				[17, 4],
				[24, 46],
				[49, 10]
			],
			[
				[13, 32],
				[4, 18],
				[42, 32],
				[48, 14]
			],
			[
				[40, 7],
				[20, 4],
				[10, 67],
				[43, 22]
			],
			[
				[18, 31],
				[19, 6],
				[20, 61],
				[34, 34]
			]
		],


		/* ************************************************************ */
		n_remainder_bits: [
			null,
			0,
			7,
			7,
			7,
			7,
			7,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			4,
			4,
			4,
			4,
			4,
			4,
			4,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			0,
			0,
			0,
			0,
			0,
			0
		],

		/* ************************************************************ */
		alphanum: [
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
			' ',
			'$',
			'%',
			'*',
			'+',
			'-',
			'.',
			'/',
			':'
		],


		/* ************************************************************ */
		alphanum_rev: {
			'0': 0,
			'1': 1,
			'2': 2,
			'3': 3,
			'4': 4,
			'5': 5,
			'6': 6,
			'7': 7,
			'8': 8,
			'9': 9,
			'A': 10,
			'B': 11,
			'C': 12,
			'D': 13,
			'E': 14,
			'F': 15,
			'G': 16,
			'H': 17,
			'I': 18,
			'J': 19,
			'K': 20,
			'L': 21,
			'M': 22,
			'N': 23,
			'O': 24,
			'P': 25,
			'Q': 26,
			'R': 27,
			'S': 28,
			'T': 29,
			'U': 30,
			'V': 31,
			'W': 32,
			'X': 33,
			'Y': 34,
			'Z': 35,
			' ': 36,
			'$': 37,
			'%': 38,
			'*': 39,
			'+': 40,
			'-': 41,
			'.': 42,
			'/': 43,
			':': 44
		}
	};

	function log(str) {
		if (QrCreator.debug) Application.console.log("[QrCreator] " + Array.slice(arguments));
	}

	function alert(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService)
			.showAlertNotification("", aTitle || "QrCreator", aString, false, "", null);
	}

	function $(id) {
		return document.getElementById(id);
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	QrCreator.init(true);
	window.QrCreator = QrCreator;
})();