import configs from "../configs/configs.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import crypto from 'crypto';

const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    //1.- Vamos a obtener las credenciales (username, password) del request
    const { username, password } = req.body;
    //2.- Vamos a buscar el usuario en la BDD, si no existe vamos a retornar un 404
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //3.- Vamos a comparar la contraseña que viene en el request con la contraseña hasheada que tenemos en la BDD
    const passwordsMatch = await user.comparePasswords(password);
    //4.- Si las contraseñas no coinciden, vamos a retornar un 401
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //5.- Si las contraseñas coinciden, vamos a generar un token JWT y lo vamos a retornar en la respuesta
    // El metodo sign lo que hace es firmar nuestro jwt (token), la firma del token sirve para poder validar
    // que el token no ha sido modificado por un tercero
    // EL primer parametro que vamos a enviar en el metodo es un objeto que contiene la informacion del usuario
    // FSHGAFGJDFG%JSDFK/(435345) -> Informacion del usuario
    const token = await jwt.sign(
      { user_id: user._id, role: user.role },
      configs.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////////////

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //1.- vamos a validar si el correo que esta enviando existe o esta almacenado en la BDD
    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({message: "User not found email"});
    }
    //2.- vamos a generar el tokem unnico que vamos a enviar al correo del usuario
    const resetToken = user.generatePasswordToken();
    await user.save({validateBeforeSave: false});

    //3.- vamos a genera la url que vamos a enviar al correo del user
    //http://localhost:3000/reset-password/resetTokenPassword
    const resetUrl = `http://localhost:5176/reset-password/${resetToken}`;

    //4.- vamos a enviar el correo al usuario
    try{
      const message = `To reset your password, please click on the following link: ${resetUrl}`;
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
      res.json({message: "sending email"});
    }catch(error){
      user.resetPasswordToken=undefined;
      user.resetPasswordExpires=undefined;

      await user.save({validateBeforeSave: false});
      res.status(500).json({message: error.message});
    }
  }catch (error) {
    res.status(500).json({message: error.message});
  }
}

//////////////////////////////////////////////////////////////
const resetPassword = async (req, res) => {
  try{
    //1. obtener el token del request
    const {token} = req.params;
    //2. obtener la nueva password que ha configurado el usuario
    const {password} = req.body;
    //3. en BDD tenemos el token pero esta hasheasdo y lo que llega del request llega en texto plano
    //vamos a hashear el token que llega del request para compararlo con el token hasheado que tenemos en la BDD
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    //4. vamos a buscar al usuario que tiene el token hasheado en la BDD
    // y ademas vamos aplicar el tiempo de vida del token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: {$gt: Date.now()},
    });

    //5.- Validar si el usuario que estamos buscando existe o no
    if(!user){
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    //6. vamos a actualizar la password del usuario
    user.passwod = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({message: "Password updated successfully"});
        }catch (error) {
    res.status(500).json({message: error.message});
  }
}

export {
  register,
  login,
  forgotPassword,
  resetPassword,
};
