// render map in the page
var map;
function initMap(data) {
    var bound = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'));

    for (var i = 0; i < data.length; i++) {
        var lat = parseFloat(data[i]['lat']);
        var lng = parseFloat(data[i]['lng']);

        bound.extend(new google.maps.LatLng(lat, lng));
        // create markers for pickup points
        new google.maps.Marker({
            position: { lat: lat, lng: lng },
            label: data[i]['name'],
            map: map
        });
    }
    // adjust center and bounds of the map
    map.setCenter(bound.getCenter());
    map.fitBounds(bound);
}

// render list in the page
function renderList(data) {
    var htmlStr = '';

    for (var i = 0; i < data.length; i++) {
        htmlStr += '<li class="list-group-item" data-id="' + data[i]['id'] + '">' + data[i]['name'] +
            '<br> Latitude: ' + data[i]['lat'] +
            '<br> Longitude: ' + data[i]['lng'] + '</li>';
    }

    $('.js-list').empty().append(htmlStr);
}

$(function () {
    $('#search').click(function () {
        var postalCode = $('.js-postal-code').val();
        if (!postalCode) {
            $('.js-message').removeClass('sr-only').text('You must enter a postal code');
            // remove the data of previous request
            $('.js-list').empty();
            $('#map').empty();
            return;
        }

        $.get('/pickuplist', { postalCode: postalCode })
            .done(function (res) {
                $('.js-message').addClass('sr-only').empty();
                renderList(res.data);
                initMap(res.data);
            })
            .fail(function (err) {
                $('.js-message').empty().removeClass('sr-only').text(err.responseJSON.message);
                // remove the data of previous request
                $('.js-list').empty();
                $('#map').empty();
            });
    });
});
