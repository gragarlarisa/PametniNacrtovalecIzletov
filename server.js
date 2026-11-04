
const express = require('express');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const Px = require('px');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Preberemo PC-Axis datoteko
function preberiPodatke() {
    const pot = path.join(__dirname, 'data', 'turizem.px');
    const buffer = fs.readFileSync(pot);
    const besedilo = iconv.decode(buffer, 'windows-1250');

    return new Px(besedilo);
}

// API za seznam občin in let
app.get('/api/moznosti', (req, res) => {
    try {
        const podatki = preberiPodatke();

        const obcine = podatki.values('OBČINE');
        const leta = [...new Set(
            podatki.values('MESEC').map(m => m.substring(0, 4))
        )];

        res.json({ obcine, leta });
    } catch (napaka) {
        res.status(500).json({ napaka: napaka.message });
    }
});

// API za turistično statistiko
app.get('/api/turizem', (req, res) => {
    try {
        const podatki = preberiPodatke();

        const obcina = req.query.obcina || 'Bled';
        const leto = req.query.leto || '2025';
        const meritev = req.query.meritev || 'Prihodi turistov';

        const meseci = podatki.values('MESEC');
        const obcine = podatki.values('OBČINE');
        const drzave = podatki.values('DRŽAVA');
        const meritve = podatki.values('MERITVE');

        const obcinaIndex = obcine.indexOf(obcina);
        const drzavaIndex = drzave.indexOf('0 Država - SKUPAJ');
        const meritevIndex = meritve.indexOf(meritev);

        if (obcinaIndex === -1 || meritevIndex === -1) {
            return res.status(400).json({
                napaka: 'Neveljavna občina ali meritev.'
            });
        }

        const rezultat = [];

        meseci.forEach((mesec, mesecIndex) => {
            if (mesec.startsWith(leto)) {
                const vrednost = podatki.datum([
                    mesecIndex,
                    obcinaIndex,
                    drzavaIndex,
                    meritevIndex
                ]);

                const stevilo = Number(vrednost);

                rezultat.push({
                    mesec: mesec,
                    vrednost: vrednost.trim() !== '' &&
                              Number.isFinite(stevilo)
                        ? stevilo
                        : null
                });
            }
        });

        res.json({
            obcina,
            leto,
            meritev,
            podatki: rezultat
        });

    } catch (napaka) {
        res.status(500).json({ napaka: napaka.message });
    }
});

app.listen(PORT, () => {
    console.log(`Strežnik deluje na http://localhost:${PORT}`);
});
