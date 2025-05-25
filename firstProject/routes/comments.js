import express from 'express';
import Comment from '../models/Comment.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Create a comment for a post
router.post('/:postId', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const comment = new Comment({
      text,
      post: req.params.postId,
      author: req.user._id,
    });
    await comment.save();
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err.message);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

export default router;

