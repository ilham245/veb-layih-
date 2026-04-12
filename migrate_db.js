const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123',
    port: 5432,
});

async function migrate() {
    try {
        // Read data.js and extract the array
        let dataJs = fs.readFileSync('data.js', 'utf8');
        dataJs = dataJs.replace('const carData = ', 'module.exports = ');
        fs.writeFileSync('temp_data.js', dataJs);
        
        const carData = require('./temp_data.js');
        
        const res = await pool.query('SELECT id, car_id FROM comments WHERE car_name IS NULL');
        let count = 0;
        for (let row of res.rows) {
            const car = carData.find(c => c.id === row.car_id);
            if (car) {
                const carName = car.brand || car.marka || "Avtomobil";
                await pool.query('UPDATE comments SET car_name = $1 WHERE id = $2', [carName, row.id]);
                count++;
            }
        }
        console.log(`Successfully migrated ${count} existing comments to include car_name.`);

        fs.unlinkSync('temp_data.js');
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        pool.end();
    }
}

migrate();
