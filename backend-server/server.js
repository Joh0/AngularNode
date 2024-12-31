const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// Connecting to DB
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "angular_node"
})

// Connecting to DB
db.connect((err) => {
    if(err){
        console.log("Error connecting to DB");
        console.log("Cause: " + err.cause + "Message: " + err.message);
    }else{
        console.log("Successfully connected to DB");
    }
})

// Get items
app.get('/api/menu', (req, res) => {
    var sql = "SELECT * FROM menu_items";
    db.query(sql, (err, result) => {
        if(err){
            res.status(500).json({ status: false, message: 'Error reading from DB' });
        } else {
            res.status(200).json({ status: true, data: result });
        }
    })
});

// Add item
app.post("/api/add", (req, res) => {
    const { id, item, price, calories } = {
        id: req.body.id,
        item: req.body.item,
        price: req.body["price ($)"],
        calories: req.body["calories (kCal)"]
    };

    if (!item || !price || !calories) {
        return res.status(400).json({
            status: false,
            message: "All fields (item, price, calories) are required!"
        });
    }

    const sql = "INSERT INTO menu_items (id, item, `price ($)`, `calories (kCal)`) VALUES(?, ?, ?, ?)";
    const values = [id, item, price, calories];

    console.log("Values of item to be added: " + values);

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Failed to add item to the menu!" });
        }
        res.status(201).json({ status: true, message: "Item added successfully!" });
    });
});

// Search item
app.get("/api/search/:item", (req, res) => {
    const item = req.params.item;
    const sql = "SELECT * FROM menu_items WHERE item = ?";

    db.query(sql, [item], (err, result) => {
        if (err) {
            console.error("Unable to search for item:", err);
            return res.status(500).json({ status: false, message: "Database error occurred" });
        }

        if (result.length === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

        res.status(200).json({ status: true, data: result });
    });
});

// Update item
app.put("/api/update/:id", (req, res) => {
    // Very important to take the proper item
    const { item, price, calories } = {
        item: req.body.item,
        price: req.body["price ($)"],
        calories: req.body["calories (kCal)"]
    };
    const id = req.params.id;

    if (!item || !price || !calories) {
        console.log("In backend: " + id);
        console.log("In backend: " + item);
        console.log("In backend: " + price);
        console.log("In backend: " + calories);
        return res.status(400).json({
            status: false,
            message: "All fields (item, price, calories) are required!",
        });
    }
    const sql = "UPDATE menu_items SET item = ?, `price ($)` = ?, `calories (kCal)` = ? where id = ?";
    const values = [item, price, calories, id];

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Failed to update item to the menu!", error: err.message });
        }
        res.status(200).json({ status: true, message: "Item updated successfully!" });
    });
});

// Delete item
app.delete("/api/delete/:id", (req, res) => {
    console.log("DELETE route hit!");  // Check if the route is being triggered
    const id = req.params.id;
    console.log("Attempting to delete item with ID:", id); // Log the ID
    const sql = "DELETE FROM menu_items WHERE id = ?";
    db.query(sql, id, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Failed to delete item!", error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "Item not found." });
        }
        res.status(200).json({ status: true, message: "Item " + id + " deleted successfully"}); // No content returned on successful deletion
    })
})

// Register user

/* For postman
{
    "email": "sally@hotmail.com", 
    "name": "Beef", 
    "password": "abc", 
    "role": "Admin"
}
*/
const bcrypt = require('bcrypt');

app.post("/api/register", async(req, res) => {
    const {email, name, password, role} = req.body;
   
    if (!email || !name || !password || !role) {
        return res.status(400).json({ status: false, message: "All fields (email, name, password, role) are required!" });
    }

    const validRoles = ["Admin", "User"];
    if (!validRoles.includes(role)) {
    return res.status(400).json({ status: false, message: "Invalid role specified!" });
    }

    /*
    const saltRounds = 10;
    var salt;
    var hashedPassword;
    
    bcrypt.genSalt(saltRounds, (err, saltGenerated) => {
        if (err) {
            // Handle error
            return;
        }
        // Salt generation successful, proceed to hash the password\
        salt = saltGenerated;
        console.log("Salt: " + salt);
    });

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            // Handle error
            return;
        }
        hashedPassword = hash;
    });
    */

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (email, name, password, role) VALUES (?,?,?,?)";
    const values = [email, name, hashedPassword, role];

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Failed to register user!", error: err.message });
        }
        res.status(201).json({ status: true, message: "User registered successfully!" });
    })
})

// Login

/* For postman login

{
    "email": "sally@hotmail.com", 
    "password": "abc"
}

*/

const jwt = require('jsonwebtoken');
require('dotenv').config();


app.post("/api/login", (req, res) => {
    const {email, password} = {
        email: req.body.email,
        password: req.body.password
    }
    const sql = "SELECT name, password from users where email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Database error.", error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ status: false, message: "User not found!" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid password!" });
        }

        const token = jwt.sign(
            { name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    })
});


// Server is running on this port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});