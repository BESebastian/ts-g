module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: 'public/js/compiled.js',
                options: {
                    module: 'amd'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.ts'],
                tasks: ['typescript'],
                options: {
                    livereload: {
                        port: 3001
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['typescript']);
};
