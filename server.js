require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const Px = require('px');
const { ustvariNacrt } = require('./src/aiPlanner');

const app = express();
const PORT = 3000;
app.use(express.json());
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

/**
 * API za ustvarjanje AI načrta izleta.
 * Podatke prejme s spletne strani in jih pošlje Gemini.
 */
app.post('/api/ai-izlet', async (req, res) => {
    try {
        const { kraj, datum, vrsta, trajanje } = req.body || {};

        // Preverimo uporabniške podatke
        const podatki = [kraj, datum, vrsta, trajanje];

        if (podatki.some(v =>
            typeof v !== 'string' ||
            v.trim().length === 0 ||
            v.length > 150
        )) {
            return res.status(400).json({
                napaka: 'Izpolniti moraš vsa polja za načrt izleta.'
            });
        }

        // Pokličemo Gemini in dobimo objekt NacrtIzleta
        const nacrt = await ustvariNacrt(
            kraj.trim(),
            datum.trim(),
            vrsta.trim(),
            trajanje.trim()
        );

        // Pošljemo JSON nazaj spletni strani
        res.json(nacrt);

    } catch (napaka) {
        console.error('Napaka Gemini:', napaka.message);

        res.status(500).json({
            napaka: 'AI načrta trenutno ni mogoče ustvariti. Poskusi znova.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Strežnik deluje na http://localhost:${PORT}`);
});
