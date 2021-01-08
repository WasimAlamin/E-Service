let map;
let tickets
let oldMarker;
let newMarker;
let adress;
let queryLocation;
let geocoder;
let infoWindow;
let OldInfoWindow;
let caseListJSON = [];


btnClickHandlers();



function initCaseList() {

    $.post('/Home/GetCases', (data) => {

        //Konverterar JSON strängen som returneras från Controllern till ett JSON objekt
        console.log("UTAN PARSE: " + data);

        caseListJSON = JSON.parse(data);
        console.log("PARSAD: " + caseListJSON);

        console.log(caseListJSON);


        //Skapar och lägger ut kartan
        initMap();

    })
}



//Metoden som skapar och lägger till kartan, markörer och kartans event hanterare
function initMap() {
    //initCaseList();

    const tanumsKommun = {
        north: 58.92238636924028,
        south: 58.42401701359019,
        west: 10.96346762458794,
        east: 10.666021262515228,
    }

    //Skapar kartan och väljer inställningar för start plats samt UI
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 58.715838703141316, lng: 11.333030735396424 },
        zoom: 10,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        restriction: {
            latLngBounds: tanumsKommun,
            strictBounds: true
        }
    });


    //Geocoder som översätter 
    geocoder = new google.maps.Geocoder();


    //Skapar click listener på själva kartan
    map.addListener('click', (e) => {

        let position = e.latLng.toJSON();

        //Den tidigare tillagda markern blir markerad som oldmarker
        oldMarker = newMarker;

        //Ny marker skapas lagras som newMarker
        newMarker = new google.maps.Marker({
            position: position,
            icon: "/Content/map-icon-yellow.svg",
            map,
            title: "Ärende",
            collisionBehavior: "google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY",
        });


        //Reverse geocoding, synkar placerad markör med adress fältet i formuläret
        geocoder.geocode({ location: position }, (result, status) => {
            if (status === 'OK') {

                if (result[0]) {
                    $('#position-input').val(result[0].formatted_address);
                }
            } else {
                alert('Kunde tyvär inte hitta adressen!')
            }
        });


        //Raderar oldMarker om det finns en
        if (oldMarker != null) {

            oldMarker.setMap(null);
        }

    });


    //Skriver ut markörer från listan tickets
    caseListJSON.forEach(function (object) {

        let icon;
        //Väljer icon färg
        if (object.isActive == false) {
            icon = {
                url: "/Content/map-icon-green.svg"
            }
        } else {
            icon = {
                url: "/Content/map-icon-yellow.svg"
            }
        }

        let marker = new google.maps.Marker({
            position: { lat: Number(object.lat), lng: Number(object.lng) },
            icon: icon,
            map,
            title: "Ärende",
            collisionBehavior: "google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY",
        });

        //Html för informationsrutorna
        const contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            "<p style='font-weight:bold; text-align:center'>Ärende information</p>" +
            "<p> Ärendenummer: " + object.id + " </p>" +
            "<p> Kategori: " + object.category + " </p>" +
            "<p> Beskrivning: " + object.description + " </p>" +
            "<p> Status: " + object.status + " </p>" +
            "</div>" +
            "</div>";

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 150,
        });

        //Lägger till en click listener som visar informationsruta för varje markör
        marker.addListener("click", () => {
            infowindow.open(map, marker);
        });
    })
}










//Alla click handlers för knapparna------------------------------------

function btnClickHandlers() {

    $('#img-btn').click((e) => {
        e.preventDefault();
    })


    //Hämtar data från alla fält och från den aktiva markören och skickar det vidare till Controller
    $('#submit-btn').click((e) => {

        e.preventDefault();

        //Hämtar dagens datum
        let date = new Date;
        let dateString = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();

        //console.log('Categori id: ' + categoryFixer($('#select-category').val()))


        //Hämtar all data som behövs för ett ärende och packar in det i ett JSON objekt.
        let caseJSON = {
            date: dateString,
            lat: newMarker.position.lat,
            lng: newMarker.position.lng,
            description: $('#desc-input').val(),
            contact_phone: $('#phone-input').val(),
            contact_email: $('#email-input').val(),
            isActive: true
        }

        //Skickar ett ärende som ett JSON objekt till metoden i Controller som kommunicerar med WebService
        $.post('/Home/AddCase', caseJSON, (data, status) => {
            console.log('Submit request status: ' + status)

            if (status == "success") {
                alert("Ditt ärende har nu registrerats!")
                location.reload();
            } else {
                alert("Ditt ärende kunde tyvär inte registreras. Var vänlig och försök igen!")
                location.reload();
            }
        });

    })



    //Synkar adressfältet till kartan, skapar en markör utifrån angiven adress i fältet
    $('#position-btn').click(function (e) {

        e.preventDefault();

        adress = $('#position-input').val();
        $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + adress + '&key=AIzaSyAJXWucFbLokvY0d5SUvV4eDJuaW9vPMqw', function (data) {

            queryLocation = data.results[0].geometry.location;
            console.log(queryLocation);

            oldMarker = newMarker;

            //Ny marker skapas lagras som newMarker
            newMarker = new google.maps.Marker({
                position: queryLocation,
                icon: "/Content/map-icon-yellow.svg",
                map,
                title: "Nytt ärende",
                collisionBehavior: "google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY",
            });

            //Raderar oldMarker
            oldMarker.setMap(null);
        });
    })
}









