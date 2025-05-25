import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';
import authMiddleware from '../middleware/auth.js';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = new Post({
      title,
      content,
      author: req.user._id,
      image: req.file ? req.file.filename : null,
    });
    await newPost.save();
    await newPost.populate('author', 'username');
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/myblogs', authMiddleware, async (req, res) => {
  try {
    const myPosts = await Post.find({ author: req.user._id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(myPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


