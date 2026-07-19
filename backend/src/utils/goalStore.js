import Goal from "../models/Goal.js";
import { isMongoAvailable } from "../config/db.js";

const memoryGoals = [];

export const listGoalsForUser = async (userId) => {
  if (isMongoAvailable()) {
    return Goal.find({ userId }).sort({ createdAt: -1 });
  }
  return memoryGoals
    .filter((g) => g.userId.toString() === userId.toString())
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createGoalForUser = async (userId, data) => {
  if (isMongoAvailable()) {
    return Goal.create({ userId, ...data });
  }
  const goal = {
    _id: `${Date.now()}`,
    userId,
    currentAmount: 0.0,
    status: "active",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryGoals.push(goal);
  return goal;
};

export const updateGoalForUser = async (id, userId, data) => {
  if (isMongoAvailable()) {
    return Goal.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }
  const goal = memoryGoals.find(
    (g) => g._id.toString() === id.toString() && g.userId.toString() === userId.toString(),
  );
  if (!goal) return null;
  Object.assign(goal, data, { updatedAt: new Date() });
  return goal;
};

export const contributeToGoalForUser = async (id, userId, amount) => {
  const deposit = parseFloat(amount);
  if (isMongoAvailable()) {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return null;
    const nextAmount = parseFloat(goal.currentAmount.toString()) + deposit;
    const status = nextAmount >= parseFloat(goal.targetAmount.toString()) ? "completed" : goal.status;
    return Goal.findOneAndUpdate(
      { _id: id, userId },
      { currentAmount: parseFloat(nextAmount.toFixed(2)), status },
      { new: true },
    );
  }

  const goal = memoryGoals.find(
    (g) => g._id.toString() === id.toString() && g.userId.toString() === userId.toString(),
  );
  if (!goal) return null;

  goal.currentAmount = parseFloat((parseFloat(goal.currentAmount.toString()) + deposit).toFixed(2));
  if (goal.currentAmount >= parseFloat(goal.targetAmount.toString())) {
    goal.status = "completed";
  }
  goal.updatedAt = new Date();
  return goal;
};

export const deleteGoalForUser = async (id, userId) => {
  if (isMongoAvailable()) {
    return Goal.findOneAndDelete({ _id: id, userId });
  }
  const index = memoryGoals.findIndex(
    (g) => g._id.toString() === id.toString() && g.userId.toString() === userId.toString(),
  );
  if (index === -1) return null;
  const removed = memoryGoals.splice(index, 1);
  return removed[0];
};

export const getMemoryGoals = () => memoryGoals;
