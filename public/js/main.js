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

// show message helper function
function showMessage(type, message) {
    if (type === 'error') {
        $('#message').empty().removeClass('sr-only alert-info').addClass('alert-danger').text(message);
    } else if (type === 'info') {
        $('#message').empty().removeClass('sr-only alert-danger').addClass('alert-info').text(message);
    }
}

// remove the data of previous request
function removeData() {
    $('#list').empty();
    $('#map').empty();
}

$(function () {
    $('input[name="postal-code"]').on('keyup', function () {
        var postalCode = $('input[name="postal-code"]').val();
        // check if input length equals 4, else show an info message
        if (postalCode.length === 4) {
            // check if input is different from the last queried one
            if (postalCode !== sessionStorage.getItem('postalCode')) {
                // show loading spinner
                $('#loading').modal('show');

                $.get('/pickuplist', { postalCode: postalCode })
                    .done(function (res) {
                        if (res.data.length > 0) {
                            showMessage('info', 'Pickup Points for Postal Code: ' + postalCode);
                            renderList(res.data);
                            initMap(res.data);
                        } else {
                            // if there is no pickup point show an error message
                            showMessage('error', 'No result is found for Postal Code: ' + postalCode);
                            removeData();
                        }
                        // hide loading spinner
                        $('#loading').modal('hide');
                    })
                    .fail(function (err) {
                        showMessage('error', err.responseJSON.message);
                        removeData();
                        // hide loading spinner
                        $('#loading').modal('hide');
                    });
            }
        } else {
            showMessage('info', 'Postal Code must be a 4 digit number');
            removeData();
        }
        // update the last queried postal code in session storage
        sessionStorage.setItem('postalCode', postalCode);
    });
});
