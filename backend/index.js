const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for frontend to communicate

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Karabo2018',
  database: 'wings_cafe_inventory',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// Signup Route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error checking username.' });
    }
    if (result.length > 0) {
      return res.status(400).json({ success: false, message: 'Username is already taken!' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error hashing password.' });
      }

      // Save user to database
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error creating user.' });
        }
        return res.status(200).json({ success: true, message: 'Sign up successful!' });
      });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching user data.' });
    }
    if (result.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Compare the password with the hashed password stored in the database
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error comparing passwords.' });
      }
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      return res.status(200).json({ success: true, message: 'Login successful!' });
    });
  });
});

// GET all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching products.' });
    }
    res.json(result); // Send the list of products as JSON
  });
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params; // Get the product_id from the URL
  console.log('Received product ID for deletion:', id); // Add logging

  db.query('DELETE FROM products WHERE product_id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error deleting product.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully!' });
  });
});
// Add product to the database via POST request
app.post('/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;

  // Insert the new product into the database
  db.query('INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)', 
    [name, description, category, price, quantity], 
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error adding product.' });
      }
      // Return the inserted product data (or just success message)
      res.status(201).json({ success: true, id: result.insertId, message: 'Product added successfully!' });
    }
  );
});


// Update product quantity
app.put('/products/:id', (req, res) => {
  const { id } = req.params; // Get product ID from URL
  const { quantity, name, description, category, price } = req.body;

  // Check if product exists and update its details
  db.query(
    'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE product_id = ?',
    [name, description, category, price, quantity, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating product.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      res.status(200).json({ success: true, message: 'Product updated successfully!' });
    }
  );
});

// Assuming you're using Express and a MySQL database
app.post('/users', (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Error hashing password.' });
    }

    // SQL query to insert the new user with hashed password
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error adding user:', err);
        return res.status(500).json({ message: 'Error adding user.' });
      }
      res.status(201).json({ id: result.insertId, username, password: hashedPassword });
    });
  });
});


app.put('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { username, password } = req.body;

  // SQL query to update the user
  const query = 'UPDATE users SET username = ?, password = ? WHERE user_id = ?';

  db.query(query, [username, password, user_id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Error updating user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully!' });
  });
});


app.delete('/users/:user_id', (req, res) => {
  const { user_id } = req.params; // Destructure `user_id` from the request parameters
  
  const query = 'DELETE FROM users WHERE user_id = ?'; // Use `user_id` in the query to match your database column
  
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ success: true });
  });
});


app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching users.' });
    }
    res.json(result); 
  });
});

// Assuming an Express route for updating product quantity
app.post('/products/updateQuantity', async (req, res) => {
  const { product_id, quantity_changed, type } = req.body; // type should be 'add' or 'deduct'

  try {
    // 1. Update product quantity in the 'products' table
    const productUpdateQuery = `
      UPDATE products 
      SET quantity = quantity ${type === 'add' ? '+' : '-'} ? 
      WHERE product_id = ?`;
    await db.query(productUpdateQuery, [quantity_changed, product_id]);

    // 2. Insert a new transaction record
    const transactionQuery = `
      INSERT INTO transactions (product_id, type, quantity_changed) 
      VALUES (?, ?, ?)`;
    await db.query(transactionQuery, [product_id, type, quantity_changed]);

    res.status(200).json({ message: 'Product quantity updated and transaction recorded' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Error updating product quantity' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

