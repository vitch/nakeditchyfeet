module.exports = {
  icons: {
    src: 'src/icons/*.svg',
    dest: 'src/icons/generated/',
    options: {
      engine: 'node',
      stylesheet: 'less',
      syntax: 'bootstrap',
      htmlDemo: false,
      font: 'nif-icons',
      relativeFontPath: '/fonts/'
    }
  }
}