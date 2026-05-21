const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema(
    {
        product_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required: true
        },
        
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min : 1
        },
        
        delivery_status: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending"
        },
        
        payout_status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        },

        price: {
            type: Number,
            required: true,
            min: 1
        }
    },{
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true
        },
        items: [orderItemSchema],

        total_price: {
            type: Number,
            required: true
        },

        status: {
            type: String ,
            enum: ["pending" , "paid" , "shipped" , "delivered" , "cancelled", "failed", "created"],
            default: "pending"
        },
        
        razorpay_order_id: {
            type: String,
            default: null
        },
        razorpay_payment_id: {
            type: String,
            default: null
        },
        razorpay_signature: {
            type: String,
            default: null
        },

        created_at: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model("Order" , orderSchema);