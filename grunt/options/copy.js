module.exports = {
  main: {
    files: [
      {
        expand: true,
        cwd: 'assets/',
        src: ['**'],
        dest: 'out/'
      }
    ]
  },
  require: {
    src: 'vendor/requirejs/require.js',
    dest: 'out/js/lib/require.js'
  },
  jQuery: {
    src: 'vendor/jquery/dist/jquery.js',
    dest: 'out/js/lib/jquery.js'
  },
  jQueryMin: {
    src: 'vendor/jquery/dist/jquery.min.js',
    dest: 'out/js/lib/jquery.min.js'
  },
  js: {
    files: [
      {
        expand: true,
        cwd: 'src/js/app',
        src: ['**/*.js'],
        dest: 'out/js/app'
      }
    ]
  },
  libs: {
    files: [
      {
        expand: true,
        cwd: 'vendor',
        src: ['**/*.js'],
        dest: 'out/js/lib'
      }
    ]
  },
  fonts: {
    files: [
      {
        expand: true,
        cwd: 'src/icons/generated/',
        src: ['*.eot', '*.svg', '*.ttf', '*.woff'],
        dest: 'out/fonts'
      }
    ]
  },
  leaflet: {
    files: [
      {
        expand: true,
        cwd: 'vendor/leaflet-dist/images',
        src: ['**'],
        dest: 'out/leaflet/images'
      }
    ]
  }
};