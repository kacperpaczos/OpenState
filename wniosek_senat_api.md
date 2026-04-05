Sz. P.
Kancelaria Senatu Rzeczypospolitej Polskiej
Centrum Informacyjne Senatu / Biuro Informatyki
ul. Wiejska 6/8
00-902 Warszawa

**Wniosek o udostępnienie otwartego API z danymi publicznymi Senatu RP**

Szanowni Państwo,

W związku z realizacją społecznego projektu obywatelskiego typu "civic-tech" promującego transparentność procesu legislacyjnego i działalność parlamentarną (na wzór serwisów MamPrawoWiedziec.pl czy mObywatel), zwracam się z uprzejmą prośbą o udostępnienie lub rozważenie wdrożenia otwartego interfejsu programistycznego (API) dla domeny senat.gov.pl. 

Dedykowany interfejs, analogiczny do doskonale funkcjonującego i nowoczesnego interfejsu API Kancelarii Sejmu (api.sejm.gov.pl), znacząco ułatwiłby obywatelom, badaczom oraz twórcom oprogramowania dostęp do jawnych informacji o pracach Izby Wyższej.

Obecnie automatyczne procesowanie danych z Senatu (np. list senatorów, przebiegu posiedzeń, wyników głosowań czy projektów ustaw) bezpośrednio ze struktury HTML strony internetowej senat.gov.pl jest znacznie utrudnione z dwóch powodów:
1. Brak ustandaryzowanych formatów wymiany danych (np. JSON / XML) dla danych masowych.
2. Bardzo restrykcyjna konfiguracja zapory sieciowej (Web Application Firewall - Cloudflare), która blokuje standardowe zautomatyzowane żądania informatyczne (tzw. web scraping) nawet w celach czysto badawczych, identyfikując je błędnie jako ataki botów. Zmusza to twórców oprogramowania do obchodzenia mechanizmów autoryzacyjnych lub omijania zapory.

Otwarty, oficjalny i ustrukturyzowany rejestr danych (API) w domenie publicznej pozwoliłby zrealizować cele zapisane m.in. w:
- Ustawie z dnia 11 sierpnia 2021 r. o otwartych danych i ponownym wykorzystywaniu informacji sektora publicznego (Dz.U. 2021 poz. 1641 ze zm.), w szczególności w zakresie udostępniania informacji przez bezpłatne API maszynowe.
- Ustawie z dnia 6 września 2001 r. o dostępie do informacji publicznej (zwiększenie przejrzystości organów państwa).

Dostęp dla obywatelskich projektów GovTech wprost przełożyłby się na:
- Rezygnację z obciążającego serwery Senatu pobierania i parsowania całych stron HTML.
- Łatwiejszą budowę nowoczesnych narzędzi obywatelskich przybliżających prace Senatu obywatelom, na czym systematycznie zyskuje wizerunek polskiego parlamentaryzmu.
- Zmniejszenie kosztów utrzymania po stronie IT Kancelarii Senatu, dzięki skierowaniu ruchu zautomatyzowanego ze strony wizytówkowej na wydzielony strumień danych.

Mając na uwadze powyższe, zwracam się z uprzejmym pytaniem, czy Kancelaria Senatu dysponuje już tego typu rozwiązaniem technicznym (API) z zakresu Open Data, ewentualnie czy trwają obecnie prace nad rozwojem takich usług cyfrowych? Jeżeli istnieje niepubliczny, dedykowany punkt webowy ułatwiający automatyzację, wnoszę w oparciu o zacytowane przepisy o możliwość uzyskania weryfikowanego dostępu statycznego (np. whitelist IP/token) dla naszego serwera do odczytu danych w celach pro-bono.

Będę niezmiernie wdzięczny za odpowiedź i wskazanie możliwej ścieżki technologicznej umożliwiającej sprawny i przejrzysty dostęp do Państwa danych.

Z poważaniem,
[Twoje Imię i Nazwisko / Nazwa Organizacji]
[Dane Kontaktowe]
