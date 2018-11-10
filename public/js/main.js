// render map in the page
var map;
function initMap(data) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });
}

$(function () {
    // render list in the page
    function renderList(data) {
        var htmlStr = '';

        for (var i = 0; i < data.length; i++) {
            htmlStr += '<li class="list-group-item" data-id="' + data[i]['id'] + '">' + data[i]['name'] + 
                '<br> Latitude: ' + data[i]['latitude'] + 
                '<br> Longitude: ' + data[i]['longitude'] + '</li>';
        }

        $('.js-list').empty().append(htmlStr);
    }

    $('#search').click(function () {
        var postalCode = $('.js-postal-code').val();
        if (!postalCode) {
            $('.js-message').removeClass('sr-only').text('You must enter a postal code');
            // remove the data of previous request
            $('.js-list').empty();
            return;
        }

        $.get('/pickuplist', { postalCode: postalCode })
            .done(function (res) {
                $('.js-message').addClass('sr-only').empty();
                console.log(res);
                renderList(res.data);
                initMap(data);
            })
            .fail(function (err) {
                $('.js-message').empty().removeClass('sr-only').text(err.responseJSON.message);
                // remove the data of previous request
                $('.js-list').empty();
            });
    });
});
