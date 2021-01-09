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
let markerList = [];


btnClickHandlers();



function initCaseList() {

    $.post('/Home/GetCases', (data) => {

        //Konverterar JSON strängen som returneras från Controllern till ett JSON objekt


        caseListJSON = JSON.parse(data);
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

    let minZoom = 8.9;

    //Skapar kartan och väljer inställningar för start plats samt UI
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 58.715838703141316, lng: 11.333030735396424 },
        zoom: minZoom,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        //restriction: {
        //    latLngBounds: tanumsKommun,
        //    strictBounds: true
        //}
    });

    google.maps.event.addListener(map, 'zoom_changed', function () {
        if (map.getZoom() < minZoom) map.setZoom(minZoom);
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
            icon: "/Content/map-pin-blue.svg",
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
        //if (object.isActive == false) {
        //    icon = {
        //        url: "/Content/map-icon-green.svg"
        //    }
        //} else {
        //    icon = {
        //        url: "/Content/map-icon-yellow.svg"
        //    }
        //}

        if (object.isActive == false) {
            icon = {
                url: "/Content/map-pin-green.svg"
            }
        } else {
            icon = {
                url: "/Content/map-pin-yellow.svg"
            }
        }

        let marker = new google.maps.Marker({
            position: { lat: Number(object.lat), lng: Number(object.lng) },
            icon: icon,
            map,
            title: "Ärende",
            collisionBehavior: "google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY",
        });

        markerList.push(marker);

        //Html för informationsrutorna
        const contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            "<p style='font-weight:bold; text-align:center'>Ärende information</p>" +
            "<p> Ärendenummer: " + object.id + " </p>" +
            "<p> Kategori: " + categoryStringFix(object.category) + " </p>" +
            "<p> Beskrivning: " + object.description + " </p>" +
            "<p> Status: " + statusFix(object.isActive) + " </p>" +
            "</div>" +
            "</div>";

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 250,
        });

        //Lägger till en click listener som visar informationsruta för varje markör
        marker.addListener("click", () => {
            infowindow.open(map, marker);
        });
    })

    new MarkerClusterer(map, markerList, {
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
}




function statusFix(status) {

    let statusString;

    if (status) {
        statusString = 'Aktiv'
    } else {
        statusString = 'Avslutad'
    }

    return statusString;
}





//Alla click handlers för knapparna------------------------------------

function btnClickHandlers() {

    $('#img-btn').click((e) => {
        e.preventDefault();
    })


    //Hämtar data från alla fält och från den aktiva markören och skickar det vidare till Controller
    $('#submit-btn').click((e) => {

        e.preventDefault();

        let adress = $('#position-input').val();
        let desc = $('#desc-input').val();

        if ((adress == "") || (desc == "")) {

            alert("Var vänlig och fyll i de obligatoriska fälten (*)");

        } else {

            //Hämtar dagens datum
            let date = new Date;
            let month = date.getMonth() + 1;
            let dateString = date.getFullYear() + '-' + month + '-' + date.getDate();
            console.log(dateString);

            //console.log('Categori id: ' + categoryFixer($('#select-category').val()))


            //Hämtar all data som behövs för ett ärende och packar in det i ett JSON objekt.
            let caseJSON = {
                date: dateString,
                lat: newMarker.position.lat,
                lng: newMarker.position.lng,
                description: $('#desc-input').val(),
                contact_phone: $('#phone-input').val(),
                contact_email: $('#email-input').val(),
                category: categoryIdFix($("#select-category").val()),
                isActive: true
            }

            //Skickar ett ärende som ett JSON objekt till metoden i Controller som kommunicerar med WebService
            $.post('/Home/AddCase', caseJSON, (data, status) => {
                console.log('Submit request status: ' + status)

                console.log(status);
                if (status == "success") {
                    alert("Ditt ärende har nu registrerats!")
                    location.reload();
                } else {
                    alert("Ditt ärende kunde tyvär inte registreras. Var vänlig och försök igen!")
                    location.reload();
                }
            });

        }

        

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
                icon: "/Content/map-pin-blue.svg",
                map,
                title: "Nytt ärende",
                collisionBehavior: "google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY",
            });

            //Raderar oldMarker
            oldMarker.setMap(null);
        });
    })
}




//Switch cases, gör om kategori-id till sträng och tvärtom
function categoryStringFix(categoryId) {

    let categoryString;
    switch (categoryId) {
        case 1:
            categoryString = "Gatubelysning";
            break;
        case 2:
            categoryString = "Parker";
            break;
        case 3:
            categoryString = "Gator och Vägar";
            break;
        case 4:
            categoryString = "Trafiksignaler";
            break;
        case 5:
            categoryString = "Papperskorgar";
            break;
        case 6:
            categoryString = "Skyltar";
            break;
        case 7:
            categoryString = "Parkering";
            break;
        case 8:
            categoryString = "Offentliga Toaletter";
            break;
        case 9:
            categoryString = "Brunnar";
            break;
        case 10:
            categoryString = "Cykelbanor, Gångbanor och Trottoarer";
            break;
        case 11:
            categoryString = "Övrigt";
            break;
        default:
            categoryString = "Övrigt";
            break;

    }

    return categoryString;
}

function categoryIdFix(categoryString) {

    let categoryId;
    switch (categoryString) {
        case "Gatubelysning":
            categoryId = 1;
            break;
        case "Parker":
            categoryId = 2;
            break;
        case "Gator och Vägar":
            categoryId = 3;
            break;
        case "Trafiksignaler":
            categoryId = 4;
            break;
        case "Papperskorgar":
            categoryId = 5;
            break;
        case "Skyltar":
            categoryId = 6;
            break;
        case "Parkering":
            categoryId = 7;
            break;
        case "Offentliga Toaletter":
            categoryId = 8;
            break;
        case "Brunnar":
            categoryId = 9;
            break;
        case "Cykelbanor, Gångbanor och Trottoarer":
            categoryId = 10;
            break;
        case "Övrigt":
            categoryId = 11;
            break;
        default:
            categoryId = 11;
            break;
    }

    return categoryId;
}



