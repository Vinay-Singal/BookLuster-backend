import User from "../model/user_model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already exists" });
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({
      fullname: fullname,
      email: email,
      password: hashPassword,
    });
    await newUser.save();
    // const token = newUser.generateToken();
    res.status(201).json({ message: "User created", user:{
        _id:newUser._id,
        fullname:newUser.fullname,
        email:newUser.email,
    } });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      res.status(200).json({
        message: "login successfull",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
};
