import Order from "../../models/Order";
import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";
import Cors from "cors";

connectDb();

// Initialize the cors middleware
const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "OPTIONS"],
  })
);nectDb();

async function orders(req, res){
  // Run Cors
  await cors(req, res)
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const orders = await Order.find({ user: userId })
      ///1 is same as asc -1 is same as desc
      .sort({ createdAt: "desc" })
      .populate({
        path: "products.product",
        model: "Product"
      });
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(403).send("Please login again");
  }
};

export default orders;
