var path = require('path');
//그런트세팅관련
module.exports = function(grunt) {
    grunt.initConfig  ({
        express: {
            server : {
                options: {
                    script: path.resolve(__dirname, 'app.js'),
                    port: 3000,
                    nospawn: true,
                    delay: 5
                   // livereload: true
                }
            }
        },
        watch: {
            express: {
                files: [
                    path.resolve(__dirname,'./gruntFile.js'),
                    path.resolve(__dirname,'./app.js'),
                    path.resolve(__dirname,'./routes'+'/*.js'),
                    path.resolve(__dirname,'./views'+'/*.ejs'),
                    path.resolve(__dirname,'./public/**/*')
                ],
                tasks:  [ 'express:server' ]
            },
            options: {
                //livereload: true,
                spawn: false
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: path.resolve(__dirname,'./public/css'),
                    src: ['*.css', '!*.min.css'],
                    dest: path.resolve(__dirname,'./public/css'),
                    ext: '.min.css'
                }]
            }
        }

    });
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['express:server', 'watch','cssmin']);
};
