const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL bağlantı məlumatları (Lokal üçün)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // default baza
    password: '123', // İstifadəçi öz parolunu buraya yazmalıdır, sadəlik üçün 123
    port: 5432,
});

// Cədvəli yaradın (yoxdursa)
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                car_id INTEGER NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                car_name VARCHAR(255),
                text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE comments DROP COLUMN IF EXISTS user_address;
            ALTER TABLE comments ADD COLUMN IF NOT EXISTS car_name VARCHAR(255);
        `);
        console.log("Məlumat bazası cədvəlləri hazırlandı (PostgreSQL).");
    } catch (err) {
        console.error("PostgreSQL qoşulma xətası. Proqramı və ya parolunuzu (server.js daxilində) yoxlayın:", err.message);
    }
}

initDB();

// Qeydiyyat API
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email və parol tələb olunur." });

    try {
        // Mövcudluğu yoxla
        const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length > 0) {
            return res.status(400).json({ error: "Bu email artıq mövcuddur." });
        }

        // Bazaya yaz
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
        res.status(201).json({ message: "Qeydiyyat uğurla tamamlandı!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server xətası baş verdi." });
    }
});

// Giriş API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email və parol tələb olunur." });

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (user.password === password) {
                res.status(200).json({ message: "Uğurla giriş etdiniz!" });
            } else {
                res.status(401).json({ error: "Email və ya Parol yanlışdır." });
            }
        } else {
            res.status(404).json({ error: "Bu email bazada tapılmadı. Zəhmət olmasa 'Qeydiyyatdan Keç' düyməsini vurun." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server xətası baş verdi." });
    }
});

// Şərhləri gətirmək (GET)
app.get('/api/comments/:carId', async (req, res) => {
    const carId = parseInt(req.params.carId);
    try {
        const result = await pool.query('SELECT * FROM comments WHERE car_id = $1 ORDER BY id DESC', [carId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Şərhləri oxumaqda xəta." });
    }
});

// Şərh əlavə etmək (POST)
app.post('/api/comments', async (req, res) => {
    const { carId, userEmail, userName, carName, text } = req.body;
    if (!carId || !userEmail || !userName || !text) {
        return res.status(400).json({ error: "Bütün sahələr doldurulmalıdır." });
    }
    try {
        await pool.query(
            'INSERT INTO comments (car_id, user_email, user_name, car_name, text) VALUES ($1, $2, $3, $4, $5)',
            [carId, userEmail, userName, carName, text]
        );
        res.status(201).json({ message: "Şərh asanlıqla əlavə edildi." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Şərh yazmaqda xəta." });
    }
});

// Profil məlumatlarını gətirmək (GET)
app.get('/api/profile/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const userResult = await pool.query('SELECT email, password FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "İstifadəçi tapılmadı." });
        }

        const commentsResult = await pool.query('SELECT car_id, text, created_at FROM comments WHERE user_email = $1 ORDER BY id DESC', [email]);

        res.json({
            user: userResult.rows[0],
            comments: commentsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Profil məlumatlarını oxumaq mümkün olmadı." });
    }
});

app.listen(PORT, () => {
    console.log(`Server işləyir: http://localhost:${PORT}`);
    console.log("Xəta yaranarsa `server.js` faylına girib PostgreSQL parolunuzu yoxlayın!");
});
