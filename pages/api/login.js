import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../../utils/initMiddleware";
import Cors from 'cors'

connectDb(); 

// Initialize the cors middleware
const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET','POST', 'OPTIONS'],
  })
)

async function login(req, res) {


    // Run Cors
    await cors(req, res)

  const { email, password } = req.body;
  try {
    //1 Check to see if the user already exists with provided email
    const user = await User.findOne({ email }).select("+password");

    //2 if not return error
    if (!user) {
      return res.status(404).send("No user exists with that email");
    }
    //3 check if user password matches one in db
    const passwordsMatch = await bcrypt.compare(password, user.password);
    //4 if so generate token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
      //5 send that token to the client
      res.status(200).json(token);
    } else {
      res.status(401).send("Passwords do not match");
    }
  } catch (err) {
    console.error(error);
    res.status(500).send("Error logging in User.");
  }
}

export default login;
