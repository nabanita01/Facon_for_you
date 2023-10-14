var markers = [];
  var in_area = [];
  var autocomplete;
  var locations = [
    ['Store 1', 40.763537, -73.972248, '767 5th Ave, New York, New York 10153', 'email@gmail.com'],
    ['Store 2', 43.618893, -116.360244, '2855 E Fairview Ave, Meridian, Idaho 83642', 'email@gmail.com'],
    ['Store 3', 47.660934, -122.288883, '3605 NE 45th St, Seattle, Washington 98105', 'email@gmail.com'],
    ['Store 4', 46.585127, -120.556504, '3510 W Nob Hill Blvd, Yakima, Washington 98902', 'email@gmail.com'],
    ['Store 5', 48.464760, -122.340843, '1250 Swan Dr, Burlington, Washington 98233', 'email@gmail.com'],
    ['Store 6', 47.809718, -122.302079, '5030 208th St SW, Lynnwood, Washington 98036', 'email@gmail.com'],
    ['Store 7', 40.969998, -73.708549, '400 Halstead Ave, Harrison, New York 10528', 'email@gmail.com'],
    ['Store 8', 40.760842, -73.988847, '324 W 47th St, New York, New York 10528', 'email@gmail.com'],
  ];

  var geocoder = new google.maps.Geocoder();

  autocomplete = new google.maps.places.Autocomplete((document.getElementById('locator_text')));

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.833333,
      lng: -98.583333
    },
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  for (i = 0; i < locations.length; i++) {
    add_marker(locations);
  }

  google.maps.event.addDomListener(window, "resize", function() {
    centermap();
  });

  $('#locator').submit(function(e) {
    e.preventDefault();
    var address = $('input[type="text"]').val();
    var radiusmiles = parseInt($('select').val());
    var radiusmetric = radiusmiles / 0.000621371192;
    in_area = [];

    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {

        var searchedlocation = results[0].geometry.location;
        var circle = new google.maps.Circle({
          radius: radiusmetric,
          center: searchedlocation
        });
        map.setCenter(searchedlocation);
        map.fitBounds(circle.getBounds());

        for (i = 0; i < locations.length; i++) {
          var position = new google.maps.LatLng(locations[i][1], locations[i][2]);
          var distance = google.maps.geometry.spherical.computeDistanceBetween(searchedlocation, position);

          if (distance <= radiusmetric) {
            markers[i].setMap(map);
            in_area.push([locations[i][0], locations[i][3], locations[i][4], (distance * 0.000621371192).toFixed(2)]);
          } else {
            markers[i].setMap(null);
          }

        }
        resultstotal(in_area.length, radiusmiles, address, circle);
      }
    });

  });

  function centermap() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  }

  function add_marker(arraymarkers) {
    var latlng = new google.maps.LatLng(arraymarkers[i][1], arraymarkers[i][2]);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: 'http://chart.apis.google.com/chart?cht=d&chdp=mapsapi&chl=pin%27i%5c%27%5b%27-2%27f%5chv%27a%5c%5dh%5c%5do%5c0099FF%27fC%5c000000%27tC%5c000000%27eC%5cLauto%27f%5c&ext=.png'
    });
    markers[i] = marker;
  }

  function resultstotal(resultstotal, radius, search, circlearea) {
    $('main').empty().append('<p class="col">' + resultstotal + ' stores within ' + radius + 'mi of ' + search + '</p><ol class="col"></ol>');
    in_area.sort(function(a, b) {
      return a[3] - b[3];
    });
    for (i = 0; i < in_area.length; i++) {

      var dealername = in_area[i][0];
      var dealeraddress = in_area[i][1];
      var dealeremail = in_area[i][2];
      var distanceround = in_area[i][3];

      $('main ol').append('<li>' +
        '<h4>' + dealername + ' (' + distanceround + ' mi away)</h4>' +
        '<p>' + dealeraddress + '</p>' +
        '<a href="mailto:' + dealeremail + '">' + dealeremail + '</a>' +
        '</li>');
    }

    $('main, #map').addClass('active');

    $('html, body').animate({
      scrollTop: $("main").offset().top
    }, 500);
    $('main').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
      centermap();
      map.fitBounds(circlearea.getBounds());
    });

  }