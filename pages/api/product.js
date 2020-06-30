import Product from "../../models/Product";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
import middleware from "../../utils/initMiddleware";
import Cors from 'cors'

connectDb(); 

// Initialize the cors middleware
const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "PUT", "POST", "DELETE","OPTIONS"],
  })
)

//GET -> handle get request, DELETE -> handle delete request
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
    case "DELETE":
      await handleDeleteRequest(req, res);
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  // Run Cors
  await cors(req, res)
  const { _id } = req.query;
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
}

async function handlePostRequest(req, res) {
  // Run Cors
  await cors(req, res);
  try {
    const { name, price, description, mediaUrl } = req.body;
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).send("Product missing one or more fields");
    }
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl,
    }).save();

    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error in creating product");
  }
}

async function handleDeleteRequest(req, res) {
  // Run Cors
  await cors(req, res);
  const { _id } = req.query;
  try {
    //1 delete product by id
    await Product.findOneAndDelete({ _id });
    //2 Remove product from all carts,referenced as 'product'
    await Cart.updateMany(
      { "products.product": _id },
      { $pull: { products: { product: _id } } }
    );
    res.status(204).json({});
  } catch (err) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
}

// export default async(req,res)=>{
//     const {_id} = req.query;

//     const product = await Product.findOne({_id});
//     res.status(200).json(product);

// }
