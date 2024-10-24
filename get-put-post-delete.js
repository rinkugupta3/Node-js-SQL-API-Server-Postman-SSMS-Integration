// C:\Users\dhira\Desktop\Dhiraj HP Laptop\Projects\Node-js-SQL-API-Server-Postman-SSMS-Integration> node index.js
// Make sure your Node.js server is running on http://localhost:3000.
// In PyCharm, simply run the above index.js or requests.js file (depending on what you name it).
// Ensure that the Axios library is installed (npm install axios).

const axios = require('axios');

// POST: Create a new customer
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
    console.error('Error creating customer:', error.message);
  }
};

// PUT: Update an existing customer
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
    console.error('Error updating customer:', error.message);
  }
};

// DELETE: Remove a customer by ID
const deleteCustomer = async (customerId) => {
  const url = `http://localhost:3000/api/customers/${customerId}`;

  try {
    const response = await axios.delete(url);
    console.log('Customer deleted successfully:', response.data);
  } catch (error) {
    console.error('Error deleting customer:', error.message);
  }
};

// GET: Retrieve all customers
const getAllCustomers = async () => {
  const url = 'http://localhost:3000/api/customers';

  try {
    const response = await axios.get(url);
    console.log('Customers fetched successfully:', response.data);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
  }
};

// Example usage
createCustomer();
updateCustomer(1);
deleteCustomer(1);
getAllCustomers();
