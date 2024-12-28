const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Document = require("../models/Document");
const { verifyToken, checkRole, logRequests } = require("../middleware/authMW");

const router = express.Router();

router.use(logRequests);

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ username: user.username, token: token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all documents for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single document by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new document
router.post("/", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const newDocument = await Document.create({
      title,
      content,
      owner: req.user.id,
    });
    res.json(newDocument);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a document
router.put("/:id", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    document.title = title;
    document.content = content;
    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a document
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await document.remove();
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
