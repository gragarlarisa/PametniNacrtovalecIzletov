# 🌍 Pametni načrtovalec izletov

## Opis projekta

Pametni načrtovalec izletov je projekt, ki združuje podatke o lokacijah, vremenu in turističnih znamenitostih. Podatki so shranjeni v XML-datotekah, aplikacija pa jih prebere, poveže prek ID-jev in omogoča filtriranje znamenitosti glede na izbrano mesto.

Projekt vključuje tudi spletni razčlenjevalnik, ki s spletne strani Visit Ljubljana pridobiva podatke o turističnih lokacijah. Pridobljene podatke shrani v datoteko JSON.

## Uporabljene tehnologije

- JavaScript
- Node.js
- XML
- JSON
- `fast-xml-parser`
- Puppeteer
- HTML in DOM

## Struktura projekta

- `data/lokacije.xml` – podatki o lokacijah.
- `data/vreme.xml` – vremenski podatki, povezani z lokacijami.
- `data/znamenitosti.xml` – turistične znamenitosti, povezane z lokacijami.
- `data/znamenitosti-splet.json` – podatki o turističnih lokacijah, pridobljeni s spletno stranjo.
- `src/app.js` – izvorna koda glavne aplikacije.
- `src/parser.js` – izvorna koda spletnega razčlenjevalnika.
- `filtrirano.json` – filtrirani rezultati v formatu JSON.
- `filtrirano.xml` – filtrirani rezultati v formatu XML.

## Namestitev

Za delovanje projekta potrebujemo nameščen Node.js.

V terminalu v glavni mapi projekta izvedemo ukaz:

```bash
npm install
```

S tem namestimo potrebne knjižnice, določene v datoteki `package.json`, vključno s knjižnicama `fast-xml-parser` in `puppeteer`.

## Zagon glavne aplikacije

Za prikaz znamenitosti v Mariboru zaženemo:

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

## Zagon spletnega razčlenjevalnika

Spletni razčlenjevalnik zaženemo z ukazom:

```bash
node src/parser.js
```

Razčlenjevalnik s pomočjo knjižnice Puppeteer odpre spletno stran [Visit Ljubljana](https://www.visitljubljana.com/en/poi/), poišče povezave do turističnih lokacij in obišče njihove podstrani.

Na podstraneh poskuša pridobiti opis lokacije. Pri tem preveri besedilo v glavni vsebini strani in metapodatke. Če ustreznega opisa ne najde, shrani obvestilo, da opis ni na voljo.

Pridobljene podatke shrani v datoteko `data/znamenitosti-splet.json`. Za vsako lokacijo se shranijo ime, povezava in opis.

Razčlenjevalnik trenutno obdela največ devet različnih povezav.

## Delovanje glavne aplikacije

Aplikacija prebere vse tri XML-datoteke in podatke pretvori v JavaScript objekte. Nato poveže lokacije, vremenske podatke in znamenitosti prek ID-jev. Glede na izbrano mesto filtrira znamenitosti, jih izpiše v konzolo ter shrani rezultate v datoteki `filtrirano.json` in `filtrirano.xml`.

## Primer uporabe

Ukaz:

```bash
node src/app.js Ljubljana
```

Aplikacija izpiše znamenitosti v Ljubljani skupaj s podatki o lokaciji in vremenu.

Spletni razčlenjevalnik pa lahko zaženemo ločeno:

```bash
node src/parser.js
```

Ta pridobi podatke s spletne strani Visit Ljubljana in jih shrani v JSON-datoteko.

## Avtorica

Larisa Gragar