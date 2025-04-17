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
    days:{type:Number,dafault:"0"},
    createdAt: { type: Date, default: Date.now }
});

outpassSchema.pre("save", function (next) {
    if (this.place === "Home") {
        const out = new Date(this.outDate);
        const entry = new Date(this.inDate);

        if (isNaN(out.getTime()) || isNaN(entry.getTime())) {
            console.log("Invalid dates:", this.outDate, this.inDate);
            this.days = 0;
        } else if (out <= entry) {
            out.setHours(0, 0, 0, 0);
            entry.setHours(0, 0, 0, 0);

            // Calculate days
            const timeDiff = entry.getTime() - out.getTime();
            this.days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both outDate and inDate
        } else {
            this.days = 0; // If inDate is earlier than outDate
        }
    } else {
        this.days = 0; // for Market outpass
    }
    next();
});

const outpassModel = mongoose.model("outpass", outpassSchema);
module.exports = outpassModel;
