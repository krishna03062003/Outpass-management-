const mongoose = require("mongoose");

const outpassSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "student", required: true },// 🔥 Changed from rollNumber (String) to ObjectId
    outDate: { type: Date, required: true },
    inDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    entry: { type: String, enum: ["Open", "Close"], default: "Open" },
    place: { type: String, enum: ["Market", "Home"], required: true },
    address: { type: String, required: function () { return this.place === "Home"; } },
    createdAt: { type: Date, default: Date.now }
});

const outpassModel = mongoose.model("outpass", outpassSchema);
module.exports = outpassModel;
