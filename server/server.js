const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());                        // Allows integrating React
app.use(express.json({ limit: '50mb' })); // Reading JSON data from React (increased limit for images)

// Serve images statically
app.use('/images', express.static(path.join(__dirname, '../src/valam_images')));
app.use('/combo_images', express.static(path.join(__dirname, '../src/valam_combo_offer_images')));

// Creating MySQL Connection
const db = mysql.createConnection({
    host: '10.10.100.241',
    user: 'mailroomusr',                // Your MySQL Username
    password: 'MailroomUsr@123',        // Your MySQL Password
    database: 'mailroom',               // Your Database name
    port: 3375
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Error:", err);
    } else {
        console.log("MySQL Database Connected Successfully! ✅");
    }
});

// A POST API to receive data from React and save it to the database
app.post('/api/create-order', (req, res) => {
    // Data from React (in req.body)
    const { OrderNumber, ItemsOrdered, ShipTo, MobileNumber, Address, City, Pincode } = req.body;

    // Converting Items to String (for easy storage in Database)
    const itemsString = JSON.stringify(ItemsOrdered);

    // MySQL Query
    const sql = "INSERT INTO Orders (order_number, items, name, mobile, address, city, pincode, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [OrderNumber, itemsString, ShipTo, MobileNumber, Address, City, Pincode, 'Pending'];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while saving the order!" });
        } else {
            res.status(200).json({ message: "Order successfully saved to the database!" });
        }
    });
});

// A POST API to handle newsletter subscriptions
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required!" });
    }

    const sql = "INSERT INTO VALAM_SUBSCRIBE_TABLE (email_id) VALUES (?)";
    db.query(sql, [email], (err, result) => {
        if (err) {
            // Check for MySQL duplicate entry error (code 1062)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "This email is already subscribed!" });
            }
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while subscribing!" });
        }
        res.status(200).json({ message: "Successfully subscribed!" });
    });
});

// A POST API for Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required!" });
    }

    const sql = "SELECT * FROM VALAM_REGISTER_TABLE WHERE user_name = ? AND user_password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Database Error during login:", err);
            return res.status(500).json({ error: "An error occurred during login!" });
        }

        if (results.length > 0) {
            // Login successful
            res.status(200).json({ message: "Login successful", user: results[0].user_name });
        } else {
            // Invalid credentials
            res.status(401).json({ error: "Invalid username or password" });
        }
    });
});

// A GET API to fetch all subscribers for the Admin Dashboard
app.get('/api/subscribers', (req, res) => {
    const sql = "SELECT * FROM VALAM_SUBSCRIBE_TABLE ORDER BY created_date ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching subscribers:", err);
            res.status(500).json({ error: "An error occurred while fetching subscribers!" });
        } else {
            res.status(200).json(results);
        }
    });
});

// A GET API to fetch all combo offers for the Admin Dashboard
app.get('/api/combo-offers', (req, res) => {
    const sql = "SELECT * FROM VALAM_COMBO_OFFER_TABLE ORDER BY created_date ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching combo offers:", err);
            res.status(500).json({ error: "An error occurred while fetching combo offers!" });
        } else {
            res.status(200).json(results);
        }
    });
});

// A POST API to save combo offer to the database
app.post('/api/combo-offers', (req, res) => {
    const { name, amount, imageFile, imageName } = req.body;

    if (!name || !amount || !imageFile) {
        return res.status(400).json({ error: "Name, Amount, and Image are required!" });
    }

    // Process image
    let finalImageName = '';
    if (imageFile && imageName) {
        const savedName = saveImage(imageFile, imageName, 'valam_combo_offer_images');
        if (savedName) finalImageName = savedName;
    }

    const sql = "INSERT INTO VALAM_COMBO_OFFER_TABLE (combo_offer_name, combo_offer_amount, combo_offer_image) VALUES (?, ?, ?)";
    db.query(sql, [name, amount, finalImageName], (err, result) => {
        if (err) {
            console.error("Error saving combo offer:", err);
            res.status(500).json({ error: "An error occurred while saving the combo offer!" });
        } else {
            res.status(200).json({ message: "Combo offer successfully saved!", id: result.insertId });
        }
    });
});

// A PUT API to update combo offer
app.put('/api/combo-offers/:id', (req, res) => {
    const { id } = req.params;
    const { name, amount, imageFile, imageName, existingImage } = req.body;

    if (!name || !amount || (!imageFile && !existingImage)) {
        return res.status(400).json({ error: "Name, Amount, and Image are required!" });
    }

    // Process image
    let finalImageName = existingImage || '';
    if (imageFile && imageName) {
        const savedName = saveImage(imageFile, imageName, 'valam_combo_offer_images');
        if (savedName) finalImageName = savedName;
    }

    const sql = "UPDATE VALAM_COMBO_OFFER_TABLE SET combo_offer_name = ?, combo_offer_amount = ?, combo_offer_image = ? WHERE combo_offer_id = ?";
    db.query(sql, [name, amount, finalImageName, id], (err, result) => {
        if (err) {
            console.error("Error updating combo offer:", err);
            res.status(500).json({ error: "An error occurred while updating the combo offer!" });
        } else {
            res.status(200).json({ message: "Combo offer successfully updated!" });
        }
    });
});

app.delete('/api/combo-offers/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM VALAM_COMBO_OFFER_TABLE WHERE combo_offer_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting combo offer:", err);
            res.status(500).json({ error: "An error occurred while deleting the combo offer!" });
        } else {
            res.status(200).json({ message: "Combo offer successfully deleted!" });
        }
    });
});

// A GET API to fetch all orders for the Admin Dashboard
app.get('/api/orders', (req, res) => {
    // Assuming created_date was added. If not, fallback to order_number or id
    const sql = "SELECT * FROM Orders ORDER BY id ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred while fetching orders!" });
        } else {
            res.status(200).json(results);
        }
    });
});

// A PUT API to update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required!" });
    }

    // Checking if the table column is 'Order_status' or 'order_status' based on previous context. We'll use order_status. Wait, earlier code said "Order_status".
    // I'll update order_status
    const sql = "UPDATE Orders SET order_status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            res.status(500).json({ error: "An error occurred while updating the order status!" });
        } else {
            res.status(200).json({ message: "Order status successfully updated!" });
        }
    });
});

// A PUT API to update items availability for an order
app.put('/api/orders/:id/items', (req, res) => {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "Valid items array is required!" });
    }

    const itemsString = JSON.stringify(items);

    const sql = "UPDATE Orders SET items = ? WHERE id = ?";
    db.query(sql, [itemsString, id], (err, result) => {
        if (err) {
            console.error("Error updating order items:", err);
            res.status(500).json({ error: "An error occurred while updating order items!" });
        } else {
            res.status(200).json({ message: "Order items successfully updated!" });
        }
    });
});

// A POST API to receive menu from React and save it to the database
app.post('/api/menus', (req, res) => {
    const { menuName } = req.body;
    if (!menuName) {
        return res.status(400).json({ error: "Menu Name is required!" });
    }

    const sql = "INSERT INTO VALAM_MENU (menu_name) VALUES (?)";
    db.query(sql, [menuName], (err, result) => {
        if (err) {
            console.error("Error saving menu:", err);
            res.status(500).json({ error: "An error occurred while saving the menu!" });
        } else {
            res.status(200).json({ message: "Menu successfully saved!", id: result.insertId });
        }
    });
});

// A GET API to fetch all menus for the Admin Dashboard
app.get('/api/menus', (req, res) => {
    const sql = "SELECT * FROM VALAM_MENU ORDER BY menu_id ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching menus:", err);
            res.status(500).json({ error: "An error occurred while fetching menus!" });
        } else {
            res.status(200).json(results);
        }
    });
});

// A PUT API to update an existing menu
app.put('/api/menus/:id', (req, res) => {
    const { id } = req.params;
    const { menuName, status } = req.body;

    if (!menuName) {
        return res.status(400).json({ error: "Menu Name is required!" });
    }

    const sql = "UPDATE VALAM_MENU SET menu_name = ?, status = ? WHERE menu_id = ?";
    db.query(sql, [menuName, status || 'Active', id], (err, result) => {
        if (err) {
            console.error("Error updating menu:", err);
            res.status(500).json({ error: "An error occurred while updating the menu!" });
        } else {
            res.status(200).json({ message: "Menu successfully updated!" });
        }
    });
});

// A DELETE API to delete a menu
app.delete('/api/menus/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM VALAM_MENU WHERE menu_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting menu:", err);
            res.status(500).json({ error: "An error occurred while deleting the menu!" });
        } else {
            res.status(200).json({ message: "Menu successfully deleted!" });
        }
    });
});

// Helper function to save base64 image
function saveImage(base64Data, originalName, folderName = 'valam_images') {
    if (!base64Data) return null;

    try {
        const uploadDir = path.join(__dirname, '../src', folderName);

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Extract base64 part
        const base64Image = base64Data.split(';base64,').pop();

        // Generate unique filename
        const timestamp = Date.now();
        const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${safeName}`;

        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
        return fileName;
    } catch (err) {
        console.error("Error saving image:", err);
        return null;
    }
};

// A POST API to receive content and save it to the database
app.post('/api/contents', (req, res) => {
    const { menu_id, menu_name, menu_name_tamil, amount, imageFile, imageName, existingImage, content_text_english, content_text_tamil, ingredients_text_english, ingredients_text_tamil, net_weight, shelf_life } = req.body;

    // Process image
    let finalImageName = existingImage || '';
    if (imageFile && imageName) {
        const savedName = saveImage(imageFile, imageName);
        if (savedName) finalImageName = savedName;
    }

    const sql = "INSERT INTO VALAM_CONTENT_TABLE (menu_id, menu_name, menu_name_tamil, amount, image, content_text_english, content_text_tamil, ingredients_text_english, ingredients_text_tamil, net_weight, shelf_life) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [menu_id, menu_name, menu_name_tamil, amount, finalImageName, content_text_english, content_text_tamil, ingredients_text_english, ingredients_text_tamil, net_weight, shelf_life], (err, result) => {
        if (err) {
            console.error("Error saving content:", err);
            res.status(500).json({ error: "An error occurred while saving the content!" });
        } else {
            res.status(200).json({ message: "Content successfully saved!", id: result.insertId });
        }
    });
});

// A GET API to fetch all contents
app.get('/api/contents', (req, res) => {
    const sql = `
        SELECT c.*, m.menu_name AS actual_menu_name 
        FROM VALAM_CONTENT_TABLE c
        LEFT JOIN VALAM_MENU m ON c.menu_id = m.menu_id
        ORDER BY c.content_id ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching contents:", err);
            res.status(500).json({ error: "An error occurred while fetching contents!" });
        } else {
            res.status(200).json(results);
        }
    });
});

// A PUT API to update an existing content
app.put('/api/contents/:id', (req, res) => {
    const { id } = req.params;
    const { menu_id, menu_name, menu_name_tamil, amount, imageFile, imageName, existingImage, content_text_english, content_text_tamil, ingredients_text_english, ingredients_text_tamil, net_weight, shelf_life } = req.body;

    // Process image
    let finalImageName = existingImage || '';
    if (imageFile && imageName) {
        const savedName = saveImage(imageFile, imageName);
        if (savedName) finalImageName = savedName;
    }

    const sql = "UPDATE VALAM_CONTENT_TABLE SET menu_id = ?, menu_name = ?, menu_name_tamil = ?, amount = ?, image = ?, content_text_english = ?, content_text_tamil = ?, ingredients_text_english = ?, ingredients_text_tamil = ?, net_weight = ?, shelf_life = ? WHERE content_id = ?";
    db.query(sql, [menu_id, menu_name, menu_name_tamil, amount, finalImageName, content_text_english, content_text_tamil, ingredients_text_english, ingredients_text_tamil, net_weight, shelf_life, id], (err, result) => {
        if (err) {
            console.error("Error updating content:", err);
            res.status(500).json({ error: "An error occurred while updating the content!" });
        } else {
            res.status(200).json({ message: "Content successfully updated!" });
        }
    });
});

// A DELETE API to delete a content
app.delete('/api/contents/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM VALAM_CONTENT_TABLE WHERE content_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting content:", err);
            res.status(500).json({ error: "An error occurred while deleting the content!" });
        } else {
            res.status(200).json({ message: "Content successfully deleted!" });
        }
    });
});

// A GET API to fetch all products for the frontend
app.get('/api/products', (req, res) => {
    const sql = `
        SELECT c.*, m.menu_name AS actual_menu_name 
        FROM VALAM_CONTENT_TABLE c
        LEFT JOIN VALAM_MENU m ON c.menu_id = m.menu_id
        ORDER BY c.content_id ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            res.status(500).json({ error: "An error occurred while fetching products!" });
        } else {
            // Map database schema to frontend expected format
            const products = results.map(row => {
                const displayName = row.actual_menu_name || row.menu_name;
                return {
                    id: row.content_id,
                    name: row.menu_name_tamil ? `${displayName} - ${row.menu_name_tamil}` : displayName,
                    category: displayName,
                    price: Number(row.amount || 0),
                    rating: 5.0, // Default placeholder
                    reviews: 0,
                    image: row.image ? `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}/images/${row.image}` : '',
                    description: row.content_text_english || '',
                    descriptionTa: row.content_text_tamil || '',
                    ingredientsEn: row.ingredients_text_english || '',
                    ingredientsTa: row.ingredients_text_tamil || '',
                    netWeight: row.net_weight || '',
                    shelfLife: row.shelf_life || '',
                    featured: true,
                    colors: ["#166534", "#15803d", "#854d0e"] // Default colors
                };
            });
            res.status(200).json(products);
        }
    });
});

// Starting the server
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000 🚀");
});
