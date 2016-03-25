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

	grunt.registerTask("default", ["check", "generate", "execute"]);

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
		if(!grunt.option("columns")) {
			grunt.log.error("ERROR: Columns parameter missing!" ["red"]);
			return false;
		}
		if(/\d{2}/.test(grunt.option("columns"))) {
			if(!grunt.option("force")) {
				grunt.fail.warn("Did you miss a comma in?");
				return false;
			}
		}
	});

	grunt.registerTask("generate", function() {
		grunt.task.requires("check");

		$ = require("cheerio").load("", {xmlMode: true});

		var rows = grunt.option("columns").split(","),
			rowLen = rows.length,
			sizeOf = require("image-size"),
			$html = $("<html/>"),
			$head = $("<head/>"),
			$style = $("<style/>"),
			$body = $('<body style="width: 960px"/>'),
			link = '<link rel="stylesheet" href="../macy-base.css" type="text/css" />',
			jq = '<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.0.min.js"> </script>',
			styles = "body.NavAppHomePage #bd {width: 960px !important;border: none !important;line-height: 0px !important;}#globalContentContainer .row div {padding-right: 0;}",
			columns = [], isEven = [], imgNames = [], imgSizes = [], floaterSize = null, floaterName, i, j, k, $rowDiv, $innerDiv, $innerUl, $img;

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

		for(i = 0, k = 0; i < rowLen; i++) {
			columns[i] = parseInt(rows[i], 10);
inner:		for(j = 0; j < columns[i]; j++) {
				if(imgSizes[k + j].width % 60 !== 0) {
					break inner;
				}
			}
			isEven[i] = j === columns[i] ? true : false;
			k += columns[i];
		}

		for(i = 0, k = 0; i < rowLen; i++) {
			if(isEven[i]) {
				$rowDiv = $('<div class="row" data-row-type="row-' + (i + 1) + '-"/>');
				for(j = 0; j < columns[i]; j++, k++) {
					$innerDiv = $('<div class="small-' + (imgSizes[k].width / 60) + ' column"/>');
					$img = $("<img/>");
					$img.attr({
						"src" : "images/" + imgNames[k],
						"width" : imgSizes[k].width,
						"height" : imgSizes[k].height,
						"usemap" : "#" + folder + "_map" + k,
						"alt" : ""
					});
					$innerDiv.append($img);
					$rowDiv.append($innerDiv);
				}
			} else {
				$style.append(grunt.file.exists("assets/block_style.txt") ? grunt.file.read("assets/block_style.txt") : "");
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
						"alt" : ""
					});
					$innerUl.append("<li>" + $img + "</li>");
				}
			}
			$body.append($rowDiv);
		}
	});

	grunt.registerTask("execute", function() {
		grunt.task.requires("generate");
		grunt.file.write(folder + "/homepage.html", $.html());
		grunt.loadNpmTasks('grunt-prettify');
		grunt.task.run('prettify');
	});
};