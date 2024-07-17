'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Let's go der Hase!
    console.info('%cmade with ♥ Mike Pridik', 'background: rgb(43,84,124); color:#fff;padding: 3px');

    const readerWrapper = document.getElementById('reader');
    const resultWrapper = document.getElementById('result');
    const footer = document.getElementById('footer');

    function onScanSuccess(decodedText, scanner) {
        console.log(decodedText);
        fetchFoodInfo(decodedText);
        scanner.clear();
        resultWrapper.innerHTML = `<a href="index.html" class="btn">Neuer Scannen</a>`;
        readerWrapper.remove();
    }

    if (typeof Html5QrcodeScanner !== 'undefined') {
        const html5QrcodeScanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250
            },
            fps: 20,
        });

        html5QrcodeScanner.render((decodedText) => 
            onScanSuccess(decodedText, html5QrcodeScanner)
        );
    } else {
        console.error('Html5Qrcode ist nicht definiert. Stellen Sie sicher, dass die Bibliothek korrekt geladen wurde.');
    }

    async function fetchFoodInfo(code) {
        const url = `https://world.openfoodfacts.org/api/v0/product/${code}.json`;
        try {
            let response = await fetch(url);
            if (!response.ok) {
                if (response.status === 0) {
                    console.log('Kein Code übergeben');
                    resultWrapper.innerHTML = `<a href="index.html" class="btn">Neuer Scannen</a>`;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            console.log('data: ', data);
            const product = data.product;
            resultWrapper.innerHTML = `
                <span>Angaben zum Produkt</span>
                <h2 class="txt--shadow">${product.product_name_de}</h2>
                <img src="${product.selected_images.front.display.de}" alt="${product.product_name_de}">

                
            `;
            footer.innerHTML = `<a href="index.html" class="btn">Neuer Scannen</a>`;
            return data;

        } catch (error) {
            console.error('Fehler beim Abrufen der Nährstoffe:', error);
            resultWrapper.innerHTML = `<a href="index.html" class="btn">Neuer Scan</a>`;
        }
    }
});
