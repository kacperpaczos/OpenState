// Dane pobrane z API Sejmu RP (api.sejm.gov.pl)
// Data pobrania: 2026-01-19T19:08:32.617Z

const realMpsData = [
  {
    "id": 1,
    "name": "Andrzej Adamczyk",
    "club": "PiS",
    "district": "Kraków",
    "votes": 45171,
    "email": "Andrzej.Adamczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/1/photo"
  },
  {
    "id": 2,
    "name": "Piotr Adamowicz",
    "club": "KO",
    "district": "Gdańsk",
    "votes": 23147,
    "email": "Piotr.Adamowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/2/photo"
  },
  {
    "id": 4,
    "name": "Waldemar Andzel",
    "club": "PiS",
    "district": "Katowice",
    "votes": 22699,
    "email": "Waldemar.Andzel@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/4/photo"
  },
  {
    "id": 5,
    "name": "Dorota Arciszewska-Mielewczyk",
    "club": "PiS",
    "district": "Słupsk",
    "votes": 11766,
    "email": "Dorota.Arciszewska-Mielewczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/5/photo"
  },
  {
    "id": 6,
    "name": "Jan Krzysztof Ardanowski",
    "club": "Republikanie",
    "district": "Toruń",
    "votes": 28658,
    "email": "Jan.Ardanowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/6/photo"
  },
  {
    "id": 7,
    "name": "Iwona Ewa Arent",
    "club": "PiS",
    "district": "Olsztyn",
    "votes": 16675,
    "email": "Iwona.Arent@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/7/photo"
  },
  {
    "id": 9,
    "name": "Marek Ast",
    "club": "PiS",
    "district": "Zielona Góra",
    "votes": 36365,
    "email": "Marek.Ast@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/9/photo"
  },
  {
    "id": 10,
    "name": "Urszula Augustyn",
    "club": "KO",
    "district": "Tarnów",
    "votes": 27047,
    "email": "Urszula.Augustyn@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/10/photo"
  },
  {
    "id": 11,
    "name": "Piotr Babinetz",
    "club": "PiS",
    "district": "Krosno",
    "votes": 12829,
    "email": "Piotr.Babinetz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/11/photo"
  },
  {
    "id": 12,
    "name": "Ryszard Bartosik",
    "club": "PiS",
    "district": "Konin",
    "votes": 25371,
    "email": "Ryszard.Bartosik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/12/photo"
  },
  {
    "id": 13,
    "name": "Władysław Bartoszewski",
    "club": "PSL-TD",
    "district": "Warszawa",
    "votes": 34563,
    "email": "Wladyslaw.Bartoszewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/13/photo"
  },
  {
    "id": 14,
    "name": "Barbara Bartuś",
    "club": "PiS",
    "district": "Nowy Sącz",
    "votes": 21250,
    "email": "Barbara.Bartus@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/14/photo"
  },
  {
    "id": 15,
    "name": "Paweł Bejda",
    "club": "PSL-TD",
    "district": "Sieradz",
    "votes": 25363,
    "email": "Pawel.Bejda@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/15/photo"
  },
  {
    "id": 16,
    "name": "Konrad Berkowicz",
    "club": "Konfederacja",
    "district": "Kraków",
    "votes": 36918,
    "email": "Konrad.Berkowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/16/photo"
  },
  {
    "id": 17,
    "name": "Sylwia Bielawska",
    "club": "KO",
    "district": "Wałbrzych",
    "votes": 17577,
    "email": "Sylwia.Bielawska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/17/photo"
  },
  {
    "id": 18,
    "name": "Marek Biernacki",
    "club": "PSL-TD",
    "district": "Słupsk",
    "votes": 34369,
    "email": "Marek.Biernacki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/18/photo"
  },
  {
    "id": 19,
    "name": "Paweł Bliźniuk",
    "club": "KO",
    "district": "Łódź",
    "votes": 12315,
    "email": "Pawel.Blizniuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/19/photo"
  },
  {
    "id": 20,
    "name": "Mariusz Błaszczak",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 127578,
    "email": "Mariusz.Blaszczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/20/photo"
  },
  {
    "id": 21,
    "name": "Mateusz Bochenek",
    "club": "KO",
    "district": "Katowice",
    "votes": 15117,
    "email": "Mateusz.Bochenek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/21/photo"
  },
  {
    "id": 22,
    "name": "Rafał Bochenek",
    "club": "PiS",
    "district": "Kraków",
    "votes": 42142,
    "email": "Rafal.Bochenek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/22/photo"
  },
  {
    "id": 23,
    "name": "Izabela Bodnar",
    "club": "niez.",
    "district": "Wrocław",
    "votes": 26404,
    "email": "Izabela.Bodnar@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/23/photo"
  },
  {
    "id": 24,
    "name": "Jacek Bogucki",
    "club": "PiS",
    "district": "Białystok",
    "votes": 12032,
    "email": "Jacek.Bogucki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/24/photo"
  },
  {
    "id": 26,
    "name": "Krzysztof Bojarski",
    "club": "KO",
    "district": "Lublin",
    "votes": 10672,
    "email": "Krzysztof.Bojarski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/26/photo"
  },
  {
    "id": 27,
    "name": "Joanna Borowiak",
    "club": "PiS",
    "district": "Toruń",
    "votes": 25995,
    "email": "Joanna.Borowiak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/27/photo"
  },
  {
    "id": 28,
    "name": "Kamil Bortniczuk",
    "club": "PiS",
    "district": "Płock",
    "votes": 31555,
    "email": "Kamil.Bortniczuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/28/photo"
  },
  {
    "id": 29,
    "name": "Piotr Borys",
    "club": "KO",
    "district": "Legnica",
    "votes": 44912,
    "email": "Piotr.Borys@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/29/photo"
  },
  {
    "id": 30,
    "name": "Bożena Borys-Szopa",
    "club": "PiS",
    "district": "Katowice",
    "votes": 30445,
    "email": "Bozena.Borys-Szopa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/30/photo"
  },
  {
    "id": 31,
    "name": "Marcin Bosacki",
    "club": "KO",
    "district": "Poznań",
    "votes": 24197,
    "email": "Marcin.Bosacki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/31/photo"
  },
  {
    "id": 32,
    "name": "Karina Anna Bosak",
    "club": "Konfederacja",
    "district": "Warszawa",
    "votes": 21217,
    "email": "Karina.Bosak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/32/photo"
  },
  {
    "id": 33,
    "name": "Krzysztof Bosak",
    "club": "Konfederacja",
    "district": "Białystok",
    "votes": 44902,
    "email": "Krzysztof.Bosak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/33/photo"
  },
  {
    "id": 36,
    "name": "Agnieszka Buczyńska",
    "club": "Polska2050",
    "district": "Gdańsk",
    "votes": 35213,
    "email": "Agnieszka.Buczynska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/36/photo"
  },
  {
    "id": 39,
    "name": "Elżbieta Burkiewicz",
    "club": "Polska2050",
    "district": "Rzeszów",
    "votes": 11582,
    "email": "Elzbieta.Burkiewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/39/photo"
  },
  {
    "id": 40,
    "name": "Lidia Burzyńska",
    "club": "PiS",
    "district": "Częstochowa",
    "votes": 49713,
    "email": "Lidia.Burzynska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/40/photo"
  },
  {
    "id": 41,
    "name": "Marek Jan Chmielewski",
    "club": "KO",
    "district": "Wałbrzych",
    "votes": 9108,
    "email": "Marek.Chmielewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/41/photo"
  },
  {
    "id": 42,
    "name": "Zbigniew Chmielowiec",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 18574,
    "email": "Zbigniew.Chmielowiec@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/42/photo"
  },
  {
    "id": 43,
    "name": "Artur Chojecki",
    "club": "PiS",
    "district": "Olsztyn",
    "votes": 17418,
    "email": "Artur.Chojecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/43/photo"
  },
  {
    "id": 44,
    "name": "Kazimierz Bogusław Choma",
    "club": "PiS",
    "district": "Lublin",
    "votes": 8363,
    "email": "Kazimierz.Choma@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/44/photo"
  },
  {
    "id": 45,
    "name": "Dominika Chorosińska",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 9582,
    "email": "Dominika.Chorosinska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/45/photo"
  },
  {
    "id": 46,
    "name": "Tadeusz Chrzan",
    "club": "PiS",
    "district": "Krosno",
    "votes": 12184,
    "email": "Tadeusz.Chrzan@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/46/photo"
  },
  {
    "id": 47,
    "name": "Alicja Chybicka",
    "club": "KO",
    "district": "Wrocław",
    "votes": 78816,
    "email": "Alicja.Chybicka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/47/photo"
  },
  {
    "id": 48,
    "name": "Anna Ewa Cicholska",
    "club": "PiS",
    "district": "Płock",
    "votes": 19074,
    "email": "Anna.Cicholska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/48/photo"
  },
  {
    "id": 49,
    "name": "Janusz Cichoń",
    "club": "KO",
    "district": "Olsztyn",
    "votes": 32356,
    "email": "Janusz.Cichon@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/49/photo"
  },
  {
    "id": 50,
    "name": "Krzysztof Ciecióra",
    "club": "PiS",
    "district": "Piotrków Trybunalski",
    "votes": 10426,
    "email": "Krzysztof.Cieciora@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/50/photo"
  },
  {
    "id": 51,
    "name": "Janusz Cieszyński",
    "club": "PiS",
    "district": "Olsztyn",
    "votes": 20644,
    "email": "Janusz.Cieszynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/51/photo"
  },
  {
    "id": 52,
    "name": "Michał Cieślak",
    "club": "PiS",
    "district": "Kielce",
    "votes": 5629,
    "email": "Michal.Cieslak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/52/photo"
  },
  {
    "id": 53,
    "name": "Żaneta Cwalina-Śliwowska",
    "club": "Polska2050",
    "district": "Siedlce",
    "votes": 9747,
    "email": "Zaneta.Cwalina-Sliwowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/53/photo"
  },
  {
    "id": 54,
    "name": "Krzysztof Czarnecki",
    "club": "PiS",
    "district": "Piła",
    "votes": 37420,
    "email": "Krzysztof.Czarnecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/54/photo"
  },
  {
    "id": 55,
    "name": "Witold Wojciech Czarnecki",
    "club": "PiS",
    "district": "Konin",
    "votes": 17601,
    "email": "Witold.Czarnecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/55/photo"
  },
  {
    "id": 56,
    "name": "Przemysław Czarnek",
    "club": "PiS",
    "district": "Lublin",
    "votes": 121686,
    "email": "Przemyslaw.Czarnek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/56/photo"
  },
  {
    "id": 57,
    "name": "Arkadiusz Czartoryski",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 15845,
    "email": "Arkadiusz.Czartoryski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/57/photo"
  },
  {
    "id": 58,
    "name": "Włodzimierz Czarzasty",
    "club": "Lewica",
    "district": "Katowice",
    "votes": 22332,
    "email": "Wlodzimierz.Czarzasty@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/58/photo"
  },
  {
    "id": 59,
    "name": "Jacek Czerniak",
    "club": "Lewica",
    "district": "Lublin",
    "votes": 10910,
    "email": "Jacek.Czerniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/59/photo"
  },
  {
    "id": 60,
    "name": "Zofia Czernow",
    "club": "KO",
    "district": "Legnica",
    "votes": 30258,
    "email": "Zofia.Czernow@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/60/photo"
  },
  {
    "id": 61,
    "name": "Anita Czerwińska",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 18443,
    "email": "Anita.Czerwinska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/61/photo"
  },
  {
    "id": 62,
    "name": "Katarzyna Czochara",
    "club": "PiS",
    "district": "Opole",
    "votes": 20004,
    "email": "Katarzyna.Czochara@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/62/photo"
  },
  {
    "id": 63,
    "name": "Sławomir Ćwik",
    "club": "Polska2050",
    "district": "Chełm",
    "votes": 8004,
    "email": "Slawomir.Cwik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/63/photo"
  },
  {
    "id": 64,
    "name": "Władysław Dajczak",
    "club": "PiS",
    "district": "Zielona Góra",
    "votes": 29131,
    "email": "Wladyslaw.Dajczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/64/photo"
  },
  {
    "id": 65,
    "name": "Anna Dąbrowska-Banaszek",
    "club": "PiS",
    "district": "Chełm",
    "votes": 13910,
    "email": "Anna.Dabrowska-Banaszek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/65/photo"
  },
  {
    "id": 66,
    "name": "Zbigniew Dolata",
    "club": "PiS",
    "district": "Konin",
    "votes": 25663,
    "email": "Zbigniew.Dolata@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/66/photo"
  },
  {
    "id": 67,
    "name": "Barbara Dolniak",
    "club": "KO",
    "district": "Katowice",
    "votes": 37470,
    "email": "Barbara.Dolniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/67/photo"
  },
  {
    "id": 68,
    "name": "Andrzej Domański",
    "club": "KO",
    "district": "Warszawa",
    "votes": 6848,
    "email": "Andrzej.Domanski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/68/photo"
  },
  {
    "id": 69,
    "name": "Bartłomiej Dorywalski",
    "club": "PiS",
    "district": "Kielce",
    "votes": 9696,
    "email": "Bartlomiej.Dorywalski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/69/photo"
  },
  {
    "id": 70,
    "name": "Robert Dowhan",
    "club": "KO",
    "district": "Zielona Góra",
    "votes": 14761,
    "email": "Robert.Dowhan@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/70/photo"
  },
  {
    "id": 71,
    "name": "Przemysław Drabek",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 17886,
    "email": "Przemyslaw.Drabek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/71/photo"
  },
  {
    "id": 72,
    "name": "Elżbieta Duda",
    "club": "PiS",
    "district": "Kraków",
    "votes": 11388,
    "email": "Elzbieta.Duda@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/72/photo"
  },
  {
    "id": 74,
    "name": "Adam Dziedzic",
    "club": "PSL-TD",
    "district": "Rzeszów",
    "votes": 24304,
    "email": "Adam.Dziedzic@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/74/photo"
  },
  {
    "id": 75,
    "name": "Jan Michał Dziedziczak",
    "club": "PiS",
    "district": "Kalisz",
    "votes": 14689,
    "email": "Jan.Dziedziczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/75/photo"
  },
  {
    "id": 76,
    "name": "Agnieszka Dziemianowicz-Bąk",
    "club": "Lewica",
    "district": "Słupsk",
    "votes": 30631,
    "email": "Agnieszka.Dziemianowicz-Bak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/76/photo"
  },
  {
    "id": 77,
    "name": "Magdalena Filiks",
    "club": "KO",
    "district": "Szczecin",
    "votes": 40772,
    "email": "Magdalena.Filiks@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/77/photo"
  },
  {
    "id": 78,
    "name": "Magdalena Filipek-Sobczak",
    "club": "PiS",
    "district": "Lublin",
    "votes": 10480,
    "email": "Magdalena.Filipek-Sobczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/78/photo"
  },
  {
    "id": 79,
    "name": "Radosław Fogiel",
    "club": "PiS",
    "district": "Radom",
    "votes": 32791,
    "email": "Radoslaw.Fogiel@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/79/photo"
  },
  {
    "id": 80,
    "name": "Bronisław Foltyn",
    "club": "Konfederacja",
    "district": "Bielsko-Biała",
    "votes": 18134,
    "email": "Bronislaw.Foltyn@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/80/photo"
  },
  {
    "id": 81,
    "name": "Roman Fritz",
    "club": "Konfederacja_KP",
    "district": "Bielsko-Biała",
    "votes": 11089,
    "email": "Roman.Fritz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/81/photo"
  },
  {
    "id": 82,
    "name": "Joanna Frydrych",
    "club": "KO",
    "district": "Krosno",
    "votes": 29681,
    "email": "Joanna.Frydrych@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/82/photo"
  },
  {
    "id": 83,
    "name": "Konrad Frysztak",
    "club": "KO",
    "district": "Radom",
    "votes": 25416,
    "email": "Konrad.Frysztak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/83/photo"
  },
  {
    "id": 84,
    "name": "Patryk Gabriel",
    "club": "KO",
    "district": "Gdańsk",
    "votes": 11201,
    "email": "Patryk.Gabriel@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/84/photo"
  },
  {
    "id": 85,
    "name": "Krzysztof Gadowski",
    "club": "KO",
    "district": "Bielsko-Biała",
    "votes": 36031,
    "email": "Krzysztof.Gadowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/85/photo"
  },
  {
    "id": 86,
    "name": "Aleksandra Gajewska",
    "club": "KO",
    "district": "Warszawa",
    "votes": 49428,
    "email": "Aleksandra.Gajewska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/86/photo"
  },
  {
    "id": 87,
    "name": "Kinga Gajewska",
    "club": "KO",
    "district": "Warszawa",
    "votes": 85283,
    "email": "Kinga.Gajewska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/87/photo"
  },
  {
    "id": 88,
    "name": "Elżbieta Gapińska",
    "club": "KO",
    "district": "Płock",
    "votes": 13214,
    "email": "Elzbieta.Gapinska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/88/photo"
  },
  {
    "id": 90,
    "name": "Krzysztof Gawkowski",
    "club": "Lewica",
    "district": "Bydgoszcz",
    "votes": 21831,
    "email": "Krzysztof.Gawkowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/90/photo"
  },
  {
    "id": 91,
    "name": "Zdzisław Gawlik",
    "club": "KO",
    "district": "Rzeszów",
    "votes": 7054,
    "email": "Zdzislaw.Gawlik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/91/photo"
  },
  {
    "id": 92,
    "name": "Andrzej Gawron",
    "club": "PiS",
    "district": "Częstochowa",
    "votes": 13239,
    "email": "Andrzej.Gawron@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/92/photo"
  },
  {
    "id": 93,
    "name": "Grzegorz Gaża",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 11940,
    "email": "Grzegorz.Gaza@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/93/photo"
  },
  {
    "id": 94,
    "name": "Elżbieta Gelert",
    "club": "KO",
    "district": "Elbląg",
    "votes": 15847,
    "email": "Elzbieta.Gelert@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/94/photo"
  },
  {
    "id": 95,
    "name": "Anna Gembicka",
    "club": "PiS",
    "district": "Toruń",
    "votes": 25993,
    "email": "Anna.Gembicka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/95/photo"
  },
  {
    "id": 96,
    "name": "Artur Daniel Gierada",
    "club": "KO",
    "district": "Kielce",
    "votes": 16878,
    "email": "Artur.Gierada@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/96/photo"
  },
  {
    "id": 97,
    "name": "Roman Giertych",
    "club": "KO",
    "district": "Kielce",
    "votes": 23622,
    "email": "Roman.Giertych@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/97/photo"
  },
  {
    "id": 98,
    "name": "Włodzisław Giziński",
    "club": "KO",
    "district": "Bydgoszcz",
    "votes": 13630,
    "email": "Wlodzislaw.Gizinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/98/photo"
  },
  {
    "id": 99,
    "name": "Szymon Giżyński",
    "club": "PiS",
    "district": "Częstochowa",
    "votes": 14148,
    "email": "Szymon.Gizynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/99/photo"
  },
  {
    "id": 100,
    "name": "Piotr Gliński",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 135339,
    "email": "Piotr.Glinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/100/photo"
  },
  {
    "id": 101,
    "name": "Tomasz Głogowski",
    "club": "KO",
    "district": "Katowice",
    "votes": 11463,
    "email": "Tomasz.Glogowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/101/photo"
  },
  {
    "id": 102,
    "name": "Piotr Głowski",
    "club": "KO",
    "district": "Piła",
    "votes": 16067,
    "email": "Piotr.Glowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/102/photo"
  },
  {
    "id": 103,
    "name": "Marta Golbik",
    "club": "KO",
    "district": "Katowice",
    "votes": 19430,
    "email": "Marta.Golbik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/103/photo"
  },
  {
    "id": 104,
    "name": "Małgorzata Golińska",
    "club": "PiS",
    "district": "Koszalin",
    "votes": 15253,
    "email": "Malgorzata.Golinska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/104/photo"
  },
  {
    "id": 105,
    "name": "Kazimierz Gołojuch",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 14216,
    "email": "Kazimierz.Golojuch@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/105/photo"
  },
  {
    "id": 106,
    "name": "Adam Gomoła",
    "club": "Polska2050",
    "district": "Opole",
    "votes": 21923,
    "email": "Adam.Gomola@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/106/photo"
  },
  {
    "id": 107,
    "name": "Robert Gontarz",
    "club": "PiS",
    "district": "Elbląg",
    "votes": 24940,
    "email": "Robert.Gontarz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/107/photo"
  },
  {
    "id": 108,
    "name": "Stanisław Gorczyca",
    "club": "KO",
    "district": "Elbląg",
    "votes": 7979,
    "email": "Stanislaw.Gorczyca@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/108/photo"
  },
  {
    "id": 109,
    "name": "Mariusz Gosek",
    "club": "PiS",
    "district": "Kielce",
    "votes": 5309,
    "email": "Mariusz.Gosek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/109/photo"
  },
  {
    "id": 110,
    "name": "Daria Gosek-Popiołek",
    "club": "Lewica",
    "district": "Kraków",
    "votes": 39054,
    "email": "Daria.Gosek-Popiolek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/110/photo"
  },
  {
    "id": 112,
    "name": "Piotr Górnikiewicz",
    "club": "Polska2050",
    "district": "Tarnów",
    "votes": 5180,
    "email": "Piotr.Gornikiewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/112/photo"
  },
  {
    "id": 113,
    "name": "Agnieszka Górska",
    "club": "PiS",
    "district": "Radom",
    "votes": 11494,
    "email": "Agnieszka.Gorska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/113/photo"
  },
  {
    "id": 114,
    "name": "Krzysztof Grabczuk",
    "club": "KO",
    "district": "Chełm",
    "votes": 32985,
    "email": "Krzysztof.Grabczuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/114/photo"
  },
  {
    "id": 115,
    "name": "Jan Grabiec",
    "club": "KO",
    "district": "Warszawa",
    "votes": 71534,
    "email": "Jan.Grabiec@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/115/photo"
  },
  {
    "id": 116,
    "name": "Marcin Grabowski",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 10339,
    "email": "Marcin.Grabowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/116/photo"
  },
  {
    "id": 117,
    "name": "Michał Gramatyka",
    "club": "Polska2050",
    "district": "Katowice",
    "votes": 32251,
    "email": "Michal.Gramatyka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/117/photo"
  },
  {
    "id": 118,
    "name": "Małgorzata Gromadzka",
    "club": "KO",
    "district": "Chełm",
    "votes": 10710,
    "email": "Malgorzata.Gromadzka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/118/photo"
  },
  {
    "id": 119,
    "name": "Marek Gróbarczyk",
    "club": "PiS",
    "district": "Szczecin",
    "votes": 44422,
    "email": "Marek.Grobarczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/119/photo"
  },
  {
    "id": 120,
    "name": "Andrzej Grzyb",
    "club": "PSL-TD",
    "district": "Kalisz",
    "votes": 29391,
    "email": "Andrzej.Grzyb@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/120/photo"
  },
  {
    "id": 121,
    "name": "Andrzej Gut-Mostowy",
    "club": "PiS",
    "district": "Nowy Sącz",
    "votes": 16467,
    "email": "Andrzej.Gut-Mostowy@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/121/photo"
  },
  {
    "id": 122,
    "name": "Kazimierz Gwiazdowski",
    "club": "PiS",
    "district": "Białystok",
    "votes": 11898,
    "email": "Kazimierz.Gwiazdowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/122/photo"
  },
  {
    "id": 123,
    "name": "Marcin Gwóźdź",
    "club": "PiS",
    "district": "Wałbrzych",
    "votes": 23434,
    "email": "Marcin.Gwozdz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/123/photo"
  },
  {
    "id": 124,
    "name": "Marek Gzik",
    "club": "KO",
    "district": "Katowice",
    "votes": 19070,
    "email": "Marek.Gzik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/124/photo"
  },
  {
    "id": 125,
    "name": "Krzysztof Habura",
    "club": "KO",
    "district": "Sieradz",
    "votes": 11267,
    "email": "Krzysztof.Habura@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/125/photo"
  },
  {
    "id": 126,
    "name": "Agnieszka Hanajczyk",
    "club": "KO",
    "district": "Sieradz",
    "votes": 16865,
    "email": "Agnieszka.Hanajczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/126/photo"
  },
  {
    "id": 127,
    "name": "Iwona Hartwich",
    "club": "KO",
    "district": "Toruń",
    "votes": 17889,
    "email": "Iwona.Hartwich@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/127/photo"
  },
  {
    "id": 128,
    "name": "Paulina Hennig-Kloska",
    "club": "Polska2050",
    "district": "Konin",
    "votes": 30334,
    "email": "Paulina.Hennig-Kloska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/128/photo"
  },
  {
    "id": 130,
    "name": "Czesław Hoc",
    "club": "PiS",
    "district": "Koszalin",
    "votes": 31360,
    "email": "Czeslaw.Hoc@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/130/photo"
  },
  {
    "id": 131,
    "name": "Zbigniew Hoffmann",
    "club": "PiS",
    "district": "Konin",
    "votes": 47594,
    "email": "Zbigniew.Hoffmann@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/131/photo"
  },
  {
    "id": 132,
    "name": "Marek Tomasz Hok",
    "club": "KO",
    "district": "Koszalin",
    "votes": 8176,
    "email": "Marek.Hok@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/132/photo"
  },
  {
    "id": 133,
    "name": "Szymon Hołownia",
    "club": "Polska2050",
    "district": "Białystok",
    "votes": 79951,
    "email": "Szymon.Holownia@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/133/photo"
  },
  {
    "id": 134,
    "name": "Marcin Horała",
    "club": "PiS",
    "district": "Słupsk",
    "votes": 47974,
    "email": "Marcin.Horala@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/134/photo"
  },
  {
    "id": 135,
    "name": "Łukasz Horbatowski",
    "club": "KO",
    "district": "Legnica",
    "votes": 13934,
    "email": "Lukasz.Horbatowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/135/photo"
  },
  {
    "id": 136,
    "name": "Paweł Hreniak",
    "club": "PiS",
    "district": "Wrocław",
    "votes": 19384,
    "email": "Pawel.Hreniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/136/photo"
  },
  {
    "id": 137,
    "name": "Paweł Jabłoński",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 22996,
    "email": "Pawel.Jablonski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/137/photo"
  },
  {
    "id": 138,
    "name": "Klaudia Jachira",
    "club": "KO",
    "district": "Warszawa",
    "votes": 9172,
    "email": "Klaudia.Jachira@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/138/photo"
  },
  {
    "id": 139,
    "name": "Marek Jakubiak",
    "club": "Republikanie",
    "district": "Warszawa",
    "votes": 39151,
    "email": "Marek.Jakubiak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/139/photo"
  },
  {
    "id": 140,
    "name": "Maria Małgorzata Janyska",
    "club": "KO",
    "district": "Piła",
    "votes": 23592,
    "email": "Maria.Janyska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/140/photo"
  },
  {
    "id": 141,
    "name": "Michał Jaros",
    "club": "KO",
    "district": "Wrocław",
    "votes": 30512,
    "email": "Michal.Jaros@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/141/photo"
  },
  {
    "id": 142,
    "name": "Patryk Jaskulski",
    "club": "KO",
    "district": "Szczecin",
    "votes": 7439,
    "email": "Patryk.Jaskulski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/142/photo"
  },
  {
    "id": 143,
    "name": "Danuta Jazłowiecka",
    "club": "KO",
    "district": "Opole",
    "votes": 11580,
    "email": "Danuta.Jazlowiecka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/143/photo"
  },
  {
    "id": 145,
    "name": "Marcin Józefaciuk",
    "club": "niez.",
    "district": "Łódź",
    "votes": 8893,
    "email": "Marcin.Jozefaciuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/145/photo"
  },
  {
    "id": 146,
    "name": "Norbert Jakub Kaczmarczyk",
    "club": "PiS",
    "district": "Tarnów",
    "votes": 11926,
    "email": "Norbert.Kaczmarczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/146/photo"
  },
  {
    "id": 147,
    "name": "Filip Kaczyński",
    "club": "PiS",
    "district": "Kraków",
    "votes": 18285,
    "email": "Filip.Kaczynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/147/photo"
  },
  {
    "id": 148,
    "name": "Jarosław Kaczyński",
    "club": "PiS",
    "district": "Kielce",
    "votes": 177228,
    "email": "Jaroslaw.Kaczynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/148/photo"
  },
  {
    "id": 149,
    "name": "Piotr Kaleta",
    "club": "PiS",
    "district": "Kalisz",
    "votes": 16344,
    "email": "Piotr.Kaleta@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/149/photo"
  },
  {
    "id": 150,
    "name": "Sebastian Kaleta",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 31369,
    "email": "Sebastian.Kaleta@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/150/photo"
  },
  {
    "id": 151,
    "name": "Mariusz Kałużny",
    "club": "PiS",
    "district": "Toruń",
    "votes": 19072,
    "email": "Mariusz.Kaluzny@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/151/photo"
  },
  {
    "id": 153,
    "name": "Piotr Kandyba",
    "club": "KO",
    "district": "Warszawa",
    "votes": 15144,
    "email": "Piotr.Kandyba@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/153/photo"
  },
  {
    "id": 154,
    "name": "Jan Kanthak",
    "club": "PiS",
    "district": "Lublin",
    "votes": 22037,
    "email": "Jan.Kanthak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/154/photo"
  },
  {
    "id": 155,
    "name": "Fryderyk Sylwester Kapinos",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 18065,
    "email": "Fryderyk.Kapinos@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/155/photo"
  },
  {
    "id": 156,
    "name": "Jacek Karnowski",
    "club": "KO",
    "district": "Gdańsk",
    "votes": 55069,
    "email": "Jacek.Karnowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/156/photo"
  },
  {
    "id": 157,
    "name": "Iwona Karolewska",
    "club": "KO",
    "district": "Bydgoszcz",
    "votes": 8572,
    "email": "Iwona.Karolewska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/157/photo"
  },
  {
    "id": 158,
    "name": "Rafał Kasprzyk",
    "club": "Polska2050",
    "district": "Kielce",
    "votes": 10907,
    "email": "Rafal.Kasprzyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/158/photo"
  },
  {
    "id": 159,
    "name": "Henryk Kiepura",
    "club": "PSL-TD",
    "district": "Częstochowa",
    "votes": 20665,
    "email": "Henryk.Kiepura@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/159/photo"
  },
  {
    "id": 161,
    "name": "Katarzyna Kierzek-Koperska",
    "club": "KO",
    "district": "Poznań",
    "votes": 20091,
    "email": "Katarzyna.Kierzek-Koperska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/161/photo"
  },
  {
    "id": 162,
    "name": "Dariusz Klimczak",
    "club": "PSL-TD",
    "district": "Piotrków Trybunalski",
    "votes": 21826,
    "email": "Dariusz.Klimczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/162/photo"
  },
  {
    "id": 163,
    "name": "Joanna Kluzik-Rostkowska",
    "club": "KO",
    "district": "Radom",
    "votes": 21218,
    "email": "Joanna.Kluzik-Rostkowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/163/photo"
  },
  {
    "id": 164,
    "name": "Agnieszka Maria Kłopotek",
    "club": "PSL-TD",
    "district": "Bydgoszcz",
    "votes": 11049,
    "email": "Agnieszka.Klopotek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/164/photo"
  },
  {
    "id": 165,
    "name": "Łukasz Kmita",
    "club": "PiS",
    "district": "Kraków",
    "votes": 26062,
    "email": "Lukasz.Kmita@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/165/photo"
  },
  {
    "id": 167,
    "name": "Maria Koc",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 70732,
    "email": "Maria.Koc@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/167/photo"
  },
  {
    "id": 168,
    "name": "Ewa Kołodziej",
    "club": "KO",
    "district": "Katowice",
    "votes": 7283,
    "email": "Ewa.Kolodziej@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/168/photo"
  },
  {
    "id": 169,
    "name": "Magdalena Małgorzata Kołodziejczak",
    "club": "KO",
    "district": "Gdańsk",
    "votes": 12773,
    "email": "Magdalena.Kolodziejczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/169/photo"
  },
  {
    "id": 170,
    "name": "Michał Kołodziejczak",
    "club": "KO",
    "district": "Konin",
    "votes": 44062,
    "email": "Michal.Kolodziejczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/170/photo"
  },
  {
    "id": 171,
    "name": "Rafał Komarewicz",
    "club": "Polska2050",
    "district": "Kraków",
    "votes": 44808,
    "email": "Rafal.Komarewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/171/photo"
  },
  {
    "id": 172,
    "name": "Maciej Konieczny",
    "club": "Razem",
    "district": "Katowice",
    "votes": 17901,
    "email": "Maciej.Konieczny@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/172/photo"
  },
  {
    "id": 173,
    "name": "Zbigniew Konwiński",
    "club": "KO",
    "district": "Słupsk",
    "votes": 15538,
    "email": "Zbigniew.Konwinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/173/photo"
  },
  {
    "id": 174,
    "name": "Władysław Kosiniak-Kamysz",
    "club": "PSL-TD",
    "district": "Tarnów",
    "votes": 50139,
    "email": "Wladyslaw.Kosiniak-Kamysz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/174/photo"
  },
  {
    "id": 175,
    "name": "Tomasz Kostuś",
    "club": "KO",
    "district": "Opole",
    "votes": 11857,
    "email": "Tomasz.Kostus@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/175/photo"
  },
  {
    "id": 176,
    "name": "Andrzej Kosztowniak",
    "club": "PiS",
    "district": "Radom",
    "votes": 9755,
    "email": "Andrzej.Kosztowniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/176/photo"
  },
  {
    "id": 177,
    "name": "Katarzyna Kotula",
    "club": "Lewica",
    "district": "Gdańsk",
    "votes": 33122,
    "email": "Katarzyna.Kotula@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/177/photo"
  },
  {
    "id": 178,
    "name": "Paweł Kowal",
    "club": "KO",
    "district": "Rzeszów",
    "votes": 63534,
    "email": "Pawel.Kowal@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/178/photo"
  },
  {
    "id": 179,
    "name": "Henryk Kowalczyk",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 30081,
    "email": "Henryk.Kowalczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/179/photo"
  },
  {
    "id": 180,
    "name": "Janusz Kowalski",
    "club": "PiS",
    "district": "Opole",
    "votes": 14593,
    "email": "Janusz.Kowalski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/180/photo"
  },
  {
    "id": 181,
    "name": "Bartosz Józef Kownacki",
    "club": "PiS",
    "district": "Bydgoszcz",
    "votes": 17135,
    "email": "Bartosz.Kownacki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/181/photo"
  },
  {
    "id": 182,
    "name": "Iwona Maria Kozłowska",
    "club": "KO",
    "district": "Bydgoszcz",
    "votes": 14514,
    "email": "Iwona.Kozlowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/182/photo"
  },
  {
    "id": 183,
    "name": "Stefan Krajewski",
    "club": "PSL-TD",
    "district": "Białystok",
    "votes": 9803,
    "email": "Stefan.Krajewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/183/photo"
  },
  {
    "id": 184,
    "name": "Wiesław Krajewski",
    "club": "PiS",
    "district": "Tarnów",
    "votes": 24838,
    "email": "Wieslaw.Krajewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/184/photo"
  },
  {
    "id": 185,
    "name": "Leonard Krasulski",
    "club": "PiS",
    "district": "Elbląg",
    "votes": 13948,
    "email": "Leonard.Krasulski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/185/photo"
  },
  {
    "id": 186,
    "name": "Iwona Małgorzata Krawczyk",
    "club": "KO",
    "district": "Legnica",
    "votes": 8831,
    "email": "Iwona.Krawczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/186/photo"
  },
  {
    "id": 187,
    "name": "Michał Krawczyk",
    "club": "KO",
    "district": "Lublin",
    "votes": 12009,
    "email": "Michal.Krawczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/187/photo"
  },
  {
    "id": 188,
    "name": "Robert Kropiwnicki",
    "club": "KO",
    "district": "Legnica",
    "votes": 31838,
    "email": "Robert.Kropiwnicki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/188/photo"
  },
  {
    "id": 189,
    "name": "Piotr Król",
    "club": "PiS",
    "district": "Bydgoszcz",
    "votes": 17952,
    "email": "Piotr.Krol@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/189/photo"
  },
  {
    "id": 190,
    "name": "Wojciech Król",
    "club": "KO",
    "district": "Katowice",
    "votes": 7136,
    "email": "Wojciech.Krol@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/190/photo"
  },
  {
    "id": 191,
    "name": "Anna Krupka",
    "club": "PiS",
    "district": "Kielce",
    "votes": 39854,
    "email": "Anna.Krupka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/191/photo"
  },
  {
    "id": 192,
    "name": "Andrzej Kryj",
    "club": "PiS",
    "district": "Kielce",
    "votes": 6968,
    "email": "Andrzej.Kryj@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/192/photo"
  },
  {
    "id": 193,
    "name": "Mariusz Krystian",
    "club": "PiS",
    "district": "Kraków",
    "votes": 11366,
    "email": "Mariusz.Krystian@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/193/photo"
  },
  {
    "id": 194,
    "name": "Marek Krząkała",
    "club": "KO",
    "district": "Bielsko-Biała",
    "votes": 18605,
    "email": "Marek.Krzakala@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/194/photo"
  },
  {
    "id": 195,
    "name": "Adam Krzemiński",
    "club": "KO",
    "district": "Płock",
    "votes": 6071,
    "email": "Adam.Krzeminski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/195/photo"
  },
  {
    "id": 196,
    "name": "Henryka Krzywonos-Strycharska",
    "club": "KO",
    "district": "Słupsk",
    "votes": 8460,
    "email": "Henryka.Krzywonos-Strycharska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/196/photo"
  },
  {
    "id": 197,
    "name": "Krzysztof Kubów",
    "club": "PiS",
    "district": "Legnica",
    "votes": 15928,
    "email": "Krzysztof.Kubow@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/197/photo"
  },
  {
    "id": 198,
    "name": "Anita Kucharska-Dziedzic",
    "club": "Lewica",
    "district": "Zielona Góra",
    "votes": 23051,
    "email": "Anita.Kucharska-Dziedzic@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/198/photo"
  },
  {
    "id": 199,
    "name": "Marek Kuchciński",
    "club": "PiS",
    "district": "Krosno",
    "votes": 50519,
    "email": "Marek.Kuchcinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/199/photo"
  },
  {
    "id": 200,
    "name": "Paweł Kukiz",
    "club": "Republikanie",
    "district": "Opole",
    "votes": 43292,
    "email": "Pawel.Kukiz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/200/photo"
  },
  {
    "id": 201,
    "name": "Marcin Kulasek",
    "club": "Lewica",
    "district": "Olsztyn",
    "votes": 11514,
    "email": "Marcin.Kulasek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/201/photo"
  },
  {
    "id": 202,
    "name": "Maria Kurowska",
    "club": "PiS",
    "district": "Krosno",
    "votes": 20813,
    "email": "Maria.Kurowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/202/photo"
  },
  {
    "id": 203,
    "name": "Władysław Kurowski",
    "club": "PiS",
    "district": "Kraków",
    "votes": 12320,
    "email": "Wladyslaw.Kurowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/203/photo"
  },
  {
    "id": 204,
    "name": "Zbigniew Krzysztof Kuźmiuk",
    "club": "PiS",
    "district": "Radom",
    "votes": 24702,
    "email": "Zbigniew.Kuzmiuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/204/photo"
  },
  {
    "id": 205,
    "name": "Anna Kwiecień",
    "club": "PiS",
    "district": "Radom",
    "votes": 34570,
    "email": "Anna.Kwiecien@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/205/photo"
  },
  {
    "id": 206,
    "name": "Piotr Lachowicz",
    "club": "KO",
    "district": "Nowy Sącz",
    "votes": 12918,
    "email": "Piotr.Lachowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/206/photo"
  },
  {
    "id": 207,
    "name": "Stanisław Lamczyk",
    "club": "KO",
    "district": "Słupsk",
    "votes": 8722,
    "email": "Stanislaw.Lamczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/207/photo"
  },
  {
    "id": 208,
    "name": "Maciej Lasek",
    "club": "KO",
    "district": "Warszawa",
    "votes": 20565,
    "email": "Maciej.Lasek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/208/photo"
  },
  {
    "id": 209,
    "name": "Gabriela Lenartowicz",
    "club": "KO",
    "district": "Bielsko-Biała",
    "votes": 16515,
    "email": "Gabriela.Lenartowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/209/photo"
  },
  {
    "id": 210,
    "name": "Ewa Leniart",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 38795,
    "email": "Ewa.Leniart@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/210/photo"
  },
  {
    "id": 211,
    "name": "Aleksandra Leo",
    "club": "Polska2050",
    "district": "Wałbrzych",
    "votes": 16661,
    "email": "Aleksandra.Leo@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/211/photo"
  },
  {
    "id": 212,
    "name": "Izabela Leszczyna",
    "club": "KO",
    "district": "Częstochowa",
    "votes": 60549,
    "email": "Izabela.Leszczyna@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/212/photo"
  },
  {
    "id": 213,
    "name": "Joanna Lichocka",
    "club": "PiS",
    "district": "Sieradz",
    "votes": 36060,
    "email": "Joanna.Lichocka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/213/photo"
  },
  {
    "id": 214,
    "name": "Krzysztof Lipiec",
    "club": "PiS",
    "district": "Kielce",
    "votes": 14962,
    "email": "Krzysztof.Lipiec@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/214/photo"
  },
  {
    "id": 215,
    "name": "Łukasz Litewka",
    "club": "Lewica",
    "district": "Katowice",
    "votes": 40579,
    "email": "Lukasz.Litewka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/215/photo"
  },
  {
    "id": 216,
    "name": "Grzegorz Lorek",
    "club": "PiS",
    "district": "Piotrków Trybunalski",
    "votes": 19711,
    "email": "Grzegorz.Lorek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/216/photo"
  },
  {
    "id": 217,
    "name": "Radosław Lubczyk",
    "club": "PSL-TD",
    "district": "Koszalin",
    "votes": 14353,
    "email": "Radoslaw.Lubczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/217/photo"
  },
  {
    "id": 218,
    "name": "Katarzyna Anna Lubnauer",
    "club": "KO",
    "district": "Warszawa",
    "votes": 22529,
    "email": "Katarzyna.Lubnauer@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/218/photo"
  },
  {
    "id": 219,
    "name": "Adam Luboński",
    "club": "Polska2050",
    "district": "Piła",
    "votes": 8724,
    "email": "Adam.Lubonski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/219/photo"
  },
  {
    "id": 220,
    "name": "Artur Jarosław Łącki",
    "club": "KO",
    "district": "Szczecin",
    "votes": 6100,
    "email": "Artur.Lacki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/220/photo"
  },
  {
    "id": 221,
    "name": "Alicja Łepkowska-Gołaś",
    "club": "KO",
    "district": "Białystok",
    "votes": 13511,
    "email": "Alicja.Lepkowska-Golas@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/221/photo"
  },
  {
    "id": 222,
    "name": "Dorota Łoboda",
    "club": "KO",
    "district": "Warszawa",
    "votes": 10510,
    "email": "Dorota.Loboda@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/222/photo"
  },
  {
    "id": 223,
    "name": "Krystian Łuczak",
    "club": "KO",
    "district": "Toruń",
    "votes": 16451,
    "email": "Krystian.Luczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/223/photo"
  },
  {
    "id": 224,
    "name": "Sebastian Łukaszewicz",
    "club": "PiS",
    "district": "Białystok",
    "votes": 11554,
    "email": "Sebastian.Lukaszewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/224/photo"
  },
  {
    "id": 225,
    "name": "Marzena Anna Machałek",
    "club": "PiS",
    "district": "Legnica",
    "votes": 18363,
    "email": "Marzena.Machalek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/225/photo"
  },
  {
    "id": 226,
    "name": "Antoni Macierewicz",
    "club": "PiS",
    "district": "Piotrków Trybunalski",
    "votes": 32496,
    "email": "Antoni.Macierewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/226/photo"
  },
  {
    "id": 228,
    "name": "Ewa Malik",
    "club": "PiS",
    "district": "Katowice",
    "votes": 39498,
    "email": "Ewa.Malik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/228/photo"
  },
  {
    "id": 229,
    "name": "Mirosław Maliszewski",
    "club": "PSL-TD",
    "district": "Radom",
    "votes": 17857,
    "email": "Miroslaw.Maliszewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/229/photo"
  },
  {
    "id": 230,
    "name": "Maciej Małecki",
    "club": "PiS",
    "district": "Płock",
    "votes": 33696,
    "email": "Maciej.Malecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/230/photo"
  },
  {
    "id": 231,
    "name": "Arkadiusz Marchewka",
    "club": "KO",
    "district": "Szczecin",
    "votes": 33222,
    "email": "Arkadiusz.Marchewka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/231/photo"
  },
  {
    "id": 233,
    "name": "Dorota Marek",
    "club": "KO",
    "district": "Kraków",
    "votes": 14141,
    "email": "Dorota.Marek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/233/photo"
  },
  {
    "id": 234,
    "name": "Dariusz Matecki",
    "club": "PiS",
    "district": "Szczecin",
    "votes": 14974,
    "email": "Dariusz.Matecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/234/photo"
  },
  {
    "id": 235,
    "name": "Jerzy Materna",
    "club": "PiS",
    "district": "Zielona Góra",
    "votes": 17470,
    "email": "Jerzy.Materna@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/235/photo"
  },
  {
    "id": 236,
    "name": "Grzegorz Matusiak",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 12690,
    "email": "Grzegorz.Matusiak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/236/photo"
  },
  {
    "id": 237,
    "name": "Katarzyna Matusik-Lipiec",
    "club": "KO",
    "district": "Kraków",
    "votes": 9261,
    "email": "Katarzyna.Matusik-Lipiec@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/237/photo"
  },
  {
    "id": 238,
    "name": "Marek Matuszewski",
    "club": "PiS",
    "district": "Sieradz",
    "votes": 17412,
    "email": "Marek.Matuszewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/238/photo"
  },
  {
    "id": 239,
    "name": "Paulina Matysiak",
    "club": "niez.",
    "district": "Sieradz",
    "votes": 17695,
    "email": "Paulina.Matysiak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/239/photo"
  },
  {
    "id": 240,
    "name": "Łukasz Mejza",
    "club": "PiS",
    "district": "Zielona Góra",
    "votes": 10162,
    "email": "Lukasz.Mejza@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/240/photo"
  },
  {
    "id": 241,
    "name": "Sławomir Mentzen",
    "club": "Konfederacja",
    "district": "Warszawa",
    "votes": 101269,
    "email": "Slawomir.Mentzen@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/241/photo"
  },
  {
    "id": 242,
    "name": "Anna Milczanowska",
    "club": "PiS",
    "district": "Piotrków Trybunalski",
    "votes": 22595,
    "email": "Anna.Milczanowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/242/photo"
  },
  {
    "id": 243,
    "name": "Daniel Milewski",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 44145,
    "email": "Daniel.Milewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/243/photo"
  },
  {
    "id": 246,
    "name": "Mateusz Morawiecki",
    "club": "PiS",
    "district": "Katowice",
    "votes": 117064,
    "email": "Mateusz.Morawiecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/246/photo"
  },
  {
    "id": 247,
    "name": "Jan Mosiński",
    "club": "PiS",
    "district": "Kalisz",
    "votes": 7321,
    "email": "Jan.Mosinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/247/photo"
  },
  {
    "id": 248,
    "name": "Michał Moskal",
    "club": "PiS",
    "district": "Lublin",
    "votes": 21958,
    "email": "Michal.Moskal@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/248/photo"
  },
  {
    "id": 249,
    "name": "Czesław Mroczek",
    "club": "KO",
    "district": "Siedlce",
    "votes": 11648,
    "email": "Czeslaw.Mroczek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/249/photo"
  },
  {
    "id": 250,
    "name": "Aleksander Mikołaj Mrówczyński",
    "club": "PiS",
    "district": "Słupsk",
    "votes": 15125,
    "email": "Aleksander.Mrowczynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/250/photo"
  },
  {
    "id": 252,
    "name": "Joanna Mucha",
    "club": "Polska2050",
    "district": "Lublin",
    "votes": 32563,
    "email": "Joanna.Mucha@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/252/photo"
  },
  {
    "id": 254,
    "name": "Krzysztof Mulawa",
    "club": "Konfederacja",
    "district": "Siedlce",
    "votes": 14043,
    "email": "Krzysztof.Mulawa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/254/photo"
  },
  {
    "id": 256,
    "name": "Arkadiusz Myrcha",
    "club": "KO",
    "district": "Toruń",
    "votes": 64452,
    "email": "Arkadiusz.Myrcha@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/256/photo"
  },
  {
    "id": 257,
    "name": "Grzegorz Napieralski",
    "club": "KO",
    "district": "Szczecin",
    "votes": 7239,
    "email": "Grzegorz.Napieralski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/257/photo"
  },
  {
    "id": 258,
    "name": "Dorota Niedziela",
    "club": "KO",
    "district": "Kraków",
    "votes": 28783,
    "email": "Dorota.Niedziela@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/258/photo"
  },
  {
    "id": 259,
    "name": "Jacek Niedźwiedzki",
    "club": "KO",
    "district": "Białystok",
    "votes": 9063,
    "email": "Jacek.Niedzwiedzki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/259/photo"
  },
  {
    "id": 260,
    "name": "Małgorzata Niemczyk",
    "club": "KO",
    "district": "Łódź",
    "votes": 20959,
    "email": "Malgorzata.Niemczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/260/photo"
  },
  {
    "id": 261,
    "name": "Jolanta Niezgodzka",
    "club": "KO",
    "district": "Wrocław",
    "votes": 7262,
    "email": "Jolanta.Niezgodzka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/261/photo"
  },
  {
    "id": 262,
    "name": "Sławomir Nitras",
    "club": "KO",
    "district": "Szczecin",
    "votes": 90720,
    "email": "Slawomir.Nitras@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/262/photo"
  },
  {
    "id": 263,
    "name": "Barbara Nowacka",
    "club": "KO",
    "district": "Słupsk",
    "votes": 139524,
    "email": "Barbara.Nowacka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/263/photo"
  },
  {
    "id": 264,
    "name": "Maja Ewa Nowak",
    "club": "Polska2050",
    "district": "Zielona Góra",
    "votes": 25109,
    "email": "Maja.Nowak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/264/photo"
  },
  {
    "id": 265,
    "name": "Tomasz Piotr Nowak",
    "club": "KO",
    "district": "Konin",
    "votes": 15495,
    "email": "Tomasz.Nowak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/265/photo"
  },
  {
    "id": 266,
    "name": "Wanda Nowicka",
    "club": "Lewica",
    "district": "Katowice",
    "votes": 16882,
    "email": "Wanda.Nowicka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/266/photo"
  },
  {
    "id": 267,
    "name": "Urszula Nowogórska",
    "club": "PSL-TD",
    "district": "Nowy Sącz",
    "votes": 24388,
    "email": "Urszula.Nowogorska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/267/photo"
  },
  {
    "id": 269,
    "name": "Marcin Ociepa",
    "club": "PiS",
    "district": "Opole",
    "votes": 40418,
    "email": "Marcin.Ociepa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/269/photo"
  },
  {
    "id": 270,
    "name": "Marzena Okła-Drewnowicz",
    "club": "KO",
    "district": "Kielce",
    "votes": 64990,
    "email": "Marzena.Okla-Drewnowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/270/photo"
  },
  {
    "id": 271,
    "name": "Barbara Okuła",
    "club": "Polska2050",
    "district": "Białystok",
    "votes": 3482,
    "email": "Barbara.Okula@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/271/photo"
  },
  {
    "id": 272,
    "name": "Barbara Oliwiecka",
    "club": "Polska2050",
    "district": "Kalisz",
    "votes": 12214,
    "email": "Barbara.Oliwiecka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/272/photo"
  },
  {
    "id": 273,
    "name": "Dorota Olko",
    "club": "Lewica",
    "district": "Warszawa",
    "votes": 44188,
    "email": "Dorota.Olko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/273/photo"
  },
  {
    "id": 274,
    "name": "Paweł Olszewski",
    "club": "KO",
    "district": "Bydgoszcz",
    "votes": 35289,
    "email": "Pawel.Olszewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/274/photo"
  },
  {
    "id": 275,
    "name": "Mirosław Adam Orliński",
    "club": "PSL-TD",
    "district": "Płock",
    "votes": 9066,
    "email": "Miroslaw.Orlinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/275/photo"
  },
  {
    "id": 276,
    "name": "Łukasz Osmalak",
    "club": "Polska2050",
    "district": "Bielsko-Biała",
    "votes": 19616,
    "email": "Lukasz.Osmalak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/276/photo"
  },
  {
    "id": 277,
    "name": "Katarzyna Osos",
    "club": "KO",
    "district": "Zielona Góra",
    "votes": 11832,
    "email": "Katarzyna.Osos@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/277/photo"
  },
  {
    "id": 278,
    "name": "Jacek Osuch",
    "club": "PiS",
    "district": "Kraków",
    "votes": 10386,
    "email": "Jacek.Osuch@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/278/photo"
  },
  {
    "id": 280,
    "name": "Teresa Pamuła",
    "club": "PiS",
    "district": "Krosno",
    "votes": 15273,
    "email": "Teresa.Pamula@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/280/photo"
  },
  {
    "id": 281,
    "name": "Paweł Papke",
    "club": "KO",
    "district": "Olsztyn",
    "votes": 27023,
    "email": "Pawel.Papke@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/281/photo"
  },
  {
    "id": 282,
    "name": "Urszula Pasławska",
    "club": "PSL-TD",
    "district": "Olsztyn",
    "votes": 26992,
    "email": "Urszula.Paslawska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/282/photo"
  },
  {
    "id": 283,
    "name": "Krzysztof Paszyk",
    "club": "PSL-TD",
    "district": "Piła",
    "votes": 27642,
    "email": "Krzysztof.Paszyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/283/photo"
  },
  {
    "id": 284,
    "name": "Karolina Pawliczak",
    "club": "KO",
    "district": "Kalisz",
    "votes": 21819,
    "email": "Karolina.Pawliczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/284/photo"
  },
  {
    "id": 285,
    "name": "Bartłomiej Pejo",
    "club": "Konfederacja",
    "district": "Lublin",
    "votes": 26037,
    "email": "Bartlomiej.Pejo@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/285/photo"
  },
  {
    "id": 286,
    "name": "Ryszard Petru",
    "club": "Polska2050",
    "district": "Warszawa",
    "votes": 24192,
    "email": "Ryszard.Petru@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/286/photo"
  },
  {
    "id": 287,
    "name": "Małgorzata Pępek",
    "club": "KO",
    "district": "Bielsko-Biała",
    "votes": 22184,
    "email": "Malgorzata.Pepek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/287/photo"
  },
  {
    "id": 288,
    "name": "Bolesław Piecha",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 32427,
    "email": "Boleslaw.Piecha@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/288/photo"
  },
  {
    "id": 289,
    "name": "Grzegorz Piechowiak",
    "club": "PiS",
    "district": "Piła",
    "votes": 13122,
    "email": "Grzegorz.Piechowiak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/289/photo"
  },
  {
    "id": 290,
    "name": "Anna Pieczarka",
    "club": "PiS",
    "district": "Tarnów",
    "votes": 71199,
    "email": "Anna.Pieczarka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/290/photo"
  },
  {
    "id": 291,
    "name": "Katarzyna Maria Piekarska",
    "club": "KO",
    "district": "Warszawa",
    "votes": 8748,
    "email": "Katarzyna.Piekarska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/291/photo"
  },
  {
    "id": 292,
    "name": "Norbert Pietrykowski",
    "club": "Polska2050",
    "district": "Bydgoszcz",
    "votes": 27596,
    "email": "Norbert.Pietrykowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/292/photo"
  },
  {
    "id": 293,
    "name": "Lucjan Marek Pietrzczyk",
    "club": "KO",
    "district": "Kielce",
    "votes": 5826,
    "email": "Lucjan.Pietrzczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/293/photo"
  },
  {
    "id": 294,
    "name": "Dariusz Piontkowski",
    "club": "PiS",
    "district": "Białystok",
    "votes": 22147,
    "email": "Dariusz.Piontkowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/294/photo"
  },
  {
    "id": 295,
    "name": "Kazimierz Plocke",
    "club": "KO",
    "district": "Słupsk",
    "votes": 8154,
    "email": "Kazimierz.Plocke@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/295/photo"
  },
  {
    "id": 296,
    "name": "Grzegorz Płaczek",
    "club": "Konfederacja",
    "district": "Katowice",
    "votes": 18648,
    "email": "Grzegorz.Placzek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/296/photo"
  },
  {
    "id": 297,
    "name": "Kacper Płażyński",
    "club": "PiS",
    "district": "Gdańsk",
    "votes": 100445,
    "email": "Kacper.Plazynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/297/photo"
  },
  {
    "id": 298,
    "name": "Szymon Pogoda",
    "club": "PiS",
    "district": "Legnica",
    "votes": 10117,
    "email": "Szymon.Pogoda@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/298/photo"
  },
  {
    "id": 299,
    "name": "Jerzy Polaczek",
    "club": "PiS",
    "district": "Katowice",
    "votes": 5996,
    "email": "Jerzy.Polaczek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/299/photo"
  },
  {
    "id": 300,
    "name": "Elżbieta Anna Polak",
    "club": "KO",
    "district": "Zielona Góra",
    "votes": 78475,
    "email": "Elzbieta.Polak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/300/photo"
  },
  {
    "id": 301,
    "name": "Piotr Polak",
    "club": "PiS",
    "district": "Sieradz",
    "votes": 23845,
    "email": "Piotr.Polak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/301/photo"
  },
  {
    "id": 302,
    "name": "Agnieszka Pomaska",
    "club": "KO",
    "district": "Gdańsk",
    "votes": 83590,
    "email": "Agnieszka.Pomaska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/302/photo"
  },
  {
    "id": 303,
    "name": "Marcin Porzucek",
    "club": "PiS",
    "district": "Piła",
    "votes": 28293,
    "email": "Marcin.Porzucek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/303/photo"
  },
  {
    "id": 306,
    "name": "Grzegorz Puda",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 33728,
    "email": "Grzegorz.Puda@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/306/photo"
  },
  {
    "id": 307,
    "name": "Michał Pyrzyk",
    "club": "PSL-TD",
    "district": "Konin",
    "votes": 10304,
    "email": "Michal.Pyrzyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/307/photo"
  },
  {
    "id": 308,
    "name": "Renata Rak",
    "club": "KO",
    "district": "Koszalin",
    "votes": 9170,
    "email": "Renata.Rak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/308/photo"
  },
  {
    "id": 309,
    "name": "Ireneusz Raś",
    "club": "PSL-TD",
    "district": "Kraków",
    "votes": 27518,
    "email": "Ireneusz.Ras@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/309/photo"
  },
  {
    "id": 310,
    "name": "Zbigniew Rau",
    "club": "PiS",
    "district": "Łódź",
    "votes": 32387,
    "email": "Zbigniew.Rau@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/310/photo"
  },
  {
    "id": 311,
    "name": "Marcin Romanowski",
    "club": "PiS",
    "district": "Chełm",
    "votes": 17318,
    "email": "Marcin.Romanowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/311/photo"
  },
  {
    "id": 312,
    "name": "Bartosz Romowicz",
    "club": "Polska2050",
    "district": "Krosno",
    "votes": 21527,
    "email": "Bartosz.Romowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/312/photo"
  },
  {
    "id": 313,
    "name": "Monika Rosa",
    "club": "KO",
    "district": "Katowice",
    "votes": 44857,
    "email": "Monika.Rosa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/313/photo"
  },
  {
    "id": 314,
    "name": "Wiesław Różyński",
    "club": "PSL-TD",
    "district": "Chełm",
    "votes": 17237,
    "email": "Wieslaw.Rozynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/314/photo"
  },
  {
    "id": 315,
    "name": "Urszula Rusecka",
    "club": "PiS",
    "district": "Tarnów",
    "votes": 17080,
    "email": "Urszula.Rusecka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/315/photo"
  },
  {
    "id": 317,
    "name": "Jakub Rutnicki",
    "club": "KO",
    "district": "Piła",
    "votes": 67069,
    "email": "Jakub.Rutnicki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/317/photo"
  },
  {
    "id": 318,
    "name": "Paweł Rychlik",
    "club": "PiS",
    "district": "Sieradz",
    "votes": 27361,
    "email": "Pawel.Rychlik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/318/photo"
  },
  {
    "id": 319,
    "name": "Marek Rząsa",
    "club": "KO",
    "district": "Krosno",
    "votes": 13510,
    "email": "Marek.Rzasa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/319/photo"
  },
  {
    "id": 320,
    "name": "Jarosław Rzepa",
    "club": "PSL-TD",
    "district": "Szczecin",
    "votes": 21309,
    "email": "Jaroslaw.Rzepa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/320/photo"
  },
  {
    "id": 321,
    "name": "Jarosław Sachajko",
    "club": "Republikanie",
    "district": "Chełm",
    "votes": 33727,
    "email": "Jaroslaw.Sachajko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/321/photo"
  },
  {
    "id": 322,
    "name": "Paweł Sałek",
    "club": "PiS",
    "district": "Piotrków Trybunalski",
    "votes": 15200,
    "email": "Pawel.Salek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/322/photo"
  },
  {
    "id": 324,
    "name": "Tadeusz Samborski",
    "club": "PSL-TD",
    "district": "Legnica",
    "votes": 16120,
    "email": "Tadeusz.Samborski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/324/photo"
  },
  {
    "id": 325,
    "name": "Jacek Sasin",
    "club": "PiS",
    "district": "Białystok",
    "votes": 59490,
    "email": "Jacek.Sasin@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/325/photo"
  },
  {
    "id": 326,
    "name": "Marek Sawicki",
    "club": "PSL-TD",
    "district": "Siedlce",
    "votes": 25534,
    "email": "Marek.Sawicki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/326/photo"
  },
  {
    "id": 327,
    "name": "Ewa Schädler",
    "club": "Polska2050",
    "district": "Poznań",
    "votes": 33815,
    "email": "Ewa.Schadler@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/327/photo"
  },
  {
    "id": 329,
    "name": "Anna Schmidt",
    "club": "PiS",
    "district": "Krosno",
    "votes": 28692,
    "email": "Anna.Schmidt@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/329/photo"
  },
  {
    "id": 330,
    "name": "Łukasz Schreiber",
    "club": "PiS",
    "district": "Bydgoszcz",
    "votes": 44413,
    "email": "Lukasz.Schreiber@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/330/photo"
  },
  {
    "id": 331,
    "name": "Jarosław Sellin",
    "club": "PiS",
    "district": "Gdańsk",
    "votes": 7284,
    "email": "Jaroslaw.Sellin@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/331/photo"
  },
  {
    "id": 332,
    "name": "Olga Ewa Semeniuk-Patkowska",
    "club": "PiS",
    "district": "Olsztyn",
    "votes": 14183,
    "email": "Olga.Semeniuk-Patkowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/332/photo"
  },
  {
    "id": 333,
    "name": "Edward Siarka",
    "club": "PiS",
    "district": "Nowy Sącz",
    "votes": 18587,
    "email": "Edward.Siarka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/333/photo"
  },
  {
    "id": 334,
    "name": "Krystyna Sibińska",
    "club": "KO",
    "district": "Zielona Góra",
    "votes": 19415,
    "email": "Krystyna.Sibinska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/334/photo"
  },
  {
    "id": 335,
    "name": "Czesław Siekierski",
    "club": "PSL-TD",
    "district": "Kielce",
    "votes": 21916,
    "email": "Czeslaw.Siekierski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/335/photo"
  },
  {
    "id": 336,
    "name": "Rafał Siemaszko",
    "club": "KO",
    "district": "Słupsk",
    "votes": 15494,
    "email": "Rafal.Siemaszko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/336/photo"
  },
  {
    "id": 337,
    "name": "Tomasz Siemoniak",
    "club": "KO",
    "district": "Opole",
    "votes": 46223,
    "email": "Tomasz.Siemoniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/337/photo"
  },
  {
    "id": 339,
    "name": "Arkadiusz Sikora",
    "club": "Lewica",
    "district": "Legnica",
    "votes": 12048,
    "email": "Arkadiusz.Sikora@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/339/photo"
  },
  {
    "id": 340,
    "name": "Włodzimierz Skalik",
    "club": "Konfederacja_KP",
    "district": "Opole",
    "votes": 15190,
    "email": "Wlodzimierz.Skalik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/340/photo"
  },
  {
    "id": 341,
    "name": "Marcin Skonieczka",
    "club": "Polska2050",
    "district": "Toruń",
    "votes": 11864,
    "email": "Marcin.Skonieczka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/341/photo"
  },
  {
    "id": 342,
    "name": "Krystyna Skowrońska",
    "club": "KO",
    "district": "Rzeszów",
    "votes": 14901,
    "email": "Krystyna.Skowronska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/342/photo"
  },
  {
    "id": 343,
    "name": "Sławomir Skwarek",
    "club": "PiS",
    "district": "Lublin",
    "votes": 12427,
    "email": "Slawomir.Skwarek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/343/photo"
  },
  {
    "id": 344,
    "name": "Waldemar Sługocki",
    "club": "KO",
    "district": "Zielona Góra",
    "votes": 25037,
    "email": "Waldemar.Slugocki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/344/photo"
  },
  {
    "id": 345,
    "name": "Weronika Smarduch",
    "club": "KO",
    "district": "Nowy Sącz",
    "votes": 27031,
    "email": "Weronika.Smarduch@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/345/photo"
  },
  {
    "id": 346,
    "name": "Kazimierz Smoliński",
    "club": "PiS",
    "district": "Gdańsk",
    "votes": 16177,
    "email": "Kazimierz.Smolinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/346/photo"
  },
  {
    "id": 347,
    "name": "Anna Sobolak",
    "club": "KO",
    "district": "Wrocław",
    "votes": 7675,
    "email": "Anna.Sobolak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/347/photo"
  },
  {
    "id": 348,
    "name": "Krzysztof Sobolewski",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 18390,
    "email": "Krzysztof.Sobolewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/348/photo"
  },
  {
    "id": 350,
    "name": "Agnieszka Anna Soin",
    "club": "PiS",
    "district": "Wrocław",
    "votes": 18645,
    "email": "Agnieszka.Soin@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/350/photo"
  },
  {
    "id": 351,
    "name": "Zbigniew Sosnowski",
    "club": "PSL-TD",
    "district": "Toruń",
    "votes": 27070,
    "email": "Zbigniew.Sosnowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/351/photo"
  },
  {
    "id": 352,
    "name": "Marek Sowa",
    "club": "KO",
    "district": "Kraków",
    "votes": 24652,
    "email": "Marek.Sowa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/352/photo"
  },
  {
    "id": 353,
    "name": "Katarzyna Sójka",
    "club": "PiS",
    "district": "Kalisz",
    "votes": 18138,
    "email": "Katarzyna.Sojka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/353/photo"
  },
  {
    "id": 354,
    "name": "Magdalena Sroka",
    "club": "PSL-TD",
    "district": "Gdańsk",
    "votes": 18348,
    "email": "Magdalena.Sroka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/354/photo"
  },
  {
    "id": 355,
    "name": "Mirosława Stachowiak-Różecka",
    "club": "PiS",
    "district": "Wrocław",
    "votes": 97193,
    "email": "Miroslawa.Stachowiak-Rozecka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/355/photo"
  },
  {
    "id": 356,
    "name": "Dariusz Stefaniuk",
    "club": "PiS",
    "district": "Chełm",
    "votes": 29710,
    "email": "Dariusz.Stefaniuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/356/photo"
  },
  {
    "id": 357,
    "name": "Franciszek Sterczewski",
    "club": "KO",
    "district": "Poznań",
    "votes": 10108,
    "email": "Franciszek.Sterczewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/357/photo"
  },
  {
    "id": 358,
    "name": "Piotr Paweł Strach",
    "club": "Polska2050",
    "district": "Katowice",
    "votes": 17634,
    "email": "Piotr.Strach@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/358/photo"
  },
  {
    "id": 359,
    "name": "Mirosław Suchoń",
    "club": "Polska2050",
    "district": "Bielsko-Biała",
    "votes": 30897,
    "email": "Miroslaw.Suchon@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/359/photo"
  },
  {
    "id": 360,
    "name": "Marek Suski",
    "club": "PiS",
    "district": "Radom",
    "votes": 37853,
    "email": "Marek.Suski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/360/photo"
  },
  {
    "id": 361,
    "name": "Paweł Suski",
    "club": "KO",
    "district": "Koszalin",
    "votes": 5934,
    "email": "Pawel.Suski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/361/photo"
  },
  {
    "id": 362,
    "name": "Artur Szałabawka",
    "club": "PiS",
    "district": "Szczecin",
    "votes": 15446,
    "email": "Artur.Szalabawka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/362/photo"
  },
  {
    "id": 363,
    "name": "Wojciech Szarama",
    "club": "PiS",
    "district": "Katowice",
    "votes": 12185,
    "email": "Wojciech.Szarama@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/363/photo"
  },
  {
    "id": 364,
    "name": "Wiesław Szczepański",
    "club": "Lewica",
    "district": "Kalisz",
    "votes": 13668,
    "email": "Wieslaw.Szczepanski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/364/photo"
  },
  {
    "id": 366,
    "name": "Krzysztof Szczucki",
    "club": "PiS",
    "district": "Toruń",
    "votes": 34014,
    "email": "Krzysztof.Szczucki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/366/photo"
  },
  {
    "id": 367,
    "name": "Józefa Szczurek-Żelazko",
    "club": "PiS",
    "district": "Tarnów",
    "votes": 26231,
    "email": "Jozefa.Szczurek-Zelazko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/367/photo"
  },
  {
    "id": 369,
    "name": "Andrzej Szejna",
    "club": "Lewica",
    "district": "Kielce",
    "votes": 17961,
    "email": "Andrzej.Szejna@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/369/photo"
  },
  {
    "id": 370,
    "name": "Andrzej Szewiński",
    "club": "KO",
    "district": "Częstochowa",
    "votes": 10171,
    "email": "Andrzej.Szewinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/370/photo"
  },
  {
    "id": 371,
    "name": "Adam Szłapka",
    "club": "KO",
    "district": "Poznań",
    "votes": 149064,
    "email": "Adam.Szlapka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/371/photo"
  },
  {
    "id": 372,
    "name": "Henryk Szopiński",
    "club": "KO",
    "district": "Piła",
    "votes": 8263,
    "email": "Henryk.Szopinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/372/photo"
  },
  {
    "id": 373,
    "name": "Paweł Szrot",
    "club": "PiS",
    "district": "Bydgoszcz",
    "votes": 20214,
    "email": "Pawel.Szrot@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/373/photo"
  },
  {
    "id": 374,
    "name": "Krystyna Szumilas",
    "club": "KO",
    "district": "Katowice",
    "votes": 50871,
    "email": "Krystyna.Szumilas@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/374/photo"
  },
  {
    "id": 375,
    "name": "Stanisław Szwed",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 57055,
    "email": "Stanislaw.Szwed@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/375/photo"
  },
  {
    "id": 376,
    "name": "Ewa Szymanowska",
    "club": "Polska2050",
    "district": "Łódź",
    "votes": 26185,
    "email": "Ewa.Szymanowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/376/photo"
  },
  {
    "id": 377,
    "name": "Tomasz Szymański",
    "club": "KO",
    "district": "Toruń",
    "votes": 17825,
    "email": "Tomasz.Szymanski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/377/photo"
  },
  {
    "id": 378,
    "name": "Szymon Szynkowski vel Sęk",
    "club": "PiS",
    "district": "Poznań",
    "votes": 45167,
    "email": "Szymon.SzynkowskiVelSek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/378/photo"
  },
  {
    "id": 379,
    "name": "Łukasz Ściebiorowski",
    "club": "KO",
    "district": "Katowice",
    "votes": 7116,
    "email": "Lukasz.Sciebiorowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/379/photo"
  },
  {
    "id": 380,
    "name": "Agnieszka Ścigaj",
    "club": "PiS",
    "district": "Kraków",
    "votes": 6262,
    "email": "Agnieszka.Scigaj@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/380/photo"
  },
  {
    "id": 381,
    "name": "Andrzej Śliwka",
    "club": "PiS",
    "district": "Elbląg",
    "votes": 32895,
    "email": "Andrzej.Sliwka@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/381/photo"
  },
  {
    "id": 382,
    "name": "Paweł Śliz",
    "club": "Polska2050",
    "district": "Kraków",
    "votes": 19630,
    "email": "Pawel.Sliz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/382/photo"
  },
  {
    "id": 384,
    "name": "Jacek Świat",
    "club": "PiS",
    "district": "Wrocław",
    "votes": 13663,
    "email": "Jacek.Swiat@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/384/photo"
  },
  {
    "id": 385,
    "name": "Apoloniusz Tajner",
    "club": "KO",
    "district": "Bielsko-Biała",
    "votes": 20748,
    "email": "Apoloniusz.Tajner@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/385/photo"
  },
  {
    "id": 386,
    "name": "Krzysztof Tchórzewski",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 25867,
    "email": "Krzysztof.Tchorzewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/386/photo"
  },
  {
    "id": 387,
    "name": "Robert Telus",
    "club": "PiS",
    "district": "Piotrków Trybunalski",
    "votes": 49262,
    "email": "Robert.Telus@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/387/photo"
  },
  {
    "id": 388,
    "name": "Ryszard Terlecki",
    "club": "PiS",
    "district": "Nowy Sącz",
    "votes": 29882,
    "email": "Ryszard.Terlecki@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/388/photo"
  },
  {
    "id": 389,
    "name": "Tadeusz Tomaszewski",
    "club": "Lewica",
    "district": "Konin",
    "votes": 17181,
    "email": "Tadeusz.Tomaszewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/389/photo"
  },
  {
    "id": 390,
    "name": "Jacek Tomczak",
    "club": "PSL-TD",
    "district": "Poznań",
    "votes": 24918,
    "email": "Jacek.Tomczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/390/photo"
  },
  {
    "id": 391,
    "name": "Wioleta Tomczak",
    "club": "Polska2050",
    "district": "Słupsk",
    "votes": 13217,
    "email": "Wioleta.Tomczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/391/photo"
  },
  {
    "id": 392,
    "name": "Cezary Tomczyk",
    "club": "KO",
    "district": "Sieradz",
    "votes": 69211,
    "email": "Cezary.Tomczyk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/392/photo"
  },
  {
    "id": 393,
    "name": "Stanisław Tomczyszyn",
    "club": "PSL-TD",
    "district": "Zielona Góra",
    "votes": 10332,
    "email": "Stanislaw.Tomczyszyn@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/393/photo"
  },
  {
    "id": 394,
    "name": "Małgorzata Tracz",
    "club": "KO",
    "district": "Wrocław",
    "votes": 17693,
    "email": "Malgorzata.Tracz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/394/photo"
  },
  {
    "id": 395,
    "name": "Tomasz Trela",
    "club": "Lewica",
    "district": "Łódź",
    "votes": 26273,
    "email": "Tomasz.Trela@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/395/photo"
  },
  {
    "id": 396,
    "name": "Krzysztof Truskolaski",
    "club": "KO",
    "district": "Białystok",
    "votes": 57664,
    "email": "Krzysztof.Truskolaski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/396/photo"
  },
  {
    "id": 397,
    "name": "Krzysztof Tuduj",
    "club": "Konfederacja",
    "district": "Wrocław",
    "votes": 25922,
    "email": "Krzysztof.Tuduj@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/397/photo"
  },
  {
    "id": 398,
    "name": "Sylwester Tułajew",
    "club": "PiS",
    "district": "Lublin",
    "votes": 10228,
    "email": "Sylwester.Tulajew@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/398/photo"
  },
  {
    "id": 399,
    "name": "Witold Tumanowicz",
    "club": "Konfederacja",
    "district": "Chełm",
    "votes": 14387,
    "email": "Witold.Tumanowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/399/photo"
  },
  {
    "id": 400,
    "name": "Donald Tusk",
    "club": "KO",
    "district": "Warszawa",
    "votes": 538634,
    "email": "Donald.Tusk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/400/photo"
  },
  {
    "id": 402,
    "name": "Katarzyna Ueberhan",
    "club": "Lewica",
    "district": "Poznań",
    "votes": 24485,
    "email": "Katarzyna.Ueberhan@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/402/photo"
  },
  {
    "id": 403,
    "name": "Jarosław Urbaniak",
    "club": "KO",
    "district": "Kalisz",
    "votes": 50724,
    "email": "Jaroslaw.Urbaniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/403/photo"
  },
  {
    "id": 404,
    "name": "Piotr Uruski",
    "club": "PiS",
    "district": "Krosno",
    "votes": 22703,
    "email": "Piotr.Uruski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/404/photo"
  },
  {
    "id": 405,
    "name": "Piotr Uściński",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 15006,
    "email": "Piotr.Uscinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/405/photo"
  },
  {
    "id": 406,
    "name": "Jarosław Wałęsa",
    "club": "KO",
    "district": "Gdańsk",
    "votes": 17408,
    "email": "Jaroslaw.Walesa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/406/photo"
  },
  {
    "id": 407,
    "name": "Marcin Warchoł",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 26750,
    "email": "Marcin.Warchol@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/407/photo"
  },
  {
    "id": 408,
    "name": "Robert Wardzała",
    "club": "KO",
    "district": "Tarnów",
    "votes": 9265,
    "email": "Robert.Wardzala@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/408/photo"
  },
  {
    "id": 409,
    "name": "Robert Warwas",
    "club": "PiS",
    "district": "Katowice",
    "votes": 17403,
    "email": "Robert.Warwas@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/409/photo"
  },
  {
    "id": 410,
    "name": "Jan Warzecha",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 14023,
    "email": "Jan.Warzecha@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/410/photo"
  },
  {
    "id": 411,
    "name": "Małgorzata Wassermann",
    "club": "PiS",
    "district": "Kraków",
    "votes": 125786,
    "email": "Malgorzata.Wassermann@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/411/photo"
  },
  {
    "id": 412,
    "name": "Michał Wawer",
    "club": "Konfederacja",
    "district": "Kielce",
    "votes": 18300,
    "email": "Michal.Wawer@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/412/photo"
  },
  {
    "id": 415,
    "name": "Rafał Weber",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 31349,
    "email": "Rafal.Weber@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/415/photo"
  },
  {
    "id": 416,
    "name": "Marek Wesoły",
    "club": "PiS",
    "district": "Katowice",
    "votes": 9915,
    "email": "Marek.Wesoly@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/416/photo"
  },
  {
    "id": 417,
    "name": "Joanna Wicha",
    "club": "Lewica",
    "district": "Warszawa",
    "votes": 15324,
    "email": "Joanna.Wicha@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/417/photo"
  },
  {
    "id": 418,
    "name": "Patryk Wicher",
    "club": "PiS",
    "district": "Nowy Sącz",
    "votes": 18604,
    "email": "Patryk.Wicher@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/418/photo"
  },
  {
    "id": 419,
    "name": "Dariusz Wieczorek",
    "club": "Lewica",
    "district": "Szczecin",
    "votes": 15378,
    "email": "Dariusz.Wieczorek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/419/photo"
  },
  {
    "id": 420,
    "name": "Jarosław Wiesław Wieczorek",
    "club": "PiS",
    "district": "Katowice",
    "votes": 23451,
    "email": "Jaroslaw.Wieczorek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/420/photo"
  },
  {
    "id": 421,
    "name": "Monika Wielichowska",
    "club": "KO",
    "district": "Wałbrzych",
    "votes": 52182,
    "email": "Monika.Wielichowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/421/photo"
  },
  {
    "id": 422,
    "name": "Ryszard Wilk",
    "club": "Konfederacja",
    "district": "Nowy Sącz",
    "votes": 19374,
    "email": "Ryszard.Wilk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/422/photo"
  },
  {
    "id": 423,
    "name": "Teresa Wilk",
    "club": "PiS",
    "district": "Elbląg",
    "votes": 9280,
    "email": "Teresa.Wilk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/423/photo"
  },
  {
    "id": 424,
    "name": "Przemysław Wipler",
    "club": "Konfederacja",
    "district": "Toruń",
    "votes": 13457,
    "email": "Przemyslaw.Wipler@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/424/photo"
  },
  {
    "id": 425,
    "name": "Aleksandra Karolina Uznańska-Wiśniewska",
    "club": "KO",
    "district": "Łódź",
    "votes": 25436,
    "email": "Aleksandra.Uznanska-Wisniewska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/425/photo"
  },
  {
    "id": 426,
    "name": "Adrian Witczak",
    "club": "KO",
    "district": "Piotrków Trybunalski",
    "votes": 16287,
    "email": "Adrian.Witczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/426/photo"
  },
  {
    "id": 427,
    "name": "Mariusz Witczak",
    "club": "KO",
    "district": "Kalisz",
    "votes": 12754,
    "email": "Mariusz.Witczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/427/photo"
  },
  {
    "id": 428,
    "name": "Elżbieta Witek",
    "club": "PiS",
    "district": "Legnica",
    "votes": 89172,
    "email": "Elzbieta.Witek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/428/photo"
  },
  {
    "id": 429,
    "name": "Przemysław Witek",
    "club": "KO",
    "district": "Częstochowa",
    "votes": 5121,
    "email": "Przemyslaw.Witek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/429/photo"
  },
  {
    "id": 430,
    "name": "Kamil Wnuk",
    "club": "Polska2050",
    "district": "Katowice",
    "votes": 16310,
    "email": "Kamil.Wnuk@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/430/photo"
  },
  {
    "id": 431,
    "name": "Anna Wojciechowska",
    "club": "KO",
    "district": "Olsztyn",
    "votes": 18828,
    "email": "Anna.Wojciechowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/431/photo"
  },
  {
    "id": 432,
    "name": "Agnieszka Wojciechowska van Heukelom",
    "club": "PiS",
    "district": "Łódź",
    "votes": 10557,
    "email": "Agnieszka.WojciechowskavanHeukelom@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/432/photo"
  },
  {
    "id": 433,
    "name": "Agata Wojtyszek",
    "club": "PiS",
    "district": "Kielce",
    "votes": 15405,
    "email": "Agata.Wojtyszek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/433/photo"
  },
  {
    "id": 434,
    "name": "Bogusław Wołoszański",
    "club": "KO",
    "district": "Piotrków Trybunalski",
    "votes": 35202,
    "email": "Boguslaw.Woloszanski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/434/photo"
  },
  {
    "id": 435,
    "name": "Michał Woś",
    "club": "PiS",
    "district": "Bielsko-Biała",
    "votes": 39902,
    "email": "Michal.Wos@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/435/photo"
  },
  {
    "id": 436,
    "name": "Grzegorz Woźniak",
    "club": "PiS",
    "district": "Siedlce",
    "votes": 9088,
    "email": "Grzegorz.Wozniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/436/photo"
  },
  {
    "id": 437,
    "name": "Tadeusz Woźniak",
    "club": "PiS",
    "district": "Sieradz",
    "votes": 19691,
    "email": "Tadeusz.Wozniak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/437/photo"
  },
  {
    "id": 438,
    "name": "Michał Wójcik",
    "club": "PiS",
    "district": "Katowice",
    "votes": 8270,
    "email": "Michal.Wojcik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/438/photo"
  },
  {
    "id": 439,
    "name": "Maciej Wróbel",
    "club": "KO",
    "district": "Olsztyn",
    "votes": 9837,
    "email": "Maciej.Wrobel@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/439/photo"
  },
  {
    "id": 440,
    "name": "Bartłomiej Wróblewski",
    "club": "PiS",
    "district": "Poznań",
    "votes": 28860,
    "email": "Bartlomiej.Wroblewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/440/photo"
  },
  {
    "id": 441,
    "name": "Paweł Zalewski",
    "club": "Polska2050",
    "district": "Warszawa",
    "votes": 35395,
    "email": "Pawel.Zalewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/441/photo"
  },
  {
    "id": 442,
    "name": "Adrian Zandberg",
    "club": "Razem",
    "district": "Warszawa",
    "votes": 64435,
    "email": "Adrian.Zandberg@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/442/photo"
  },
  {
    "id": 443,
    "name": "Andrzej Tomasz Zapałowski",
    "club": "Konfederacja",
    "district": "Krosno",
    "votes": 14475,
    "email": "Andrzej.Zapalowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/443/photo"
  },
  {
    "id": 444,
    "name": "Bartosz Zawieja",
    "club": "KO",
    "district": "Poznań",
    "votes": 9103,
    "email": "Bartosz.Zawieja@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/444/photo"
  },
  {
    "id": 445,
    "name": "Marcelina Zawisza",
    "club": "Razem",
    "district": "Opole",
    "votes": 19388,
    "email": "Marcelina.Zawisza@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/445/photo"
  },
  {
    "id": 446,
    "name": "Sławomir Zawiślak",
    "club": "Konfederacja_KP",
    "district": "Chełm",
    "votes": 10936,
    "email": "Slawomir.Zawislak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/446/photo"
  },
  {
    "id": 448,
    "name": "Witold Zembaczyński",
    "club": "KO",
    "district": "Opole",
    "votes": 23647,
    "email": "Witold.Zembaczynski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/448/photo"
  },
  {
    "id": 449,
    "name": "Piotr Zgorzelski",
    "club": "PSL-TD",
    "district": "Płock",
    "votes": 32011,
    "email": "Piotr.Zgorzelski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/449/photo"
  },
  {
    "id": 450,
    "name": "Zbigniew Ziejewski",
    "club": "PSL-TD",
    "district": "Elbląg",
    "votes": 12695,
    "email": "Zbigniew.Ziejewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/450/photo"
  },
  {
    "id": 451,
    "name": "Urszula Sara Zielińska",
    "club": "KO",
    "district": "Warszawa",
    "votes": 16470,
    "email": "Urszula.Zielinska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/451/photo"
  },
  {
    "id": 452,
    "name": "Jarosław Zieliński",
    "club": "PiS",
    "district": "Białystok",
    "votes": 20812,
    "email": "Jaroslaw.Zielinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/452/photo"
  },
  {
    "id": 453,
    "name": "Tomasz Zieliński",
    "club": "PiS",
    "district": "Chełm",
    "votes": 13469,
    "email": "Tomasz.Zielinski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/453/photo"
  },
  {
    "id": 454,
    "name": "Jolanta Zięba-Gzik",
    "club": "PSL-TD",
    "district": "Sieradz",
    "votes": 10474,
    "email": "Jolanta.Zieba-Gzik@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/454/photo"
  },
  {
    "id": 455,
    "name": "Tomasz Zimoch",
    "club": "niez.",
    "district": "Wrocław",
    "votes": 34187,
    "email": "Tomasz.Zimoch@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/455/photo"
  },
  {
    "id": 456,
    "name": "Zbigniew Ziobro",
    "club": "PiS",
    "district": "Rzeszów",
    "votes": 74592,
    "email": "Zbigniew.Ziobro@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/456/photo"
  },
  {
    "id": 457,
    "name": "Wojciech Michał Zubowski",
    "club": "PiS",
    "district": "Legnica",
    "votes": 8527,
    "email": "Wojciech.Zubowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/457/photo"
  },
  {
    "id": 458,
    "name": "Ireneusz Zyska",
    "club": "PiS",
    "district": "Wałbrzych",
    "votes": 11817,
    "email": "Ireneusz.Zyska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/458/photo"
  },
  {
    "id": 459,
    "name": "Bożena Żelazowska",
    "club": "PSL-TD",
    "district": "Warszawa",
    "votes": 17416,
    "email": "Bozena.Zelazowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/459/photo"
  },
  {
    "id": 460,
    "name": "Anna Maria Żukowska",
    "club": "Lewica",
    "district": "Warszawa",
    "votes": 38426,
    "email": "Anna.Zukowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/460/photo"
  },
  {
    "id": 461,
    "name": "Anna Baluch",
    "club": "PiS",
    "district": "Lublin",
    "votes": 7686,
    "email": "Anna.Baluch@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/461/photo"
  },
  {
    "id": 462,
    "name": "Magdalena Łośko",
    "club": "KO",
    "district": "Bydgoszcz",
    "votes": 4864,
    "email": "Magdalena.Losko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/462/photo"
  },
  {
    "id": 463,
    "name": "Monika Pawłowska",
    "club": "PiS",
    "district": "Chełm",
    "votes": 10789,
    "email": "Monika.Pawlowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/463/photo"
  },
  {
    "id": 464,
    "name": "Alicja Łuczak",
    "club": "KO",
    "district": "Kalisz",
    "votes": 5186,
    "email": "Alicja.Luczak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/464/photo"
  },
  {
    "id": 465,
    "name": "Dominik Jaśkowiec",
    "club": "KO",
    "district": "Kraków",
    "votes": 6093,
    "email": "Dominik.Jaskowiec@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/465/photo"
  },
  {
    "id": 466,
    "name": "Paweł Masełko",
    "club": "KO",
    "district": "Opole",
    "votes": 8322,
    "email": "Pawel.Maselko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/466/photo"
  },
  {
    "id": 467,
    "name": "Katarzyna Stachowicz",
    "club": "KO",
    "district": "Katowice",
    "votes": 10060,
    "email": "Katarzyna.Stachowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/467/photo"
  },
  {
    "id": 468,
    "name": "Lidia Czechak",
    "club": "PiS",
    "district": "Kalisz",
    "votes": 7053,
    "email": "Lidia.Czechak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/468/photo"
  },
  {
    "id": 469,
    "name": "Barbara Grygorcewicz",
    "club": "KO",
    "district": "Koszalin",
    "votes": 5700,
    "email": "Barbara.Grygorcewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/469/photo"
  },
  {
    "id": 470,
    "name": "Bożenna Hołownia",
    "club": "Polska2050",
    "district": "Warszawa",
    "votes": 22593,
    "email": "Bozenna.Holownia@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/470/photo"
  },
  {
    "id": 471,
    "name": "Urszula Koszutska",
    "club": "KO",
    "district": "Katowice",
    "votes": 6498,
    "email": "Urszula.Koszutska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/471/photo"
  },
  {
    "id": 472,
    "name": "Piotr Kowal",
    "club": "Lewica",
    "district": "Toruń",
    "votes": 7860,
    "email": "Piotr.Kowal@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/472/photo"
  },
  {
    "id": 473,
    "name": "Michał Kowalski",
    "club": "PiS",
    "district": "Słupsk",
    "votes": 6486,
    "email": "Michal.Kowalski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/473/photo"
  },
  {
    "id": 474,
    "name": "Maria Joanna Koźlakiewicz",
    "club": "KO",
    "district": "Płock",
    "votes": 4535,
    "email": "Maria.Kozlakiewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/474/photo"
  },
  {
    "id": 475,
    "name": "Katarzyna Królak",
    "club": "KO",
    "district": "Elbląg",
    "votes": 5979,
    "email": "Katarzyna.Krolak@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/475/photo"
  },
  {
    "id": 476,
    "name": "Wioletta Maria Kulpa",
    "club": "PiS",
    "district": "Płock",
    "votes": 18283,
    "email": "Wioletta.Kulpa@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/476/photo"
  },
  {
    "id": 477,
    "name": "Grzegorz Macko",
    "club": "PiS",
    "district": "Wałbrzych",
    "votes": 10781,
    "email": "Grzegorz.Macko@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/477/photo"
  },
  {
    "id": 478,
    "name": "Jerzy Meysztowicz",
    "club": "KO",
    "district": "Kraków",
    "votes": 5408,
    "email": "Jerzy.Meysztowicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/478/photo"
  },
  {
    "id": 479,
    "name": "Krzysztof Mieszkowski",
    "club": "KO",
    "district": "Wrocław",
    "votes": 7031,
    "email": "Krzysztof.Mieszkowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/479/photo"
  },
  {
    "id": 480,
    "name": "Anna Paluch",
    "club": "PiS",
    "district": "Nowy Sącz",
    "votes": 14616,
    "email": "Anna.Paluch@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/480/photo"
  },
  {
    "id": 481,
    "name": "Krzysztof Piątkowski",
    "club": "KO",
    "district": "Łódź",
    "votes": 7018,
    "email": "Krzysztof.Piatkowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/481/photo"
  },
  {
    "id": 482,
    "name": "Mariusz Popielarz",
    "club": "KO",
    "district": "Siedlce",
    "votes": 5009,
    "email": "Mariusz.Popielarz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/482/photo"
  },
  {
    "id": 483,
    "name": "Magdalena Roguska",
    "club": "KO",
    "district": "Warszawa",
    "votes": 6193,
    "email": "Magdalena.Roguska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/483/photo"
  },
  {
    "id": 484,
    "name": "Marta Stożek",
    "club": "Razem",
    "district": "Wrocław",
    "votes": 19434,
    "email": "Marta.Stozek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/484/photo"
  },
  {
    "id": 485,
    "name": "Krzysztof Szymański",
    "club": "Konfederacja",
    "district": "Słupsk",
    "votes": 6379,
    "email": "Krzysztof.Szymanski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/485/photo"
  },
  {
    "id": 486,
    "name": "Włodzimierz Tomaszewski",
    "club": "PiS",
    "district": "Łódź",
    "votes": 9247,
    "email": "Wlodzimierz.Tomaszewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/486/photo"
  },
  {
    "id": 487,
    "name": "Maciej Tomczykiewicz",
    "club": "KO",
    "district": "Bielsko-Biała",
    "votes": 12153,
    "email": "Maciej.Tomczykiewicz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/487/photo"
  },
  {
    "id": 488,
    "name": "Jarosław Krajewski",
    "club": "PiS",
    "district": "Warszawa",
    "votes": 24703,
    "email": "Jaroslaw.Krajewski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/488/photo"
  },
  {
    "id": 489,
    "name": "Bożena Lisowska",
    "club": "KO",
    "district": "Lublin",
    "votes": 6935,
    "email": "Bozena.Lisowska@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/489/photo"
  },
  {
    "id": 490,
    "name": "Michał Połuboczek",
    "club": "Konfederacja",
    "district": "Rzeszów",
    "votes": 6287,
    "email": "Michal.Poluboczek@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/490/photo"
  },
  {
    "id": 491,
    "name": "Aleksandra Kot",
    "club": "KO",
    "district": "Kraków",
    "votes": 4942,
    "email": "Aleksandra.Kot@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/491/photo"
  },
  {
    "id": 492,
    "name": "Rafał Romanowski",
    "club": "PiS",
    "district": "Płock",
    "votes": 14831,
    "email": "Rafal.Romanowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/492/photo"
  },
  {
    "id": 493,
    "name": "Henryk Smolarz",
    "club": "PSL-TD",
    "district": "Lublin",
    "votes": 5536,
    "email": "Henryk.Smolarz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/493/photo"
  },
  {
    "id": 494,
    "name": "Robert Jagła",
    "club": "KO",
    "district": "Wałbrzych",
    "votes": 5676,
    "email": "Robert.Jagla@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/494/photo"
  },
  {
    "id": 495,
    "name": "Michał Jach",
    "club": "PiS",
    "district": "Szczecin",
    "votes": 12480,
    "email": "Michal.Jach@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/495/photo"
  },
  {
    "id": 496,
    "name": "Bogumiła Olbryś",
    "club": "PiS",
    "district": "Białystok",
    "votes": 10661,
    "email": "Bogumila.Olbrys@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/496/photo"
  },
  {
    "id": 497,
    "name": "Tomasz Rzymkowski",
    "club": "niez.",
    "district": "Sieradz",
    "votes": 16875,
    "email": "Tomasz.Rzymkowski@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/497/photo"
  },
  {
    "id": 498,
    "name": "Marek Subocz",
    "club": "PiS",
    "district": "Koszalin",
    "votes": 7511,
    "email": "Marek.Subocz@sejm.pl",
    "photoUrl": "https://api.sejm.gov.pl/sejm/term10/MP/498/photo"
  }
];

// Eksportujemy dane, aby były dostępne w innych plikach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = realMpsData;
} else {
    // Dla przeglądarki przypisujemy do zmiennej globalnej
    window.realMpsData = realMpsData;
}
