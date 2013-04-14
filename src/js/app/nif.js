define(
  [],
  function()
  {
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
            if (!isOpen) {
              setTimeout(initMap, 1000);
            }
            return false;
          }
        );

        function initMap()
        {
          $('#map>p').remove();

          var map = L.map('map').setView([51.505, -0.09], 13);

          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
            .openPopup();
        }

        if ($('#map.is-open').length) {
          initMap();
        }

        setTimeout(
          function()
          {
            $('#map').addClass('is-animated');
          },
          1000
        )
      }
    );
  }
);