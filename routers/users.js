const connection = require('../db/dbconnect');
const mysql = require('mysql');
const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');

userRouter.get('/users', (req, res) => {

  const query = `
  SELECT name,role
  FROM users;
`;

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });
  
  // GET a single user by id
  userRouter.get('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM users WHERE userid = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(results[0]);
    });
  });

  userRouter.get('/mess/members/:messid', (req, res) => {
    const messid = req.params.messid;
  
    const query = `
      SELECT users.userid, users.name, users.email, users.role
      FROM users
      INNER JOIN mess ON users.messid = mess.messid
      WHERE users.messid = ?
    `;
    connection.query(query, [messid], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching mess members');
      } else {
        res.json(results);
      }
    });
  });
  
  // POST a new user
  userRouter.post('/users', (req, res) => {
    const { messid, name, email, password, role } = req.body;
    connection.query('INSERT INTO users (messid, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [messid, name, email, password, role], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  });
  

// login
userRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  const getUserQuery = 'SELECT * FROM users WHERE email = ? ';

  connection.query(getUserQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error logging in');
    } else {
      if (result.length > 0) {
                    const payload = {
                            user: {
                                   userid: result[0].userid,
                                    role: result[0].role
                                  }};

                  jwt.sign(payload, 'mytokenkey', { expiresIn: '1h' }, (err, token) => {
                      if (err) throw err;
                      res.json({ 
                        message: 'Login successful', 
                        token , 
                        userid: result[0].userid,
                        name: result[0].name,
                        role: result[0].role
                      });
                  });

            } else {
              res.status(400).json({ error: 'Invalid credentials' });
            }
          
       
      } 
    
  });
});

  // PUT update a user
  userRouter.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { messid, name, email, password, role } = req.body;
    connection.query('UPDATE users SET messid = ?, name = ?, email = ?, password = ?, role = ? WHERE userid = ?', [messid, name, email, password, role, id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'User updated successfully' });
    });
  });
  
  // DELETE a user
  userRouter.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM users WHERE userid = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    });
  });

  userRouter.put('/makeManager/:id', (req, res) => {
    const id = req.params.id;
    const { role } = req.body;

    // Check if role field is present and valid
    if (!role || (role !== 'manager' && role !== 'messmate')) {
        res.status(400).json({ error: 'Invalid role provided' });
        return;
    }

    connection.query('UPDATE users SET role = ? WHERE userid = ?', [role, id], (error, results) => {
        if (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ error: 'Failed to update user role' });
            return;
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
 console.log('manager/messmate role updated successfully')
        res.json({ message: 'manager role updated successfully' });
    });
});

  
  
  module.exports = userRouter;

  //login
  //make one person as manager.