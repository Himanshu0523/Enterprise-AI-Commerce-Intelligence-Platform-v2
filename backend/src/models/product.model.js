const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            index: true
        },

        price: {
            type: Number,
            required: true
        }, 

        stock: {
            type: Number,
            default: 0
        },

        description: {
            type: String
        },

        image: {
            type: String,
            default: ""
        },

        isNewProduct: {
            type: Boolean,
            default: false
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        isOnSale: {
            type: Boolean,
            default: false
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

module.exports = mongoose.model("Product" , productSchema);