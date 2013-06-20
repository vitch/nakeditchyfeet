define(
  [
    'util/ObjectBase'
  ],
  function(ObjectBase)
  {
    'use strict';

    var compiledTemplates = {};

    return ObjectBase.extend(
      {},
      {
        render: function(filename, template, data) {
          var compiledTemplate = compiledTemplates[filename];
          if (!compiledTemplate) {
            compiledTemplate = compiledTemplates[filename] = swig.compile(template, {filename: filename});
          }
          return compiledTemplate(data)
        }
      }
    );
  }
);