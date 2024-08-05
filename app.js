/* eslint-disable no-undef */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Let's go der Hase!
    console.info('%cmade with ♥ Mike Pridik', 'background: rgb(43,84,124); color:#fff;padding: 3px');

    const readerWrapper = document.getElementById('reader');
    const resultWrapper = document.getElementById('result');
    const footer = document.getElementById('footer');

    function onScanSuccess(decodedText, scanner) {
        fetchFoodInfo(decodedText);
        scanner.clear();
        resultWrapper.innerHTML = `<a href="index.html" class="btn">Neuer Scan</a>`;
        readerWrapper.remove();
    }

    if (typeof Html5QrcodeScanner !== 'undefined') {
        const html5QrcodeScanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 200,
                height: 200
            },
            fps: 60,
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
                    resultWrapper.innerHTML = `<a href="index.html" class="btn">Neuer Scan</a>`;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            const product = data.product;
            resultWrapper.innerHTML = `
                <span>Angaben zum Produkt: ${data.code}</span>
                <h2 class="txt--shadow">${product.product_name}</h2>
                <img src="${product.image_url}" alt="${product.product_name}">
                <h3>Nährstoffe</h3>
                <table>
                    <thead>
                        <tr>
                            <th>durchschnittlich auf</th>
                            <th>100g</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Brennwert</td>
                            <td>${product.nutriments['energy-kcal_100g']} g</td>
                        </tr>
                        <tr>
                            <td>Fett</td>
                            <td>${product.nutriments.fat_100g} g</td>
                        </tr>
                        <tr>
                            <td>Kohlenhydrate</td>
                            <td>${product.nutriments.carbohydrates_100g} g</td>
                        </tr>
                        <tr>
                            <td>- davon Zucker</td>
                            <td>${product.nutriments.sugars_100g} g</td>
                        </tr>
                        <tr>
                            <td>Protein</td>
                            <td>${product.nutriments.proteins_100g} g</td>
                        </tr>
                        <tr>
                            <td>Salz</td>
                            <td>${product.nutriments.salt_100g} g</td>
                        </tr>
                    </tbody>
                </table>
                
            `;
            footer.innerHTML = `<a href="index.html" class="btn">Neuer Scan</a>`;
            return data;

        } catch (error) {
            console.error('Fehler beim Abrufen der Nährstoffe:', error);
            resultWrapper.innerHTML = `Fehler beim Abrufen der Nährstoffe. Bitte erneut versuchen. <br><br> <a href="index.html" class="btn">Neuer Scan</a>`;
            footer.innerHTML = `<a href="index.html" class="btn">Neuer Scan</a>`;
        }
    }
});
