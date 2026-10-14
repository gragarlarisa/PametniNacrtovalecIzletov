const fs = require("fs");
const path = require("path");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true
});

const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true
});

const dataPath = path.join(__dirname, "..", "data");

// Branje XML datotek
function preberiXML(imeDatoteke) {
    const pot = path.join(dataPath, imeDatoteke);
    const vsebina = fs.readFileSync(pot, "utf8");
    return parser.parse(vsebina);
}

function seznam(podatki, kljuc) {
    const rezultat = podatki[kljuc];
    if (!rezultat) return [];
    return Array.isArray(rezultat) ? rezultat : [rezultat];
}

try {
    const lokacijePodatki = preberiXML("lokacije.xml");
    const vremePodatki = preberiXML("vreme.xml");
    const znamenitostiPodatki = preberiXML("znamenitosti.xml");

    const lokacije = seznam(lokacijePodatki.lokacije, "lokacija");
    const vreme = seznam(vremePodatki.vremenskiPodatki, "vreme");
    const znamenitosti = seznam(znamenitostiPodatki.znamenitosti, "znamenitost");

    // Povezovanje podatkov prek ID-jev
    const lokacijePoId = new Map(
        lokacije.map(lokacija => [lokacija["@_id"], lokacija])
    );

    const vremePoLokaciji = new Map(
        vreme.map(zapis => [zapis["@_lokacijaId"], zapis])
    );

    const povezaneZnamenitosti = znamenitosti.map(znamenitost => {
        const lokacijaId = znamenitost["@_lokacijaId"];
        const lokacija = lokacijePoId.get(lokacijaId);
        const vremenskiPodatek = vremePoLokaciji.get(lokacijaId);

        return {
            id: znamenitost["@_id"],
            ime: znamenitost.ime,
            vrsta: znamenitost.vrsta,
            cenaVstopnine: znamenitost.cenaVstopnine,
            ocena: znamenitost.ocena,
            datumDodajanja: znamenitost.datumDodajanja || null,
            lokacijaId,
            mesto: lokacija ? lokacija.ime : "Neznano",
            drzava: lokacija ? lokacija.drzava : "Neznano",
            datumVremena: vremenskiPodatek?.datum ?? null,
            temperatura: vremenskiPodatek?.temperatura ?? null,
            stanjeVremena: vremenskiPodatek?.stanje ?? null
        };
    });

    // Filter: znamenitosti v Mariboru
    const izbranoMesto = "Maribor";

    const filtrirano = povezaneZnamenitosti.filter(
        zapis => zapis.mesto.toLowerCase() === izbranoMesto.toLowerCase()
    );

    // Pregleden izpis v konzolo
    console.log(`\nZnamenitosti v mestu ${izbranoMesto}:`);
    console.table(filtrirano);

    // Izvoz v JSON
    const jsonPot = path.join(__dirname, "..", "filtrirano.json");
    fs.writeFileSync(jsonPot, JSON.stringify(filtrirano, null, 2), "utf8");

    // Izvoz istih rezultatov v XML
    const xmlPot = path.join(__dirname, "..", "filtrirano.xml");
    const xmlVsebina = builder.build({
        filtriraneZnamenitosti: {
            znamenitost: filtrirano.map(zapis => ({
                "@_id": zapis.id,
                "@_lokacijaId": zapis.lokacijaId,
                ime: zapis.ime,
                vrsta: zapis.vrsta,
                cenaVstopnine: zapis.cenaVstopnine,
                ocena: zapis.ocena,
                datumDodajanja: zapis.datumDodajanja ?? "",
                mesto: zapis.mesto,
                drzava: zapis.drzava,
                datumVremena: zapis.datumVremena ?? "",
                temperatura: zapis.temperatura ?? "",
                stanjeVremena: zapis.stanjeVremena ?? ""
            }))
        }
    });

    fs.writeFileSync(xmlPot, '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlVsebina, "utf8");

    console.log("\nIzvoz je uspel!");
    console.log("Ustvarjeni datoteki: filtrirano.json in filtrirano.xml");
} catch (napaka) {
    console.error("Prišlo je do napake:", napaka.message);
}