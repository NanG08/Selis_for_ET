import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Transaction, Budget, Goal, Subscription } from './src/lib/models.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'selis-secret-key';
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mongo: mongoose.connection.readyState });
  });

  // MongoDB Connection
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  } else {
    console.warn('MONGODB_URI not found in environment variables. Backend will not work correctly.');
  }

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection not established. Please check your MONGODB_URI secret.' });
    }
    const { email, password, name, plan } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, name, plan: plan || 'personal' });
      await user.save();
      
      const token = jwt.sign({ id: user._id, email, plan: user.plan }, JWT_SECRET);
      res.json({ token, user: { id: user._id, email, name, plan: user.plan } });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists or registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection not established. Please check your MONGODB_URI secret.' });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, email, plan: user.plan }, JWT_SECRET);
        res.json({ token, user: { id: user._id, email, name: user.name, plan: user.plan } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Transaction Routes
  app.get('/api/transactions', authenticateToken, async (req: any, res) => {
    try {
      const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
      res.json(transactions.map(t => ({ ...t.toObject(), id: t._id })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  app.post('/api/transactions', authenticateToken, async (req: any, res) => {
    try {
      const { amount, category, date, description, type, planContext } = req.body;
      const tx = new Transaction({ userId: req.user.id, amount, category, date, description, type, planContext });
      await tx.save();
      res.json({ ...tx.toObject(), id: tx._id });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  // Budget Routes
  app.get('/api/budgets', authenticateToken, async (req: any, res) => {
    try {
      const budgets = await Budget.find({ userId: req.user.id });
      res.json(budgets.map(b => ({ ...b.toObject(), id: b._id })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch budgets' });
    }
  });

  app.post('/api/budgets', authenticateToken, async (req: any, res) => {
    try {
      const { category, limitAmount, planContext } = req.body;
      const budget = new Budget({ userId: req.user.id, category, limitAmount, planContext });
      await budget.save();
      res.json({ ...budget.toObject(), id: budget._id });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create budget' });
    }
  });

  // Goal Routes
  app.get('/api/goals', authenticateToken, async (req: any, res) => {
    try {
      const goals = await Goal.find({ userId: req.user.id });
      res.json(goals.map(g => ({ ...g.toObject(), id: g._id })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch goals' });
    }
  });

  app.post('/api/goals', authenticateToken, async (req: any, res) => {
    try {
      const { name, targetAmount, currentAmount, deadline, planContext } = req.body;
      const goal = new Goal({ userId: req.user.id, name, targetAmount, currentAmount, deadline, planContext });
      await goal.save();
      res.json({ ...goal.toObject(), id: goal._id });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  // Subscription Routes
  app.get('/api/subscriptions', authenticateToken, async (req: any, res) => {
    try {
      const subscriptions = await Subscription.find({ userId: req.user.id });
      res.json(subscriptions.map(s => ({ ...s.toObject(), id: s._id })));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  });

  app.post('/api/subscriptions', authenticateToken, async (req: any, res) => {
    try {
      const { name, amount, frequency, nextBillingDate, planContext } = req.body;
      const sub = new Subscription({ userId: req.user.id, name, amount, frequency, nextBillingDate, planContext });
      await sub.save();
      res.json({ ...sub.toObject(), id: sub._id });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  app.delete('/api/subscriptions/:id', authenticateToken, async (req: any, res) => {
    try {
      await Subscription.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete subscription' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
