module.exports = {
  icons: {
    src: 'src/icons/*.svg',
    dest: 'src/icons/generated/',
    options: {
      engine: 'node',
      stylesheet: 'less',
      template: 'src/icons/template/fa.css',
      templateOptions: {
        baseClass: 'icon',
        classPrefix: 'icon-',
        mixinPrefix: 'icon-'
      },
      htmlDemo: false,
      font: 'nif-icons',
      relativeFontPath: '/fonts/'
    }
  }
}