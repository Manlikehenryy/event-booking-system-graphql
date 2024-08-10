import bcrypt from "bcryptjs";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";

const authResolvers = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const result = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      await result.save();

      return { ...result._doc, _id: result.id };
    } catch (error) {
      throw error;
    }
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User does not exist!");
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error("Invalid email or password!");
    }

    const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET,{expiresIn: '1h'});

    return {
     userId: user.id,
     token: token,
     tokenExpiration: 1
    };
  },
};

export default authResolvers;
