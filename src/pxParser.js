
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const Px = require('px');

// Pot do prenesene PC-Axis datoteke
const pot = path.join(__dirname, '..', 'data', 'turizem.px');

// Preberemo datoteko s pravilnim kodiranjem
const buffer = fs.readFileSync(pot);
const besedilo = iconv.decode(buffer, 'windows-1250');

// Razčlenimo PC-Axis podatke
const podatki = new Px(besedilo);

// Izpišemo osnovne informacije
console.log('Naslov:', podatki.title());
console.log('Dimenzije:', podatki.variables());

console.log('Prvih 10 mesecev:',
    podatki.values('MESEC').slice(0, 10));

console.log('Prvih 10 občin:',
    podatki.values('OBČINE').slice(0, 10));

console.log('Prve države:',
    podatki.values('DRŽAVA').slice(0, 10));

console.log('Meritve:',
    podatki.values('MERITVE'));


console.log('\nTEST: Prihodi turistov na Bledu');

// Poiščemo indekse posameznih vrednosti
const mesecIndex = podatki.values('MESEC').indexOf('2020M01');
const obcinaIndex = podatki.values('OBČINE').indexOf('Bled');
const drzavaIndex = podatki.values('DRŽAVA').indexOf('0 Država - SKUPAJ');
const meritevIndex = podatki.values('MERITVE').indexOf('Prihodi turistov');

console.log('Indeksi:', [
    mesecIndex,
    obcinaIndex,
    drzavaIndex,
    meritevIndex
]);

// Pridobimo dejansko statistično vrednost
const rezultat = podatki.datum([
    mesecIndex,
    obcinaIndex,
    drzavaIndex,
    meritevIndex
]);

console.log('Prihodi turistov na Bledu januarja 2020:', rezultat);
console.log('Tip podatka:', typeof rezultat);
