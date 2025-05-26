const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'car_rental'
});

// Function to check database connection and create database if it doesn't exist
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // First, connect without selecting a database
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                reject(err);
                return;
            }

            // Create database if it doesn't exist
            connection.query('CREATE DATABASE IF NOT EXISTS car_rental', (err) => {
                if (err) {
                    console.error('Error creating database:', err);
                    reject(err);
                    return;
                }

                // Use the database
                connection.query('USE car_rental', (err) => {
                    if (err) {
                        console.error('Error using database:', err);
                        reject(err);
                        return;
                    }

                    // Create cars table if it doesn't exist
                    const createTableQuery = `
                        CREATE TABLE IF NOT EXISTS cars (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            model VARCHAR(100) NOT NULL,
                            year INT NOT NULL,
                            type VARCHAR(50) NOT NULL,
                            transmission VARCHAR(20) NOT NULL,
                            fuelType VARCHAR(20) NOT NULL,
                            seats INT NOT NULL,
                            price DECIMAL(10,2) NOT NULL,
                            image VARCHAR(255) NOT NULL,
                            description TEXT NOT NULL,
                            features TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                        )
                    `;

                    connection.query(createTableQuery, (err) => {
                        if (err) {
                            console.error('Error creating table:', err);
                            reject(err);
                            return;
                        }

                        console.log('Database and table initialized successfully');
                        connection.end();
                        resolve();
                    });
                });
            });
        });
    });
}

// Initialize database before starting the server
initializeDatabase()
    .then(() => {
        // Connect to the database
        db.connect((err) => {
            if (err) {
                console.error('Error connecting to database:', err);
                return;
            }
            console.log('Connected to database');
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error middleware:', err.stack);
            res.status(500).json({ error: 'Something went wrong!', details: err.message });
        });

        // API Routes
        app.get('/api/cars', (req, res) => {
            console.log('Fetching cars...');
            const query = 'SELECT * FROM cars ORDER BY name, model';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching cars:', err);
                    res.status(500).json({ error: 'Error fetching cars', details: err.message });
                    return;
                }
                console.log('Cars fetched successfully:', results.length);
                res.json(results);
            });
        });

        app.post('/api/cars', upload.single('image'), (req, res) => {
            console.log('Received car data:', req.body);
            console.log('Received file:', req.file);

            const { name, model, year, type, transmission, fuelType, seats, price, description, features } = req.body;
            const image = req.file ? req.file.filename : null;
            
            // Validate required fields
            if (!name || !model || !year || !type || !transmission || !fuelType || !seats || !price || !image || !description || !features) {
                console.error('Missing required fields:', {
                    name, model, year, type, transmission, fuelType, seats, price, image, description, features
                });
                return res.status(400).json({ 
                    error: 'All fields are required',
                    missing: {
                        name: !name,
                        model: !model,
                        year: !year,
                        type: !type,
                        transmission: !transmission,
                        fuelType: !fuelType,
                        seats: !seats,
                        price: !price,
                        image: !image,
                        description: !description,
                        features: !features
                    }
                });
            }

            const query = `
                INSERT INTO cars (
                    name, model, year, type, transmission, fuelType, seats, price, 
                    image, description, features
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                name, model, year, type, transmission, fuelType, seats, price,
                image, description, features
            ];

            console.log('Executing query:', query);
            console.log('With values:', values);

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error adding car:', err);
                    res.status(500).json({ 
                        error: 'Error adding car',
                        details: err.message,
                        sqlMessage: err.sqlMessage
                    });
                    return;
                }
                console.log('Car added successfully:', result);
                res.json({ id: result.insertId, message: 'Car added successfully' });
            });
        });

        app.put('/api/cars/:id', upload.single('image'), (req, res) => {
            const { id } = req.params;
            const { name, model, year, type, transmission, fuelType, seats, price, description, features } = req.body;
            const image = req.file ? req.file.filename : null;
            
            // Validate required fields
            if (!name || !model || !year || !type || !transmission || !fuelType || !seats || !price || !description || !features) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            let query;
            let values;

            if (image) {
                query = `
                    UPDATE cars SET 
                        name = ?, model = ?, year = ?, type = ?, transmission = ?, 
                        fuelType = ?, seats = ?, price = ?, image = ?, 
                        description = ?, features = ? 
                    WHERE id = ?
                `;
                values = [name, model, year, type, transmission, fuelType, seats, price, image, description, features, id];
            } else {
                query = `
                    UPDATE cars SET 
                        name = ?, model = ?, year = ?, type = ?, transmission = ?, 
                        fuelType = ?, seats = ?, price = ?, 
                        description = ?, features = ? 
                    WHERE id = ?
                `;
                values = [name, model, year, type, transmission, fuelType, seats, price, description, features, id];
            }

            db.query(query, values, (err) => {
                if (err) {
                    console.error('Error updating car:', err);
                    res.status(500).json({ error: 'Error updating car' });
                    return;
                }
                res.json({ message: 'Car updated successfully' });
            });
        });

        app.delete('/api/cars/:id', (req, res) => {
            const { id } = req.params;
            
            // First get the image filename
            db.query('SELECT image FROM cars WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Error finding car:', err);
                    res.status(500).json({ error: 'Error deleting car' });
                    return;
                }

                if (results.length > 0 && results[0].image) {
                    // Delete the image file
                    const imagePath = path.join(__dirname, 'uploads', results[0].image);
                    fs.unlink(imagePath, (err) => {
                        if (err) console.error('Error deleting image file:', err);
                    });
                }

                // Then delete the car record
                db.query('DELETE FROM cars WHERE id = ?', [id], (err) => {
                    if (err) {
                        console.error('Error deleting car:', err);
                        res.status(500).json({ error: 'Error deleting car' });
                        return;
                    }
                    res.json({ message: 'Car deleted successfully' });
                });
            });
        });

        // Serve admin page
        app.get('/admin/add_car.html', (req, res) => {
            res.sendFile(path.join(__dirname, 'admin', 'add_car.html'));
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
    }); 