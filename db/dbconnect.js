const mysql = require('mysql');
// require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "mysqldib",
    password: "nafipass",
    database: "mess_manager"
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    checkAndCreateTables();
    console.log('Connected to database.');
});

function checkAndCreateTables() {
    // SQL statements to create tables if they don't exist
    const createMessTable = `
      CREATE TABLE IF NOT EXISTS mess (
        messid INT AUTO_INCREMENT PRIMARY KEY,
        messname VARCHAR(255)
      );

    `;
    
    db.query(createMessTable, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Mess table created successfully or exists');
      }
      // Close the connection
    });

    const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        userid INT AUTO_INCREMENT PRIMARY KEY,
        messid INT,
        name VARCHAR(50),
        email VARCHAR(70),
        password VARCHAR(50),
        role VARCHAR(50),
        FOREIGN KEY (messid) REFERENCES mess(messid) ON DELETE SET NULL
      );

    `;
    
    db.query(createUserTable, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('User table created successfully or exists');
      }
      // Close the connection
    });

    const createMealTable = `
    CREATE TABLE IF NOT EXISTS meal (
      mealid INT AUTO_INCREMENT PRIMARY KEY,
      userid INT,
      messid INT,
      lunchmeal VARCHAR(100),
      lunchcount INT,
      lunchcomment VARCHAR(150),
      dinner VARCHAR(100),
      dinnercount INT,
      dinnercomment VARCHAR(150),
      date DATE,
      FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
      FOREIGN KEY (messid) REFERENCES mess(messid) ON DELETE SET NULL,
      UNIQUE KEY \`user_date_unique\` (\`userid\`, \`date\`)
    );
`;

    
    db.query(createMealTable, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Meal table created successfully or exists');
      }
      // Close the connection
    });













}

module.exports = db;


// sudo /opt/lampp/lampp start
// sudo /opt/lampp/manager-linux-x64.run

  
