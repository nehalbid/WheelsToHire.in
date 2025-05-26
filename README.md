# Car Rental Management System

A web-based car rental management system that allows administrators to manage car inventory and users to browse available cars.

## Features

- Admin interface for adding, updating, and deleting cars
- Dynamic car listing page
- Car details organized by brand
- Responsive design
- MySQL database integration

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd car-rental
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Create a MySQL database named `car_rental`
   - Import the `database.sql` file to create the necessary tables

4. Configure the database connection:
   - Open `server.js`
   - Update the database connection details if needed:
     ```javascript
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: '', // Your MySQL password
         database: 'car_rental'
     });
     ```

5. Start the server:
```bash
node server.js
```

6. Access the application:
   - Admin interface: http://localhost:3000/admin/add_car.html
   - Car listing page: http://localhost:3000/userdashboard/carpage.html

## Project Structure

```
car-rental/
├── admin/
│   └── add_car.html
├── userdashboard/
│   └── carpage.html
├── public/
│   ├── assets/
│   └── styles.css
├── database.sql
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- GET /api/cars - Get all cars
- POST /api/cars - Add a new car
- PUT /api/cars/:id - Update a car
- DELETE /api/cars/:id - Delete a car

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
