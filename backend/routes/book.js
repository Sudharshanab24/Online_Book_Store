const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

// ✅ Add a new book (Admin only)
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { imageUrl, title, author, price, desc, language, standard } = req.body;

        if (!imageUrl || !title || !author || !price || !desc || !language || !standard) {
            return res.status(400).json({ message: "All fields including standard are required." });
        }

        const book = new Book({
            imageUrl,
            title,
            author,
            price,
            desc,
            language,
            standard,
        });

        await book.save();
        res.status(200).json({ message: "Book added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Update book details (Admin only)
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { bookid, imageUrl, title, author, price, desc, language, standard } = req.body;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await Book.findByIdAndUpdate(bookid, {
            imageUrl,
            title,
            author,
            price,
            desc,
            language,
            standard,
        });

        return res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Delete a book (Admin only)
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { bookid } = req.body;

        if (!bookid) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const book = await Book.findById(bookid);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        await Book.findByIdAndDelete(bookid);

        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// ✅ Get all books (with optional standard filter)
router.get("/get-all-books", async (req, res) => {
    try {
        const { standard } = req.query;
        const filter = standard ? { standard } : {};

        const books = await Book.find(filter).sort({ createdAt: -1 });

        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// ✅ Get recent books (latest 4 books)
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// ✅ Get book by ID
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.json({
            status: "success",
            data: book,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;
