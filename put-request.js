// C:\Users\dhira\Desktop\Dhiraj HP Laptop\Projects\Node-js-SQL-API-Server-Postman-SSMS-Integration> node index.js
// Make sure your Node.js server is running on http://localhost:3000.
// In PyCharm, simply run the above index.js or requests.js file (depending on what you name it).
// Ensure that the Axios library is installed (npm install axios).

// Axios is a popular JavaScript library that is used to make HTTP requests from the browser or Node.js.
// Axios make it easier to handle asynchronous operations.
// This allows for cleaner, more manageable code using async/await syntax.

const axios = require('axios');

const updateCustomer = async (customerId) => {
  const url = `http://localhost:3000/api/customers/${customerId}`;
  const data = {
    FirstName: "UpdatedFirstName",
    LastName: "UpdatedLastName",
    Address: "Updated Address, New City, New State",
    Profile: "Updated Profile Info",
    Occupation: "Updated Occupation",
    PhoneNumber: "111-222-3333",
    Email: "updated.email@example.com"
  };

  try {
    const response = await axios.put(url, data);
    console.log('Customer updated successfully:', response.data);
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.error('Error updating customer:', error.response.status, error.response.data);
    } else {
      // The request was made but no response was received
      console.error('Error updating customer:', error.message);
    }
  }
};

// Update customer with ID 1
updateCustomer(2);
