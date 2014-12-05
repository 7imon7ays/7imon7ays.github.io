module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['dev/js/jquery.mousewheel.js',
              'dev/js/underscore_throttle.js',
              'dev/js/resize.js',
              'dev/js/tumble_cube_mobile.js',
              'dev/js/tumble_cube_desktop.js',
              'dev/js/tumble_info.js',
              'dev/js/tumble_cube.js'
            ],
        dest: 'prod/js/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'prod/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);
};

