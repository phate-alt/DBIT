import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

import image1 from '../components/yum.jpg'; // Replace with your actual image paths
import image2 from '../components/shake.webp';
import image3 from '../components/ty.avif';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Home() {
  const [productList, setProductList] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Image list for carousel
  const images = [image1, image2, image3];

  // CSS styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    },
    header: {
      backgroundColor: '#2d3a3f', // Darker header background
      color: 'aqua',
      padding: '20px',
      textAlign: 'center',
    },
    nav: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      borderBottom: '3px solid #3c9ecf', // Soft blue border at the bottom
      backgroundColor: '#1e293b',
    },
    link: {
      color: 'aqua',
      textDecoration: 'none',
      padding: '10px 20px',
      margin: '0 12px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    linkHover: {
      backgroundColor: '#3c9ecf', // Soft blue hover
      transform: 'scale(1.1)',
    },
    logoutLink: {
      backgroundColor: 'red', // Red background for logout
      color: '#fff', // White text color
      textDecoration: 'none',
      padding: '10px 20px',
      margin: '0 12px',
      fontSize: '16px',
      fontWeight: 'bold',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    logoutLinkHover: {
      backgroundColor: '#c53030', // Darker red on hover
      transform: 'scale(1.1)',
    },
    content: {
      padding: '20px',
      textAlign: 'center',
      flexGrow: 1,
    },
    chartContainer: {
      width: '80%',
      height: '300px',
      margin: 'auto',
    },
    carouselImage: {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      margin: '20px auto',
      borderRadius: '10px',
      transition: 'opacity 0.5s ease-in-out',
    },
  };

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProductList(data))
      .catch((error) => console.error('Error fetching products:', error));

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      navigate('/Home');
    } else {
      setLoggedInUser(loggedInUser);
    }
  }, [navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [images.length]);

  const filteredProducts = productList.filter((product) => product.quantity > 0);

  const chartData = {
    labels: filteredProducts.map((product) => product.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: filteredProducts.map((product) => product.quantity),
        backgroundColor: '#111827', // Soft blue for chart
        barThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { font: { size: 12 } } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Dashboard</h1>
        <div style={styles.userSection}>
          <span>{loggedInUser}</span>
        </div>
      </header>

      <nav style={styles.nav}>
      <Link to="/Home" style={styles.link}>
          <i className="fas fa-tachometer-alt" style={styles.icon}></i> Dashboard
        </Link>
        <Link to="/ProductManagement" style={styles.link}>
          <i className="fas fa-box" style={styles.icon}></i> Product Management
        </Link>
        <Link to="/PurchasesManagement" style={styles.link}>
          <i className="fas fa-shopping-cart" style={styles.icon}></i> Purchase Management
        </Link>
        <Link to="/UserManagement" style={styles.link}>
          <i className="fas fa-users" style={styles.icon}></i> User Management
        </Link>
        {/* Logout button */}
        <Link
          to="/"
          style={styles.logoutLink}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#c53030')} // Darker red on hover
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'red')}
        >
          Logout
        </Link>
      </nav>

      <div style={styles.content}>
        <h2>Overview of Current Stock Levels</h2>

        {filteredProducts.length === 0 ? (
          <p style={{ color: 'red', fontSize: '16px' }}>No products found.</p>
        ) : (
          <div style={styles.chartContainer}>
            <Bar data={chartData} options={options} />
          </div>
        )}

        {/* Rotating image carousel */}
        <img
          src={images[currentImageIndex]}
          alt="Product rotation"
          style={styles.carouselImage}
        />
      </div>
    </div>
  );
}

export default Home;
