const mongoose = require("mongoose");
const schema = mongoose.Schema;
const transactionSchema = new schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, required: true, emu: ["income", "expense"] },
  category: {
    type: String,
    required: function () {
      return this.type === "expense";
    },
  },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

transactionSchema.index({ date: 1 });

// "transaction" smya dyal collection o 3tinaha schema li asta3mal li smitha transactionSchema
const transaction = mongoose.model("transaction", transactionSchema);
module.exports = transaction;
