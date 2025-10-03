const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Die 30 berühmtesten Naruto/Naruto Shippuden Charaktere
const narutoCharacters = [
  "Uzumaki Naruto",
  "Uchiha Sasuke",
  "Haruno Sakura",
  "Hatake Kakashi",
  "Uchiha Itachi",
  "Uchiha Madara",
  "Senju Hashirama",
  "Senju Tobirama",
  "Namikaze Minato",
  "Uzumaki Kushina",
  "Jiraiya",
  "Tsunade",
  "Orochimaru",
  "Gaara",
  "Rock Lee",
  "Neji Hyuuga",
  "Hinata Hyuuga",
  "Shikamaru Nara",
  "Choji Akimichi",
  "Ino Yamanaka",
  "Kiba Inuzuka",
  "Shino Aburame",
  "Tenten",
  "Might Guy",
  "Asuma Sarutobi",
  "Kurenai Yuhi",
  "Sarutobi Hiruzen",
  "Uchiha Obito",
  "Pain",
  "Konan"
];

// Funktion zum Erstellen eines sauberen Dateinamens
function sanitizeFilename(name) {
  return name
    .replace(/[^\w\s-]/g, '') // Entfernt Sonderzeichen
    .replace(/\s+/g, '-')     // Ersetzt Leerzeichen mit Bindestrichen
    .replace(/--+/g, '-')     // Ersetzt mehrfache Bindestriche
    .toLowerCase();
}

// Funktion zum Herunterladen einer Datei
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
        file.on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
}

// Funktion zum Abrufen von Charakter-Daten von der API
async function fetchCharacterData(characterName) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(characterName);
    const url = `https://api.jikan.moe/v4/characters?q=${query}&limit=1`;
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.data && jsonData.data.length > 0) {
            const character = jsonData.data[0];
            resolve({
              name: characterName,
              imageUrl: character.images.jpg.image_url
            });
          } else {
            console.log(`❌ Keine Daten gefunden für: ${characterName}`);
            resolve(null);
          }
        } catch (error) {
          console.error(`❌ JSON Parse Error für ${characterName}:`, error.message);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error(`❌ Request Error für ${characterName}:`, error.message);
      resolve(null);
    });
  });
}

// Hauptfunktion
async function downloadNarutoCharacters() {
  console.log('🍥 Starte Naruto Charaktere Download...\n');
  
  // Erstelle Ordner falls nicht vorhanden
  const imageDir = './naruto-characters';
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
    console.log('📁 Ordner "naruto-characters" erstellt\n');
  }
  
  const results = [];
  const failed = [];
  
  for (let i = 0; i < narutoCharacters.length; i++) {
    const characterName = narutoCharacters[i];
    console.log(`📥 ${i + 1}/${narutoCharacters.length} - Lade: ${characterName}`);
    
    try {
      // API-Daten abrufen
      const characterData = await fetchCharacterData(characterName);
      
      if (characterData && characterData.imageUrl) {
        const filename = sanitizeFilename(characterName) + '.jpg';
        const filepath = path.join(imageDir, filename);
        
        // Bild herunterladen
        await downloadImage(characterData.imageUrl, filepath);
        
        // Zu Ergebnissen hinzufügen
        results.push({
          name: characterName,
          image: `./naruto-characters/${filename}`
        });
        
        console.log(`   ✅ Gespeichert als: ${filename}`);
      } else {
        failed.push(characterName);
        results.push({
          name: characterName,
          image: null
        });
        console.log(`   ❌ Fehlgeschlagen`);
      }
      
      // Rate limiting - 400ms Pause zwischen Requests
      await new Promise(resolve => setTimeout(resolve, 400));
      
    } catch (error) {
      console.error(`   ❌ Fehler bei ${characterName}:`, error.message);
      failed.push(characterName);
      results.push({
        name: characterName,
        image: null
      });
    }
  }
  
  // JSON-Datei erstellen
  const jsonOutput = {
    "characters": results
  };
  
  fs.writeFileSync('./naruto-characters.json', JSON.stringify(jsonOutput, null, 2));
  
  // Zusammenfassung
  console.log('\n🎉 Download abgeschlossen!');
  console.log(`✅ Erfolgreich: ${results.filter(r => r.image !== null).length}/${narutoCharacters.length}`);
  if (failed.length > 0) {
    console.log(`❌ Fehlgeschlagen: ${failed.join(', ')}`);
  }
  console.log('\n📄 JSON-Datei erstellt: naruto-characters.json');
  console.log('📁 Bilder gespeichert in: ./naruto-characters/\n');
  
  // Ausgabe der JSON für direktes Kopieren
  console.log('📋 JSON zum Einfügen in deine App:\n');
  console.log(JSON.stringify(results, null, 2));
}

// Script starten
downloadNarutoCharacters().catch(console.error);