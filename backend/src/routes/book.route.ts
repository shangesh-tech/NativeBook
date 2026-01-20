import { Router, Response } from "express";
import Book from "../lib/models/Book";
import protectRoute from "../middleware/auth.middleware";

const router = Router();

/* ----------------------------------
   CREATE A NEW BOOK
----------------------------------- */
router.post(
  "/",
  protectRoute,
  async (req: any, res: Response): Promise<Response> => {
    try {
      const { title, caption, rating, image } = req.body;

      if (!title || !caption || !rating || !image) {
        return res.status(400).json({ message: "Please provide all fields" });
      }

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newBook = new Book({
        title,
        caption,
        rating,
        image,
        user: req.user._id,
      });

      await newBook.save();

      return res.status(201).json(newBook);
    } catch (error) {
      console.error("Error creating book", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* ----------------------------------
   GET ALL BOOKS WITH PAGINATION
----------------------------------- */
router.get(
  "/",
  protectRoute,
  async (req: any, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 2;
      const skip = (page - 1) * limit;

      const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

      const totalBooks = await Book.countDocuments();

      return res.json({
        books,
        currentPage: page,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
      });
    } catch (error) {
      console.error("Error fetching books", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* ----------------------------------
   GET LOGGED-IN USER BOOKS
----------------------------------- */
router.get(
  "/user",
  protectRoute,
  async (req: any, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const books = await Book.find({ user: req.user._id }).sort({
        createdAt: -1,
      });

      return res.json(books);
    } catch (error) {
      console.error("Get user books error", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* ----------------------------------
   UPDATE BOOK
----------------------------------- */
router.put(
  "/:id",
  protectRoute,
  async (req: any, res: Response): Promise<Response> => {
    try {
      const { title, caption, rating, image } = req.body;

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // check ownership
      if (book.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      book.title = title || book.title;
      book.caption = caption || book.caption;
      book.rating = rating || book.rating;
      book.image = image || book.image;

      await book.save();

      return res.json(book);
    } catch (error) {
      console.error("Error updating book", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

/* ----------------------------------
   DELETE BOOK
----------------------------------- */
router.delete(
  "/:id",
  protectRoute,
  async (req: any, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // check ownership
      if (book.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await book.deleteOne();

      return res.json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
