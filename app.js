'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Let's go der Hase!
    console.info('%cmade with ♥ Mike Pridik', 'background: rgb(43,84,124); color:#fff;padding: 3px');

    if (typeof Html5QrcodeScanner !== 'undefined') {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 20,
        });
		
        scanner.render(success, error);
        function success(result){
            document.getElementById('result').innerHTML = `
			<h2>Scann erfolgreich!</h2>
			<p><a href="${result}">${result}</a></p>
			<button href="index.html">nochmal scannen</button>
				`;
            scanner.clear();
		
            document.getElementById('reader').remove();
		
        }
 
        function error(err){
            // console.error(err);
        }
    } else {
        console.error('Html5Qrcode ist nicht definiert. Stellen Sie sicher, dass die Bibliothek korrekt geladen wurde.');
    }

    // Funktion zum Abrufen der Daten von Open Food Facts
    function fetchFoodInfo(barcode) {
        fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    var product = data.product;
                    document.getElementById('foodInfo').innerText = `Produktname: ${product.product_name}\nMarke: ${product.brands}\nNährwert: ${product.nutriments['energy-kcal']} kcal`;
                } else {
                    document.getElementById('foodInfo').innerText = 'Produkt nicht gefunden.';
                }
            })
            .catch(error => {
                console.log('Fehler beim Abrufen der Daten: ', error);
            });
    }
});
