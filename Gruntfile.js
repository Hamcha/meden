'use strict';

module.exports = function (grunt) {
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		yeoman: {
            coffee: 'src',
            js: 'build',
        },

        watch: {
        	coffeeweb: {
                files: ['<%= yeoman.coffee %>/{,*/}*.coffee'],
                tasks: ['coffee:web']
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
            ]
        }
	});
    grunt.registerTask('server', ['concurrent:server', 'connect:livereload', 'watch']);
    grunt.registerTask('build', ['coffee:web', 'compass:dist']);
}
