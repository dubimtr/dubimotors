/* ─── DUBIMOTORS VEHICLE DATABASE ───────────────────────────────────────────
   Full Brand / Model / Trim data for Cars, Boats, Motorcycles, Jet Skis
   Sourced from UAE market data (Dubizzle, AutoTrader, CarSwitch)
   ─────────────────────────────────────────────────────────────────────────── */

const DM_VEHICLES = {

  /* ══════════════════════════════════════════════════════════════════════════
     CARS
  ══════════════════════════════════════════════════════════════════════════ */
  cars: {
    "Acura": {
      "MDX": ["Base","Technology","A-Spec","Advance","Type S","Type S Advance"],
      "RDX": ["Base","Technology","A-Spec","Advance"],
      "TLX": ["Base","Technology","A-Spec","Advance","Type S","Type S Advance"],
      "Integra": ["Base","A-Spec","A-Spec Technology","Type S"]
    },
    "Alfa Romeo": {
      "Giulia": ["Sprint","Ti","Veloce","Quadrifoglio"],
      "Stelvio": ["Sprint","Ti","Veloce","Quadrifoglio"],
      "Tonale": ["Sprint","Ti","Veloce"],
      "4C": ["Coupe","Spider"]
    },
    "Aston Martin": {
      "DB11": ["V8","V12","AMR"],
      "DBS": ["Superleggera","770 Ultimate"],
      "DBX": ["Standard","707"],
      "Vantage": ["Standard","F1 Edition","AMR"],
      "Vanquish": ["Standard","S","Zagato"],
      "Rapide": ["Standard","S","AMR"]
    },
    "Audi": {
      "A3": ["30 TFSI","35 TFSI","40 TFSI","45 TFSI e","S3","RS3"],
      "A4": ["35 TFSI","40 TFSI","45 TFSI","S4","RS4"],
      "A5": ["35 TFSI","40 TFSI","45 TFSI","S5","RS5"],
      "A6": ["40 TFSI","45 TFSI","55 TFSI","S6","RS6"],
      "A7": ["45 TFSI","55 TFSI","S7","RS7"],
      "A8": ["50 TDI","55 TFSI","60 TFSI e","L","S8"],
      "Q2": ["30 TFSI","35 TFSI","40 TFSI"],
      "Q3": ["35 TFSI","40 TFSI","45 TFSI","RS Q3"],
      "Q5": ["40 TFSI","45 TFSI","55 TFSI e","SQ5","RS Q5"],
      "Q7": ["45 TFSI","55 TFSI","SQ7"],
      "Q8": ["50 TDI","55 TFSI","SQ8","RS Q8"],
      "e-tron": ["50","55","S","GT","GT RS"],
      "TT": ["TTS Coupe","TTS Roadster","TT RS"],
      "R8": ["V10 Performance","V10 Performance Spyder"]
    },
    "Avatr": {
      "11": ["Standard Range","Long Range","Performance"],
      "12": ["Standard","Long Range"]
    },
    "Bentley": {
      "Continental GT": ["V8","W12","Speed","Mulliner","Azure"],
      "Continental GTC": ["V8","W12","Speed","Mulliner","Azure"],
      "Flying Spur": ["V6","V8","W12","Speed","Mulliner","Azure"],
      "Bentayga": ["V8","Hybrid","Speed","Azure","EWB"]
    },
    "BMW": {
      "1 Series": ["116i","118i","120i","M135i"],
      "2 Series": ["218i","220i","230i","M235i","M240i","M2"],
      "3 Series": ["318i","320i","330i","340i","M340i","M3"],
      "4 Series": ["420i","430i","440i","M440i","M4"],
      "5 Series": ["520i","523i","525i","528i","530i","535i","540i","550i","M550i","M5"],
      "6 Series": ["630i","640i","650i","M6"],
      "7 Series": ["730i","740i","745e","750i","760i","M760i"],
      "8 Series": ["840i","850i","M850i","M8"],
      "X1": ["sDrive18i","sDrive20i","xDrive20i","xDrive28i","M35i"],
      "X2": ["sDrive18i","sDrive20i","xDrive20i","M35i"],
      "X3": ["sDrive20i","xDrive20i","xDrive30i","xDrive30e","M40i","M Competition"],
      "X4": ["xDrive20i","xDrive30i","M40i","M Competition"],
      "X5": ["xDrive25d","xDrive40i","xDrive50i","xDrive45e","M50i","M Competition"],
      "X6": ["xDrive40i","xDrive50i","M50i","M Competition"],
      "X7": ["xDrive40i","xDrive50i","M60i","Alpina XB7"],
      "XM": ["Standard","Label","Label Red"],
      "Z4": ["sDrive20i","sDrive30i","M40i"],
      "iX": ["xDrive40","xDrive50","M60"],
      "i4": ["eDrive35","eDrive40","M50"],
      "i7": ["xDrive60","M70"],
      "i5": ["eDrive40","M60"]
    },
    "BYD": {
      "Atto 3": ["Standard Range","Extended Range"],
      "Han": ["EV","DM"],
      "Tang": ["EV","DM"],
      "Seal": ["Standard","Performance"],
      "Dolphin": ["Standard","Extended Range"],
      "Seagull": ["Standard"],
      "Song Plus": ["EV","DM"],
      "Song Pro": ["EV","DM"],
      "Yuan Plus": ["Standard","Long Range"]
    },
    "Cadillac": {
      "CT4": ["Luxury","Premium Luxury","Sport","V-Series Blackwing"],
      "CT5": ["Luxury","Premium Luxury","Sport","V-Series Blackwing"],
      "Escalade": ["Luxury","Premium Luxury","Sport","Platinum","ESV Luxury","ESV Platinum"],
      "XT4": ["Luxury","Premium Luxury","Sport"],
      "XT5": ["Luxury","Premium Luxury","Sport","Platinum"],
      "XT6": ["Luxury","Premium Luxury","Sport","Platinum"],
      "LYRIQ": ["Luxury","Sport","Platinum"]
    },
    "Changan": {
      "Alsvin": ["Standard","Comfort","Luxury"],
      "CS35 Plus": ["Standard","Luxury"],
      "CS55 Plus": ["Standard","Luxury","Elite"],
      "CS75 Plus": ["Standard","Luxury","Elite"],
      "CS85": ["Standard","Luxury"],
      "Uni-K": ["Standard","Luxury"],
      "Uni-T": ["Standard","Luxury"],
      "Uni-V": ["Standard","Luxury"],
      "Hunter": ["Standard","Luxury"]
    },
    "Chery": {
      "Tiggo 4 Pro": ["Standard","Luxury"],
      "Tiggo 7 Pro": ["Standard","Luxury","Elite"],
      "Tiggo 8 Pro": ["Standard","Luxury","Elite"],
      "Arrizo 5": ["Standard","Luxury"],
      "Arrizo 6 Pro": ["Standard","Luxury"],
      "Omoda 5": ["Standard","Luxury"],
      "Jaecoo 7": ["Standard","Luxury"],
      "Jaecoo 8": ["Standard","Luxury"]
    },
    "Chevrolet": {
      "Camaro": ["LS","LT","LT1","SS","ZL1","ZL1 1LE"],
      "Corvette": ["Stingray","Z06","E-Ray","ZR1"],
      "Silverado": ["WT","Custom","LT","RST","LTZ","High Country"],
      "Tahoe": ["LS","LT","RST","Z71","Premier","High Country"],
      "Suburban": ["LS","LT","RST","Z71","Premier","High Country"],
      "Traverse": ["LS","LT","RS","Premier","High Country"],
      "Trailblazer": ["LS","LT","RS","ACTIV"],
      "Equinox": ["LS","LT","RS","Premier"],
      "Malibu": ["LS","LT","RS","Premier"],
      "Captiva": ["Standard","LS","LT","Premier"],
      "Blazer": ["LT","RS","SS"],
      "Colorado": ["WT","LT","Z71","ZR2","Trail Boss"]
    },
    "Chrysler": {
      "300": ["Touring","300S","300C","SRT8"],
      "Pacifica": ["Touring","Touring L","Touring L Plus","Limited","Pinnacle","Hybrid"]
    },
    "Citroën": {
      "C3": ["Feel","Shine","C-Series"],
      "C4": ["Feel","Shine","C-Series"],
      "C5 X": ["Feel","Shine","C-Series"],
      "Berlingo": ["Feel","Shine"]
    },
    "Dacia": {
      "Sandero": ["Access","Essential","Expression","Extreme"],
      "Duster": ["Essential","Expression","Extreme"],
      "Jogger": ["Essential","Expression","Extreme"]
    },
    "Dodge": {
      "Charger": ["SXT","GT","R/T","Scat Pack","SRT Hellcat","SRT Hellcat Redeye","SRT Super Stock"],
      "Challenger": ["SXT","GT","R/T","Scat Pack","SRT Hellcat","SRT Hellcat Redeye","SRT Super Stock","SRT Demon"],
      "Durango": ["SXT","GT","Citadel","R/T","SRT 392","SRT Hellcat"],
      "RAM 1500": ["Tradesman","Big Horn","Rebel","Laramie","Longhorn","Limited","TRX"],
      "RAM 2500": ["Tradesman","Big Horn","Laramie","Longhorn","Limited","Power Wagon"],
      "RAM 3500": ["Tradesman","Big Horn","Laramie","Longhorn","Limited"]
    },
    "Ferrari": {
      "Roma": ["Standard","Spider"],
      "Portofino": ["Standard","M"],
      "SF90": ["Stradale","Spider","XX","XX Spider"],
      "296": ["GTB","GTS","XX","XX Spider"],
      "F8": ["Tributo","Spider"],
      "812": ["Superfast","GTS","Competizione","Competizione A"],
      "Purosangue": ["Standard"],
      "GTC4Lusso": ["Standard","T"],
      "488": ["GTB","Spider","Pista","Pista Spider"],
      "458": ["Italia","Spider","Speciale","Speciale A"]
    },
    "Fiat": {
      "500": ["Pop","Sport","Lounge","Abarth","500e"],
      "Tipo": ["Easy","Lounge","Sport"],
      "Panda": ["Easy","City Cross","Cross"],
      "Doblo": ["Standard","Cargo"]
    },
    "Ford": {
      "Mustang": ["EcoBoost","GT","Mach 1","Shelby GT350","Shelby GT500","Dark Horse"],
      "F-150": ["XL","XLT","Lariat","King Ranch","Platinum","Limited","Raptor","Raptor R"],
      "Explorer": ["Base","XLT","ST","Platinum","King Ranch","Timberline"],
      "Bronco": ["Base","Big Bend","Black Diamond","Outer Banks","Badlands","Wildtrak","Raptor","Heritage"],
      "Edge": ["SE","SEL","ST-Line","Titanium","ST"],
      "Escape": ["S","SE","SE Sport","SEL","Titanium","PHEV"],
      "Ranger": ["XL","XLT","Lariat","Raptor"],
      "Expedition": ["XL","XLT","Limited","King Ranch","Platinum","Timberline"],
      "EcoSport": ["S","SE","SES","Titanium"],
      "Puma": ["Titanium","ST-Line","ST"],
      "Kuga": ["Titanium","ST-Line","Vignale","PHEV"]
    },
    "GAC": {
      "GS3": ["Standard","Luxury"],
      "GS4": ["Standard","Luxury","Elite"],
      "GS5": ["Standard","Luxury"],
      "GS8": ["Standard","Luxury","Elite"],
      "Emkoo": ["Standard","Luxury"],
      "Empow": ["Standard","Luxury"],
      "Aion S": ["Standard","Plus"],
      "Aion Y": ["Standard","Plus"]
    },
    "Genesis": {
      "G70": ["2.0T Standard","2.0T Sport","3.5T Sport"],
      "G80": ["2.5T Standard","2.5T Sport","3.5T Sport","Electrified"],
      "G90": ["3.5T Standard","3.5T Sport","3.5T e-AWD"],
      "GV70": ["2.5T Standard","2.5T Sport","3.5T Sport","Electrified"],
      "GV80": ["2.5T Standard","2.5T Sport","3.5T Sport"],
      "GV60": ["Standard","Advanced","Performance"]
    },
    "GMC": {
      "Sierra 1500": ["Pro","SLE","Elevation","SLT","AT4","Denali","Denali Ultimate"],
      "Sierra 2500": ["Pro","SLE","SLT","AT4","Denali"],
      "Yukon": ["SLE","SLT","AT4","Denali","XL SLE","XL SLT","XL AT4","XL Denali"],
      "Terrain": ["SLE","SLT","AT4","Denali"],
      "Acadia": ["SLE","SLT","AT4","Denali"],
      "Canyon": ["Elevation","AT4","Denali","AT4X"]
    },
    "Haval": {
      "H2": ["Standard","Luxury"],
      "H6": ["Standard","Luxury","Elite","Ultra"],
      "H9": ["Standard","Luxury","Elite"],
      "Jolion": ["Standard","Luxury","Elite"],
      "Dargo": ["Standard","Luxury"],
      "Big Dog": ["Standard","Luxury"]
    },
    "Honda": {
      "Civic": ["LX","Sport","EX","EX-L","Touring","Si","Type R"],
      "Accord": ["LX","Sport","EX-L","Touring","Hybrid","Hybrid Sport","Hybrid Touring"],
      "CR-V": ["LX","EX","EX-L","Touring","Hybrid","Hybrid EX","Hybrid EX-L","Hybrid Touring"],
      "HR-V": ["LX","Sport","EX","EX-L"],
      "Pilot": ["Sport","EX-L","TrailSport","Touring","Elite","Black Edition"],
      "Passport": ["Sport","EX-L","TrailSport","Touring","Elite"],
      "Ridgeline": ["Sport","RTL","RTL-E","Black Edition"],
      "Odyssey": ["LX","EX","EX-L","Touring","Elite"],
      "City": ["LX","EX","EX-L","RS"],
      "Jazz": ["S","V","RS"],
      "BR-V": ["S","V","RS"],
      "WR-V": ["S","V","RS"],
      "ZR-V": ["LX","EX","Sport","EX-L","Touring"],
      "Prologue": ["EX","EX-L","Touring"]
    },
    "Hyundai": {
      "Accent": ["GL","GLS","GS"],
      "Elantra": ["SE","SEL","N Line","Limited","N"],
      "Sonata": ["SE","SEL","N Line","Limited","Hybrid","Hybrid Blue","Hybrid SEL Premium"],
      "Tucson": ["SE","SEL","N Line","XRT","Limited","Hybrid","Hybrid Blue","Hybrid SEL","Hybrid Limited","PHEV"],
      "Santa Fe": ["SE","SEL","XRT","Limited","Calligraphy","Hybrid","Hybrid SEL","Hybrid Limited","Hybrid Calligraphy","PHEV"],
      "Palisade": ["SE","SEL","XRT","Limited","Calligraphy"],
      "Kona": ["SE","SEL","N Line","Limited","Electric","Electric SEL","Electric Limited"],
      "Venue": ["SE","SEL","Denim"],
      "Ioniq 5": ["Standard Range RWD","Long Range RWD","Long Range AWD","N"],
      "Ioniq 6": ["Standard Range RWD","Long Range RWD","Long Range AWD"],
      "Ioniq 9": ["Standard","Long Range","Performance"],
      "Creta": ["GL","GLS","Prime"],
      "i10": ["GL","GLS"],
      "i20": ["GL","GLS","N Line"],
      "i30": ["GL","GLS","N Line","N"],
      "Staria": ["Standard","Premium","Lounge"]
    },
    "Infiniti": {
      "Q50": ["Pure","Luxe","Red Sport 400","Sensory"],
      "Q60": ["Pure","Luxe","Red Sport 400","Sensory"],
      "QX50": ["Pure","Luxe","Sensory","Autograph"],
      "QX55": ["Pure","Luxe","Sensory","Autograph"],
      "QX60": ["Pure","Luxe","Sensory","Autograph"],
      "QX80": ["Luxe","Sensory","Autograph","Monograph"]
    },
    "Isuzu": {
      "D-Max": ["Standard","LS","V-Cross","Hi-Lander"],
      "MU-X": ["Standard","LS","LS-A","LS-T"],
      "Trooper": ["Standard","LS"]
    },
    "Jaguar": {
      "XE": ["SE","R-Dynamic SE","R-Dynamic HSE","R-Dynamic S"],
      "XF": ["SE","R-Dynamic SE","R-Dynamic HSE","R-Dynamic S"],
      "XJ": ["Premium Luxury","Portfolio","Autobiography"],
      "F-Type": ["R-Dynamic","R","R 75","SVR"],
      "E-Pace": ["SE","R-Dynamic SE","R-Dynamic HSE","R-Dynamic S"],
      "F-Pace": ["SE","R-Dynamic SE","R-Dynamic HSE","SVR"],
      "I-Pace": ["SE","HSE","First Edition"]
    },
    "Jeep": {
      "Wrangler": ["Sport","Willys","Freedom","Sahara","Rubicon","392","4xe"],
      "Gladiator": ["Sport","Willys","Freedom","Overland","Mojave","Rubicon"],
      "Grand Cherokee": ["Laredo","Altitude","Limited","Trailhawk","Overland","Summit","Summit Reserve","SRT","Trackhawk","4xe"],
      "Grand Cherokee L": ["Laredo","Limited","Overland","Summit","Summit Reserve"],
      "Cherokee": ["Sport","Latitude","Latitude Plus","Trailhawk","Limited","Overland"],
      "Compass": ["Sport","Latitude","Latitude Lux","Trailhawk","Limited","High Altitude"],
      "Renegade": ["Sport","Latitude","Trailhawk","Limited","High Altitude"]
    },
    "Jetour": {
      "X70": ["Standard","Luxury"],
      "X70 Plus": ["Standard","Luxury"],
      "X90": ["Standard","Luxury"],
      "X90 Plus": ["Standard","Luxury"],
      "Dashing": ["Standard","Luxury"],
      "T2": ["Standard","Luxury"]
    },
    "Kia": {
      "Picanto": ["LX","EX","GT-Line"],
      "Rio": ["LX","EX","GT-Line","S"],
      "Cerato": ["LX","EX","GT-Line","GT"],
      "Stinger": ["GT-Line","GT1","GT2"],
      "Sportage": ["LX","EX","EX Premium","GT-Line","GT-Line Premium","X-Line","SX","SX Prestige","X-Pro"],
      "Tucson": ["LX","EX","GT-Line"],
      "Sorento": ["LX","S","EX","SX","SX Prestige","X-Line","Hybrid","Hybrid EX","Hybrid SX","Hybrid SX Prestige","PHEV"],
      "Telluride": ["LX","S","EX","SX","SX-P","X-Line","X-Pro"],
      "Carnival": ["LX","EX","SX","SX Prestige"],
      "EV6": ["Light","Wind","GT-Line","GT"],
      "EV9": ["Light","Wind","GT-Line"],
      "Niro": ["LX","EX","EX Premium","Touring","EV LX","EV EX","EV EX Premium","EV Wind","EV GT-Line"],
      "Soul": ["LX","S","EX","GT-Line","EV"],
      "Mohave": ["LX","EX","Gravity"],
      "K5": ["LX","GT-Line","EX","GT"],
      "K8": ["Standard","Luxury","Prestige"],
      "K9": ["Standard","Luxury","Prestige"]
    },
    "Lamborghini": {
      "Huracan": ["EVO","EVO RWD","STO","Tecnica","Sterrato"],
      "Urus": ["Standard","S","Performante"],
      "Revuelto": ["Standard","Opera Unica"],
      "Countach": ["LPI 800-4"]
    },
    "Land Rover": {
      "Defender": ["90 S","90 SE","90 HSE","90 X","90 V8","110 S","110 SE","110 HSE","110 X","110 V8","130 SE","130 HSE","130 X"],
      "Discovery": ["S","SE","HSE","R-Dynamic SE","R-Dynamic HSE","Metropolitan Edition"],
      "Discovery Sport": ["S","SE","R-Dynamic SE","R-Dynamic HSE","R-Dynamic S"],
      "Range Rover": ["SE","HSE","Autobiography","SV","SV Autobiography","PHEV SE","PHEV HSE","PHEV Autobiography"],
      "Range Rover Sport": ["SE","Dynamic SE","Dynamic HSE","Autobiography Dynamic","SVR","PHEV SE","PHEV Dynamic SE"],
      "Range Rover Velar": ["S","SE","R-Dynamic SE","R-Dynamic HSE","SV Autobiography Dynamic"],
      "Range Rover Evoque": ["S","SE","R-Dynamic SE","R-Dynamic HSE","Autobiography"]
    },
    "Lexus": {
      "IS": ["IS 300","IS 350","IS 500","IS 300h","IS 350 F Sport","IS 500 F Sport Performance"],
      "ES": ["ES 250","ES 300h","ES 350","ES 350 F Sport"],
      "GS": ["GS 350","GS 350 F Sport","GS 450h"],
      "LS": ["LS 500","LS 500 F Sport","LS 500h","LS 500h F Sport"],
      "RC": ["RC 300","RC 350","RC 350 F Sport","RC F","RC F Track Edition"],
      "LC": ["LC 500","LC 500h","LC 500 Inspiration Series"],
      "NX": ["NX 250","NX 350","NX 350h","NX 450h+","NX 350 F Sport","NX 450h+ F Sport"],
      "RX": ["RX 350","RX 350h","RX 450h","RX 450h+","RX 500h","RX 350 F Sport","RX 500h F Sport"],
      "GX": ["GX 460","GX 550","GX 460 Premium","GX 550 Premium"],
      "LX": ["LX 600","LX 600 Premium","LX 600 Luxury","LX 600 F Sport","LX 600 Ultra Luxury"],
      "UX": ["UX 200","UX 250h","UX 300e"],
      "TX": ["TX 350","TX 500h","TX 550h+"],
      "RZ": ["RZ 300e","RZ 450e","RZ 450e F Sport"]
    },
    "Lincoln": {
      "Corsair": ["Standard","Reserve","Grand Touring"],
      "Nautilus": ["Standard","Reserve","Black Label"],
      "Aviator": ["Standard","Reserve","Black Label","Grand Touring"],
      "Navigator": ["Standard","Reserve","Black Label","L Standard","L Reserve","L Black Label"]
    },
    "Lucid": {
      "Air": ["Pure","Touring","Grand Touring","Grand Touring Performance","Sapphire"]
    },
    "Maserati": {
      "Ghibli": ["GT","Modena","Trofeo"],
      "Quattroporte": ["GT","Modena","Trofeo"],
      "Levante": ["GT","Modena","Trofeo"],
      "Grecale": ["GT","Modena","Trofeo","Folgore"],
      "GranTurismo": ["Modena","Trofeo","Folgore"],
      "MC20": ["Standard","Cielo","Folgore"]
    },
    "Mazda": {
      "Mazda2": ["GL","GS","GT"],
      "Mazda3": ["GX","GS","GT","Turbo"],
      "Mazda6": ["GX","GS","GT","Signature"],
      "CX-3": ["GX","GS","GT"],
      "CX-30": ["GX","GS","GT","Turbo"],
      "CX-5": ["GX","GS","GT","Signature","Carbon Edition","Turbo"],
      "CX-50": ["GX","GS","GT","Meridian Edition","Turbo"],
      "CX-60": ["GX","GS","GT","Signature","PHEV"],
      "CX-90": ["GX","GS","GT","Signature","PHEV","Turbo S"],
      "MX-5 Miata": ["Sport","Club","Grand Touring","RF Club","RF Grand Touring"],
      "MX-30": ["Standard","R-EV"]
    },
    "McLaren": {
      "Artura": ["Standard","Performance","Spider"],
      "720S": ["Standard","Performance","Spider","Le Mans"],
      "750S": ["Coupe","Spider"],
      "765LT": ["Coupe","Spider"],
      "GT": ["Standard"],
      "Senna": ["Standard","GTR"],
      "Elva": ["Standard"],
      "Speedtail": ["Standard"]
    },
    "Mercedes-Benz": {
      "A-Class": ["A 180","A 200","A 220","A 250","A 35 AMG","A 45 AMG","A 45 S AMG"],
      "B-Class": ["B 180","B 200","B 220","B 250 e"],
      "C-Class": ["C 180","C 200","C 220d","C 300","C 300 e","C 43 AMG","C 63 AMG","C 63 S AMG","C 63 S e Performance"],
      "E-Class": ["E 200","E 220d","E 300","E 350","E 400","E 450","E 53 AMG","E 63 AMG","E 63 S AMG"],
      "S-Class": ["S 400d","S 450","S 500","S 580","S 63 AMG","S 680","Maybach S 580","Maybach S 650","Maybach S 680"],
      "CLA": ["CLA 180","CLA 200","CLA 220","CLA 250","CLA 35 AMG","CLA 45 AMG","CLA 45 S AMG"],
      "CLS": ["CLS 300d","CLS 450","CLS 53 AMG"],
      "GLA": ["GLA 200","GLA 220d","GLA 250","GLA 35 AMG","GLA 45 AMG","GLA 45 S AMG"],
      "GLB": ["GLB 200","GLB 220d","GLB 250","GLB 35 AMG"],
      "GLC": ["GLC 200","GLC 220d","GLC 300","GLC 300 e","GLC 43 AMG","GLC 63 AMG","GLC 63 S AMG"],
      "GLE": ["GLE 300d","GLE 350","GLE 400d","GLE 450","GLE 580","GLE 53 AMG","GLE 63 AMG","GLE 63 S AMG"],
      "GLS": ["GLS 450","GLS 580","GLS 63 AMG","Maybach GLS 600","Maybach GLS 680"],
      "G-Class": ["G 400d","G 500","G 63 AMG","G 63 AMG Edition 1","G 63 AMG Stronger Than Time","G 63 AMG Manufaktur"],
      "AMG GT": ["AMG GT 43","AMG GT 53","AMG GT 63","AMG GT 63 S","AMG GT S","AMG GT R","AMG GT R Pro","AMG GT Black Series"],
      "SL": ["SL 43","SL 55","SL 63","SL 55 AMG","SL 63 AMG"],
      "EQA": ["EQA 250","EQA 300","EQA 350"],
      "EQB": ["EQB 250","EQB 300","EQB 350"],
      "EQC": ["EQC 400"],
      "EQE": ["EQE 300","EQE 350","EQE 350+","EQE 500","AMG EQE 43","AMG EQE 53"],
      "EQS": ["EQS 450+","EQS 580","AMG EQS 53","Maybach EQS 680"],
      "EQV": ["EQV 300"]
    },
    "MG": {
      "MG3": ["Standard","Luxury"],
      "MG5": ["Standard","Luxury","EV Standard","EV Luxury"],
      "MG6": ["Standard","Luxury","Trophy"],
      "MG ZS": ["Standard","Luxury","EV Standard","EV Luxury","EV Trophy"],
      "MG HS": ["Standard","Luxury","Trophy","PHEV"],
      "MG RX5": ["Standard","Luxury"],
      "MG RX8": ["Standard","Luxury"],
      "MG4": ["Standard","Luxury","Trophy"],
      "MG7": ["Standard","Luxury"],
      "Cyberster": ["Standard","Trophy"]
    },
    "Mini": {
      "Cooper": ["Classic","Essential","Resolute","Iconic","JCW"],
      "Cooper S": ["Classic","Essential","Resolute","Iconic","JCW"],
      "Clubman": ["Cooper","Cooper S","Cooper ALL4","Cooper S ALL4","JCW ALL4"],
      "Countryman": ["Cooper","Cooper S","Cooper SE ALL4","Cooper S ALL4","JCW ALL4"],
      "Paceman": ["Cooper","Cooper S","Cooper ALL4","Cooper S ALL4"],
      "Convertible": ["Cooper","Cooper S","JCW"],
      "Coupe": ["Cooper","Cooper S","JCW"],
      "Roadster": ["Cooper","Cooper S","JCW"],
      "Electric": ["Standard","Level 1","Level 2","Level 3"]
    },
    "Mitsubishi": {
      "Lancer": ["GLX","GLS","GT","Ralliart","Evolution X"],
      "Outlander": ["ES","SE","SEL","GT","PHEV SE","PHEV SEL","PHEV GT"],
      "Eclipse Cross": ["ES","SE","SEL","GT","PHEV"],
      "ASX": ["GLX","GLS"],
      "Pajero": ["GLS","GLS Sport","Exceed"],
      "Pajero Sport": ["GLX","GLS","GT","Exceed"],
      "L200": ["GLX","GLS","GT"],
      "Galant": ["GLX","GLS"],
      "Colt": ["Standard","Ralliart"]
    },
    "Nissan": {
      "Micra": ["Visia","Acenta","N-Sport","Tekna"],
      "Sunny": ["S","SV","SL"],
      "Sentra": ["S","SV","SR","SL"],
      "Altima": ["S","SV","SR","SL","Platinum","VC-Turbo"],
      "Maxima": ["S","SV","SR","SL","Platinum"],
      "370Z": ["Sport","Touring","Nismo"],
      "GT-R": ["Premium","Track Edition","Nismo"],
      "Kicks": ["S","SV","SR","Platinum"],
      "Juke": ["Visia","Acenta","N-Design","Tekna","Nismo"],
      "Qashqai": ["Visia","Acenta","N-Connecta","Tekna","Tekna+"],
      "X-Trail": ["S","SV","SL","Platinum","e-POWER"],
      "Murano": ["S","SV","SL","Platinum"],
      "Pathfinder": ["S","SV","SL","Platinum","Rock Creek"],
      "Armada": ["S","SV","SL","Platinum"],
      "Patrol": ["XE","SE","LE","Platinum","Nismo"],
      "Navara": ["XE","SE","LE","Pro-4X"],
      "Frontier": ["S","SV","Pro-4X"],
      "Titan": ["S","SV","Pro-4X","Platinum Reserve","PRO-X"]
    },
    "Peugeot": {
      "208": ["Active","Allure","GT","e-208"],
      "308": ["Active","Allure","GT","PHEV"],
      "408": ["Active","Allure","GT","PHEV"],
      "508": ["Active","Allure","GT","SW GT","PHEV"],
      "2008": ["Active","Allure","GT","e-2008"],
      "3008": ["Active","Allure","GT","PHEV"],
      "5008": ["Active","Allure","GT"]
    },
    "Porsche": {
      "911": ["Carrera","Carrera S","Carrera 4","Carrera 4S","Targa 4","Targa 4S","GT3","GT3 RS","GT3 Touring","Turbo","Turbo S","Dakar","Sport Classic"],
      "Cayenne": ["Base","S","E-Hybrid","GTS","Turbo","Turbo S E-Hybrid","Coupe Base","Coupe S","Coupe E-Hybrid","Coupe GTS","Coupe Turbo","Coupe Turbo S E-Hybrid"],
      "Macan": ["Base","S","GTS","Turbo","Electric Base","Electric 4","Electric 4S","Electric Turbo"],
      "Panamera": ["Base","4","4S","GTS","Turbo","Turbo S","Turbo S E-Hybrid","Sport Turismo","4 Sport Turismo"],
      "Taycan": ["Base","4","4S","GTS","Turbo","Turbo S","Cross Turismo","4 Cross Turismo","4S Cross Turismo","GTS Sport Turismo","Turbo Sport Turismo","Turbo S Cross Turismo"],
      "718 Cayman": ["Base","S","GTS 4.0","GT4","GT4 RS","Spyder","Spyder RS"],
      "718 Boxster": ["Base","S","GTS 4.0","Spyder"]
    },
    "RAM": {
      "1500": ["Tradesman","Big Horn","Rebel","Laramie","Longhorn","Limited","TRX","Classic Tradesman","Classic SLT"],
      "2500": ["Tradesman","Big Horn","Laramie","Longhorn","Limited","Power Wagon"],
      "3500": ["Tradesman","Big Horn","Laramie","Longhorn","Limited"]
    },
    "Renault": {
      "Clio": ["Life","Zen","Intens","RS Line","E-Tech"],
      "Megane": ["Life","Zen","Intens","RS Line","RS","E-Tech"],
      "Captur": ["Life","Zen","Intens","RS Line","E-Tech"],
      "Kadjar": ["Life","Zen","Intens","RS Line"],
      "Koleos": ["Life","Zen","Intens"],
      "Duster": ["Life","Zen","Intens"],
      "Arkana": ["Life","Zen","Intens","RS Line","E-Tech"],
      "Austral": ["Zen","Intens","Iconic","E-Tech"]
    },
    "Rolls-Royce": {
      "Ghost": ["Standard","Extended","Black Badge","Prism"],
      "Phantom": ["Standard","Extended","EWB"],
      "Wraith": ["Standard","Black Badge"],
      "Dawn": ["Standard","Black Badge"],
      "Cullinan": ["Standard","Black Badge","Series II"],
      "Spectre": ["Standard"]
    },
    "Rox": {
      "T3": ["Standard","Luxury"],
      "T5": ["Standard","Luxury"],
      "T7": ["Standard","Luxury"]
    },
    "Skoda": {
      "Fabia": ["Active","Ambition","Style"],
      "Octavia": ["Active","Ambition","Style","RS","RS 245"],
      "Superb": ["Active","Ambition","Style","Sportline"],
      "Kamiq": ["Active","Ambition","Style"],
      "Karoq": ["Active","Ambition","Style","Sportline"],
      "Kodiaq": ["Active","Ambition","Style","Sportline","RS"],
      "Enyaq": ["50","60","80","80x","RS","RS Coupe"]
    },
    "Subaru": {
      "Impreza": ["Base","Premium","Sport","Limited"],
      "Legacy": ["Base","Premium","Sport","Limited","Touring"],
      "Outback": ["Base","Premium","Sport","Limited","Touring","Wilderness"],
      "Forester": ["Base","Premium","Sport","Limited","Touring","Wilderness"],
      "Crosstrek": ["Base","Premium","Sport","Limited","Wilderness"],
      "Ascent": ["Base","Premium","Sport","Limited","Touring"],
      "WRX": ["Base","Premium","Sport","Limited","GT","TR","STI"],
      "BRZ": ["Base","Premium","Limited","Series.Gray","tS"]
    },
    "Suzuki": {
      "Swift": ["GL","GLX","Sport"],
      "Baleno": ["GL","GLX"],
      "Celerio": ["GL","GLX"],
      "Dzire": ["GL","GLX"],
      "Ertiga": ["GL","GLX"],
      "Vitara": ["GL","GLX","Sport","S-Cross"],
      "Grand Vitara": ["GL","GLX","Sport"],
      "Jimny": ["GL","GLX","Sierra"],
      "Fronx": ["GL","GLX","Alpha"],
      "Brezza": ["LXI","VXI","ZXI","ZXI+"]
    },
    "Tesla": {
      "Model 3": ["Standard Range","Long Range","Performance","Highland Standard","Highland Long Range","Highland Performance"],
      "Model S": ["Long Range","Plaid"],
      "Model X": ["Long Range","Plaid"],
      "Model Y": ["Standard Range","Long Range","Performance"],
      "Cybertruck": ["All-Wheel Drive","Cyberbeast"]
    },
    "Toyota": {
      "Yaris": ["E","G","SE","GR Sport","GR"],
      "Corolla": ["E","G","SE","XSE","XLE","Hybrid","GR","GR Sport"],
      "Camry": ["LE","SE","XSE","XLE","TRD","Hybrid LE","Hybrid SE","Hybrid XSE","Hybrid XLE"],
      "Avalon": ["XLE","XSE","Limited","TRD","Hybrid XLE","Hybrid Limited"],
      "Prius": ["L Eco","LE","XLE","Limited","Prime LE","Prime XSE","Prime XSE Premium","Prime Limited"],
      "C-HR": ["LE","XLE","Nightshade","Limited"],
      "RAV4": ["LE","XLE","XLE Premium","TRD Off-Road","Adventure","XSE Hybrid","SE Hybrid","XLE Hybrid","XLE Premium Hybrid","Limited Hybrid","Prime SE","Prime XSE","Prime XSE Premium"],
      "Highlander": ["L","LE","XLE","XSE","Limited","Platinum","Hybrid LE","Hybrid XLE","Hybrid Limited","Hybrid Platinum"],
      "4Runner": ["SR5","TRD Sport","TRD Off-Road","TRD Off-Road Premium","Limited","Nightshade","TRD Pro"],
      "Sequoia": ["SR5","TRD Sport","TRD Off-Road","Limited","Platinum","Capstone","TRD Pro","Hybrid SR5","Hybrid Limited","Hybrid Platinum","Hybrid Capstone","Hybrid TRD Pro"],
      "Tundra": ["SR","SR5","Limited","Platinum","1794 Edition","Capstone","TRD Pro","Hybrid SR5","Hybrid Limited","Hybrid Platinum","Hybrid 1794","Hybrid Capstone","Hybrid TRD Pro"],
      "Land Cruiser": ["GX","GX-R","VX","VX-R","GR Sport","300 GX","300 VX","300 GR Sport","70 Series","200 GX","200 VX"],
      "Land Cruiser Prado": ["GX","GX-R","VX","VX-R","TXL"],
      "FJ Cruiser": ["Base","Trail Teams"],
      "Fortuner": ["EXR","VXR","GR Sport"],
      "Hilux": ["E","G","SR","SR5","GR Sport"],
      "Tacoma": ["SR","SR5","TRD Sport","TRD Off-Road","Limited","TRD Pro","Trailhunter"],
      "Supra": ["2.0","3.0","3.0 Premium","A91 Edition","45th Anniversary"],
      "GR86": ["Base","Premium"],
      "bZ4X": ["XLE","Limited","XLE AWD","Limited AWD"],
      "Crown": ["XLE","Limited","Platinum","Hybrid XLE","Hybrid Limited","Hybrid Platinum"]
    },
    "Volkswagen": {
      "Polo": ["Trendline","Comfortline","Highline","GTI","R-Line"],
      "Golf": ["Trendline","Comfortline","Highline","GTI","GTI Clubsport","R","R-Line"],
      "Jetta": ["Trendline","Comfortline","Highline","GLI"],
      "Passat": ["Trendline","Comfortline","Highline","R-Line"],
      "Arteon": ["Elegance","R-Line","R"],
      "Tiguan": ["Trendline","Comfortline","Highline","R-Line","R"],
      "Touareg": ["Elegance","R-Line","R"],
      "ID.3": ["Pure","Pro","Pro S","Tour"],
      "ID.4": ["Pure","Pro","Pro S","GTX"],
      "ID.6": ["Pure","Pro","Pro S"],
      "Touran": ["Trendline","Comfortline","Highline"],
      "T-Roc": ["Trendline","Comfortline","Highline","R-Line","R"],
      "T-Cross": ["Trendline","Comfortline","Highline","R-Line"]
    },
    "Volvo": {
      "S60": ["B4 Momentum","B4 R-Design","B5 R-Design","B6 R-Design","Recharge T8"],
      "S90": ["B5 Momentum","B5 R-Design","B6 Inscription","Recharge T8"],
      "V60": ["B4 Momentum","B4 R-Design","B5 R-Design","Recharge T8","Cross Country"],
      "V90": ["B5 Momentum","B5 R-Design","B6 Inscription","Recharge T8","Cross Country"],
      "XC40": ["B3 Core","B4 Core","B4 Plus","B5 Plus","Recharge Pure Electric","Recharge Twin"],
      "XC60": ["B4 Core","B4 Plus","B5 Plus","B6 Ultimate","Recharge T6","Recharge T8"],
      "XC90": ["B5 Core","B5 Plus","B6 Plus","B6 Ultimate","Recharge T8"]
    },
    "Xiaomi": {
      "SU7": ["Standard","Pro","Max"],
      "SU7 Ultra": ["Standard"]
    },
    "Zeekr": {
      "001": ["Standard","Long Range","Performance"],
      "007": ["Standard","Long Range","Performance"],
      "009": ["Standard","Premium"],
      "X": ["Standard","Premium"]
    },
    "Bugatti": {
      "Chiron": ["Standard","Sport","Super Sport","Pur Sport","Profilée"],
      "Veyron": ["Standard","Grand Sport","Super Sport","Grand Sport Vitesse"],
      "Divo": ["Standard"],
      "Bolide": ["Standard"],
      "Tourbillon": ["Standard"]
    },
    "Cupra": {
      "Ateca": ["Standard","VZ"],
      "Formentor": ["Standard","VZ","VZ5"],
      "Born": ["Standard","e-Boost"],
      "Leon": ["Standard","VZ"],
      "Terramar": ["Standard","VZ"]
    },
    "Daihatsu": {
      "Terios": ["Standard","Luxury"],
      "Rocky": ["Standard","Luxury"],
      "Sirion": ["Standard","Luxury"]
    },
    "EXEED": {
      "TXL": ["Standard","Luxury"],
      "VX": ["Standard","Luxury"],
      "RX": ["Standard","Luxury"]
    },
    "Foton": {
      "Tunland": ["Standard","Luxury"],
      "Sauvana": ["Standard","Luxury"]
    },
    "Geely": {
      "Coolray": ["Standard","Sport"],
      "Emgrand": ["Standard","Luxury"],
      "Azkarra": ["Standard","Luxury"],
      "Okavango": ["Standard","Luxury"]
    },
    "Hino": {
      "300 Series": ["Standard"],
      "500 Series": ["Standard"]
    },
    "Hongqi": {
      "H5": ["Standard","Luxury"],
      "H9": ["Standard","Luxury","Plus"],
      "E-HS9": ["Standard","Luxury"]
    },
    "Ineos": {
      "Grenadier": ["Standard","Fieldmaster","Trialmaster"]
    },
    "Karma": {
      "Revero": ["GT","GTS"],
      "GS-6": ["Standard","Sport"]
    },
    "Koenigsegg": {
      "Agera": ["Standard","R","RS","Final"],
      "Regera": ["Standard"],
      "Jesko": ["Standard","Absolut"],
      "Gemera": ["Standard"]
    },
    "Lada": {
      "Niva": ["Standard","Legend","Travel"],
      "Granta": ["Standard","Sport"]
    },
    "Lancia": {
      "Ypsilon": ["Silver","Gold","Platinum"],
      "Delta": ["Standard","Integrale"]
    },
    "Lexus": {
      "CT": ["200h","200h F Sport"],
      "ES": ["250","300h","350","350 F Sport"],
      "GS": ["200t","300","350","450h","F Sport"],
      "GX": ["460","460 Premium","460 Luxury","550","550 Premium Plus","550 Overtrail+"],
      "IS": ["200t","300","300 F Sport","350","350 F Sport","500","500 F Sport"],
      "LC": ["500","500h","500 Inspiration"],
      "LS": ["350","500","500h","500 F Sport"],
      "LX": ["450d","500d","600","600 F Sport","600 Ultra Luxury"],
      "NX": ["200t","250","300h","350","350h","350 F Sport","450h+"],
      "RC": ["200t","300","350","F"],
      "RX": ["300","350","350h","450h","450h+","500h F Sport"],
      "UX": ["200","250h","300e"]
    },
    "Lincoln": {
      "Aviator": ["Standard","Reserve","Black Label","Grand Touring"],
      "Corsair": ["Standard","Reserve","Grand Touring"],
      "Navigator": ["Standard","Reserve","Black Label","L Standard","L Reserve","L Black Label"],
      "Nautilus": ["Standard","Reserve","Black Label"]
    },
    "Lotus": {
      "Emira": ["V6 First Edition","V6 Sport","i4 First Edition"],
      "Evija": ["Standard"],
      "Eletre": ["Standard","S","R"]
    },
    "Lucid": {
      "Air": ["Pure","Touring","Grand Touring","Dream Edition","Sapphire"],
      "Gravity": ["Standard","Grand Touring"]
    },
    "Maserati": {
      "Ghibli": ["GT","Modena","Trofeo"],
      "GranTurismo": ["Modena","Trofeo","Folgore"],
      "Grecale": ["GT","Modena","Trofeo","Folgore"],
      "Levante": ["GT","Modena","Trofeo"],
      "MC20": ["Standard","Cielo"],
      "Quattroporte": ["GT","Modena","Trofeo"]
    },
    "MINI": {
      "Cooper": ["Standard","S","SE","JCW"],
      "Clubman": ["Cooper","Cooper S","JCW"],
      "Countryman": ["Cooper","Cooper S","Cooper SE","JCW"],
      "Convertible": ["Cooper","Cooper S","JCW"],
      "Aceman": ["Standard","S"]
    },
    "Mitsubishi": {
      "Eclipse Cross": ["GLX","GLS","Exceed","PHEV"],
      "Outlander": ["GLX","GLS","Exceed","PHEV"],
      "Pajero": ["GLX","GLS","Exceed"],
      "Pajero Sport": ["GLX","GLS","Exceed"],
      "ASX": ["GLX","GLS","Exceed"],
      "Galant": ["GLX","GLS","Exceed"],
      "Lancer": ["GLX","GLS","Evolution X"]
    },
    "Opel": {
      "Astra": ["Edition","GS","GS Line","OPC"],
      "Corsa": ["Edition","GS","GS Line","Electric"],
      "Crossland": ["Edition","GS","GS Line"],
      "Grandland": ["Edition","GS","GS Line","PHEV"],
      "Insignia": ["Edition","GS","GS Line"],
      "Mokka": ["Edition","GS","GS Line","Electric"]
    },
    "Pagani": {
      "Huayra": ["Standard","BC","Roadster","Roadster BC","Tricolore"],
      "Utopia": ["Standard"]
    },
    "Peugeot": {
      "208": ["Active","Allure","GT","e-208"],
      "308": ["Active","Allure","GT","e-308"],
      "408": ["Allure","GT"],
      "2008": ["Active","Allure","GT","e-2008"],
      "3008": ["Active","Allure","GT","GT Premium"],
      "5008": ["Active","Allure","GT"],
      "508": ["Allure","GT","SW"]
    },
    "Proton": {
      "X50": ["Standard","Executive","Premium","Flagship"],
      "X70": ["Standard","Executive","Premium","Flagship"],
      "Saga": ["Standard","Premium"],
      "Persona": ["Standard","Premium"]
    },
    "RAM": {
      "1500": ["Tradesman","Big Horn","Laramie","Rebel","Limited","TRX"],
      "2500": ["Tradesman","Big Horn","Laramie","Power Wagon","Limited"],
      "3500": ["Tradesman","Big Horn","Laramie","Limited"]
    },
    "Renault": {
      "Clio": ["Life","Zen","Intens","RS Line","E-Tech"],
      "Captur": ["Life","Zen","Intens","RS Line","E-Tech"],
      "Duster": ["Life","Zen","Intens","4WD"],
      "Kadjar": ["Life","Zen","Intens"],
      "Koleos": ["Life","Zen","Intens","Iconic"],
      "Megane": ["Life","Zen","Intens","RS","E-Tech"],
      "Arkana": ["Life","Zen","Intens","RS Line"],
      "Austral": ["Life","Zen","Intens","Iconic"]
    },
    "Rivian": {
      "R1T": ["Adventure","Explore","Launch Edition"],
      "R1S": ["Adventure","Explore","Launch Edition"]
    },
    "SEAT": {
      "Ibiza": ["Reference","Style","FR"],
      "Arona": ["Reference","Style","Xperience","FR"],
      "Ateca": ["Reference","Style","Xperience","FR"],
      "Leon": ["Reference","Style","FR","Cupra"],
      "Tarraco": ["Reference","Style","Xperience","FR"]
    },
    "Skoda": {
      "Fabia": ["Active","Ambition","Style"],
      "Octavia": ["Active","Ambition","Style","RS","RS 245"],
      "Superb": ["Active","Ambition","Style","Sportline"],
      "Kamiq": ["Active","Ambition","Style"],
      "Karoq": ["Active","Ambition","Style","Sportline"],
      "Kodiaq": ["Active","Ambition","Style","Sportline","RS"],
      "Enyaq": ["50","60","80","80x","RS","RS Coupe"]
    },
    "Smart": {
      "#1": ["Pro","Premium","Brabus"],
      "#3": ["Pro","Premium","Brabus"],
      "Fortwo": ["Pure","Passion","Prime","Brabus"],
      "Forfour": ["Pure","Passion","Prime","Brabus"]
    },
    "Wuling": {
      "Air EV": ["Standard","Long Range"],
      "Almaz": ["Standard","Exclusive"],
      "Cortez": ["Standard","Exclusive"]
    },
    "Other": {
      "Other": ["Other"]
    }
  },

  /* ══════════════════════════════════════════════════════════════════════════
     BOATS & YACHTS
  ══════════════════════════════════════════════════════════════════════════ */
  boats: {
    "Azimut": {
      "Azimut 40": ["Standard","Fly"],
      "Azimut 50": ["Standard","Fly"],
      "Azimut 60": ["Standard","Fly"],
      "Azimut 70": ["Standard","Fly"],
      "Azimut 80": ["Standard","Fly"],
      "Azimut 100": ["Standard","Fly"],
      "Azimut 120": ["Standard"],
      "S6": ["Standard"],
      "S7": ["Standard"],
      "S8": ["Standard"]
    },
    "Benetti": {
      "Delfino 93": ["Standard"],
      "Classic 120": ["Standard"],
      "Classic 140": ["Standard"],
      "Classic 165": ["Standard"],
      "Oasis 40M": ["Standard"],
      "Oasis 50M": ["Standard"]
    },
    "Boston Whaler": {
      "170 Montauk": ["Standard"],
      "190 Montauk": ["Standard"],
      "210 Montauk": ["Standard"],
      "270 Vantage": ["Standard"],
      "280 Outrage": ["Standard"],
      "320 Vantage": ["Standard"],
      "350 Outrage": ["Standard"]
    },
    "Bayliner": {
      "Element E16": ["Standard"],
      "Element E18": ["Standard"],
      "VR4": ["Standard","Bowrider"],
      "VR5": ["Standard","Bowrider"],
      "VR6": ["Standard","Bowrider"],
      "Trophy 19CC": ["Standard"],
      "Trophy 21CC": ["Standard"]
    },
    "Ferretti": {
      "Ferretti 500": ["Standard","Fly"],
      "Ferretti 550": ["Standard","Fly"],
      "Ferretti 670": ["Standard","Fly"],
      "Ferretti 720": ["Standard","Fly"],
      "Ferretti 780": ["Standard","Fly"],
      "Ferretti 850": ["Standard","Fly"],
      "Ferretti 920": ["Standard","Fly"]
    },
    "Gulf Craft": {
      "Oryx 24": ["Standard"],
      "Oryx 28": ["Standard"],
      "Oryx 32": ["Standard"],
      "Oryx 36": ["Standard"],
      "Oryx 40": ["Standard"],
      "Oryx 43": ["Standard"],
      "Touring 22": ["Standard"],
      "Touring 26": ["Standard"],
      "Touring 30": ["Standard"],
      "Majesty 48": ["Standard"],
      "Majesty 55": ["Standard"],
      "Majesty 62": ["Standard"],
      "Majesty 75": ["Standard"],
      "Majesty 100": ["Standard"],
      "Majesty 120": ["Standard"]
    },
    "Jeanneau": {
      "Cap Camarat 5.5": ["WA","CC","BR"],
      "Cap Camarat 6.5": ["WA","CC","BR"],
      "Cap Camarat 7.5": ["WA","CC"],
      "Cap Camarat 9.0": ["WA","CC"],
      "Merry Fisher 695": ["Standard","Marlin"],
      "Merry Fisher 795": ["Standard","Marlin"],
      "Merry Fisher 895": ["Standard","Marlin"],
      "Sun Odyssey 380": ["Standard"],
      "Sun Odyssey 410": ["Standard"],
      "Sun Odyssey 440": ["Standard"],
      "Sun Odyssey 490": ["Standard"]
    },
    "Lürssen": {
      "44M": ["Standard"],
      "60M": ["Standard"],
      "80M": ["Standard"],
      "100M": ["Standard"]
    },
    "Majesty Yachts": {
      "Majesty 48": ["Standard"],
      "Majesty 55": ["Standard"],
      "Majesty 62": ["Standard"],
      "Majesty 75": ["Standard"],
      "Majesty 100": ["Standard"],
      "Majesty 120": ["Standard"],
      "Majesty 140": ["Standard"],
      "Majesty 175": ["Standard"]
    },
    "Nimbus": {
      "T8": ["Standard"],
      "T9": ["Standard"],
      "T11": ["Standard"],
      "305 Coupé": ["Standard"],
      "405 Coupé": ["Standard"]
    },
    "Nomad": {
      "Nomad 55": ["Standard"],
      "Nomad 65": ["Standard"],
      "Nomad 75": ["Standard"]
    },
    "Oceanos": {
      "Oceanos 40": ["Standard","Fly"],
      "Oceanos 50": ["Standard","Fly"],
      "Oceanos 60": ["Standard","Fly"]
    },
    "Princess": {
      "V40": ["Standard","Open"],
      "V50": ["Standard","Open"],
      "V55": ["Standard","Open"],
      "V60": ["Standard","Open"],
      "V65": ["Standard","Open"],
      "V78": ["Standard","Open"],
      "Y72": ["Standard"],
      "Y85": ["Standard"],
      "Y95": ["Standard"]
    },
    "Riva": {
      "Aquariva Super": ["Standard"],
      "Rivamare": ["Standard"],
      "Rivale 56": ["Standard"],
      "Dolceriva": ["Standard"],
      "El-Iseo": ["Standard"],
      "Riva 76": ["Bahamas","Bahamas Super"],
      "Riva 88": ["Florida","Florida Super"],
      "Riva 100": ["Corsaro","Corsaro Super"]
    },
    "Sea Ray": {
      "190 SPX": ["Standard"],
      "210 SPX": ["Standard"],
      "230 SLX": ["Standard"],
      "270 SLX": ["Standard"],
      "310 SLX": ["Standard"],
      "350 SLX": ["Standard"],
      "400 SLX": ["Standard"],
      "Sundancer 260": ["Standard"],
      "Sundancer 320": ["Standard"],
      "Sundancer 350": ["Standard"],
      "Sundancer 400": ["Standard"],
      "Sundancer 460": ["Standard"],
      "Sundancer 520": ["Standard"]
    },
    "Sunseeker": {
      "Predator 55": ["Standard"],
      "Predator 65": ["Standard"],
      "Predator 74": ["Standard"],
      "Manhattan 55": ["Standard"],
      "Manhattan 65": ["Standard"],
      "Manhattan 75": ["Standard"],
      "Yacht 75": ["Standard"],
      "Yacht 88": ["Standard"],
      "Yacht 95": ["Standard"],
      "Ocean 182": ["Standard"]
    },
    "Technomar": {
      "Technomar 40": ["Standard"],
      "Technomar 50": ["Standard"],
      "Technomar 65": ["Standard"]
    },
    "Yamaha": {
      "242 Limited S": ["Standard"],
      "252S": ["Standard"],
      "275SD": ["Standard"],
      "AR190": ["Standard"],
      "AR210": ["Standard"],
      "AR240": ["Standard"],
      "SX190": ["Standard"],
      "SX210": ["Standard"]
    },
    "Other": {
      "Other": ["Other"]
    }
  },

  /* ══════════════════════════════════════════════════════════════════════════
     MOTORCYCLES
  ══════════════════════════════════════════════════════════════════════════ */
  bikes: {
    "BMW Motorrad": {
      "R 1250 GS": ["Standard","Adventure","Trophy","40 Years GS"],
      "R 1250 RT": ["Standard","SE"],
      "R 1250 RS": ["Standard","SE"],
      "R 1250 R": ["Standard","Exclusive"],
      "S 1000 RR": ["Standard","M Sport","M Competition"],
      "S 1000 R": ["Standard","M Sport"],
      "S 1000 XR": ["Standard","Sport","Pro"],
      "F 900 R": ["Standard","A2"],
      "F 900 XR": ["Standard","A2"],
      "F 850 GS": ["Standard","Adventure","Trophy"],
      "F 750 GS": ["Standard"],
      "G 310 R": ["Standard"],
      "G 310 GS": ["Standard"],
      "K 1600 GT": ["Standard","SE"],
      "K 1600 GTL": ["Standard","Exclusive"],
      "M 1000 RR": ["Standard","Competition"],
      "CE 04": ["Standard","Connect Ride"]
    },
    "Ducati": {
      "Panigale V4": ["Standard","S","R","SP","SP2","Superleggera"],
      "Panigale V2": ["Standard","Bayliss","Winter Test"],
      "Streetfighter V4": ["Standard","S","SP","SP2","Lamborghini"],
      "Streetfighter V2": ["Standard","B"],
      "Multistrada V4": ["Standard","S","S Sport","Rally","Rally Pro","Pikes Peak"],
      "Multistrada V2": ["Standard","S","S Sport","Rally"],
      "Monster": ["Standard","Plus","SP"],
      "SuperSport": ["950","950 S"],
      "Diavel V4": ["Standard","Lamborghini"],
      "XDiavel": ["Standard","S","Dark","NQ"],
      "Scrambler": ["Icon","Icon Dark","Urban Motard","Full Throttle","Desert Sled","Nightshift","1100 Pro","1100 Sport Pro","1100 Tribute Pro"],
      "Hypermotard": ["950","950 SP","950 RVE"],
      "DesertX": ["Standard","Rally"],
      "Elettrica": ["Standard"]
    },
    "Harley-Davidson": {
      "Sportster S": ["Standard"],
      "Nightster": ["Standard","Special"],
      "Iron 883": ["Standard"],
      "Iron 1200": ["Standard"],
      "Forty-Eight": ["Standard"],
      "Street Bob 114": ["Standard"],
      "Fat Bob 114": ["Standard"],
      "Low Rider S": ["Standard"],
      "Low Rider ST": ["Standard"],
      "Softail Standard": ["Standard"],
      "Heritage Classic 114": ["Standard"],
      "Fat Boy 114": ["Standard"],
      "Breakout 117": ["Standard"],
      "Road Glide": ["Standard","Special","ST","Limited","Anniversary"],
      "Street Glide": ["Standard","Special","ST","Anniversary"],
      "Road King": ["Standard","Special","Classic"],
      "Electra Glide": ["Standard","Ultra Classic","Ultra Limited","Ultra Limited Low"],
      "CVO Road Glide": ["Standard","Limited"],
      "CVO Street Glide": ["Standard"],
      "Pan America 1250": ["Standard","Special"]
    },
    "Honda": {
      "CBR 650R": ["Standard","E-Clutch"],
      "CBR 1000RR-R Fireblade": ["Standard","SP"],
      "CBR 500R": ["Standard"],
      "CB 650R": ["Standard","E-Clutch"],
      "CB 1000R": ["Standard","Black Edition"],
      "CB 500F": ["Standard"],
      "CB 500X": ["Standard"],
      "CB 300R": ["Standard"],
      "Africa Twin": ["Standard","Adventure Sports","Adventure Sports ES"],
      "NC 750X": ["Standard","DCT"],
      "NC 750S": ["Standard","DCT"],
      "X-ADV": ["Standard"],
      "Forza 750": ["Standard"],
      "Forza 350": ["Standard"],
      "Forza 125": ["Standard"],
      "Gold Wing": ["Standard","Tour","Tour DCT","Tour Airbag DCT"],
      "Rebel 500": ["Standard"],
      "Rebel 1100": ["Standard","DCT"]
    },
    "Kawasaki": {
      "Ninja ZX-10R": ["Standard","SE","KRT Edition"],
      "Ninja ZX-6R": ["Standard","KRT Edition"],
      "Ninja 650": ["Standard","KRT Edition"],
      "Ninja 400": ["Standard","KRT Edition"],
      "Z900": ["Standard","SE","RS","RS SE"],
      "Z650": ["Standard","RS"],
      "Z400": ["Standard"],
      "Versys 1000": ["Standard","SE","Grand Tourer"],
      "Versys 650": ["Standard","LT"],
      "KLR 650": ["Standard","Adventure"],
      "W800": ["Standard","Cafe","Street"],
      "Eliminator": ["Standard","SE"],
      "Vulcan S": ["Standard","ABS","Cafe"],
      "H2": ["Standard","Carbon","SX","SX SE","SX SE+"],
      "H2R": ["Standard"]
    },
    "KTM": {
      "Duke 125": ["Standard"],
      "Duke 200": ["Standard"],
      "Duke 390": ["Standard"],
      "Duke 790": ["Standard"],
      "Duke 890": ["Standard","R"],
      "Duke 1290 Super": ["Standard","S","R"],
      "RC 125": ["Standard"],
      "RC 390": ["Standard"],
      "Adventure 390": ["Standard"],
      "Adventure 790": ["Standard","R"],
      "Adventure 890": ["Standard","R","Rally","Rally Factory"],
      "Adventure 1090": ["Standard","R"],
      "Adventure 1190": ["Standard","R"],
      "Adventure 1290 Super": ["Standard","S","R"],
      "SMC R 690": ["Standard"],
      "EXC 300": ["Standard","TPI"],
      "EXC-F 350": ["Standard","Six Days"],
      "EXC-F 450": ["Standard","Six Days"]
    },
    "Suzuki": {
      "GSX-R 600": ["Standard"],
      "GSX-R 750": ["Standard"],
      "GSX-R 1000": ["Standard","R"],
      "GSX-S 750": ["Standard"],
      "GSX-S 1000": ["Standard","GT","GT+"],
      "GSX-S 950": ["Standard"],
      "V-Strom 650": ["Standard","XT"],
      "V-Strom 1050": ["Standard","XT","DE"],
      "Burgman 400": ["Standard"],
      "Burgman 650": ["Standard","Executive"],
      "Boulevard M109R": ["Standard","B.O.S.S."],
      "Boulevard C90": ["Standard","T"],
      "Hayabusa": ["Standard"]
    },
    "Triumph": {
      "Street Triple": ["R","RS","Moto2 Edition"],
      "Speed Triple": ["1200 RS","1200 RR"],
      "Tiger 660": ["Sport"],
      "Tiger 900": ["GT","GT Pro","GT Low","Rally","Rally Pro","Rally Explorer"],
      "Tiger 1200": ["GT","GT Pro","GT Explorer","Rally","Rally Pro","Rally Explorer"],
      "Bonneville T100": ["Standard","Black"],
      "Bonneville T120": ["Standard","Black","Gold Line"],
      "Bonneville Bobber": ["Standard","Black"],
      "Bonneville Speedmaster": ["Standard"],
      "Thruxton RS": ["Standard","Moto2 Edition"],
      "Scrambler 400 X": ["Standard"],
      "Scrambler 900": ["Standard","Classic","Gold Line"],
      "Scrambler 1200": ["XC","XE","Bond Edition"],
      "Rocket 3": ["R","GT"],
      "Trident 660": ["Standard"],
      "Daytona 660": ["Standard","Moto2 Edition"],
      "Speed 400": ["Standard"]
    },
    "Yamaha": {
      "YZF-R1": ["Standard","M","GYTR"],
      "YZF-R6": ["Standard","Race"],
      "YZF-R7": ["Standard"],
      "YZF-R3": ["Standard","Monster Energy MotoGP"],
      "MT-10": ["Standard","SP"],
      "MT-09": ["Standard","SP","Tracer GT","Tracer GT+"],
      "MT-07": ["Standard","Tracer GT"],
      "MT-03": ["Standard"],
      "MT-125": ["Standard"],
      "XSR 900": ["Standard","GP"],
      "XSR 700": ["Standard"],
      "XSR 125": ["Standard"],
      "Ténéré 700": ["Standard","World Raid"],
      "Ténéré 700 Explore": ["Standard"],
      "NMAX 155": ["Standard","Connected"],
      "XMAX 300": ["Standard","Tech MAX"],
      "XMAX 400": ["Standard","Tech MAX"],
      "TMAX 560": ["Standard","Tech MAX"],
      "Tracer 9": ["Standard","GT","GT+"],
      "FJR 1300": ["A","AS"],
      "V-Star 250": ["Standard"],
      "V-Star 650": ["Standard","Custom","Silverado"],
      "V-Star 950": ["Standard","Tourer"],
      "V-Star 1300": ["Standard","Tourer","Deluxe"],
      "Bolt": ["Standard","R-Spec","C-Spec"]
    },
    "Other": {
      "Other": ["Other"]
    }
  },

  /* ══════════════════════════════════════════════════════════════════════════
     JET SKIS / PWC
  ══════════════════════════════════════════════════════════════════════════ */
  jetski: {
    "Sea-Doo": {
      "Spark": ["2up 60hp","2up 90hp","3up 90hp","Trixx 2up","Trixx 3up"],
      "GTI": ["GTI 90","GTI 130","GTI SE 130","GTI SE 170","GTI Pro 130","GTI Pro 170"],
      "GTR": ["GTR 230"],
      "GTX": ["GTX 170","GTX 230","GTX Limited 230","GTX Limited 300"],
      "RXT": ["RXT 230","RXT-X 300"],
      "RXP": ["RXP-X 300","RXP-X Apex"],
      "Wake": ["Wake 170","Wake Pro 230"],
      "Fish Pro": ["Fish Pro Scout 130","Fish Pro Sport 170","Fish Pro Trophy 170"],
      "Explorer Pro": ["130","170"],
      "Switch": ["13 Sport","13 Cruise","18 Sport","18 Cruise","18 Cruise LE","21 Cruise","21 Cruise LE"]
    },
    "Yamaha": {
      "EX": ["EX","EX Sport","EX Deluxe"],
      "VX": ["VX","VX Cruiser","VX Cruiser HO","VX Limited HO"],
      "FX": ["FX Cruiser HO","FX HO","FX Cruiser SVHO","FX SVHO","FX Limited SVHO"],
      "GP": ["GP1800R HO","GP1800R SVHO"],
      "SuperJet": ["Standard"],
      "WaveRunner FX": ["FX Cruiser HO","FX HO","FX SVHO","FX Cruiser SVHO","FX Limited SVHO"]
    },
    "Kawasaki": {
      "Jet Ski Ultra": ["Ultra 160LX","Ultra 310LX","Ultra 310LX-S","Ultra 310R","Ultra 310X","Ultra 310X-S"],
      "Jet Ski STX": ["STX 160","STX 160X","STX 160LX"],
      "Jet Ski SX-R": ["SX-R 160"],
      "Jet Ski Ultra 160": ["Standard","LX"],
      "Jet Ski Ultra 310": ["Standard","LX","LX-S","R","X","X-S"]
    },
    "Honda": {
      "AquaTrax": ["F-12","F-12X","F-15X","R-12","R-12X"]
    },
    "Polaris": {
      "SLTX": ["Standard"],
      "Virage": ["Standard","TX","TXi"],
      "Genesis": ["Standard","FFI"]
    },
    "Other": {
      "Other": ["Other"]
    }
  }
};

/* ─── HELPER: Get sorted makes for a category (Other always last) ─── */
function getDM_Makes(category) {
  const keys = Object.keys(DM_VEHICLES[category] || {});
  return keys.sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });
}

/* ─── HELPER: Get models for a make/category (Other always last) ─── */
function getDM_Models(category, make) {
  const cat = DM_VEHICLES[category] || {};
  const keys = Object.keys(cat[make] || {});
  return keys.sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });
}

/* ─── HELPER: Get trims for a make/model/category (Other always last) ─── */
function getDM_Trims(category, make, model) {
  const cat = DM_VEHICLES[category] || {};
  const trims = (cat[make] || {})[model] || [];
  return [...trims.filter(t => t !== 'Other'), 'Other'];
}
