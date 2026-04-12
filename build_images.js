const fs = require('fs');
const https = require('https');

const carQueries = [
    { query: "Mercedes-Benz AMG GT exterior", id: 1 },
    { query: "Range Rover L460", id: 2 },
    { query: "Lexus LC 500 exterior", id: 3 },
    { query: "Ford Mustang GT S550", id: 4 },
    { query: "BMW M5 F90 exterior", id: 5 },
    { query: "Mercedes-Benz G 63 AMG", id: 6 },
    { query: "Porsche 911 992 exterior", id: 7 },
    { query: "Tesla Model S Plaid", id: 8 },
    { query: "Audi e-tron GT exterior", id: 9 },
    { query: "Mercedes-Benz W223 exterior", id: 10 },
    { query: "Rolls-Royce Ghost exterior", id: 11 },
    { query: "Bentley Continental GT exterior", id: 12 },
    { query: "Ferrari F8 Tributo", id: 13 },
    { query: "Lamborghini Huracan exterior", id: 14 },
    { query: "Aston Martin DB11 exterior", id: 15 },
    { query: "McLaren 720S exterior", id: 16 },
    { query: "Chevrolet Camaro ZL1 exterior", id: 17 },
    { query: "Audi R8 Mk2 exterior", id: 18 },
    { query: "Jaguar F-Type exterior", id: 19 },
    { query: "Maserati MC20 exterior", id: 20 }
];

const templateData = [
    {id: 1, marka: "Mercedes-Benz", model: "AMG GT 63 S", brand: "Mercedes-Benz AMG GT", price: "320.000 AZN", year: 2023, mileage: "15.000 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Qırmızı", muherrik: "4.0 L V8", elaqe: "+994 50 123 45 01"},
    {id: 2, marka: "Land Rover", model: "Range Rover", brand: "Range Rover Autobiography", price: "410.000 AZN", year: 2024, mileage: "Yeni", yeni: "Bəli", bazar: "Rəsmi diler", seher: "Bakı", reng: "Qara", muherrik: "4.4 L V8", elaqe: "+994 55 987 65 02"},
    {id: 3, marka: "Lexus", model: "LC 500", brand: "Lexus LC 500", price: "245.000 AZN", year: 2022, mileage: "22.000 km", yeni: "Xeyr", bazar: "Amerika", seher: "Sumqayıt", reng: "Ağ", muherrik: "5.0 L V8", elaqe: "+994 77 444 33 03"},
    {id: 4, marka: "Ford", model: "Mustang GT", brand: "Ford Mustang GT", price: "85.000 AZN", year: 2019, mileage: "45.000 km", yeni: "Xeyr", bazar: "Amerika", seher: "Bakı", reng: "Qırmızı", muherrik: "5.0 L V8", elaqe: "+994 10 220 11 04"},
    {id: 5, marka: "BMW", model: "M5 Competition", brand: "BMW M5", price: "280.000 AZN", year: 2023, mileage: "12.500 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Ağ", muherrik: "4.4 L M TwinPower", elaqe: "+994 50 333 22 05"},
    {id: 6, marka: "Mercedes-Benz", model: "G 63 AMG", brand: "Mercedes-Benz G-Class", price: "450.000 AZN", year: 2024, mileage: "Yeni", yeni: "Bəli", bazar: "Rəsmi diler", seher: "Gəncə", reng: "Qara", muherrik: "4.0 L V8 Biturbo", elaqe: "+994 51 555 66 06"},
    {id: 7, marka: "Porsche", model: "911 Turbo S", brand: "Porsche 911", price: "560.000 AZN", year: 2023, mileage: "5.000 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Qırmızı", muherrik: "3.8 L Boxer", elaqe: "+994 55 111 22 07"},
    {id: 8, marka: "Tesla", model: "Model S Plaid", brand: "Tesla Model S Plaid", price: "270.000 AZN", year: 2024, mileage: "Yeni", yeni: "Bəli", bazar: "Amerika", seher: "Bakı", reng: "Ağ", muherrik: "Elektrik", elaqe: "+994 70 888 99 08"},
    {id: 9, marka: "Audi", model: "RS e-tron GT", brand: "Audi RS e-tron", price: "230.000 AZN", year: 2022, mileage: "18.000 km", yeni: "Xeyr", bazar: "Avropa", seher: "Sumqayıt", reng: "Ağ", muherrik: "Elektrik", elaqe: "+994 50 444 88 09"},
    {id: 10, marka: "Mercedes-Benz", model: "S 500", brand: "Mercedes-Benz S-Class", price: "340.000 AZN", year: 2023, mileage: "10.000 km", yeni: "Xeyr", bazar: "Rəsmi diler", seher: "Bakı", reng: "Ağ", muherrik: "3.0 L V6", elaqe: "+994 99 777 66 10"},
    {id: 11, marka: "Rolls-Royce", model: "Ghost", brand: "Rolls-Royce Ghost", price: "850.000 AZN", year: 2024, mileage: "Yeni", yeni: "Bəli", bazar: "Rəsmi diler", seher: "Bakı", reng: "Qara", muherrik: "6.75 L V12", elaqe: "+994 50 100 00 11"},
    {id: 12, marka: "Bentley", model: "Continental GT", brand: "Bentley Continental", price: "600.000 AZN", year: 2022, mileage: "9.500 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Qırmızı", muherrik: "4.0 L V8", elaqe: "+994 55 500 50 12"},
    {id: 13, marka: "Ferrari", model: "F8 Tributo", brand: "Ferrari F8 Tributo", price: "720.000 AZN", year: 2021, mileage: "14.500 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Qırmızı", muherrik: "3.9 L V8", elaqe: "+994 77 777 77 13"},
    {id: 14, marka: "Lamborghini", model: "Huracan Evo", brand: "Lamborghini Huracan", price: "680.000 AZN", year: 2023, mileage: "4.200 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Qırmızı", muherrik: "5.2 L V10", elaqe: "+994 50 888 88 14"},
    {id: 15, marka: "Aston Martin", model: "DB11", brand: "Aston Martin DB11", price: "475.000 AZN", year: 2020, mileage: "28.000 km", yeni: "Xeyr", bazar: "Amerika", seher: "Bakı", reng: "Ağ", muherrik: "4.0 L V8", elaqe: "+994 51 456 78 15"},
    {id: 16, marka: "McLaren", model: "720S", brand: "McLaren 720S", price: "710.000 AZN", year: 2022, mileage: "7.000 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Qırmızı", muherrik: "4.0 L V8", elaqe: "+994 55 654 32 16"},
    {id: 17, marka: "Chevrolet", model: "Camaro ZL1", brand: "Chevrolet Camaro ZL1", price: "165.000 AZN", year: 2023, mileage: "Yeni", yeni: "Bəli", bazar: "Amerika", seher: "Gəncə", reng: "Qırmızı", muherrik: "6.2 L V8", elaqe: "+994 70 999 88 17"},
    {id: 18, marka: "Audi", model: "R8 V10 Plus", brand: "Audi R8", price: "420.000 AZN", year: 2019, mileage: "32.000 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Ağ", muherrik: "5.2 L V10", elaqe: "+994 50 111 33 18"},
    {id: 19, marka: "Jaguar", model: "F-Type R", brand: "Jaguar F-Type", price: "240.000 AZN", year: 2021, mileage: "17.000 km", yeni: "Xeyr", bazar: "Rəsmi diler", seher: "Bakı", reng: "Qara", muherrik: "5.0 L V8", elaqe: "+994 77 222 55 19"},
    {id: 20, marka: "Maserati", model: "MC20", brand: "Maserati MC20", price: "680.000 AZN", year: 2023, mileage: "3.500 km", yeni: "Xeyr", bazar: "Avropa", seher: "Bakı", reng: "Ağ", muherrik: "3.0 L V6", elaqe: "+994 50 505 50 20"}
];

const fetchJson = (url) => new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CarCatalogTest/1.0' } }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
            try { resolve(JSON.parse(raw)); } catch(e) { resolve(null); }
        });
    }).on('error', reject);
});

// Fallback images in case API fails
const fallbackImgs = [
    "assets/gwagon_front_1775679715491.png",
    "assets/black_suv_car_1775676364280.png",
    "assets/white_electric_car_1775676379177.png",
    "assets/red_sports_car_1775676262391.png"
];

async function generate() {
    console.log("Fetching images from Wikimedia Commons API...");
    for (let c of templateData) {
        let q = carQueries.find(x => x.id === c.id).query;
        let url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json`;
        
        let j = await fetchJson(url);
        let urls = [];
        if (j && j.query && j.query.pages) {
            urls = Object.values(j.query.pages).map(p => {
                if (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url) {
                    return p.imageinfo[0].url;
                }
                return null;
            }).filter(u => u && (u.endsWith('.jpg') || u.endsWith('.png') || u.endsWith('.jpeg')));
        }
        
        // Always ensure we have 5 images. Fill with fallback if not enough
        while(urls.length < 5) {
            urls.push(fallbackImgs[urls.length % fallbackImgs.length]);
        }
        c.images = urls.slice(0, 5); // strict 5
        console.log(`Car ${c.id}: Found ${urls.length} images`);
    }

    let finalDataScript = `// data.js\n\nconst carData = ${JSON.stringify(templateData, null, 4)};\n\n`;
    finalDataScript += `
function getComments(carId) {
    const comments = localStorage.getItem('car_comments_' + carId);
    return comments ? JSON.parse(comments) : null;
}

function saveComment(carId, name, text) {
    let comments = getComments(carId);
    if (!comments) comments = [];
    comments.push({ name, text });
    localStorage.setItem('car_comments_' + carId, JSON.stringify(comments));
}

if(!localStorage.getItem('car_comments_init')){
    saveComment(1, "Əli Həsənov", "Möhtəşəm dizayn! Bu model idarəetmədə fərq yaradır.");
    saveComment(2, "Aysel Qasımova", "Parametrlər yaxşıdır, rəngi də əla görünür.");
    localStorage.setItem('car_comments_init', 'true');
}
`;
    
    fs.writeFileSync('data.js', finalDataScript, 'utf8');
    console.log("Successfully rebuilt data.js with real Wikipedia images!");
}

generate();
