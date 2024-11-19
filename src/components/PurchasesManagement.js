import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import bgImage from '../components/diet.jpg';

const PurchaseManagement = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const updateProductQuantity = (updatedProduct) => {
    fetch(`http://localhost:5000/products/${updatedProduct.product_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedProducts = products.map((product) =>
          product.product_id === updatedProduct.product_id ? updatedProduct : product
        );
        setProducts(updatedProducts);
      })
      .catch((err) => console.error('Error updating product:', err));
  };

  const handleBuy = (index) => {
    const product = products[index];
    const quantityToBuy = prompt('Enter quantity to buy:', '1');
    if (quantityToBuy && !isNaN(quantityToBuy)) {
      const updatedQuantity = product.quantity + parseInt(quantityToBuy);
      const updatedProduct = { ...product, quantity: updatedQuantity };
      updateProductQuantity(updatedProduct);
      setMessage(`You bought ${quantityToBuy} ${product.name}(s)`);
    }
  };

  const handleSell = (index) => {
    const product = products[index];
    if (!product) {
      console.error('Product not found!');
      return;
    }

    const quantityToSell = prompt('Enter quantity to sell:', '1');
    if (quantityToSell && !isNaN(quantityToSell) && product.quantity >= quantityToSell) {
      const updatedQuantity = product.quantity - quantityToSell;
      const updatedProduct = { ...product, quantity: updatedQuantity };
      updateProductQuantity(updatedProduct);
      setMessage(`You sold ${quantityToSell} ${product.name}(s)`);
    } else {
      alert('Invalid quantity or insufficient stock!');
    }
  };

  // Filter products with non-zero quantity
  const availableProducts = products.filter((product) => product.quantity > 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Purchase Management</h1>
      </header>

      <nav style={styles.nav}>
        <Link to="/Home" style={styles.navLink}>
          <i className="fas fa-tachometer-alt" style={styles.icon}></i> Dashboard
        </Link>
        <Link to="/ProductManagement" style={styles.navLink}>
          <i className="fas fa-box" style={styles.icon}></i> Product Management
        </Link>
        <Link to="/PurchasesManagement" style={styles.navLink}>
          <i className="fas fa-shopping-cart" style={styles.icon}></i> Purchase Management
        </Link>
        <Link to="/UserManagement" style={styles.navLink}>
          <i className="fas fa-users" style={styles.icon}></i> User Management
        </Link>
      </nav>

      <div style={styles.content}>
        <h2>Manage Purchases</h2>
        {message && <p style={styles.message}>{message}</p>}
        {availableProducts.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Product Name</th>
                <th style={styles.tableHeaderCell}>Quantity</th>
                <th style={styles.tableHeaderCell}>Price</th>
                <th style={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableProducts.map((product, index) => (
                <tr key={product.product_id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{product.name}</td>
                  <td style={styles.tableCell}>{product.quantity}</td>
                  <td style={styles.tableCell}>
                    M{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </td>
                  <td style={styles.tableCell}>
                    <button style={styles.button} onClick={() => handleBuy(index)}>Buy</button>
                    <button style={styles.button} onClick={() => handleSell(index)}>Sell</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noProductsMessage}>No products available. Please add products first.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'black',
    color: 'aqua',
    padding: '20px',
    textAlign: 'center',
    opacity: '0.8',
  },
  nav: {
    backgroundColor: 'black',
    padding: '10px',
    textAlign: 'center',
    opacity: '0.8',
  },
  navLink: {
    color: 'aqua',
    textDecoration: 'none',
    padding: '10px 20px',
    margin: '0 10px',
    display: 'inline-block',
  },
  icon: {
    marginRight: '8px',
  },
  content: {
    padding: '20px',
    textAlign: 'center',
    flexGrow: 1,
  },
  table: {
    width: '100%',
    margin: '20px auto',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  tableHeader: {
    backgroundColor: '#007BFF',
    color: 'white',
  },
  tableHeaderCell: {
    padding: '15px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.3s',
  },
  tableCell: {
    padding: '15px',
    textAlign: 'left',
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginRight: '5px',
    transition: 'background-color 0.3s',
  },
  noProductsMessage: {
    color: 'red',
    fontSize: '16px',
    marginTop: '20px',
  },
  message: {
    color: 'black',
    fontSize: '16px',
    marginTop: '10px',
    fontWeight: 'bold',
  },
};

export default PurchaseManagement;
