module.exports = function(grunt) {
	"use strict";

	var folder, $;

	grunt.initConfig({
		prettify: {
			options: {
				"indent" : 1,
				"indent_char" : "	",
				"indent_scripts" : "normal",
				"brace_style": "collapse",
				"unformatted": []
			}
		}
	});

	grunt.registerTask("default", ["check", "build", "execute"]);

	grunt.registerTask("check", function() {
		if(!grunt.option("folder")) {
			grunt.log.error("ERROR: Folder parameter missing!" ["red"]);
			return false;
		} else {
			folder = grunt.option("folder").toString();
			grunt.config.set("prettify.one.src", folder + "/homepage.html");
			grunt.config.set("prettify.one.dest", folder + "/homepage.html");
		}
		if(!grunt.file.exists(folder)) {
			grunt.log.error("ERROR: Folder does not exist!" ["red"]);
			return false;
		}
		if(grunt.option("alt")) {
			if(!grunt.file.exists(folder + "/altsheet.xlsx")) {
				grunt.log.error("ERROR: 'alt' parameter set but no 'altsheet.xlsx' found!" ["red"]);
				return false;
			}
		}
	});

	grunt.registerTask("build", function() {
		grunt.task.requires("check");

		$ = require("cheerio").load("", {xmlMode: true});

		var sizeOf = require("image-size"),
			$html = $("<html/>"),
			$head = $("<head/>"),
			$style = $("<style/>"),
			$body = $('<body style="width: 960px; margin: auto"/>'),
			link = '<link rel="stylesheet" href="../macy-base.css" type="text/css" />',
			jq = '<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.0.min.js"> </script>',
			styles = "body.NavAppHomePage #bd {width: 960px !important;border: none !important;line-height: 0px !important;}#globalContentContainer .row div {padding-right: 0;}",
			columns = [], isRowEven = [], imgNames = [], imgSizes = [], alts = [],
			floaterSize = null, floaterName,
			$rowDiv, $innerDiv, $innerUl, $img,
			i, j, k, sum = 0, rowLen, imgLen, temp, isExtraWide = false, isBlock = false;

		$.root().append($html);
		$html.append($head, $body);
		$head.append(link, jq, $style);
		$style.append(styles);

		// find images, get size and name
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

		// floater image code
		if(grunt.option("floater")) {
			$body.append(grunt.file.exists("assets/floater/html.txt") ? grunt.file.read("assets/floater/html.txt") : "");
			$style.append(grunt.file.exists("assets/floater/style.txt") ? grunt.file.read("assets/floater/style.txt") : "");
			$head.append(grunt.file.exists("assets/floater/script.txt") ? grunt.file.read("assets/floater/script.txt") : "");

			if(floaterSize === null) {
				grunt.log.writeln("WARNING: Floating parameter set but no floater image found!" ["yellow"]);
			} else {
				$("#floatingImage").attr({
					"src" : "images/" + floaterName,
					"width" : floaterSize.width,
					"height" : floaterSize.height
				});
			}
		}

		// get rows and columns
		for(i = 0, j = 0, k = 1; i < imgLen; i++, k++) {
			sum += imgSizes[i].width;
			if(sum >= 960) {
				columns[j++] = k;
				sum = 0;
				k = 0;
			}
		}
		rowLen = columns.length;

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
			isRowEven[i] = j === columns[i] ? true : false;
			k += columns[i];
		}

		// get excel data
		if(grunt.option("alt")) {
			var sheet = require("xlsx").readFile(folder + "/altsheet.xlsx").Sheets["Sheet1"];

			for(i = 0; i < imgLen; i++) {
				if(imgNames[i] === sheet["A" + (i + 1)].v) {
					alts[i] = sheet["B" + (i + 1)].v;
				}
			}
		}

		// build html and apply foundation
		for(i = 0, k = 0; i < rowLen; i++) {
			if(isRowEven[i]) {
				// apply row-column classes
				$rowDiv = $('<div class="row" data-row-type="row-' + (i + 1) + '-"/>');
				for(j = 0; j < columns[i]; j++, k++) {
					temp = imgSizes[k].width;
					$innerDiv = $('<div class="small-' + (temp <= 960 ? temp / 60 : 16) + ' column"/>');
					$img = $("<img/>");
					$img.attr({
						"src" : "images/" + imgNames[k],
						"width" : imgSizes[k].width,
						"height" : imgSizes[k].height,
						"usemap" : "#" + folder + "_map" + k,
						"alt" : alts[k]
					});
					if(temp > 960) {
						$img.attr("class", "xtraWideImg");
						isExtraWide = true;
					}
					$innerDiv.append($img);
					$rowDiv.append($innerDiv);
				}
			} else {
				// apply block_grid class
				isBlock = true;
				$rowDiv = $('<div class="row collapse block_grid" data-row-type="row-' + (i + 1) + '-"/>');
				$innerUl = $('<ul class="small-block-grid-' + columns[i] + '"/>');
				$rowDiv.append($innerUl);
				for(j = 0; j < columns[i]; j++, k++) {
					$img = $("<img/>");
					$img.attr({
						"src" : "images/" + imgNames[k],
						"width" : imgSizes[k].width,
						"height" : imgSizes[k].height,
						"usemap" : "#" + folder + "_map" + k,
						"alt" : alts[k]
					});
					$innerUl.append("<li>" + $img + "</li>");
				}
			}
			$body.append($rowDiv);
		}
		if(isExtraWide) {
			$style.append(".xtraWideImg {max-width: none !important;margin-left: -50% !important;}");
		}
		if(isBlock) {
			$style.append(grunt.file.exists("assets/block_style.txt") ? grunt.file.read("assets/block_style.txt") : "");
		}
	});

	grunt.registerTask("execute", function() {
		grunt.task.requires("build");
		grunt.file.write(folder + "/homepage.html", $.html());
		grunt.loadNpmTasks('grunt-prettify');
		grunt.task.run('prettify');
	});
};