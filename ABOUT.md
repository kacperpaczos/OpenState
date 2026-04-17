# Manifest i Założenia (ABOUT.md)

## Cel Domeny
OpenOurGov (OpenState) jest systemem agregacji, weryfikacji, normalizacji i udostępniania polskiego procesu legislacyjnego. Stanowi odpowiedź na powolne, niestabilne strukturalnie oraz nieprzejrzyste rządowe źródła informacji. Zadaniem oprogramowania jest kompresja prawnej biurokracji do analitycznej i przejrzystej formy (estetyka *GovApple*) gotowej do szybkiej konsumpcji przez świadomego obywatela.  

## First Principles Prawdy Projektu

Architektura i kod muszą opierać się na następujących nienaruszalnych zasadach (First Principles):

1. **Dane źródłowe są zepsute, brudne i nieprzewidywalne:** 
   Załóż, że formatowanie na `senat.gov.pl` zmieni się bez powiadomienia, a odpowiedź z Sejmu API zrzuci wyjątek HTTP 500 albo wypluje niestrukturyzowany JSON. System musi to przewidzieć.
2. **Absolutna niezawodność, nie ufaj sieci:** 
   Obywatel ma czytać naszą własną, znormalizowaną wersję bazy danych. Nasze serwery nigdy nie wywołują API rządu na żądanie użytkownika. Cały ruch (odczyt z Next.js) jest w 100% odseparowany poprzez bufor relacyjnej bazy PostgreSQL.
3. **Interfejs służy do szybkiej weryfikacji faktów, a nie do zabawy:** 
   Każdy przycisk, tabela i grafika mają maksymalizować Gęstość Informacji (Information Density). Usuwamy zbędne ozdobniki. Kolor gra rolę semantyczną (np. różnice wizualne w aktach - diff zielony/czerwony). 
4. **Idempotentność:** 
   Uruchamianie pipeline'ów ekstrakcyjnych (scraperów) i migracyjnych na tej samej próbie danych tysiąc razy z rzędu nie może uszkodzić, zduplikować ani zmodyfikować stanu bazy na błędny.  

## Wykorzystywane Źródła Danych Rządowych

Zidentyfikowane i wykorzystywane na produkcji kluczowe wektory danych wejściowych:

* **API Sejmu RP (JSON):** 
  * `https://api.sejm.gov.pl/sejm/term10`
  * Agreguje dane ustrukturyzowane posłów, procesów (druki, ustawy, interpelacje, głosowania).
* **Witryna Senatu RP (HTML/Scraping):**
  * `https://www.senat.gov.pl`
  * Agreguje i parsuje metodą 'brute-force' strukturę obrad, głosowań oraz profil senatorów z powodu braku dedykowanego publicznego API.
* **Rządowe Centrum Legislacji (RCL API / XML):**
  * `https://legislacja.rcl.gov.pl`
  * Punkt dostępu dla etapów ministerialnych przed skierowaniem projektów do Sejmu.
