module.exports = function(grunt) {
	var folder, files;

	grunt.registerTask("prepare", ["jsp", "extract", "clean"]);

	grunt.registerTask("jsp", function() {
		this.requires("update");

		var $ = grunt.config.get("vars.$"),
			jsp = grunt.file.exists("assets/jsp_directive.txt") ? grunt.file.read("assets/jsp_directive.txt") : "",
			content = $("head").html(), temp;

		files = grunt.config.get("vars.files");
		folder = grunt.config.get("vars.folder");
		temp = folder.substring(0, 4) + "." + folder.substring(4, 6) + "." + folder.substring(6);
		jsp = (jsp.replace("hpDateVal", temp)).replace("hpAssetsVal", temp.replace(/\./g, "/"));

		if(/macy-base/.test(content)) content = content.replace(/<link.*/, "");
		if(/jquery/.test(content)) content = content.replace(/<script.*\n.*/, "");

		$("img").each(function() {
			temp = $(this).attr("src");
			$(this).attr("src", "${hpAssets}/" + temp.substring(temp.indexOf("/") + 1));
		});
		content = jsp.concat(content.trim(), $("body").html());

		grunt.file.write(folder + files.hp2, content);
	});

	grunt.registerTask("extract", function() {
		this.requires("jsp");

		var imgAlt = "", areaAlt = "", $ = grunt.config.get("vars.$");

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