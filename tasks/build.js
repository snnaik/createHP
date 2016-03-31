module.exports = function(grunt) {
	"use strict";

	grunt.registerTask("build", function() {
		this.requires("check");

		{ // variables
			var $;

			grunt.config.set("vars.$", ($ = grunt.config.get("vars.cheerio").load("")));

			var folder = grunt.config.get("vars.folder"),
				sizeOf = require("image-size"),
				$html = $("<html/>"),
				$head = $("<head/>"),
				$style = $("<style/>"),
				$body = $('<body style="width: 960px; margin: auto"/>'),
				strings = require("../assets/strings.js"),
				columns = [], isRowEven = [], imgNames = [], imgSizes = [], alts = [],
				floaterSize = null, floaterName,
				$rowDiv, $innerDiv, $innerUl, $img,
				i, j, k, l, sum = 0, row, rowLen, imgLen, temp, mapName, isExtraWide = false, isBlock = false;

			$.root().append($html);
			$html.append($head, $body);
			$head.append(strings.link, strings.jq, $style);
			$style.append(strings.styles);
		}

		{ // find images, get size and name
			grunt.file.recurse(folder + "/images", function(path, root, sub, name) {
				if(/(\.png|\.jpg|\.jpeg|\.gif)$/.test(name)) {
					if(/^floater./.test(name)) {
						floaterName = name;
						floaterSize = sizeOf(path);
					} else {
						imgNames.push(name);
						imgSizes.push(sizeOf(path));
					}
				}
			});
			imgLen = imgSizes.length;
		}

		// floater image code
		if(grunt.option("floater")) {
			$body.append(grunt.file.exists("assets/floater/html.txt") ? grunt.file.read("assets/floater/html.txt") : "");
			$style.append(grunt.file.exists("assets/floater/style.txt") ? grunt.file.read("assets/floater/style.txt") : "");
			$head.append(grunt.file.exists("assets/floater/script.txt") ? grunt.file.read("assets/floater/script.txt") : "");

			if(floaterSize === null) {
				grunt.log.writeln("Warning: Floating parameter set but no floater image found!" ["yellow"]);
			} else {
				$("#floatingImage").attr({
					"src" : "images/" + floaterName,
					"width" : floaterSize.width,
					"height" : floaterSize.height
				});
			}
		}

		{ // get rows and columns
			for(i = 0, j = 0, k = 1; i < imgLen; i++, k++) {
				sum += imgSizes[i].width;
				if(sum >= 960) {
					if(k > 1 && sum > 960) {
						temp = "";
						for(l = i - k + 1; l <= i; l++) temp += ", " + imgNames[l];
						grunt.log.writeln("One or more images not sliced correctly! [" + temp.substring(2) ["yellow"] + "]");
					}
					columns[j++] = k;
					sum = 0;
					k = 0;
				}
			}
			if(temp) return false;
			sum !== 0 && grunt.fatal("Last row does not fill the full width of the page!" + "\nAre you missing one or more images?\n" ["yellow"]);
			rowLen = columns.length;
		}

		// check what type of foundation class can be applied for each row : "row-column pair" or "block_grid"
		for(i = 0, k = 0; i < rowLen; i++) {
	inner:		for(j = 0; j < columns[i]; j++) {
				temp = imgSizes[k + j].width;
				if(temp > 960) {
					j++;
					break inner;
				} else if(temp % 60 !== 0) {
					break inner;
				}
			}
			isRowEven[i] = j === columns[i];
			k += columns[i];
		}

		// get excel data
		if(grunt.option("alt")) {
			var sheet = require("xlsx").readFile(folder + grunt.config.get("vars.files").altsheet).Sheets["Sheet1"];

			for(i = 0; i < imgLen; i++) {
				if(sheet["A" + (i + 1)] && sheet["B" + (i + 1)]) {
					alts[i] = imgNames[i] === sheet["A" + (i + 1)].v ? sheet["B" + (i + 1)].v : "";
				}
			}
		}

		{ // build html and apply foundation
			for(i = 0, k = 0; i < rowLen; i++) {
				row = 'data-row-num="row_' + (i + 1);
				if(isRowEven[i]) {
					// apply row-column classes
					$rowDiv = $('<div class="row" ' + row + '"/>');
					for(j = 0; j < columns[i]; j++, k++) {
						temp = imgSizes[k].width;
						mapName = folder + "_map" + (k + 1);
						$innerDiv = $('<div class="small-' + (temp <= 960 ? temp / 60 : 16) + ' column"/>');
						$img = $("<img/>");
						$img.attr({
							"src" : "images/" + imgNames[k],
							"width" : imgSizes[k].width,
							"height" : imgSizes[k].height,
							"usemap" : "#" + mapName,
							"alt" : alts[k] || ""
						});
						if(temp > 960) {
							$img.attr("class", "xtraWideImg");
							isExtraWide = true;
						}
						$innerDiv.append($img, '<map name="' + mapName + '" id="' + mapName + '" ' + row + '"/>');
						$rowDiv.append($innerDiv);
					}
				} else {
					// apply block_grid class
					isBlock = true;
					$rowDiv = $('<div class="row block_grid" ' + row + '"/>');
					$innerUl = $('<ul class="small-block-grid-' + columns[i] + '"/>');
					$rowDiv.append($innerUl);
					for(j = 0; j < columns[i]; j++, k++) {
						mapName = folder + "_map" + (k + 1);
						$img = $("<img/>");
						$img.attr({
							"src" : "images/" + imgNames[k],
							"width" : imgSizes[k].width,
							"height" : imgSizes[k].height,
							"usemap" : "#" + mapName,
							"alt" : alts[k] || ""
						});
						$innerUl.append('<li>' + $img + '<map name="' + mapName + '" id="' + mapName + '" ' + row + '"/></li>');
					}
				}
				$body.append($rowDiv);
			}
			isExtraWide && $style.append(strings.xtraWideCss);
			isBlock && $style.append(grunt.file.exists("assets/block_style.txt") ? grunt.file.read("assets/block_style.txt") : "");
		}
	});
};