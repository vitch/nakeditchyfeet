module.exports = {
  compile: {
    options: {
      baseUrl: 'src/js/app',
      appDir: '',
      wrap: true,
      insertRequire: ['nif'],
      name: 'nif',
      include: ['nif'],
      out: 'out/js/app/nif.min.js'
    }
  }
};