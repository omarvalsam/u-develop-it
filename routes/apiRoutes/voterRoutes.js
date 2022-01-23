const express = require('express');
const { result } = require('lodash');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all voters
router.get('/voters', (req, res) => {
  const sql = `SELECT * FROM voters ORDER BY last_name`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get a specific voter
router.get('/voter/:id', (req, res) => {
  const sql = `SELECT * FROM voters WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.json(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create a new voter!
router.post('/voter', ({ body }, res) => {
  // Data validation
  const errors = inputCheck(body, 'first_name', 'last_name', 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.email];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.json(400).json({ err: error.message });
    }
    res.json({
      message: 'Success!',
      data: body
    });
  });
});

// Update a voters info!
router.put('/voter/:id', (req, res) => {
  const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE voters SET email = ? WHERE id = ?`;
  const params = [req.body.email, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found!'
      });
    } else {
      res.json({
        message: 'Success!',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a voters account
router.delete('/voter/:id', (req, res) => {
  const sql = `DELETE FROM voters WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'User not found!'
      });
    } else {
      res.json({
        message: 'DELETEDD!!!',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  })
})

module.exports = router;