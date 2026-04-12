const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123', // Parolunuz
  port: 5432,
});

// data.js faylından maşın siyahısını oxumaq ki, maşın adlarını göstərə bilək
const dataJsContent = fs.readFileSync('./data.js', 'utf8');
let carData = [];
try {
    const jsonStr = dataJsContent.match(/const carData = (\[[\s\S]*\]);/)[1];
    carData = eval(jsonStr);
} catch(e) {
    console.log("Maşınlar oxunarkən xəta tutuldu");
}

function getCarName(id) {
    const car = carData.find(c => c.id === id);
    return car ? car.brand : `Bilinməyən (ID: ${id})`;
}

async function checkDatabase() {
    try {
        console.log("=== QEYDİYYATDAN KEÇƏN BÜTÜN İSTİFADƏÇİLƏR VƏ PAROLLAR ===");
        const usersResult = await pool.query('SELECT id, email, password FROM users');
        if (usersResult.rows.length === 0) {
            console.log("Hələ ki, heç kim qeydiyyatdan keçməyib.");
        } else {
            console.table(usersResult.rows);
        }

        console.log("\n=== YAZILMIŞ ŞƏRHLƏR VƏ AİD OLDUQLARI MAŞINLAR ===");
        const commentsResult = await pool.query('SELECT id, car_id, user_name, user_email, text FROM comments');
        if (commentsResult.rows.length === 0) {
            console.log("Hələ ki, şərh yazılmayıb.");
        } else {
            const formattedComments = commentsResult.rows.map(c => ({
                id: c.id,
                Yazan: `${c.user_name} (${c.user_email})`,
                Masin: getCarName(c.car_id),
                Serh: c.text
            }));
            console.table(formattedComments);
        }
    } catch (err) {
        console.error("Xəta baş verdi:", err.message);
    } finally {
        pool.end();
    }
}

checkDatabase();
