const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

const PORT = 5000;

mongoose.connect(
  "mongodb+srv://Admin:Karan@cluster0.ezldiau.mongodb.net/Hungryhub?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(cors());
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  fname: String,
  lname: String,
  password: String,
  phoneNumber: String,
});

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
});

const restaurantSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  image: String,
  address: {
    type: String,
    required: true,
  },
  ratings: Number,
  menu: [menuSchema],
});

const cartSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: String,
});

const orderSchema = new mongoose.Schema({
  items: [
    {
      _id: String,
      name: String,
      description: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
});

const reviewSchema = new mongoose.Schema({
  restaurantId: String,
  review: String,
  rating: Number,
});

const couponSchema = new mongoose.Schema({
  
  code: {
    type: String,
    required: true,
    unique:true,
  },
  discount: {
    type: String,
    required: true,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const User = mongoose.model("User", userSchema);
const Cart = mongoose.model("Cart", cartSchema, "carts");
const Order = mongoose.model("Order", orderSchema, "orders");
const Review = mongoose.model("Review", reviewSchema);
const Coupon = mongoose.model('Coupon', couponSchema);

app.post("/api/register", async (req, res) => {
  const { username, email, fname, lname, password, phoneNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      fname,
      lname,
      password: hashedPassword,
      phoneNumber,
    });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/menu/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Assuming you have a Restaurant model and you want to find menu items by restaurantId
    const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const menu = restaurant.menu;
    res.json(menu);
  } catch (err) {
    console.error("Error fetching menu items", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/restaurant/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    console.error("Error fetching menu items", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching menu items", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/menu/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Assuming you have a Restaurant model and you want to find menu items by restaurantId
    const restaurant = await Restaurant.findOne({ restaurantId: restaurantId });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const menu = restaurant.menu;
    res.json(menu);
  } catch (err) {
    console.error("Error fetching menu items", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error("Error fetching restaurants", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { restaurantId, review, rating } = req.body;
    const newReview = new Review({ restaurantId, review, rating });
    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.log("invalid");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, send an error response
    if (!passwordMatch) {
      console.log("invalid");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If the passwords match, send a success response
    res.json({ message: "Login successful", user: user });
    console.log("valid");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("invalid server");
  }
});

app.post("/api/cart/add", async (req, res) => {
  const { name, description, price, quantity } = req.body;

  try {
    const cartItem = new Cart({
      name,
      description,
      price,
      quantity,
    });
    await cartItem.save();
    res.json({ message: "Item added to cart successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/cart/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const newQuantity = req.body.quantity;

  try {
    const updatedItem = await Cart.findOneAndUpdate(
      { _id: itemId },
      { $set: { quantity: newQuantity } },
      { new: true }
    ).exec();

    if (!updatedItem) {
      return res.status(404).send("Item not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/cart/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const deletedItem = await Cart.findOneAndDelete({ _id: itemId }).exec();

    if (!deletedItem) {
      return res.status(404).send("Item not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order({
      items: req.body.items,
      total: req.body.total,
    });

    await newOrder.save();
    res.sendStatus(201);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const deletedOrder = await Order.findOneAndDelete({ _id: orderId }).exec();

    if (!deletedOrder) {
      return res.status(404).send("Order not found");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/reset-password", async (req, res) => {
  try {
    const { username, email, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Update the user's password in the database
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/restaurantupdate/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  const updatedDetails = req.body; // Assuming the updated details are sent in the request body

  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: restaurantId },
      { $set: updatedDetails },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    console.error("Error updating restaurant details", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/restaurantdelete/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findOneAndDelete({
      _id: restaurantId,
    }).exec();

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("Error deleting restaurant", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching all users", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/userdelete/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOneAndDelete({
      _id: userId,
    }).exec();

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json({ message: "user deleted successfully" });
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/userupdate/:userId", async (req, res) => {
  const { userId } = req.params;
  const updatedDetails = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatedDetails },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user details", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/api/changepswd', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Update the user's password in the database
    await user.save();

    res.status(200).json({ message: 'Password Changed successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/api/admin/add-restaurant", async (req, res) => {
  try {
    const { name, cuisine, image, address, ratings,location } = req.body;
    console.log(req.body);

    // Validate required fields
    if (!name || !cuisine || !address || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRestaurant = new Restaurant({
      name,
      cuisine,
      image,
      address,
      ratings,
      location,
      menu: [], 
    });

    await newRestaurant.save();

    res.status(201).json({ message: "Restaurant added successfully", restaurant: newRestaurant });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/restaurants/names", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    const restaurantNames = restaurants.map(restaurant => restaurant.name);
    res.json(restaurantNames);
  } catch (error) {
    console.error("Error fetching restaurant names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/admin/add-menu-item", async (req, res) => {
  try {
    const { restaurantId } = req.body;  // Change from params to body
    const { name, price, description, image, category } = req.body;

    const restaurant = await Restaurant.findOne({ name: restaurantId });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const newMenuItem = {
      name,
      price,
      description,
      image,
      category,
    };

    restaurant.menu.push(newMenuItem);
    await restaurant.save();

    res.status(201).json({ message: "Menu item added successfully", restaurant });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/add-user", async (req, res) => {
  const { username, fname, lname, email, password, phoneNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      fname,
      lname,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await user.save();
    res.json({ message: "User added successfully", user });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/getCoupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching all Coupons", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a coupon by ID
app.delete('/deleteCoupon/:couponId', async (req, res) => {
  const { couponId } = req.params;
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    
    if (!deletedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Error deleting coupon", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/api/add-coupon', async (req, res) => {
  const { code, discount } = req.body;

  try {
    const newCoupon = new Coupon({
      code,
      discount,
    });

    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (err) {
    console.error('Error adding coupon:', err);

    if (err.code === 11000) {
      // Duplicate key error (coupon code already exists)
      res.status(400).json({ error: 'Coupon code must be unique' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.put('/couponupdate/:id', async (req, res) => {
  const { id } = req.params;
  const { code, discount } = req.body;

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, { code, discount }, { new: true });

    if (updatedCoupon) {
      res.json({ success: true, message: 'Coupon updated successfully' });
    } else {
      res.status(404).json({ error: 'Coupon not found' });
    }
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
