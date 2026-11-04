
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const STRAN = 'https://www.visitljubljana.com/en/poi/';

(async () => {
    let browser;

    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // 1. Odpremo spletno stran
        await page.goto(STRAN, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // 2. Pridobimo imena in povezave do znamenitosti
        const znamenitosti = await page.evaluate(() => {
            const povezave = document.querySelectorAll(
                'a[href*="/en/poi/"]'
            );

            const rezultati = [];
            const uporabljenePovezave = new Set();

            povezave.forEach((povezava) => {
                const ime = povezava.innerText.trim();
                const url = povezava.href;

                if (
                    ime &&
                    url.includes('/en/poi/') &&
                    !ime.toLowerCase().includes('subscribe') &&
                    !uporabljenePovezave.has(url)
                ) {
                    uporabljenePovezave.add(url);

                    rezultati.push({
                        ime: ime,
                        povezava: url
                    });
                }
            });

            return rezultati;
        });

        // Za začetek obdelamo največ 9 različnih povezav
        const izbraneZnamenitosti = znamenitosti.slice(0, 9);
        const seznamZnamenitosti = [];

        // 3. Odpremo posamezne podstrani in pridobimo opise
        for (const znamenitost of izbraneZnamenitosti) {
            let opis = 'Opis ni na voljo';

            try {
                console.log('Berem:', znamenitost.ime);

                await page.goto(znamenitost.povezava, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });

                opis = await page.evaluate(() => {
                    // Najprej poiščemo opis v vsebini strani
                    const elementi = document.querySelectorAll(
                        'main p, article p, main [class*="description"]'
                    );

                    for (const element of elementi) {
                        const besedilo = element.innerText.trim();
                        const maloBesedilo = besedilo.toLowerCase();

                        if (
                            besedilo.length > 30 &&
                            !maloBesedilo.includes(
                                'play audio recording'
                            ) &&
                            !maloBesedilo.includes('cookie')
                        ) {
                            return besedilo;
                        }
                    }

                    // Če opisa v vsebini ne najdemo,
                    // preverimo metapodatke spletne strani
                    const metaOpis = document.querySelector(
                        'meta[name="description"]'
                    )?.content?.trim();

                    const ogOpis = document.querySelector(
                        'meta[property="og:description"]'
                    )?.content?.trim();

                    const rezervniOpisi = [metaOpis, ogOpis];

                    for (const besedilo of rezervniOpisi) {
                        if (!besedilo) {
                            continue;
                        }

                        const maloBesedilo = besedilo.toLowerCase();

                        if (
                            besedilo.length > 30 &&
                            !maloBesedilo.includes(
                                'play audio recording'
                            ) &&
                            !maloBesedilo.includes('cookie')
                        ) {
                            return besedilo;
                        }
                    }

                    return 'Opis ni na voljo';
                });

            } catch (napaka) {
                console.log(
                    'Opisa ni bilo mogoče pridobiti:',
                    znamenitost.ime,
                    '-',
                    napaka.message
                );
            }

            // 4. Shranimo ime, povezavo in opis
            seznamZnamenitosti.push({
                ime: znamenitost.ime,
                povezava: znamenitost.povezava,
                opis: opis
            });
        }

        // 5. Izpišemo rezultate v terminal
        console.log('Pridobljeni podatki:');
        console.table(seznamZnamenitosti);

        // 6. Shranimo podatke v JSON
        const pot = path.join(
            __dirname,
            '..',
            'data',
            'znamenitosti-splet.json'
        );

        fs.writeFileSync(
            pot,
            JSON.stringify(seznamZnamenitosti, null, 2),
            'utf8'
        );

        console.log('Podatki so shranjeni v:', pot);

    } catch (napaka) {
        console.error('Napaka:', napaka.message);

    } finally {
        if (browser) {
            await browser.close();
        }

        console.log('Program je končan.');
    }
})();
