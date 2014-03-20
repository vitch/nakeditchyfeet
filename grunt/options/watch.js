module.exports = {
  content: {
    files: [
      'src/content/**/*.json',
      'src/content/**/*.md',
      'src/templates/**/*.html',
      'src/templates/**/*.xml',
      'src/data/*.json'
    ],
    tasks: ['haggerston', 'notify:watchComplete']
  },
  assets: {
    files: [
      'assets/**/*'
    ],
    tasks: ['copy:main', 'notify:watchComplete']
  },
  js: {
    files: [
      'src/js/app/**/*.js'
    ],
    tasks: ['compileJs', 'notify:watchComplete']
  },
  jsLibs: {
    files: [
      'vendor/**/*.js'
    ],
    tasks: ['copyJsLibs', 'notify:watchComplete']
  },
  styles: {
    files: [
      'src/styles/**/*.less'
    ],
    tasks: ['less', 'notify:watchComplete']
  },
  stays: {
    files: [
      'src/data/stays.json'
    ],
    tasks: ['stays', 'notify:watchComplete']
  }
};