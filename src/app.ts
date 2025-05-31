import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'
import noteRoutes from './routes/note.routes';
import errorHandler from './middlewares/error.middleware';
import './configs/passport.config'; // Ensure passport strategies are loaded
import passport from 'passport';
import userRoutes from './routes/user.routes';
import { protect } from './middlewares/auth.middleware';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


// Routes
app.get("/", (req, res)=>{
    res.send("Hello, welcome to our book app!");
})
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', protect, userRoutes); // User management routes
app.use('/api/notes', noteRoutes); // Note management routes

// Error handling middleware
app.use(errorHandler);


export default app;