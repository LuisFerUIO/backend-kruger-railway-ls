import mongoose from 'mongoose';
// comentario estructura
// {
//    user: "1234"
//    message: "Hola mundo",
//    createdAt: "2021-10-05T22:00.00.000Z"
//}
// DE ALGUNA MANERA DEBEMOS PODER LLEGAR A OBETNER LA INFORMACION DEL USUARIO
// {
//     user: "admin",
//     email: "user.com"
//
//}



const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

export const Comment = mongoose.model("comments",commentSchema);