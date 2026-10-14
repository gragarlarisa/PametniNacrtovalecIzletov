# 🌍 Pametni načrtovalec izletov

## Opis projekta

**Pametni načrtovalec izletov** je spletna aplikacija, ki uporabniku pomaga pri načrtovanju izleta. Uporabnik vnese želeno lokacijo in datum, aplikacija pa s pomočjo več zunanjih spletnih storitev pridobi podatke o lokaciji, vremenski napovedi in zanimivostih v okolici.

Glavni namen projekta je prikazati **integracijo več zunanjih REST API storitev** v eno aplikacijo ter prenos, obdelavo in prikaz podatkov, pridobljenih iz različnih virov.

## Funkcionalnosti

Aplikacija bo omogočala:

- iskanje izbrane lokacije,
- pridobivanje geografskih koordinat lokacije,
- prikaz vremenske napovedi,
- iskanje zanimivosti in objektov v bližini,
- prikaz vseh pridobljenih podatkov na enem mestu.

## Načrt integracije storitev

Aplikacija bo povezovala tri zunanje spletne storitve:

1. **Nominatim / OpenStreetMap** – za iskanje lokacije in pridobivanje geografskih koordinat.
2. **Open-Meteo** – za pridobivanje vremenske napovedi na podlagi geografskih koordinat.
3. **Overpass API / OpenStreetMap** – za iskanje zanimivosti in drugih objektov v okolici izbrane lokacije.

Potek integracije bo naslednji:

**Uporabnik vnese lokacijo → Nominatim → koordinate → Open-Meteo + Overpass API → podatki o vremenu in zanimivostih → prikaz v aplikaciji**

Ko uporabnik vnese ime lokacije, aplikacija najprej uporabi Nominatim za določitev geografskih koordinat. Pridobljeni koordinati se nato uporabita pri zahtevah do Open-Meteo in Overpass API-ja.

## Uporabljene storitve

### 1. Nominatim / OpenStreetMap

Nominatim je storitev za iskanje lokacij na podlagi podatkov OpenStreetMap.

V projektu se uporablja za pretvorbo uporabnikovega vnosa lokacije v geografske koordinate.

**Vhodni podatki:**
- ime oziroma naslov lokacije,
- parametri zahteve API-ju.

**Izhodni podatki:**
- ime lokacije,
- zemljepisna širina (latitude),
- zemljepisna dolžina (longitude),
- dodatni podatki o lokaciji.

**Oblika podatkov:** JSON

**Dokumentacija:**  
https://nominatim.org/release-docs/latest/api/Search/

---

### 2. Open-Meteo

Open-Meteo je vremenski API, ki omogoča pridobivanje vremenskih podatkov na podlagi geografskih koordinat.

V projektu se uporablja za pridobivanje vremenske napovedi za izbrano lokacijo.

**Vhodni podatki:**
- zemljepisna širina,
- zemljepisna dolžina,
- zahtevani vremenski parametri,
- datum oziroma časovno obdobje.

**Izhodni podatki:**
- temperatura,
- vremenski pojav,
- hitrost vetra,
- vremenska napoved po urah oziroma dnevih.

**Oblika podatkov:** JSON

**Dokumentacija:**  
https://open-meteo.com/en/docs

---

### 3. Overpass API / OpenStreetMap

Overpass API omogoča iskanje in pridobivanje podatkov iz OpenStreetMap glede na določene kriterije.

V projektu se uporablja za iskanje zanimivosti in drugih objektov v okolici izbrane lokacije.

**Vhodni podatki:**
- zemljepisna širina,
- zemljepisna dolžina,
- radij iskanja,
- vrsta oziroma kategorija objektov.

**Izhodni podatki:**
- ime objekta,
- vrsta objekta,
- zemljepisna širina,
- zemljepisna dolžina,
- dodatni podatki, če so na voljo.

**Oblika podatkov:** JSON

**Dokumentacija:**  
https://wiki.openstreetmap.org/wiki/Overpass_API

---

## Podatki, ki se prenašajo

Med aplikacijo in zunanjimi storitvami se bodo podatki prenašali preko **REST API zahtev**.

Podatki bodo večinoma zapisani v formatu **JSON**.

### Primer podatkov o lokaciji

Po iskanju lokacije Nominatim vrne podatke, med katerimi aplikacija uporabi predvsem:

```json
{
  "display_name": "Maribor, Slovenia",
  "lat": "46.5547",
  "lon": "15.6459"
}
```

Iz teh podatkov aplikacija pridobi koordinati, ki ju nato uporabi pri drugih zahtevah.

### Primer vremenskih podatkov

Open-Meteo vrne vremenske podatke v obliki JSON, na primer:

```json
{
  "latitude": 46.5547,
  "longitude": 15.6459,
  "current": {
    "temperature_2m": 18.5,
    "wind_speed_10m": 12.4
  }
}
```

Aplikacija iz odgovora izbere podatke, ki jih potrebuje za prikaz vremenske napovedi.

### Primer podatkov o zanimivostih

Overpass API lahko vrne podatke o objektih v okolici izbrane lokacije, na primer:

```json
{
  "type": "node",
  "lat": 46.5547,
  "lon": 15.6459,
  "tags": {
    "name": "Primer objekta",
    "tourism": "attraction"
  }
}
```

Aplikacija iz odgovora pridobi predvsem ime, vrsto in lokacijo zanimivosti.

## Način komunikacije

Komunikacija med aplikacijo in zunanjimi storitvami bo potekala preko **HTTP/HTTPS zahtev**.

Uporabljene bodo predvsem:

- **GET** zahteve za pridobivanje podatkov,
- **REST API** kot način komunikacije,
- **JSON** kot format prenosa podatkov.

Podatki, pridobljeni iz ene storitve, se bodo uporabili kot vhodni podatki za drugo storitev. Primer tega je uporaba koordinat, pridobljenih iz Nominatim, pri klicu Open-Meteo in Overpass API-ja.

## Tehnologije

- JavaScript
- HTML
- CSS
- REST API
- HTTP/HTTPS
- JSON
- OpenStreetMap
- Nominatim
- Open-Meteo
- Overpass API

Seznam tehnologij se lahko med nadaljevanjem projekta spremeni oziroma dopolni.

## Namen projekta

Namen projekta je izdelati aplikacijo, ki bo povezovala več zunanjih spletnih storitev in uporabniku na enem mestu prikazala podatke, ki so pomembni pri načrtovanju izleta.

Projekt bo prikazal:

- uporabo zunanjih REST API storitev,
- komunikacijo med različnimi sistemi,
- prenos podatkov v formatu JSON,
- uporabo podatkov ene storitve kot vhod za drugo storitev,
- obdelavo pridobljenih podatkov,
- združevanje podatkov iz več različnih virov.

## Dokumentacija uporabljenih storitev

- **Nominatim API:** https://nominatim.org/release-docs/latest/api/Search/
- **Open-Meteo API:** https://open-meteo.com/en/docs
- **Overpass API:** https://wiki.openstreetmap.org/wiki/Overpass_API
- **OpenStreetMap:** https://www.openstreetmap.org/

## Avtor

**Larisa Gragar**
