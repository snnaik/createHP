module.exports = function(grunt) {
	"use strict";

	var folder,
		files = {
			altsheet: "/altsheet.xlsx",
			hp1: "/hp_initial.html",
			hp2: "/hp_final.html",
			hp_txt: "/hp_final.txt"
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
			cheerio: require("cheerio"),
			files: files
		}
	});

	grunt.loadTasks("tasks");
	grunt.registerTask("template", ["check", "build", "execute"]);
	grunt.registerTask("reformat", ["check", "update", "extract", "clean", "finalize"]);

	grunt.registerTask("check", function() {
		!grunt.option("folder") ? grunt.fatal("Folder parameter missing!\n") : grunt.config.set("vars.folder", (folder = grunt.option("folder").toString()));
		!grunt.file.exists(folder) && grunt.fatal("Folder does not exist!\n");
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

	grunt.registerTask("extract", function() {
		var imgAlt = "", areaAlt = "", $ = grunt.config.get("vars.cheerio").load(grunt.file.read(folder + files.hp2));
		$("img").each(function() {
			imgAlt += $(this).attr("alt") + "\n";
		});
		$("area").each(function() {
			areaAlt += $(this).attr("alt") + "\n";
		});
		grunt.file.write(folder + files.hp_txt, imgAlt, areaAlt);
	});

	grunt.registerTask("clean", function() {
		this.requires("update");

		var lines = grunt.file.read(folder + files.hp2).split("\n"),
			newlines = [],
			i = lines.length, temp;

		while(--i) {
			temp = /^(<img|<area).*(?!\/>)$/.test(lines[i].trim()) ? lines[i].replace(/>$/, "/>") : lines[i];
			if(/&amp;/.test(temp)) temp = temp.replace(/&amp;/g, "&");
			if(/&apos;/.test(temp)) temp = temp.replace(/&apos;/g, "'");
			newlines[i] = temp;
		}
		grunt.file.write(folder + files.hp2, newlines.join("\n"));
	});

	grunt.registerTask("finalize", function() {
		grunt.config.set("imgmin_src", [folder + "/images/*.{png,jpg,jpeg,gif}"]);
		grunt.config.set("imagemin.dynamic.files[0].dest", folder + "/images/");
		grunt.loadNpmTasks("grunt-contrib-imagemin");
		grunt.task.run("imagemin");
		grunt.config.set("spell.files", folder + files.hp_txt);
		grunt.loadNpmTasks("grunt-spell");
		grunt.task.run("spell");
	});
};