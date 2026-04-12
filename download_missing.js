const fs = require('fs');
const https = require('https');
const path = require('path');

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
    https.get(url, { headers: { 'User-Agent': 'CarCatalogTest/1.0' } }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { resolve(null); } });
    }).on('error', reject);
});

const downloadImage = (url, filepath) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CarCatalogTest/1.0' } }, (res) => {
        if (res.statusCode !== 200) { resolve(false); return; }
        const file = fs.createWriteStream(filepath);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', reject);
});

async function run() {
    console.log("Downloading missing images...");
    for (let c of missingCars) {
        let url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(c.q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&format=json`;
        let j = await fetchJson(url);
        let urls = [];
        if (j && j.query && j.query.pages) {
            urls = Object.values(j.query.pages).map(p => {
                if (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url) return p.imageinfo[0].url;
                return null;
            }).filter(u => u && (u.endsWith('.jpg') || u.endsWith('.png') || u.endsWith('.jpeg')));
        }
        
        for (let i = 1; i <= 4; i++) {
            let imgUrl = urls[i-1];
            let filepath = path.join(__dirname, 'assets', `car${c.id}_img${i}.jpg`);
            if (imgUrl) {
                let success = await downloadImage(imgUrl, filepath);
            } 
        }
        console.log("Car " + c.id + " done!");
    }
}

run();
