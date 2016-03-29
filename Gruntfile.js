module.exports = function(grunt) {
	"use strict";

	var cheerio = require("cheerio"), folder, $,
		files = {
			altsheet: "/altsheet.xlsx",
			hp1: "/hp_initial.html",
			hp2: "/hp_final.html"
		};

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

	grunt.registerTask("template", ["check", "build", "execute"]);
	grunt.registerTask("reformat", ["check", "update", "clean"]);

	grunt.registerTask("check", function() {
		!grunt.option("folder") ? grunt.fatal("Folder parameter missing!\n") : folder = grunt.option("folder").toString();
		!grunt.file.exists(folder) && grunt.fatal("Folder does not exist!\n");
		grunt.option("alt") && !grunt.file.exists(folder + files.altsheet) && grunt.fatal("'alt' parameter set but no 'altsheet.xlsx' found!\n");
	});

	grunt.registerTask("build", function() {
		this.requires("check");

		{ // variables
			$ = cheerio.load("");

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
				i, j, k, sum = 0, rowLen, imgLen, temp, mapName, isExtraWide = false, isBlock = false;

			$.root().append($html);
			$html.append($head, $body);
			$head.append(link, jq, $style);
			$style.append(styles);
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
				grunt.log.writeln("WARNING: Floating parameter set but no floater image found!" ["yellow"]);
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
						for(j = i - k + 1; j <= i; j++) temp += ", " + imgNames[j];
						grunt.log.writeln("One or more images not sliced correctly! [" + temp.substring(2) ["yellow"] + "]");
					}
					columns[j++] = k;
					sum = 0;
					k = 0;
				}
			}
			sum !== 0 && grunt.fatal("Last image does not fill the full width of the page!" + "\nAre you missing one or more images?\n" ["yellow"]);
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
			var sheet = require("xlsx").readFile(folder + files.altsheet).Sheets["Sheet1"];

			for(i = 0; i < imgLen; i++) alts[i] = imgNames[i] === sheet["A" + (i + 1)].v ? sheet["B" + (i + 1)].v : "";
		}

		{ // build html and apply foundation
			for(i = 0, k = 0; i < rowLen; i++) {
				if(isRowEven[i]) {
					// apply row-column classes
					$rowDiv = $('<div class="row" data-row-num="row-' + (i + 1) + '"/>');
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
						$innerDiv.append($img, '<map name="' + mapName + '" id="' + mapName + '" data-row-num="row-' + (i + 1) + '"/>');
						$rowDiv.append($innerDiv);
					}
				} else {
					// apply block_grid class
					isBlock = true;
					$rowDiv = $('<div class="row block_grid" data-row-num="row-' + (i + 1) + '"/>');
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
						$innerUl.append('<li>' + $img + '<map name="' + mapName + '" id="' + mapName + '" data-row-num="row-' + (i + 1) + '"/></li>');
					}
				}
				$body.append($rowDiv);
			}
			isExtraWide && $style.append(".xtraWideImg {max-width: none !important;margin-left: -50% !important;}");
			isBlock && $style.append(grunt.file.exists("assets/block_style.txt") ? grunt.file.read("assets/block_style.txt") : "");
		}
	});

	grunt.registerTask("execute", function() {
		this.requires("build");
		grunt.file.write(folder + files.hp1, $.html());
		grunt.config.set("prettify.one.src", folder + files.hp1);
		grunt.config.set("prettify.one.dest", folder + files.hp1);
		grunt.loadNpmTasks('grunt-prettify');
		grunt.task.run('prettify');
	});

	grunt.registerTask("update", function() {
		this.requires("check");

		$ = cheerio.load(grunt.file.read(folder + files.hp1));

		var SL = require("./assets/standard_linking.js");

		$("map").each(function() {
			var $this0 = $(this),
				map = $this0.attr("name"),
				row = $this0.data("row-num"),
				cm_re = "cm_re=${hpDate}-_-HOMEPAGE_INCLUDE_1_" + row + "-_-CATEGORY%20--%205125%20--%20",
				temp;

			$this0.children().each(function() {
				var $this1 = $(this),
					href = $this1.attr("href"),
					alt = $this1.attr("alt"),
					cm = cm_re + ":" + alt,
					newHref, hrefStr, js1, js2;

				if(typeof href === "undefined" || href === "#") {
					grunt.log.writeln("WARNING: 'href' empty for area with coords : " ["yellow"] + $this1.attr("coords") ["yellow"] + ". Skipping current tag." ["yellow"]);
					return true;
				}
				if(typeof alt === "undefined" || alt === "") {
					grunt.log.writeln("WARNING: 'alt' empty for area with coords : " ["yellow"] + $this1.attr("coords") ["yellow"] + ". Skipping current tag." ["yellow"]);
					return true;
				}

				if(/^\d+$/.test(href)) { // all digits
					hrefStr = href.toString();
					js1 = "javascript:pop('${baseUrl}/popup.ognc?popupID=";
					js2 = "','myDynaPop','scrollbars=yes,width=365,height=600')";

					newHref = hrefStr.length <= 5 ? SL.catUrl + href + "&" + cm_re + hrefStr + ":" + alt : js1 + hrefStr + "&" + cm + js2;
				} else if(/^\//.test(href)) { // begins with /
					newHref = hasHash(1) || "${baseUrl}" + href + (~href.indexOf("?") ? "&" : "?") + cm;
				} else if(href === "standard") {
					temp = SL[alt.replace(/\s/g, "")];
					newHref = SL.catUrl + temp + "&" + cm_re + temp + ":" + alt;
				} else if(/www(1)?.macys.com/.test(href)) {
					newHref = hasHash(2) || "${baseUrl}" + href.substring(href.indexOf(".com") + 4) + (~href.indexOf("?") ? "&" : "?") + cm;
				} else {
					newHref = hasHash(3) || href + (~href.indexOf("?") ? "&" : "?") + cm;
				}

				$this1.attr("href", newHref);
				console.log(newHref);

				function hasHash(id) {
					var hashIndex, queIndex, index;

					if(~(hashIndex = href.indexOf("#"))) {
						if(~(queIndex = href.indexOf("?"))) {
							index = queIndex + 1;
							temp = cm + "&";
						} else {
							index = hashIndex;
							temp = "?" + cm;
						}
						temp += href.substring(index);
						switch(id) {
							case 1 : return "${baseUrl}" + href.substring(0, index) + temp;
							case 2 : return "${baseUrl}" + href.substring(href.indexOf(".com") + 4, index) + temp;
							case 3 : return href.substring(0, index) + temp;
						}
					} else {
						return false;
					}
				}
			});
		});
		grunt.file.write(folder + files.hp2, $.html());
	});

	grunt.registerTask("clean", function() {
		this.requires("update");

		var lines = grunt.file.read(folder + files.hp2).split("\n"),
			newlines = [],
			i = lines.length, temp;

		while(--i) {
			temp = /^(<img|<area).*(?!\/>)$/.test(lines[i].trim()) ? lines[i].replace(/>$/, "/>") : lines[i];
			if(/&amp;/.test(temp)) temp = temp.replace(/&amp;/g, "&");
			newlines[i] = temp;
		}
		grunt.file.write(folder + files.hp2, newlines.join("\n"));
	});
};