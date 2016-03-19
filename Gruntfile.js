"use strict";

module.exports = function (grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {
        buildcontrol: "grunt-build-control",
        nugetpack: "grunt-nuget",
        nugetpush: "grunt-nuget"
    });

    var config = {
        pkg: grunt.file.readJSON("package.json"),
        
        paths: {
            src: "src",
            build: "dist",
            temp: ".temp",
            test: "test"
        },
        
        options: {
            dev: grunt.option("dev")
        }
    };
    
    //#region Typescript
    
    config.ts = {
        options: {
            target: "es5",
            module: "umd",
            declaration: false,
            sourceMap: true,
            comments: true,
            disallowbool: true,
            disallowimportmodule: true,
            fast: "never"
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
                rootDir: "<%= paths.src %>",
                declaration: true,
                sourceMap: false
            }
        }
    };
    
    config.eslint = {
        options: {
            configFile: "eslint.json",
        },

        base: ["*.js"],
        dev: ["<%= paths.src %>/**/*.js"],
        dist: ["<%= paths.build %>/**/*.js"],
        test: ["<%= paths.test %>/**/*.js"],
        all: {
            src: ["<%= eslint.dev %>", "<%= eslint.test %>"]
        }
    };
    
    //#endregion

    //#region Tests
    
    config.karma = {
        options: {
            configFile: "karma.conf.js",
            port: 9999,
            browsers: ["PhantomJS", "Chrome", "Firefox"]
        },
        
        full: {
            singleRun: true,
            browsers: ["PhantomJS", "Chrome", "Firefox", "IE"]
        },
        
        test: {
            singleRun: true,
            browsers: ["PhantomJS"]
        },
        
        server: {
            autoWatch: false,
            background: true,
            singleRun: false,
            browsers: ["PhantomJS"],
            files: [
                { src: "test/config.js" },
                { src: "bower_components/**/*.js", included: false },
                { src: "src/**/*.{js,ts,js.map}", included: false },
                { src: "test/**/*.{js,ts,js.map}", included: false }
            ]
        }
    };
    
    //#endregion
    
    //#region Clean

    config.clean = {
        dist: "<%= paths.build %>",
        temp: "<%= paths.temp %>",
        dev: "<%= paths.src %>/**/*.{js,js.map,d.ts}",
        test: [
            "<%= clean.dev %>",
            "<%= paths.test %>/**/*.{js,js.map,d.ts}",
            "!<%= paths.test %>/typings/**/*.d.ts",
            "!<%= paths.test %>/_references.d.ts"
        ]
    };

    //#endregion
    
    //#region Watch
    
    config.newer = {
        options: {
            override: function (detail, include) {
                if (detail.task === "ts" && detail.path.indexOf(".d.ts") !== -1) {
                    return include(true);
                }
                
                include(false);
            }
        }
    };
    
    config.watch = {
        ts: {
            files: ["<%= ts.dev.src %>", "<%= ts.test.src %>"],
            tasks: ["newer:ts:test"]
        },
        eslint: {
            files: ["<%= eslint.all.src %>"],
            tasks: ["newer:eslint:all"]
        },
        
        test: {
            files: ["<%= eslint.dev %>", "<%= eslint.test %>"],
            tasks: ["karma:server:run"]
        },
        
        gruntfile: {
            files: ["Gruntfile.js"],
            options: { reload: true }
        }
    };
    
    //#endregion
    
    //#region Publish
    
    config.nugetpack = {
        all: {
            src: "nuget/*.nuspec",
            dest: "nuget/",

            options: {
                version: "<%= pkg.version %>"
            }
        }
    };
    
    config.nugetpush = {
        all: {
            src: "nuget/*.<%= pkg.version %>.nupkg"
        }
    };
    
    config.buildcontrol = {
        options: {
            commit: true,
            push: true,
            tag: "<%= pkg.version %>",
            remote: "<%= pkg.repository.url %>",
            branch: "release"
        },
        
        dist: {
            options: {
                dir: "<%= paths.build %>",
                message: "Built release %sourceName% from commit %sourceCommit% on branch %sourceBranch%"
            }
        }
    };
    
    //#endregion
    
    //#region Custom Tasks
    
    grunt.registerTask("assets", function () {
        copyPackage("package.json");
        copyPackage("bower.json");
        
        writeDest(".gitignore", "node_modules/\nbower_components/");
    });
    
    function copyPackage(src) {
        var pkg = grunt.file.readJSON(src),
            dest = config.paths.build + "/" + dest;
        
        delete pkg.scripts;
        delete pkg.devDependencies;
        
        writeDest(src, JSON.stringify(pkg, null, 2));
    }
    
    function writeDest(name, content) {
        var dest = config.paths.build + "/" + name;
        grunt.file.write(dest, content);
        grunt.log.ok(dest + " created !");
    }
    
    //#endregion
    
    
    grunt.initConfig(config);

    grunt.registerTask("dev", ["clean:dev", "ts:dev", "eslint:dev"]);
    grunt.registerTask("build", ["clean:dist", "ts:dist", "eslint:dist", "assets"]);
    
    grunt.registerTask("test", ["clean:test", "ts:test", "eslint:test", "karma:test", "clean:test"]);
    grunt.registerTask("test-full", ["clean:test", "ts:test", "eslint:test", "karma:full", "clean:test"]);
    grunt.registerTask("test-watch", ["clean:test", "ts:test", "eslint:test", "karma:server:start", "watch"]);
    
    grunt.registerTask("nuget", ["nugetpack", "nugetpush"]);
    grunt.registerTask("publish", ["build", "nuget", "buildcontrol:dist"]);

    grunt.registerTask("default", ["test", "build"]);
};