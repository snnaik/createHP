module.exports = function(grunt) {
	"use strict";

	grunt.registerTask("linkupdate", function() {
		this.requires("check");

		var folder = grunt.config.get("vars.folder"),
			file = grunt.file.read(folder + grunt.config.get("vars.files.hp2")),
			lines = file.split("\n"),
			newlines = lines,
			i = lines.length,
			SL = require("../assets/standard_linking.js"),
			baseUrl = "${baseUrl}",
			hpDate = folder.substring(0, 4) + "." + folder.substring(4, 6) + "." + folder.substring(6, 8),
			cheerio = grunt.config.get("vars.cheerio"), $, j, map, row;

		while(i--) {
			if(/^\s*<area.*linkmissing/.test(lines[i])) {
				j = i;
				while(j--) {
					if(/^\s*<map/.test(lines[j])) {
						$ = cheerio.load(lines[j]);
						map = $("map").attr("name");
						row = $("map").data("row-num");
						break;
					}
				}
				$ = cheerio.load(lines[i]);
				var $this1 = $("area"),
					cm_re = "cm_re=" + hpDate + "-_-HOMEPAGE_INCLUDE_1_" + (row || "row_sideAd") + "-_-CATEGORY%20--%205125%20--%20",
					href = $this1.attr("href"),
					alt = $this1.attr("alt"),
					sym, cm, newHref, temp;

				if(typeof alt === "undefined" || alt === "") {
					grunt.log.writeln("Warning: 'alt' empty. Added 'alt_missing'. Map : " ["yellow"] + map + " Area : " ["yellow"] + $this1.attr("coords"));
					$this1.attr("alt", "alt_missing");
					return true;
				}
				alt = alt.replace(/[^\w\s]/g, "");
				cm = cm_re + ":" + alt;
				sym = ~href.indexOf("?") ? "&" : "?";

				if(/^\d+$/.test(href)) { // all digits
					var hrefStr = href.toString(),
						hrefLen = hrefStr.length;

					if(hrefLen === 6) {
						newHref = "javascript:pop('" + baseUrl + "/popup.ognc?popupID=" + hrefStr + "&" + cm + "','myDynaPop','scrollbars=yes,width=365,height=600')";
					} else {
						newHref = SL[(hrefLen <= 5 ? "catUrl" : "prodUrl")] + href + "&" + cm_re + hrefStr + ":" + alt;
					}
				} else if(/^\//.test(href)) { // begins with /
					newHref = hasHash(1) || baseUrl + href + sym + cm;
				} else if(href === "standard") {
					if(!(temp = SL[alt.toLowerCase()])) {
						grunt.log.writeln("Warning: No standard link found for 'alt' : " ["yellow"] + alt ["red"] + " Map : " ["yellow"] + map + " Area : " ["yellow"] + $this1.attr("coords"));
						return true;
					}
					newHref = /^\d+$/.test(temp) ? SL.catUrl + temp + "&" + cm_re + temp + ":" + alt : temp + cm;
				} else if(/www(1)?.macys.com/.test(href)) {
					newHref = hasHash(2) || baseUrl + href.substring(href.indexOf(".com") + 4) + sym + cm;
				} else {
					!~href.indexOf("macys.com") && $this1.attr("target", "_blank");
					newHref = hasHash(3) || href + sym + cm;
				}

				$this1.attr("href", newHref).removeClass("linkmissing");
				if($this1.attr("class") === "") $this1.removeAttr("class");
				var line = (($.html().replace(/&amp;/g, "&")).replace(/(&apos;|&quot;|&#x2019;)/g, "'")).replace(/&#xA0;/g, " ");
				line = /(?!\/>)$/.test(line) ? line.trim().replace(/>$/, "/>") : line;
				newlines[i] = line;

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
							case 1 : return baseUrl + href.substring(0, index) + temp;
							case 2 : return baseUrl + href.substring(href.indexOf(".com") + 4, index) + temp;
							case 3 : return href.substring(0, index) + temp;
						}
					} else {
						return false;
					}
				}
			}
		}
		grunt.file.write(folder + "/temp.jsp", newlines.join("\n"));
	});
};