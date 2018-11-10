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
    // append the new list
    $('#list').empty().append(htmlStr);
}

$(function () {
    $('input[name="postal-code"]').on('keyup', function () {
        var postalCode = $('input[name="postal-code"]').val();
        // check if input length equals 4, else show an info message
        if (postalCode.length === 4) {
            $.get('/pickuplist', { postalCode: postalCode })
                .done(function (res) {
                    if (res.data.length > 0) {
                        $('#message').empty().removeClass('sr-only alert-danger').addClass('alert-info').text('Pickup Points for Postal Code: ' + postalCode);
                        renderList(res.data);
                        initMap(res.data);
                    } else {
                        // if there is no pickup point show an error message
                        $('#message').empty().removeClass('sr-only alert-info').addClass('alert-danger').text('No result is found for Postal Code: ' + postalCode);
                        // remove the data of previous request
                        $('#list').empty();
                        $('#map').empty();
                    }
                })
                .fail(function (err) {
                    $('#message').empty().removeClass('sr-only alert-info').addClass('alert-danger').text(err.responseJSON.message);
                    // remove the data of previous request
                    $('#list').empty();
                    $('#map').empty();
                });
        } else {
            $('#message').empty().removeClass('sr-only alert-danger').addClass('alert-info').text('Postal Code must be a 4 digit number');
            // remove the data of previous request
            $('#list').empty();
            $('#map').empty();
        }
    });
});
