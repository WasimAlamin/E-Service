let oldActiveMarker;
let oldActiveMarkerIcon;
let markerList = [];

//if (caseListJson != null) {

//}
let caseListJSON;
let map;

//Metoden som initierar allting
function initCaseList() {

    $.post('/Home/GetCases', (data) => {

        //Konverterar JSON strängen som returneras till ett JSON objekt
        caseListJSON = JSON.parse(data);

        console.log(caseListJSON);

        //Konfigurerar och initierar tabellen
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "400px",

            editing: true,
            sorting: true,
            paging: true,

            loadIndication: true,
            loadIndicationDelay: 500,
            loadMessage: "Laddar...",
            loadShading: true,

            confirmDeleting: true,
            deleteConfirm: "Är du säker på att du vill RADERA ärendet?",

            //Väljer vilken JSON data som ska visas
            data: caseListJSON,

            fields: [
                { name: "id", type: "number", width: 30, title: "Nr", align: "center", editing: false, validate: "required" },
                { name: "date", type: "text", width: 150, title: "Datum", editing: false },
                { name: "description", type: "text", width: 300, title: "Beskrivning" },
                { name: "contact_phone", type: "text", width: 200, title: "Kontakt-Tel", align: "center", editing: false },
                { name: "contact_email", type: "text", width: 200, title: "Kontakt-Epost", align: "center", editing: false },
                { name: "category", type: "text", width: 200, title: "Kategori", align: "center", },
                { name: "isActive", type: "checkbox", width: 50, title: "Aktiv", align: "center", },
                { type: "control" }
            ],

            //Callback funktion som triggas när ett ärende tas bort från tabellen
            onItemDeleted: function (data) {


                $.post("/Home/DeleteCase", {id: data.item.id }, function (data, status) {
                    console.log("DeleteCase request status: " + status);
                })
            },


            //Callback funtion som triggas när ett ärende uppdateras i tabellen
            onItemUpdated: function (data) {

                console.log(data);
                console.log(data.item.id);

                $.post("/Home/EditCase", {

                    id: data.item.id,
                    category: data.item.category,
                    description: data.item.description,
                    isActive: data.item.isActive

                }, function (data, status) {

                        console.log('EditCase request status: ' + status);

                        if (status == "success") {
                            alert("Ärendet har nu uppdaterats!")
                            location.reload();
                        } else {
                            alert("Ärendet kunde tyvär ej uppdateras. Var vänlig och försök igen!")
                            location.reload();
                        }
                })


                //Uppdaterar markörens färg efter uppdatering av markörens data
                markerList.forEach(function (item) {

                    if (item.id == data.item.id) {

                        item.setMap(null);
                    }
                })

                let icon;

                if (data.item.isActive == true) {
                    icon = "/Content/map-icon-yellow.svg";
                } else {
                    icon = "/Content/map-icon-green.svg"
                }

                new google.maps.Marker({
                    position: data.item.position,
                    icon: icon,
                    map,
                    title: data.item.title
                });

            },




            //Callback funktion när användaren klickar på en rad (Vald markör får blå färg)
            rowClick: function (data) {


                let selectedMarkerId = data.item.id;

                markerList.forEach(function (item) {

                    if (item.title === ("" + selectedMarkerId)) {

                        if (oldActiveMarker != null) {

                            oldActiveMarker.setMap(null);

                            new google.maps.Marker({
                                position: oldActiveMarker.position,
                                icon: oldActiveMarkerIcon,
                                map,
                                title: item.title,
                            });

                        }


                        oldActiveMarkerIcon = item.icon;
                        item.setMap(null);


                        oldActiveMarker = new google.maps.Marker({
                            position: item.position,
                            icon: "/Content/map-icon-blue.svg",
                            map,
                            title: item.title
                        });

                    }
                })


            }
        });

        //Skapar och lägger ut kartan
        initMap();

    })
}


function initMap() {


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
                alert('Kunde inte hitta adress!')
            }
        });


        //Raderar oldMarker om det finns en
        if (oldMarker != null) {

            oldMarker.setMap(null);
        }

    });



    //Skriver ut markörer från listan med JSONobjekt som hämtas från metoden i börjar
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
            title: "" + object.id,
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
            "<p> Kategori: " + object.category + " </p>" +
            "<p> Beskrivning: " + object.description + " </p>" +
            "<p> Status: " + object.isActive + " </p>" +
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


