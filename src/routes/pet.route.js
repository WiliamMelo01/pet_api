import { Router } from "express";
import pet from "../model/pet.model.js";

import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';

Router

const petRouter = Router();

petRouter.get('/pets', async (req, res) => {

    try {
        const pets = await pet.findAll();
        res.status(StatusCodes.OK).json(pets);

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }

});

petRouter.get('/pets/:id', async (req, res) => {
    try {

        const { id } = req.params;

        if (id.match('^[0-9]{1,}$')) {
            const result = await pet.findByPk(id);

            res.status(StatusCodes.OK).json(result);
        } else {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'ID not available' })
        }

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

petRouter.post('/pets', async (req, res) => {
    try {

        const { name, gender, age, location, about } = req.body;

        if (name && gender && age && location && about) {

            const result = await pet.create({
                name, age, gender, location, about
            });

            res.status(StatusCodes.OK).json(result);

        } else {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'Missing parameters.' });
        }

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

petRouter.delete('/pets/:id', async (req, res) => {
    try {

        const { id } = req.params;

        if (id.match('^[0-9]{1,}$')) {

            await pet.destroy({ where: { id: id } }).then(rows => {
                res.status(StatusCodes.OK).send({ rows_deleted: rows });
            }).catch(err => {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
            });

        } else {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'ID not available' });
        }

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

petRouter.put('/pets/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { name, age, gender, location, about } = req.body;

        if (id.match('^[0-9]{1,}$')) {

            if (name && age && gender && location && about) {

                const newPet = { name, age, gender, location, about }

                await pet.update(newPet, { where: { id: id } }).then(rows => {
                    res.status(StatusCodes.OK).send({ rows_updated: rows['0'] });
                }).catch(err => {
                    console.log(err);
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
                });

            } else {
                res.status(StatusCodes.BAD_REQUEST).send({ error: 'Missing parameters' });
            }

        } else {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'ID not available' });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
});

export default petRouter;