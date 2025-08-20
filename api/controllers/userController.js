import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import cloudinary from "../utils/cloudinary.js"; 

export const test = (req, res) => {
  res.json({ message: "Hello from the server" });
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only update your own account"));

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    if (req.body.avatar) {
      const uploadResult = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
      });
      req.body.avatar = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) return next(errorHandler(404, "User not found"));

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
