module.exports = function(grunt) {
	"use strict";

	var folder, files, $;

	grunt.registerTask("prepare", function() {
		this.requires("update");

		$ = grunt.config.get("vars.$");
		files = grunt.config.get("vars.files");
		folder = grunt.config.get("vars.folder");

		grunt.task.run("jsp", "extract", "clean");
	});

	grunt.registerTask("jsp", function() {
		this.requires("prepare");

		var jsp = grunt.file.exists(files.jsp) ? grunt.file.read(files.jsp) : "",
			content = $("head").html(), temp;

		temp = folder.substring(0, 4) + "." + folder.substring(4, 6) + "." + folder.substring(6);
		jsp = (jsp.replace("hpDateVal", temp.substring(0, 10))).replace("hpAssetsVal", temp.replace(/\./g, "/"));

		content = (content.replace(/<link.*/, "")).replace(/.*jquery.*\n.*/, "");

		$("img").each(function() {
			temp = $(this).attr("src");
			$(this).attr("src", "${hpAssets}/" + temp.substring(temp.indexOf("/") + 1));
		});
		content = jsp.concat(content.trim(), $("body").html());

		grunt.file.write(folder + files.hp2, content);
	});

	grunt.registerTask("extract", function() {
		this.requires("jsp");

		var imgAlt = "", areaAlt = "";

		$("img").each(function() {
			imgAlt += $(this).attr("alt") + "\n";
		});
		$("area").each(function() {
			areaAlt += $(this).attr("alt") + "\n";
		});
		grunt.file.write(folder + files.alt, imgAlt + areaAlt);
	});

	grunt.registerTask("clean", function() {
		this.requires("extract");

		var file = grunt.file.read(folder + files.hp2),
			newlines = [], lines, line, i;

		file = ((file.replace(/&amp;/g, "&")).replace(/(&apos;|&quot;|&#x2019;)/g, "'")).replace(/&#xA0;/g, " ");

		lines = file.split("\n");
		i = lines.length;

		while(i--) {
			line = /^(<img|<area).*(?!\/>)$/.test(lines[i].trim()) ? lines[i].replace(/>$/, "/>") : lines[i];
			line = line.replace(/^\t{1,2}/, "");
			newlines[i] = line;
		}
		grunt.file.write(folder + files.hp2, newlines.join("\n"));
	});
};