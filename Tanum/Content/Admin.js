let oldActiveMarker;
let oldActiveMarkerIcon;
let markerList = [];

//if (caseListJson != null) {

//}
let caseListJSON;
let map;

let categories = [
    { name: "Gatubelysning", id: 1 },
    { name: "Parker", id: 2 },
    { name: "Gator och Vägar", id: 3 },
    { name: "Trafiksignaler", id: 4 },
    { name: "Papperskorgar", id: 5 },
    { name: "Skyltar", id: 6 },
    { name: "Parkering", id: 7 },
    { name: "Offentliga Toaletter", id: 8 },
    { name: "Brunnar", id: 9 },
    { name: "Cykelbanor, Gångbanor och Trottoarer", id: 10 },
    { name: "Övrigt", id: 11 }
    
]

//Metoden som initierar allting
function initCaseList() {

    $.post('/Home/GetCases', (data) => {

        //Konverterar JSON strängen som returneras till ett JSON objekt
        caseListJSON = JSON.parse(data);
        caseListJSON.forEach(function (item) {
            item.category = categoryStringFix(item.category);
            item.date = item.date.slice(0, 10);
        })
        

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
                { name: "date", type: "text", width: 150, title: "Datum", editing: false , align: 'center'},
                { name: "description", type: "text", width: 300, title: "Beskrivning" },
                { name: "contact_phone", type: "text", width: 200, title: "Kontakt-Tel", align: "center", editing: false },
                { name: "contact_email", type: "text", width: 200, title: "Kontakt-Epost", align: "center", editing: false },
                { name: "category", type: "select", width: 200, items: categories, title: "Kategori", align: "center", valueField: "name", textField: "name", editing: true },
                { name: "isActive", type: "checkbox", width: 50, title: "Aktiv", align: "center", },
                { type: "control" }
            ],

            //Callback funktion som triggas när ett ärende tas bort från tabellen
            onItemDeleted: function (data) {


                $.post("/Home/DeleteCase", {id: data.item.id }, function (data, status) {
                    console.log("DeleteCase request status: " + status);
                    location.reload();
                })
            },


            //Callback funtion som triggas när ett ärende uppdateras i tabellen
            onItemUpdated: function (data) {

                console.log(data);
                console.log(data.item.id);

                $.post("/Home/EditCase", {

                    id: data.item.id,
                    category: categoryIdFix(data.item.category),
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
                    icon = "/Content/map-pin-yellow.svg";
                } else {
                    icon = "/Content/map-pin-green.svg"
                }

                new google.maps.Marker({
                    position: data.item.position,
                    icon: icon,
                    map,
                    title: data.item.title
                });

            },


            

            //Callback funktion när användaren klickar på en rad (Vald markör får blå färg)
            //rowClick: function (data) {


            //    let selectedMarkerId = data.item.id;

            //    markerList.forEach(function (item) {

            //        if (item.title === ("" + selectedMarkerId)) {

            //            if (oldActiveMarker != null) {

            //                oldActiveMarker.setMap(null);

            //                new google.maps.Marker({
            //                    position: oldActiveMarker.position,
            //                    icon: oldActiveMarkerIcon,
            //                    map,
            //                    title: item.title,
            //                });

            //            }


            //            oldActiveMarkerIcon = item.icon;
            //            item.setMap(null);


            //            oldActiveMarker = new google.maps.Marker({
            //                position: item.position,
            //                icon: "/Content/map-icon-blue.svg",
            //                map,
            //                title: item.title
            //            });

            //        }
            //    })


            //}
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

 


    //Skriver ut markörer från listan med JSONobjekt som hämtas från metoden i börjar
    caseListJSON.forEach(function (object) {

        let icon;
        //Väljer icon färg
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
            "<p> Status: " + statusFix(object.isActive) + " </p>" +
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



