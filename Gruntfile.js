'use strict';

module.exports = function (grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	//grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.initConfig({
	    yeoman: {
            coffee: 'src',
            js: 'js',
        },

        watch: {
        	coffeeweb: {
                files: ['<%= yeoman.coffee %>/{,*/}*.coffee'],
                tasks: ['coffee:web']//,  'concat', 'uglify:bundle']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '{,*/}*.html',
                    '<%= yeoman.js %>/{,*/}*.js'
                ]
            }
        },
        /*
        concat: {
            js: {
                sourceMap: true,
                src: 'js/*.js',
                dest: 'build/meden.js'
            }
        },
        uglify: {
            bundle: {
                options: {
                    expand: true,
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'build/meden.min.js': ['build/meden.js']
                }
            }
        },
        */
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: ['.']
                }
            }
        },
        coffee: {
            web: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.coffee %>',
                    src: '{,*/}*.coffee',
                    dest: '<%= yeoman.js %>',
                    ext: '.js',
                }],
                options: {
                    sourceMap: true
                }
            }
        },
        concurrent: {
            server: [
                'coffee:web'
                //'concat',
                //'uglify:bundle'
            ]
        }
	});
    grunt.registerTask('server', ['concurrent:server', 'connect:livereload', 'watch']);
    grunt.registerTask('build', ['coffee:web']);//, 'concat', 'uglify:bundle']);
}
