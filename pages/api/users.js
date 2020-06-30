import User from '../../models/User'
import jwt from 'jsonwebtoken'
import middleware from "../../utils/initMiddleware";
import Cors from 'cors'

connectDb(); 

// Initialize the cors middleware
const cors = middleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'OPTIONS'],
  })
)

async function users(req,res){

  // Run Cors
  await cors(req, res)

    try{
        const {userId} = jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
         ///1 is same as asc -1 is same as desc
        const users = await User.find({_id:{$ne: userId}}).sort({name:"asc"})
        res.status(200).json(users)
    }catch(error){
        console.error(error)
        res.status(403).send("Please login again.")
    }
}

export default users;