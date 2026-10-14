# 🌍 Pametni načrtovalec izletov

## Opis projekta

Pametni načrtovalec izletov je aplikacija, ki združuje podatke o lokacijah, vremenu in turističnih znamenitostih. Podatki so shranjeni v XML-datotekah, aplikacija pa jih prebere, poveže prek ID-jev in omogoča filtriranje znamenitosti glede na izbrano mesto.

## Uporabljene tehnologije

- JavaScript
- Node.js
- XML
- JSON
- Knjižnica `fast-xml-parser`

## Struktura projekta

- `data/lokacije.xml` – podatki o lokacijah.
- `data/vreme.xml` – vremenski podatki, povezani z lokacijami.
- `data/znamenitosti.xml` – turistične znamenitosti, povezane z lokacijami.
- `src/app.js` – izvorna koda aplikacije.
- `filtrirano.json` – filtrirani rezultati v formatu JSON.
- `filtrirano.xml` – filtrirani rezultati v formatu XML.

## Namestitev

Za delovanje potrebujemo nameščen Node.js.

V terminalu v glavni mapi projekta izvedemo:

```bash
npm install
```

## Zagon aplikacije

Za prikaz znamenitosti v Mariboru:

```bash
node src/app.js Maribor
```

Za prikaz znamenitosti v Ljubljani:

```bash
node src/app.js Ljubljana
```

Za prikaz znamenitosti na Bledu:

```bash
node src/app.js Bled
```

Če mesto ni podano, aplikacija privzeto uporabi Maribor.

## Delovanje aplikacije

Aplikacija prebere vse tri XML-datoteke in podatke pretvori v JavaScript objekte. Nato poveže lokacije, vreme in znamenitosti prek ID-jev. Glede na izbrano mesto filtrira znamenitosti, jih izpiše v konzolo ter shrani rezultate v datoteki `filtrirano.json` in `filtrirano.xml`.

## Primer uporabe

Ukaz:

```bash
node src/app.js Ljubljana
```

Aplikacija izpiše znamenitosti v Ljubljani, na primer Ljubljanski grad in Tromostovje, skupaj s podatki o lokaciji in vremenu.

## Avtorica

Larisa Gragar