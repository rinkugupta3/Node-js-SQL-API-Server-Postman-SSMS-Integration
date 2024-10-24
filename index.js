const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

const sqlConfig = {
  server: 'localhost', // No instance name, as you're using the default instance
  port: 1433,
  database: 'Customer', // Updated to the Customer database
  options: {
    encrypt: false, // Set to true if your SQL Server requires SSL
    trustServerCertificate: true, // Use only for local development
  },
  authentication: {
    type: 'default', // SQL Server Authentication
    options: {
      userName: 'sqldb', // Your SQL Server username
      password: 'testing', // Your SQL Server password
    }
  }
};

// Connect to SQL Server
sql.connect(sqlConfig)
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.log("Database Connection Failed: ", err);
  });

// GET all customer records
app.get("/api/customers", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM dbo.Customer`; // Fetch all records from Customer table
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST new customer record
app.post("/api/customers", async (req, res) => {
  const { FirstName, LastName, Address, Profile, Occupation, PhoneNumber, Email } = req.body; // Extracting fields from request body
  try {
    await sql.query`INSERT INTO dbo.Customer (FirstName, LastName, Address, Profile, Occupation, PhoneNumber, Email) 
                    VALUES (${FirstName}, ${LastName}, ${Address}, ${Profile}, ${Occupation}, ${PhoneNumber}, ${Email})`; // Insert into Customer table
    res.send("Customer record added successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT (update) a customer record by ID
app.put("/api/customers/:id", async (req, res) => {
  const { FirstName, LastName, Address, Profile, Occupation, PhoneNumber, Email } = req.body; // Extracting fields from request body
  const { id } = req.params;
  try {
    await sql.query`UPDATE dbo.Customer SET 
                      FirstName = ${FirstName}, 
                      LastName = ${LastName}, 
                      Address = ${Address}, 
                      Profile = ${Profile}, 
                      Occupation = ${Occupation}, 
                      PhoneNumber = ${PhoneNumber}, 
                      Email = ${Email} 
                    WHERE Id = ${id}`; // Update in Customer table
    res.send("Customer record updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE a customer record by ID
app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query`DELETE FROM dbo.Customer WHERE Id = ${id}`; // Delete from Customer table
    res.send("Customer record deleted successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
