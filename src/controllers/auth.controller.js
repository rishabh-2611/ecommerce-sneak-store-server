/** Import Middlewares */
import authMiddleware from "../middlewares/authentication.middleware.js";
import cartRepo from "../repositories/cart.repo.js";

/** Import Repositories */
import userRepo from "../repositories/user.repo.js";

/** Import Utils */
import generalUtil from "../utils/general.util.js";
import passwordUtil from "../utils/password.util.js";

const login = (req, res) => {
  try {
    authMiddleware
      .login(req)
      .then(async (data) => {
        // Send auth token, user details after successful login
        res.cookie("authToken", data.token, {
          httpOnly: true,
          // maxAge: 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
        });
        return res.status(200).json({
          user: data.userDetails,
          message: "User logged in successfully!",
        });
      })
      .catch((error) => {
        return res.status(401).json({ message: error });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const register = async (req, res) => {
  try {
    const userDetails = req.body;

    // Check if user already exist
    const userExists = await userRepo.isUserExists({
      email: userDetails.email,
    });

    if (userExists) {
      return res
        .status(400)
        .send({
          message:
            "An account with same email is already registered. Please login to access your account",
        });
    }

    const { salt, hash } = await passwordUtil.encryptPassword(userDetails.password)
    const userObj = {
      email: userDetails.email,
      isEnabled: true,
      credentials: { salt, password: hash },
      details: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        address: userDetails.address
      }
    };
    const newUser = await userRepo.createUser(userObj);
    if (newUser && newUser._id) {
      // Setup cart and wishlist
      const cart = await cartRepo.createCart({user: newUser._id, items:[]})
      userObj.cart = cart;
      return res
        .status(201)
        .json({
          message:
            "Your account is created successfully",
        });
    }
  } catch (err) {
    console.error("Error - signUp", err.message);
  }
  res.status(500).json({ message: "Error in user registration" });
};


const logout = (req, res) => {
  console.log('Logging out...', req.user.email)
  res.clearCookie('authToken')
  res.status(200).json({ message: 'User logged out successfully!' })
}

export default {
  login,
  register,
  logout
};
