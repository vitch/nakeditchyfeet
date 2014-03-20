module.exports = function(grunt) {
  return {
    libs: {
      files: {
        'out/js/libs.min.js': grunt.jsLibs
      }
    }
  };
};