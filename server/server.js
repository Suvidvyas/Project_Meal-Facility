// ----------Using Router---------------
require("dotenv").config();
const express = require('express');
const app = express();
const router =  require("./router/auth-router");
const connectDb = require("./utils/db")
const bodyParser = require('body-parser');
const cors = require('cors');

const errorMiddleware = require("./server/middlewares/error-middleware");

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
  }));

app.use(express.json());


app.use("/api", router);


// const staticUser = {
//   username: 'admin',
//   password: 'password123'
// };

// app.post('/login', (req, res) => {
//   const { user } = req.body;

//   if (username === staticUser.username && password === staticUser.password) {
//     return res.status(200).json({ message: 'Login successful' });
//   } else {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }
// });




app.use(errorMiddleware);



const port = 5000;
connectDb().then(() => {

app.listen(port, ()=>{
    console.log(`Server is status : ${port} `);
});
});
  
// app.get('/', (req , res)=> {
//      res
//         .status(200)
//         .send("Welcome world best mern series by suvid");
// });

// app._router("/").get((req, res)=>{
//     res
//         .status(200)
//         .send("Welcome world best mern series by suvid");
// })

