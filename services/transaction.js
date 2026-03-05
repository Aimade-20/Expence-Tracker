const transaction = require("../Models/transactionModel");
const transaction = require("../Models/transactionModel");
const transaction = require("../Models/transactionModel");
// majmou3 dyal incom f varyabl incomeAgg
const calculBlance = async () => {
  const incomeAgg = await transaction.aggregate([
    { $match: { type: "income" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  // majmou3 dyal expense f varyabl expenseAgg
  const expenseAgg = await transaction.aggregate([
    { $match: { type: "expense" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // hna anjib total li kayan f array incomeAgg ila mal9ahx irad liya 0
  const totalIncome = incomeAgg[0] ? incomeAgg[0].total : 0;
  // hna anjib total li kayan f array expenseAgg ila mal9ahx irad liya 0
  const totalExpense = expenseAgg[0] ? expenseAgg[0].total : 0;

  return totalIncome - totalExpense;
};
const creatTransaction = async (data) => {
  const balance = await calculBlance();
  if (data.type === "expense" && balance < data.amount) {
    throw new error("insufficient balace");
  }
  const transaction = await transaction.create(data);
  return transaction;
};
const getTransactions = async (filters, page = 1, limit = 10) => {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.startDate || filters.endDate) query.date = {};
  if (filters.startDate) query.date.$gte = new Date(filters.startDate);
  if (filters.endDate) query.date.$lte = new Date(filters.endDate);

  const transactions = await transaction
    .find(query)
    .sort({ date: -1 }) // autput ikon tanazoli
    .skip((page - 1) * limit) // bax itkhata document (page -1) *limit = 10 && (1 -1) *10
    .limit(limit); // 3adad dyal docs li aykharaj li hana limit 10
  return transactions;
};
const getMonthlyStats = async (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  const transactions = await transaction.find({
    date: { $gte: start, $lte: end },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotal = {};

  transactions.forEach((tx) => {
    if (tx.type === "income") totalIncome += tx.amount;
    if (tx.type === "expense") {
      totalExpense += tx.amount;
      categoryTotal[tx.category] =
        (categoryTotal[tx.category] || 0) + tx.amount;
    }
  });
  const balance = totalIncome - totalExpense;
  const categoryPercentage = {};
  for (const cat in categoryTotal) {
    categoryPercentage[cat] = (
      (categoryTotal[cat] / totalExpense) *
      100
    ).toFixed(2);
  }
  return {
    totalIncome,
    totalExpense,
    balance,
    categoryTotal,
    categoryPercentage,
  };
  module.exports = {
    calculBlance,
    creatTransaction,
    getTransactions,
    getMonthlyStats,
  };
};
