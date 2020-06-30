// import products from '../../static/products.json'
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import middleware from "../../utils/initMiddleware";
import Cors from "cors";

connectDb();

// Initialize the cors middleware
const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "OPTIONS"],
  })
);

async function products(req, res) {
  // Run Cors
  await cors(req, res);

  const { page, size } = req.query;

  //convert querystring value to number
  const pageNum = Number(page);
  const pageSize = Number(size);
  let products = [];
  const totalDocs = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);
  if (pageNum === 1) {
    products = await Product.find().limit(pageSize);
  } else {
    const skips = pageSize * (pageNum - 1);
    products = await Product.find().skip(skips).limit(pageSize);
  }

  // const products = await Product.find();

  res.status(200).json({ products, totalPages });
}

export default products;
