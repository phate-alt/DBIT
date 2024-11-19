import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import image1 from '../components/g.jpg';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    user_id: null,
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { user_id, username, password } = userForm;

    if (user_id !== null) {
      fetch(`http://localhost:5000/users/${user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then(() => {
          const updatedUsers = users.map((user) =>
            user.user_id === user_id ? { ...userForm } : user
          );
          setUsers(updatedUsers);
          setMessage(`${username} updated successfully`);
        })
        .catch((err) => console.error('Error updating user:', err));
    } else {
      fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, { user_id: data.user_id, username, password }]);
          setMessage(`${username} added successfully`);
        })
        .catch((err) => console.error('Error adding user:', err));
    }

    setUserForm({ user_id: null, username: '', password: '' });
  };

  const editUser = (user_id) => {
    const user = users.find((user) => user.user_id === user_id);
    setUserForm({
      user_id: user.user_id,
      username: user.username,
      password: user.password,
    });
  };

  const deleteUser = (user_id) => {
    const user = users.find((user) => user.user_id === user_id);

    fetch(`http://localhost:5000/users/${user_id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(users.filter((user) => user.user_id !== user_id));
          setMessage(`${user.username} deleted successfully`);
        } else {
          console.error('Failed to delete user:', data.message);
        }
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

  const styles = {
    mycontainer: {
      fontFamily: 'Arial, sans-serif',
      backgroundImage: `url(${image1})`,
      backgroundColor: '#e0e0e0',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    nav: { backgroundColor: 'black', padding: '10px', textAlign: 'center', opacity: '0.8' },
    link: { color: 'aqua', textDecoration: 'none', padding: '10px 20px', margin: '0 10px' },
    icon: { marginRight: '8px' },
    form: { padding: '20px', backgroundColor: '#f0f8ff', marginTop: '30px' },
    input: { padding: '10px', margin: '10px', width: '100%' },
    submitButton: { padding: '10px', backgroundColor: '#2980B9', color: '#fff', border: 'none' },
    message: { color: 'black', marginTop: '10px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' },
    table: { width: '100%', marginTop: '30px', borderCollapse: 'collapse' },
    th: { padding: '10px', textAlign: 'center', backgroundColor: '#2980B9', color: 'white' },
    td: { padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd', color: 'blue', backgroundColor: 'white' },
    actions: { padding: '10px', display: 'flex', gap: '50px', justifyContent: 'center', backgroundColor: 'white' },
    editButton: { padding: '6px 12px', backgroundColor: '#f39c12', color: 'white', border: 'none', cursor: 'pointer' },
    deleteButton: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer' },
    header: { backgroundColor: 'black', color: 'aqua', padding: '20px', textAlign: 'center', opacity: '0.8' },
  };

  return (
    <div style={styles.mycontainer}>
      <header style={styles.header}>
        <h1>User Management</h1>
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
      </nav>

      {message && <div style={styles.message}>{message}</div>}

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          value={userForm.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          value={userForm.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {userForm.user_id !== null ? 'Update User' : 'Add User'}
        </button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Password</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.password}</td>
              <td style={styles.actions}>
                <button style={styles.editButton} onClick={() => editUser(user.user_id)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button style={styles.deleteButton} onClick={() => deleteUser(user.user_id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
