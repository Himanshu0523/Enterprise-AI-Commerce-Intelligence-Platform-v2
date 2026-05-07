const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: function () {
                return this.provider === 'local';
            }
        },
        provider: {
            type: String,
            default: 'local'
        },
        googleId: {
            type: String,
            sparse: true,
            unique: true
        },
        avatar: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        created_at: {
            type: Date,
            default: Date.now
        },

        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],

        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: Number
            }
        ],

        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ]   
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model("User", userSchema);