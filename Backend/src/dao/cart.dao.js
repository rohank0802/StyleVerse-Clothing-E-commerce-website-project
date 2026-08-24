import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

//getcart detail by agerigation 
export async function getCartDetails(userId){
let cart=await cartModel.aggregate(
  [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $unwind: { path: '$items.product.variants' }
    },
    {
      $match: {
        $expr: {
          $eq: [
            '$items.variant',
            '$items.product.variants._id'
          ]
        }
      }
    },
    {
      $addFields: {
        totalItemsPrice: {
          price: {
            $multiply: [
              '$items.quantity',
              '$items.product.variants.price.amount'
            ]
          },
          currency:
            '$items.product.variants.price.currency'
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        totalcartItemsPrice: {
          $sum: '$totalItemsPrice.price'
        },
        currency: {
          $first: '$totalItemsPrice.currency'
        },
        items: { $push: '$items' }
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);

return cart
}