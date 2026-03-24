import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  plan: { type: String, default: 'personal' }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['income', 'expense'], required: true },
  planContext: { type: String }
}, { timestamps: true });

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limitAmount: { type: Number, required: true },
  planContext: { type: String }
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: String },
  planContext: { type: String }
}, { timestamps: true });

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['monthly', 'annual'], required: true },
  nextBillingDate: { type: String },
  planContext: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema);
export const Budget = mongoose.model('Budget', budgetSchema);
export const Goal = mongoose.model('Goal', goalSchema);
export const Subscription = mongoose.model('Subscription', subscriptionSchema);
