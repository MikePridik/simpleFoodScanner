'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Let's go der Hase!
    console.info('%cmade with ♥ Mike Pridik', 'background: rgb(43,84,124); color:#fff;padding: 3px');

    // Funktion zum Starten des Video-Streams
    function startVideoStream() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                var video = document.getElementById('video');
                video.srcObject = stream;
                video.play();
            })
            .catch(function(error) {
                var errorMessage = "Fehler beim Zugriff auf die Kamera: " + error.name;
                switch(error.name) {
                case "NotAllowedError":
                    errorMessage += " - Zugriff verweigert. Bitte erlaube den Zugriff auf die Kamera.";
                    break;
                case "NotFoundError":
                    errorMessage += " - Keine Kamera gefunden. Stelle sicher, dass eine Kamera angeschlossen und verfügbar ist.";
                    break;
                case "NotReadableError":
                    errorMessage += " - Kamera ist bereits in Verwendung. Schließe alle anderen Anwendungen, die die Kamera nutzen.";
                    break;
                default:
                    errorMessage += " - Ein unbekannter Fehler ist aufgetreten.";
                    break;
                }
                console.log(errorMessage);
                alert(errorMessage);
            });
    }

    // Starte den Video-Stream
    startVideoStream();

    // Foto aufnehmen und Barcode erkennen
    document.getElementById('snap').addEventListener('click', function() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var video = document.getElementById('video');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Barcode erkennen
        Quagga.decodeSingle({
            src: canvas.toDataURL(),
            numOfWorkers: 0, // für asynchrone Verarbeitung
            inputStream: {
                size: 800  // Größe des Inputs
            },
            decoder: {
                readers: ["ean_reader"] // Liste der Barcode-Typen, die erkannt werden sollen
            }
        }, function(result) {
            if(result && result.codeResult) {
                var barcode = result.codeResult.code;
                document.getElementById('barcodeResult').innerText = "Barcode: " + barcode;
                fetchFoodInfo(barcode);
            } else {
                document.getElementById('barcodeResult').innerText = "Kein Barcode erkannt.";
            }
        });
    });

    // Funktion zum Abrufen der Daten von Open Food Facts
    function fetchFoodInfo(barcode) {
        fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    var product = data.product;
                    document.getElementById('foodInfo').innerText = `Produktname: ${product.product_name}\nMarke: ${product.brands}\nNährwert: ${product.nutriments['energy-kcal']} kcal`;
                } else {
                    document.getElementById('foodInfo').innerText = "Produkt nicht gefunden.";
                }
            })
            .catch(error => {
                console.log("Fehler beim Abrufen der Daten: ", error);
            });
    }
});
