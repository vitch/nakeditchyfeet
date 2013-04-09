$(
  function()
  {
    $('#map-toggle a').on(
      'click',
      function(e)
      {
        var map = $('#map'),
            isOpen = map.is('.is-open');
        map[isOpen ? 'removeClass' : 'addClass']('is-open');
        return false;
      }
    );
  }
);