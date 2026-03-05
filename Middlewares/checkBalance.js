const Transaction = require("../Models/transactionModel");

const checkBalance = async (req, res, next) => {
  try {
    if (req.body.type !== "expense") {
      return next();
    }

    const income = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expense = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = income[0] ? income[0].total : 0;
    const totalExpense = expense[0] ? expense[0].total : 0;

    const balance = totalIncome - totalExpense;

    if (req.body.amount > balance) {
      return res.status(400).json({
        message: "solde insuffisant",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkBalance;
