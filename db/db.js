import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://luisfer:camila1984@krugerbackendap.0ekey.mongodb.net/products?retryWrites=true&w=majority&appName=KrugerBackendAP"
    );
    console.log("Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
};
