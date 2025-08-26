const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Anime-Daten
const animeList = [
  "One Piece",
  "Attack On Titan", 
  "Demon Slayer",
  "Death Note",
  "Naruto Shippuden",
  "Fullmetal Alchemist Brotherhood",
  "Jujutsu Kaisen",
  "Hunter X Hunter",
  "Haikyu",
  "Dragon Ball Z",
  "Code Geass",
  "Sword Art Online",
  "My Hero Academia",
  "Bleach",
  "One Punch Man",
  "Naruto",
  "Steins Gate",
  "Neon Genesis Evangelion",
  "Black Clover",
  "JoJo's Bizarre Adventure",
  "Assassination Classroom",
  "Dr. Stone",
  "Tokyo Revengers",
  "Vinland Saga",
  "Akame ga Kill",
  "Made in Abyss",
  "Fate/Zero",
  "Dragon Ball Super",
  "Death Parade",
  "The Seven Deadly Sins",
  "Kuroko no Basket",
  "Toradora!",
  "Monster",
  "Fire Force",
  "Noragami",
  "Fruits Basket",
  "Classroom of the Elite",
  "Horimiya",
  "Bunny Girl Senpai",
  "Hunter x Hunter 1999",
  "Berserk",
  "Black Butler",
  "Blue Exorcist",
  "Fullmetal Alchemist",
  "The Promised Neverland"
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

// Funktion zum Abrufen von Anime-Daten von der API
async function fetchAnimeData(animeName) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(animeName);
    const url = `https://api.jikan.moe/v4/anime?q=${query}&limit=1`;
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.data && jsonData.data.length > 0) {
            const anime = jsonData.data[0];
            resolve({
              name: animeName,
              imageUrl: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
              mal_id: anime.mal_id
            });
          } else {
            console.log(`❌ Keine Daten gefunden für: ${animeName}`);
            resolve(null);
          }
        } catch (error) {
          console.error(`❌ JSON Parse Error für ${animeName}:`, error.message);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error(`❌ Request Error für ${animeName}:`, error.message);
      resolve(null);
    });
  });
}

// Hauptfunktion
async function downloadAnimeImages() {
  console.log('🎌 Starte Anime Bilder Download...\n');
  
  // Erstelle Ordner falls nicht vorhanden
  const imageDir = './anime-images';
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
    console.log('📁 Ordner "anime-images" erstellt\n');
  }
  
  const results = [];
  const failed = [];
  
  for (let i = 0; i < animeList.length; i++) {
    const animeName = animeList[i];
    console.log(`📥 ${i + 1}/${animeList.length} - Lade: ${animeName}`);
    
    try {
      // API-Daten abrufen
      const animeData = await fetchAnimeData(animeName);
      
      if (animeData && animeData.imageUrl) {
        const filename = sanitizeFilename(animeName) + '.jpg';
        const filepath = path.join(imageDir, filename);
        
        // Bild herunterladen
        await downloadImage(animeData.imageUrl, filepath);
        
        // Zu Ergebnissen hinzufügen
        results.push({
          name: animeName,
          image: `./anime-images/${filename}`
        });
        
        console.log(`   ✅ Gespeichert als: ${filename}`);
      } else {
        failed.push(animeName);
        results.push({
          name: animeName,
          image: null
        });
        console.log(`   ❌ Fehlgeschlagen`);
      }
      
      // Rate limiting - 300ms Pause zwischen Requests
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`   ❌ Fehler bei ${animeName}:`, error.message);
      failed.push(animeName);
      results.push({
        name: animeName,
        image: null
      });
    }
  }
  
  // JSON-Datei erstellen
  const jsonOutput = {
    "Anime": results
  };
  
  fs.writeFileSync('./anime-data.json', JSON.stringify(jsonOutput, null, 2));
  
  // Zusammenfassung
  console.log('\n🎉 Download abgeschlossen!');
  console.log(`✅ Erfolgreich: ${results.filter(r => r.image !== null).length}/${animeList.length}`);
  if (failed.length > 0) {
    console.log(`❌ Fehlgeschlagen: ${failed.join(', ')}`);
  }
  console.log('\n📄 JSON-Datei erstellt: anime-data.json');
  console.log('📁 Bilder gespeichert in: ./anime-images/\n');
  
  // Ausgabe der JSON für direktes Kopieren
  console.log('📋 JSON zum Einfügen in deine App:\n');
  console.log(JSON.stringify(results, null, 2));
}

// Script starten
downloadAnimeImages().catch(console.error);