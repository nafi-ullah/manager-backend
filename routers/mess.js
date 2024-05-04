const connection = require('../db/dbconnect');
const mysql = require('mysql');
const express = require('express');
const messRouter = express.Router();

messRouter.get('/mess', (req, res) => {
    connection.query('SELECT * FROM mess', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });
  
  // GET a single mess by id
  messRouter.get('/mess/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM mess WHERE messid = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'Mess not found' });
        return;
      }
      res.json(results[0]);
    });
  });
  
  // POST a new mess
  messRouter.post('/mess', (req, res) => {
    const { messname } = req.body;
    connection.query('INSERT INTO mess (messname) VALUES (?)', messname, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(201).json({ message: 'Mess created successfully' });
    });
  });
  
  // PUT update a mess
  messRouter.put('/mess/:id', (req, res) => {
    const id = req.params.id;
    const { messname } = req.body;
    connection.query('UPDATE mess SET messname = ? WHERE messid = ?', [messname, id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'Mess updated successfully' });
    });
  });
  
  // DELETE a mess
  messRouter.delete('/mess/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM mess WHERE messid = ?', id, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'Mess deleted successfully' });
    });
  });
  
  module.exports = messRouter;