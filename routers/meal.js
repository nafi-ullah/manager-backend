const connection = require('../db/dbconnect');
const mysql = require('mysql');
const express = require('express');
const mealRouter = express.Router();
const schedule = require("node-schedule");


//http://localhost:3000/meals?messid=3&month=1

mealRouter.get('/meals', (req, res) => {
    const {messid, month, userid } = req.query;
    let sql = `
    SELECT meal.*, users.name AS username
        FROM meal
        INNER JOIN users ON meal.userid = users.userid
    WHERE 1
  `;

  const params = [];


  sql += 'AND meal.messid = ? ';
  params.push(messid);

  // Add search criteria for date if provided
  if (month) {
    sql += 'AND MONTH(meal.date) = ? AND YEAR(meal.date) = YEAR(NOW())';
    params.push(month);
  }

  // Add search criteria for user if provided
  if (userid) {
    sql += 'AND meal.userid = ? ';
    params.push(userid);
  }




  connection.query(sql, params, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An unexpected error occurred.' });
      return;
    }

    // Send the retrieved meals as a JSON response
    res.json(results);
  });
  });
  //full months meal
  mealRouter.get('/mealsDetails', (req, res) => {
    const month = req.query.month;
    const messid = req.query.messid;
    const year = req.query.year;
  
    const query = `
      SELECT users.name AS username,
             meal.date,
             meal.lunchmeal,
             meal.lunchcount,
             meal.dinner,
             meal.dinnercount
      FROM meal
      INNER JOIN users ON meal.userid = users.userid
      WHERE MONTH(meal.date) = ? AND YEAR(meal.date) = ? AND meal.messid = ?
      ORDER BY users.name;
    `;
    connection.query(query, [month, year, messid], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        const response = {};
        console.log(results);
        results.forEach((row) => {
          const username = row.username;
          if (!response[username]) {
            response[username] = [];
          }
          response[username].push({
            date: row.date,
            lunchmeal: row.lunchmeal,
            lunchcount: row.lunchcount,
            dinner: row.dinner,
            dinnercount: row.dinnercount
          });
        });
        res.json(response);
      }
    });
  });



  mealRouter.get('/dailyIndiviualMeal', (req, res) => {
    const messid = req.query.messid;
    const date = req.query.date;
  
    const query = `
      SELECT users.name AS username,
             meal.lunchmeal,
             meal.lunchcount,
             meal.lunchcomment,
             meal.dinner,
             meal.dinnercount,
             meal.dinnercomment
      FROM meal
      INNER JOIN users ON meal.userid = users.userid
      WHERE meal.messid = ? AND meal.date = ?
      GROUP BY users.userid;
    `;
    connection.query(query, [messid, date], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        res.json(results);
      }
    });
  });

  mealRouter.get('/monthlyIndividualMeal', (req, res) => {
    const messid = req.query.messid;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
  
    const query = `
      SELECT 
        users.name AS username,
        SUM(CASE WHEN meal.lunchmeal = 'chicken' THEN meal.lunchcount ELSE 0 END) AS totalChicken,
        SUM(CASE WHEN meal.lunchmeal = 'fish' THEN meal.lunchcount ELSE 0 END) AS totalFish,
        SUM(CASE WHEN meal.lunchmeal = 'rice' THEN meal.lunchcount ELSE 0 END) AS totalRice
      FROM meal
      INNER JOIN users ON meal.userid = users.userid
      WHERE meal.messid = ? AND meal.date BETWEEN ? AND ?
      GROUP BY users.userid;
    `;
  
    connection.query(query, [messid, fromDate, toDate], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching monthly meal details');
      } else {
        res.json(results);
      }
    });
  });
  

  mealRouter.get('/allDate', (req, res) => {
    const messid = req.query.messid;
    const date = req.query.date;
  
    const query = `
    SELECT DISTINCT date FROM meal
    ORDER BY Date DESC;
    `;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        res.json(results);
      }
    });
  });

  mealRouter.get('/dailyDinnerMeal', (req, res) => {
    const messid = req.query.messid;
    const date = req.query.date;
  
    const query = `
      SELECT users.name AS username,
             SUM(CASE WHEN meal.dinner = 'chicken' THEN meal.dinnercount ELSE 0 END) AS chicken_count,
             SUM(CASE WHEN meal.dinner = 'rice' THEN meal.dinnercount ELSE 0 END) AS rice_count,
             SUM(CASE WHEN meal.dinner = 'fish' THEN meal.dinnercount ELSE 0 END) AS fish_count
      FROM meal
      INNER JOIN users ON meal.userid = users.userid
      WHERE meal.messid = ? AND meal.date = ?
      GROUP BY users.userid;
    `;
    connection.query(query, [messid, date], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        res.json(results);
      }
    });
  });



  mealRouter.get('/mealsummary', (req, res) => {
    const messid = req.query.messid;
    const userid = req.query.userid;
    const month = req.query.month;
  
    const query = `
    SELECT users.name AS username,
           SUM(CASE WHEN meal.lunchmeal = 'chicken' THEN meal.lunchcount ELSE 0 END + 
               CASE WHEN meal.dinner = 'chicken' THEN meal.dinnercount ELSE 0 END) AS chicken_count,
           SUM(CASE WHEN meal.lunchmeal = 'rice' THEN meal.lunchcount ELSE 0 END + 
               CASE WHEN meal.dinner = 'rice' THEN meal.dinnercount ELSE 0 END) AS rice_count,
           SUM(CASE WHEN meal.lunchmeal = 'fish' THEN meal.lunchcount ELSE 0 END + 
               CASE WHEN meal.dinner = 'fish' THEN meal.dinnercount ELSE 0 END) AS fish_count
    FROM meal
    INNER JOIN users ON meal.userid = users.userid
    WHERE meal.messid = ? AND meal.userid = ? AND MONTH(meal.date) = ?
    GROUP BY users.userid;
  `;
    connection.query(query, [messid, userid, month], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        if (results.length === 0) {
          res.status(404).send('No data found');
        } else {
          const mealDetails = results[0];
          res.json({
            username: mealDetails.username,
            chicken_count: mealDetails.chicken_count,
            rice_count: mealDetails.rice_count,
            fish_count: mealDetails.fish_count
          });
        }
      }
    });
  });

  mealRouter.get('/lunchCountDaily', (req, res) => {
    const messid = req.query.messid;
    const date = req.query.date;
  
    const query = `
      SELECT
          SUM(CASE WHEN meal.lunchmeal = 'chicken' THEN meal.lunchcount ELSE 0 END) AS total_chicken,
          SUM(CASE WHEN meal.lunchmeal = 'rice' THEN meal.lunchcount ELSE 0 END + 
          CASE WHEN meal.lunchmeal = 'chicken' THEN meal.lunchcount ELSE 0 END + 
          CASE WHEN meal.lunchmeal = 'fish' THEN meal.lunchcount ELSE 0 END) AS total_rice,
          SUM(CASE WHEN meal.lunchmeal = 'fish' THEN meal.lunchcount ELSE 0 END) AS total_fish
      FROM meal
      WHERE meal.messid = ? AND meal.date = ?;
    `;
    connection.query(query, [messid, date], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        res.json(results[0]);
      }
    });
  });

  mealRouter.get('/dinnerCountDaily', (req, res) => {
    const messid = req.query.messid;
    const date = req.query.date;
  
    const query = `
      SELECT
          SUM(CASE WHEN meal.dinner = 'chicken' THEN meal.dinnercount ELSE 0 END) AS total_chicken,
          SUM(CASE WHEN meal.dinner = 'rice' THEN meal.dinnercount ELSE 0 END +
          CASE WHEN meal.dinner = 'chicken' THEN meal.dinnercount ELSE 0 END +
          CASE WHEN meal.dinner = 'fish' THEN meal.dinnercount ELSE 0 END) AS total_rice,
          SUM(CASE WHEN meal.dinner = 'fish' THEN meal.dinnercount ELSE 0 END) AS total_fish
      FROM meal
      WHERE meal.messid = ? AND meal.date = ?;
    `;
    connection.query(query, [messid, date], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching meal details');
      } else {
        res.json(results[0]);
      }
    });
  });
  
  
  // GET a single meal by id
  mealRouter.get('/meals/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM meal WHERE mealid = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Meal not found' });
        return;
      }
      res.json(results[0]);
    });
  });
  
  // POST a new meal
  mealRouter.post('/meals', (req, res) => {
    const { userid,messid, lunchmeal, lunchcount, lunchcomment, dinner, dinnercount, dinnercomment, date } = req.body;
    connection.query('INSERT INTO meal (userid,messid, lunchmeal, lunchcount,lunchcomment, dinner, dinnercount, dinnercomment, date) VALUES (?,?, ?, ?, ?, ?, ?, ? , ?)', [userid,messid, lunchmeal, lunchcount,lunchcomment || '', dinner, dinnercount,dinnercomment || '', date], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'Meal created successfully' });
    });
  });
  
  // PUT update a meal
  mealRouter.put('/meals/:id', (req, res) => {
    const id = req.params.id;
    const { userid,messid, lunchmeal, lunchcount, dinner, dinnercount, date } = req.body;
    connection.query('UPDATE meal SET userid = ?,messid=?, lunchmeal = ?, lunchcount = ?, dinner = ?, dinnercount = ?, date = ? WHERE mealid = ?', [userid,messid, lunchmeal, lunchcount, dinner, dinnercount, date, id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'Meal updated successfully' });
    });
  });

  mealRouter.put('/lunchupdate/:userid/:date', (req, res) => {
    const { userid, date } = req.params;
    let { lunchmeal, lunchcount, lunchcomment } = req.body;
    console.log(req.body);


    if(lunchmeal === 'off'){
        lunchcount = 0;
    }else if((lunchmeal === 'chicken' || lunchmeal ==='fish' || lunchmeal === 'rice') && !(lunchcount >= 1) ){
      lunchcount = 1;
    }
  
    // Update query
    const sql = `UPDATE meal SET lunchmeal = ?, lunchcount = ? , lunchcomment= ? WHERE userid = ? AND date = ?`;
  
    // Execute query
    connection.query(sql, [lunchmeal, lunchcount,lunchcomment || '' ,userid, date], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating meal');
      } else {
        console.log('Meal updated successfully');
        res.status(200).send('Meal updated successfully');
      }
    });
  });

  mealRouter.put('/dinnerupdate/:userid/:date', (req, res) => {
    const { userid, date } = req.params;
    let { dinner, dinnercount, dinnercomment } = req.body;

    if(dinner === 'off'){
      dinnercount = 0;
  }else if((dinner === 'chicken' || dinner ==='fish' || dinner === 'rice') && !(dinnercount >= 1) ){
    dinnercount = 1;
  }
  
    // Update query
    const sql = `UPDATE meal
    SET dinner = ?, dinnercount = ?, dinnercomment = ?
    WHERE userid = ? AND date = ?;
    `;
  
    // Execute query
    connection.query(sql, [dinner, dinnercount,dinnercomment || '', userid, date], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating meal');
      } else {
        console.log('Meal updated successfully');
        res.status(200).send('Meal updated successfully');
      }
    });
  });

  //UPDATE meal SET lunchmeal = 'fish', lunchcount = 1 WHERE userid = 13 AND date = '2024-05-03';
  
  // DELETE a meal
  mealRouter.delete('/meals/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM meal WHERE mealid = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'Meal deleted successfully' });
    });
  });

  //cron job at 6.30pm that iterate previous dates meal and copy them for tomorrow
  //block from frontend that no one can update his lunch meal after 11am

  schedule.scheduleJob("push-job", "* 30 12 * * *", async () => {
    console.log("Good job dude");
    //copy the today's all entry. and insert entry's with the replacing the date with tomorrows here
    
    const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get tomorrow's date
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Query today's entries from the meal table
  const query = `SELECT * FROM meal WHERE date = ?`;
  connection.query(query, [today], (err, results) => {
    if (err) throw err;

    // Modify the date of each entry to tomorrow's date and insert them back into the table
    results.forEach(entry => {
      entry.date = tomorrow;
      const insertQuery = `INSERT INTO meal (userid, messid, lunchmeal, lunchcount,lunchcomment, dinner, dinnercount, dinnercomment, date) VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?)`;
      connection.query(insertQuery, [entry.userid, entry.messid, entry.lunchmeal, entry.lunchcount,'', entry.dinner, entry.dinnercount,'', entry.date], (err, result) => {
        if (err) throw err;
        console.log(`Inserted entry with mealid ${result.insertId}`);
      });
    });
  });


    schedule.cancelJob("push-job");
  });
  
  module.exports = mealRouter;


  //manual update by user
  