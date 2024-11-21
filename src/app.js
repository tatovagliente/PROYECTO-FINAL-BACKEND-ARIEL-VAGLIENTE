import express from 'express';
import { engine } from 'express-handlebars';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import vistasRouter from './routes/vistasRouter.js';
import { Server } from 'socket.io';

const app = express();
const PORT = 8080;
let io;

const server = app.listen(PORT, () => {
    console.log(`Server up en puerto ${PORT} con Express`);
});

io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use('/', (req, res, next) => {
        req.io=io;
        next();
    },
    vistasRouter);

app.use('/api/products', (req, res, next) => {
        req.io = io;
        next();
    }, 
    productRouter);

app.use('/api/carts', (req, res, next) => {
        req.io = io;
        next();
    },
    cartRouter);