import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import pet from './model/pet.model.js';

//ROUTES
import petRouter from './routes/pet.route.js';

(async () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const result = await pet.sync();
    console.log(result);

    app.use(petRouter);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {

        console.log("Server rodadando na porta " + port);

    });

})()
