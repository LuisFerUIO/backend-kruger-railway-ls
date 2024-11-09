import { User } from "../models/user.model.js";
import {Product} from "../models/product.model.js";

const saveUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      deletedAt: null,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
  // actualizar el campo deletedAt: Date.now()
    const user = await User.findByIdAndUpdate(req.params.id, {
      deletedAt: Date.now(),
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


export { saveUser, getUsers, deleteUser };
