const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serve index.html if placed in /public
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Task3.html");
});

// DB Connection

const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // ✅ MySQL username
  password: "Fahad@1122",  // ✅ your MySQL password
  database: "form_db"
});


db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT
  )
`);

// Routes
app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;
  db.query("INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err) => {
      if (err) throw err;
      res.send("<h3>✅ Submission saved! <a href='/'>Go back</a></h3>");
    }
  );
});

app.get("/submissions", (req, res) => {
  db.query("SELECT * FROM submissions", (err, results) => {
    if (err) throw err;

    let html = "<h2>All Submissions</h2><table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Message</th></tr>";
    results.forEach(r => {
      html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.email}</td><td>${r.message}</td></tr>`;
    });
    html += "</table><br><a href='/'>Back to Form</a>";
    res.send(html);
  });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
