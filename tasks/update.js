module.exports = function(grunt) {
	"use strict";

	grunt.registerTask("update", function() {
		this.requires("check");

		var $ = grunt.config.get("vars.cheerio").load(grunt.file.read(grunt.config.get("vars.folder") + grunt.config.get("vars.files.hp1")));

		var SL = require("../assets/standard_linking.js");

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
					if(map === "scrollingSideAdMap") return true;
					grunt.log.writeln("Warning: 'href' empty. Added 'href_missing'. Map : " ["yellow"] + map + " Area : " ["yellow"] + $this1.attr("coords"));
					$this1.attr("href", "href_missing");
					return true;
				}
				if(typeof alt === "undefined" || alt === "") {
					grunt.log.writeln("Warning: 'alt' empty. Added 'alt_missing'. Map : " ["yellow"] + map + " Area : " ["yellow"] + $this1.attr("coords"));
					$this1.attr("alt", "alt_missing");
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
					if(!(temp = SL[alt.toLowerCase()])) {
						grunt.log.writeln("Warning: No standard link found for 'alt' : " ["yellow"] + alt ["red"] + " Map : " ["yellow"] + map + " Area : " ["yellow"] + $this1.attr("coords"));
						return true;
					}
					newHref = /^\d+$/.test(temp) ? SL.catUrl + temp + "&" + cm_re + temp + ":" + alt : temp + cm;
				} else if(/www(1)?.macys.com/.test(href)) {
					newHref = hasHash(2) || "${baseUrl}" + href.substring(href.indexOf(".com") + 4) + (~href.indexOf("?") ? "&" : "?") + cm;
				} else {
					newHref = hasHash(3) || href + (~href.indexOf("?") ? "&" : "?") + cm;
				}

				$this1.attr("href", newHref);

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
		grunt.config.set("vars.$", $);
		grunt.file.write(grunt.config.get("vars.folder") + grunt.config.get("vars.files.hp2"), $("head").html() + $("body").html());
	});
};