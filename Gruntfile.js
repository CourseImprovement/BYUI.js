module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      norm: {
        src: ['src/init.js', 'src/*.js', 'src/*/*.js'],
        dest: 'build/byui.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
};