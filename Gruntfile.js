module.exports = function(grunt) {
	"use strict";

	var folder,
		files = {
			altsheet: "/altsheet.xlsx",
			hp1: "/hp_initial.html",
			alt: "/alt_text.txt"
		};

	grunt.initConfig({
		prettify: {
			options: {
				"indent" : 1,
				"indent_char" : "	",
				"indent_scripts" : "normal",
				"brace_style": "collapse",
				"unformatted": []
			},
			one: "<%= prettify_files %>"
		},
		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 5
				},
				files: [{
					expand: true,
					src: "<%= imgmin_src %>"
				}]
			}
		},
		vars: {
			cheerio: require("cheerio")
		}
	});

	grunt.loadTasks("tasks");
	grunt.registerTask("template", ["check", "build", "execute"]);
	grunt.registerTask("reformat", ["check", "update", "jsp", "extract", "clean", "finalize"]);

	grunt.registerTask("check", function() {
		!grunt.option("folder") ? grunt.fatal("Folder parameter missing!\n") : grunt.config.set("vars.folder", (folder = grunt.option("folder").toString()));
		if(!grunt.file.exists(folder)) {
			grunt.fatal("Folder does not exist!\n")
		} else {
			files.hp2 = "/" + folder + "_hp.jsp";
			grunt.config.set("vars.files", files);
		}
		grunt.option("alt") && !grunt.file.exists(folder + files.altsheet) && grunt.fatal("'alt' parameter set but no 'altsheet.xlsx' found!\n");
	});

	grunt.registerTask("execute", function() {
		this.requires("build");
		grunt.file.write(folder + files.hp1, grunt.config.get("vars.$").html());
		grunt.config.set("prettify_files", {
			src: folder + files.hp1,
			dest: folder + files.hp1
		})
		grunt.loadNpmTasks('grunt-prettify');
		grunt.task.run('prettify');
	});

	grunt.registerTask("jsp", function() {
		this.requires("update");

		var $ = grunt.config.get("vars.$"),
			jsp = grunt.file.exists("assets/jsp_directive.txt") ? grunt.file.read("assets/jsp_directive.txt") : "",
			content = $("head").html();

		if(/macy-base/.test(content)) content = content.replace(/<link.*/, "");
		if(/jquery/.test(content)) content = content.replace(/<script.*\n.*/, "");

		content = jsp.concat(content, $("body").html());

		grunt.file.write(grunt.config.get("vars.folder") + grunt.config.get("vars.files.hp2"), content);
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

		var lines = grunt.file.read(folder + files.hp2).split("\n"),
			newlines = [],
			i = lines.length, line;

		while(i--) {
			line = /^(<img|<area).*(?!\/>)$/.test(lines[i].trim()) ? lines[i].replace(/>$/, "/>") : lines[i];
			if(/&amp;/.test(line)) line = line.replace(/&amp;/g, "&");
			if(/(&apos;|&quot;|&#x2019;)/.test(line)) line = line.replace(/(&apos;|&quot;|&#x2019;)/g, "'");
			if(/&#xA0;/.test(line)) line = line.replace(/&#xA0;/g, " ");
			line = line.replace(/^\t{1,2}/, "");
			newlines[i] = line;
		}
		grunt.file.write(folder + files.hp2, newlines.join("\n"));
	});

	grunt.registerTask("finalize", function() { return true;
		this.requires("extract");

		grunt.config.set("imgmin_src", [folder + "/images/*.{png,jpg,jpeg,gif}"]);
		grunt.config.set("imagemin.dynamic.files[0].dest", folder + "/images/");
		grunt.config.set("spell.files", folder + files.alt);

		grunt.loadNpmTasks("grunt-contrib-imagemin");
		grunt.loadNpmTasks("grunt-spell");

		grunt.task.run("imagemin");
		grunt.task.run("spell");
	});
};