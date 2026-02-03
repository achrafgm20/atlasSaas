

import  { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const token = localStorage.getItem('token');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/notification/getSellerNotifications',
          {
        headers: {
          'Authorization': `Bearer ${token}`, // Common format for JWT
          'Content-Type': 'application/json'
        }
      }
        );console.log(response.data)
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Seller Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{JSON.stringify(notif)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;