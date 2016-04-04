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
	grunt.registerTask("reformat", ["check", "update", "prepare", "finalize"]);

	grunt.registerTask("check", function() {
		!grunt.option("folder") ? grunt.fatal("Folder parameter missing!\n") : grunt.config.set("vars.folder", (folder = grunt.option("folder").toString()));
		if(!grunt.file.exists(folder)) {
			grunt.fatal("Folder does not exist!\n")
		} else if(folder.length !== 8 || isNaN(folder)) {
			grunt.fatal("Folder name invalid!\n" + "Valid format : YYYYMMDD\n" ["white"]);
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

	grunt.registerTask("finalize", function() {
		this.requires("clean");

		grunt.config.set("imgmin_src", [folder + "/images/*.{png,jpg,jpeg,gif}"]);
		grunt.config.set("imagemin.dynamic.files[0].dest", folder + "/images/");
		grunt.config.set("spell.files", folder + files.alt);

		grunt.loadNpmTasks("grunt-contrib-imagemin");
		grunt.loadNpmTasks("grunt-spell");

		grunt.task.run("imagemin");
		grunt.task.run("spell");
	});
};