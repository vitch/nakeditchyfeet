define(
  [
  ],
  function () {
    'use strict';

    var ObjectBase = function () {
      if (!_.isUndefined(this.initialize)) {
        this.initialize.apply(this, arguments);
      }
    };

    // Steal the "self-propagating extend function that Backbone classes use"
    // A bit nasty to copy it off an unrelated model but we can't directly reference the
    // private functions declared in the backbone script...
    ObjectBase.extend = Backbone.Model.extend;

    return ObjectBase;
  }
);