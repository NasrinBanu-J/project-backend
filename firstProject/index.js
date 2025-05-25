import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Database/connectDB.js';
import authRoutes from './routes/Auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/Auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
  console.log(`Server running successfully at port ${PORT}`);
});

connectDB();
