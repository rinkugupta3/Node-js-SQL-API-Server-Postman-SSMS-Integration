// C:\Users\dhira\Desktop\Dhiraj HP Laptop\Projects\Node-js-SQL-API-Server-Postman-SSMS-Integration> node index.js
// Make sure your Node.js server is running on http://localhost:3000.
// In PyCharm, simply run the above index.js or requests.js file (depending on what you name it).
// Ensure that the Axios library is installed (npm install axios).

const axios = require('axios');

const createCustomer = async () => {
  const url = 'http://localhost:3000/api/customers';
  const data = {
    FirstName: 'John',
    LastName: 'Doe',
    Address: '123 Elm St',
    Profile: 'Profile Info',
    Occupation: 'Software Engineer',
    PhoneNumber: '123-456-7890',
    Email: 'john.doe@example.com'
  };

  try {
    const response = await axios.post(url, data);
    console.log('Customer created successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error creating customer:', error.response.status, error.response.data);
    } else {
      console.error('Error creating customer:', error.message);
    }
  }
};

// Create a new customer
createCustomer();
