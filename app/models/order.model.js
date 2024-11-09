import mongoose from "mongoose";

//obejeto que representa el objeto de la orden
// {
// user: "idDelUsuario",
// products: [
//     {
//         id: "idDelProducto que estamos comprando",
//         quantity: "cantidad de productos que estamos comprando",
//     },
//     {
//         id: "idDelProducto que estamos comprando",
//         quantity: "cantidad de productos que estamos comprando",
//     },
// comments:[
// "idDelComentario","idDelComentario"
// ]
//totalPrice: "precioTgoal ",
// }
//de alguna manera puedo traer o plobar las referencias con los otros modelos
// {
//     user:{
//         username: "jose",
//         email: "user.com",
//             role: "admin",
//     }
//}



const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments",
        },
    ],
    products:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "A product must have at least 1 unit"],
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Order = mongoose.model("orders", orderSchema);

