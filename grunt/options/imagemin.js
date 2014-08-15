module.exports = {
  dist: {
    files: [{
      expand: true,
      cwd: 'out',
      src: ['**/*.{png,jpg,gif}'],
      dest: 'out'
    }]
  }
};