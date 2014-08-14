module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
        js : {
            src : [
                'config/*.js',
                'notifications.js',
                'controllers/**/*.js',
                'handlers/*.js',
                'models/*.js'
            ],
            dest : 'js/notifications.min.js'
        }
    },
    uglify : {
        js: {
            files: {
                'js/notifications.min.js' : [ 'js/notifications.min.js' ]
            }
        }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "css/notifications.css": "css/less/notifications.less"
        }
      }
    },
    watch: {
      styles: {
        files: [
          'css/less/*.less',
        ], // which files to watch
        tasks: [
          'less'
        ],
        options: {
          nospawn: true,
          debounceDelay: 250
        }
      },
      scripts: {
        files: [
          'config/*.js',
          'notifications.js',
          'controllers/**/*.js',
          'handlers/*.js',
          'models/*.js'
        ], // which files to watch
        tasks: [
          'concat' // , 'uglify'
        ],
        options: {
          nospawn: true,
          debounceDelay: 250
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['watch']);
};