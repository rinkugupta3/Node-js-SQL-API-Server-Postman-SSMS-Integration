// C:\Users\dhira\Desktop\Dhiraj HP Laptop\Projects\Node-js-SQL-API-Server-Postman-SSMS-Integration> node index.js
// Make sure your Node.js server is running on http://localhost:3000.
// In PyCharm, simply run the above index.js or requests.js file (depending on what you name it).
// Ensure that the Axios library is installed (npm install axios).

const axios = require('axios');

const getAllCustomers = async () => {
  const url = 'http://localhost:3000/api/customers';

  try {
    const response = await axios.get(url);
    console.log('Customers fetched successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error fetching customers:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching customers:', error.message);
    }
  }
};

// Fetch all customers
getAllCustomers();
