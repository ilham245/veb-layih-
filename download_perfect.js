const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

const missingCars = [
    { id: 3, q: "Lexus LC 500 exterior" },
    { id: 8, q: "Tesla Model S Plaid" },
    { id: 10, q: "Mercedes-Benz W223 exterior" },
    { id: 11, q: "Rolls-Royce Ghost exterior" },
    { id: 12, q: "Bentley Continental GT exterior" },
    { id: 13, q: "Ferrari F8 Tributo" },
    { id: 14, q: "Lamborghini Huracan exterior" },
    { id: 15, q: "Aston Martin DB11 exterior" },
    { id: 16, q: "McLaren 720S exterior" },
    { id: 17, q: "Chevrolet Camaro ZL1 exterior" },
    { id: 18, q: "Audi R8 Mk2 exterior" },
    { id: 19, q: "Jaguar F-Type exterior" },
    { id: 20, q: "Maserati MC20 exterior" }
];

const fetchJson = (url) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
             return fetchJson(res.headers.location).then(resolve).catch(reject);
        }
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { resolve(null); } });
    }).on('error', reject);
});

const fallbackImg = "assets/red_sports_car_1775676262391.png";

async function run() {
    console.log("Downloading missing images using curl...");
    for (let c of missingCars) {
        let url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(c.q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&format=json`;
        let j = await fetchJson(url);
        let urls = [];
        if (j && j.query && j.query.pages) {
            urls = Object.values(j.query.pages).map(p => {
                if (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url) return p.imageinfo[0].url;
                return null;
            }).filter(u => u && (u.endsWith('.jpg') || u.endsWith('.png') || u.endsWith('.jpeg') || u.endsWith('.JPG') || u.endsWith('.PNG')));
        }
        
        for (let i = 1; i <= 4; i++) {
            let imgUrl = urls[i-1];
            let filepath = path.join(__dirname, 'assets', `car${c.id}_img${i}.jpg`);
            
            // Delete if exists, just to be safe
            if(fs.existsSync(filepath)) fs.unlinkSync(filepath);

            if (imgUrl) {
                try {
                    console.log(`Downloading ${imgUrl} for car ${c.id}`);
                    execSync(`curl -s -L -A "Mozilla/5.0" "${imgUrl}" -o "${filepath}"`);
                    
                    // Verify that the file actually exists and has size
                    let stats = fs.statSync(filepath);
                    if(stats.size < 1000) throw new Error("File too small");
                } catch(e) {
                    console.log(`Failed to download for car ${c.id}, copying fallback`);
                    fs.copyFileSync(fallbackImg, filepath);
                }
            } else {
                console.log(`No URL found for car ${c.id}, copying fallback`);
                fs.copyFileSync(fallbackImg, filepath);
            }
        }
        console.log("Car " + c.id + " done!");
    }
}

run();
