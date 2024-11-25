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
            console.log("Failure in reading from DB");
            res.status(500).send({ status: false, message: 'Error reading from DB' });
        } else {
            res.status(200).send({ 
                status: true, 
                data: result,
            });
        }
    })
});

// Add item
app.post("/api/add", (req, res) => {
    const { item, price, calories } = req.body;

    if (!item || !price || !calories) {
        return res.status(400).send({
            status: false,
            message: "All fields (item, price, calories) are required!",
        });
    }

    const sql = "INSERT INTO menu_items (item, `price ($)`, `calories (kCal)`) VALUES (?, ?, ?)";
    const values = [item, price, calories];

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).send({ status: false, message: "Failed to add item to the menu!" });
        }
        res.status(201).send({ status: true, message: "Item added successfully!" });
    });
});

// Search item
app.get("/api/search/:item", (req, res) => {
    const item = req.params.item;
    const sql = "SELECT * FROM menu_items WHERE item = ?";

    db.query(sql, [item], (err, result) => {
        if (err) {
            console.error("Unable to search for item:", err);
            return res.status(500).send({ status: false, message: "Database error occurred" });
        }

        if (result.length === 0) {
            return res.status(404).send({ status: false, message: "Item not found" });
        }

        res.status(200).send({ status: true, data: result });
    });
});

// Update item
app.put("/api/update/:id", (req, res) => {
    const { item, price, calories } = req.body;
    const id = req.params.id;

    if (!item || !price || !calories) {
        return res.status(400).send({
            status: false,
            message: "All fields (item, price, calories) are required!",
        });
    }
    const sql = "UPDATE menu_items SET item = ?, `price ($)` = ?, `calories (kCal)` = ? where id = ?";
    const values = [item, price, calories, id];

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).send({ status: false, message: "Failed to update item to the menu!", error: err.message });
        }
        res.status(200).send({ status: true, message: "Item updated successfully!" });
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
            return res.status(500).send({ status: false, message: "Failed to delete item!", error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({
                status: false,
                message: "Item not found.",
            });
        }
        res.status(200).send({ status: true, message: "Item deleted successfully"}); // No content returned on successful deletion
    })
})


// Server is running on this port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})