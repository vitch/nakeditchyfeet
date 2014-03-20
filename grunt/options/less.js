module.exports = function(grunt) {
  return {
    site: {
      options: {
        compress: grunt.isProduction,
        paths: ['src/styles', 'vendor/bootstrap/less', 'vendor/leaflet-dist', 'vendor/font-awesome/less', 'vendor/Leaflet.awesome-markers/dist', 'vendor/leaflet.markercluster/dist']
      },
      files: {
        'out/styles/styles.css': 'src/styles/styles.less'
      }
    }
  };
};