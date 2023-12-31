import express from 'express';
import cors from 'cors';
import { config } from 'dotenv'; 
import connectDB from './config/db.js';
import Router from './routes/userRouter.js';
import router from './routes/productRouter.js';
import CatagoryRouter from './routes/catagoryRouter.js';
import cartRoutes from './routes/cardRouter.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
config();

const corsOptions = {
  origin: 'https://main--chimerical-marzipan-5ac1d5.netlify.app',
  methods: 'GET, PUT, POST, DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
// app.use(express.static(path.join(__dirname, './client/build')))
// Use the CORS middleware
app.use(cors(corsOptions));
app.use(express.json());
//port 
const PORT = process.env.PORT || 4000;

//Connection to MongoDB 
connectDB();

// app.use('*', function(req, res){
//   res.sendFile(path.join(__dirname, './client/build/index.html'))
// })
//Routing
app.use('/user', Router);
app.use('/product', router);
app.use('/catagory', CatagoryRouter);

// Use the cart route
app.use('/cart', cartRoutes);

app.get('/', (req, res) => {
    console.log("This is the E-Commerce Application");
    res.send("Hello, this is the E-Commerce Application");
});
//server running
app.listen(PORT, () => {
    console.log(`The Server is running on PORT ${PORT}`);
});
