module.exports = function(grunt) {
  return {
    libs: {
      options: {
        preserveComments: 'some'
      },
      files: {
        'out/js/libs.min.js': grunt.jsLibs
      }
    },
    require: {
      options: {
        preserveComments: 'some'
      },
      files: {
        'out/js/lib/require.js': 'vendor/requirejs/require.js'
      }
    }
  };
};