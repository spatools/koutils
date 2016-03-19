'use strict';

module.exports = function (grunt) {
    // Load grunt tasks automatically
    require("jit-grunt")(grunt, {
        nugetpack: "grunt-nuget",
        nugetpush: "grunt-nuget"
    });
    require('time-grunt')(grunt); // Time how long tasks take. Can help when optimizing build times

    var options = {
        dev: grunt.option('dev')
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        paths: {
            src: 'src',
            build: 'dist',
            temp: '.temp',
            test: 'test'
        },

        ts: {
            options: {
                target: "es5",
                module: "umd",
                declaration: false,
                sourceMap: true,
                comments: true,
                disallowbool: true,
                disallowimportmodule: true
            },
            dev: {
                src: ["_references.d.ts", "<%= paths.src %>/**/*.ts"]
            },
            test: {
                src: ["<%= paths.test %>/_references.d.ts" , "<%= paths.test %>/**/*.ts", "!<%= paths.test %>/typings/**/*.d.ts"]
            },
            dist: {
                src: "<%= ts.dev.src %>",
                dest: "<%= paths.build %>/",
                options: {
                    rootDir: '<%= paths.src %>',
                    declaration: true,
                    sourceMap: false
                }
            }
        },

        eslint: {
            options: {
                configFile: "eslint.json",
            },

            base: ["*.js"],
            dev: ["<%= paths.src %>/**/*.js"],
            dist: ["<%= paths.build %>/**/*.js"],
            test: ["<%= paths.test %>/**/*.js"]
        },

        connect: {
            test: {
                options: {
                    port: "8080",
                    open: "http://localhost:8080/tests/index.html",
                    keepalive: true
                }
            }
        },

        mocha: {
            test: ["<%= paths.test %>/index.html"]
        },

        clean: {
            dist: "<%= paths.build %>",
            temp: "<%= paths.temp %>",
            dev: "<%= paths.src %>/**/*.{js,js.map,d.ts}",
            test: [
                "<%= clean.dev %>",
                "<%= paths.test %>/**/*.{js,js.map,d.ts}",
                "!<%= paths.test %>/typings/**/*.d.ts",
                "!<%= paths.test %>/_references.d.ts"
            ]
        },

        nugetpack: {
            all: {
                src: "nuget/*.nuspec",
                dest: "nuget/",

                options: {
                    version: "<%= pkg.version %>"
                }
            }
        },
        nugetpush: {
            all: {
                src: "nuget/*.<%= pkg.version %>.nupkg"
            }
        },

        watch: {
            eslint: {
                files: ['<%= eslint.dev.src %>'],
                tasks: ['eslint:dev']
            },
            test: {
                files: ['<%= paths.test %>/*.*'],
                tasks: ['test']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        }
    });

    grunt.registerTask("fixdecla", function () {
        var content = grunt.file.read("dist/koutils.d.ts");
        content = content.replace(/\.{2}\/typings/g, "../../../typings");
        grunt.file.write("dist/koutils.d.ts", content);
    });

    grunt.registerTask("build", ["clean:dist", "ts:dist", "eslint:dist"]);
    grunt.registerTask("dev", ["clean:dev", "ts:dev", "eslint:dev"]);
    grunt.registerTask("test", ["clean:test", "ts:test", "eslint:test", "mocha:test"]);
    grunt.registerTask("nuget", ["nugetpack", "nugetpush"]);

    grunt.registerTask("default", ["clean", "test", "build"]);
};