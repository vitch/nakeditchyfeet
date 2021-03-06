module.exports = {
  icons: {
    src: 'src/icons/*.svg',
    dest: 'src/icons/generated/',
    options: {
      engine: 'node',
      stylesheet: 'less',
      template: 'src/icons/template/fa.css',
      templateOptions: {
        baseClass: 'nif-icon',
        classPrefix: 'nif-icon-',
        mixinPrefix: 'nif-icon-'
      },
      embed: true,
      // fontHeight: 512,
      // descent: 2,
      // ascent: 2,
      htmlDemo: false,
      font: 'nif-icons',
      relativeFontPath: '/fonts/'
    }
  }
}