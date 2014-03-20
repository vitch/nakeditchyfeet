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
  jQuery: {
    src: 'vendor/jquery/dist/jquery.js',
    dest: 'out/js/lib/jquery.js'
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
        cwd: 'vendor/font-awesome/fonts',
        src: ['**'],
        dest: 'out/font-awesome/fonts'
      }
    ]
  },
  awesomeMarkers: {
    files: [
      {
        expand: true,
        cwd: 'vendor/Leaflet.awesome-markers/dist/images',
        src: ['**'],
        dest: 'out/awesome-markers/images'
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