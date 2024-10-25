const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to handle validation
const validateCustomerData = (req, res, next) => {
  if (!req.body.FirstName || !req.body.LastName) {
    return res.status(400).json({ error: 'FirstName and LastName are required.' });
  }
  next();
};

const sqlConfig = {
  server: 'localhost',
  port: 1433,
  database: 'Customer',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  authentication: {
    type: 'default',
    options: {
      userName: 'sqldb',
      password: 'testing',
    },
  },
};

// Connect to SQL Server
sql.connect(sqlConfig)
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.log("Database Connection Failed: ", err);
  });

// GET all customer records - 200 OK
app.get("/api/customers", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM dbo.Customer`;
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST new customer record - 201 Created
app.post("/api/customers", validateCustomerData, async (req, res) => {
  const { FirstName, LastName, Address, Profile, Occupation, PhoneNumber, Email } = req.body;
  try {
    const existingCustomer = await sql.query`SELECT * FROM dbo.Customer WHERE Email = ${Email}`;
    if (existingCustomer.recordset.length > 0) {
      return res.status(409).json({ error: 'Conflict: Email already exists.' });
    }

    await sql.query`INSERT INTO dbo.Customer (FirstName, LastName, Address, Profile, Occupation, PhoneNumber, Email) 
                    VALUES (${FirstName}, ${LastName}, ${Address}, ${Profile}, ${Occupation}, ${PhoneNumber}, ${Email})`;
    res.status(201).json({ message: 'Customer created successfully.' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT (update) a customer record by ID - 200 OK
app.put("/api/customers/:id", async (req, res) => {
  const { FirstName, LastName, Address, Profile, Occupation, PhoneNumber, Email } = req.body;
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
                    WHERE Id = ${id}`;
    res.send("Customer record updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE a customer record by ID - 204 No Content
app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query`DELETE FROM dbo.Customer WHERE Id = ${id}`;
    res.status(204).send(); // No content to send back
  } catch (err) {
    res.status(500).send(err);
  }
});

// Simulate 202 Accepted
app.post("/api/customers/queue", async (req, res) => {
  res.status(202).json({ message: 'Request accepted for processing.' });
});

// Simulate unauthorized access - 401 Unauthorized
app.get('/api/protected-route', (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }
  res.status(200).json({ message: 'Authorized.' });
});

// Simulate forbidden access - 403 Forbidden
app.delete('/api/customers/:id/forbidden', (req, res) => {
  return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this customer.' });
});

// Simulate 404 Not Found
app.get("/api/customers/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const result = await sql.query`SELECT * FROM dbo.Customer WHERE Id = ${customerId}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Simulate method not allowed - 405 Method Not Allowed
app.put("/api/customers", (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed: Use /api/customers/:id to update a customer.' });
});

// Simulate 406 Not Acceptable
app.get("/api/customers", (req, res) => {
  if (req.headers.accept && req.headers.accept !== 'application/json') {
    return res.status(406).json({ error: 'Not Acceptable: This API only supports JSON.' });
  }
});

// Simulate 415 Unsupported Media Type
app.post("/api/customers", (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).json({ error: 'Unsupported Media Type: Only application/json is supported.' });
  }
});

// Simulate 429 Too Many Requests
let requestCount = 0;
app.get("/api/rate-limited", (req, res) => {
  requestCount++;
  if (requestCount > 5) { // Simple rate limiting logic
    return res.status(429).json({ error: 'Too Many Requests: Please try again later.' });
  }
  res.status(200).json({ message: 'Request successful.' });
});

// Simulate 500 Internal Server Error
app.get("/api/customers/error", async (req, res) => {
  throw new Error("Simulated server error");
});

// Simulate 501 Not Implemented
app.patch("/api/customers/:id", (req, res) => {
  res.status(501).json({ error: 'Not Implemented: This endpoint is not yet implemented.' });
});

// Simulate 502 Bad Gateway
app.get('/api/external', async (req, res) => {
  // Simulate an external service call failure
  res.status(502).json({ error: 'Bad Gateway: External service is down.' });
});

// Simulate 503 Service Unavailable
app.get('/api/service-unavailable', (req, res) => {
  res.status(503).json({ error: 'Service Unavailable: The server is currently overloaded.' });
});

// Simulate 504 Gateway Timeout
app.get('/api/gateway-timeout', async (req, res) => {
  // Simulate a timeout scenario
  res.status(504).json({ error: 'Gateway Timeout: The upstream server did not respond in time.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
