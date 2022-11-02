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

        if (!id.match('^[0-9]{1,}$')) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'ID not available' });
            return;
        }
        const result = await pet.findByPk(id);

        if (result === null) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Not Found' });
            return;
        }

        res.status(StatusCodes.OK).json(result);

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

petRouter.post('/pets', async (req, res) => {
    try {

        const { name, gender, age, location, about } = req.body;

        if (!name || !gender || !age || !location || !about) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'Missing parameters.' });
            return;
        }

        const result = await pet.create({
            name, age, gender, location, about
        });

        res.status(StatusCodes.OK).json(result);

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

petRouter.delete('/pets/:id', async (req, res) => {
    try {

        const { id } = req.params;

        if (!id.match('^[0-9]{1,}$')) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'ID not available' });
            return;
        }

        const petToDelete = await pet.findByPk(id);

        if (petToDelete === null) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Not Found' });
            return;
        }

        await pet.destroy({ where: { id: id } })
            .then(rows => {
                res.status(StatusCodes.OK).send({ rows_deleted: rows });
            })
            .catch(err => {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
            });

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});

petRouter.put('/pets/:id', async (req, res) => {
    try {
        const { id } = req.params;

        let { name, age, gender, location, about } = req.body;

        if (!id.match('^[0-9]{1,}$')) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'ID not available' });
            return;
        }

        if (!name && !age && !gender && !location && !about) {
            res.status(StatusCodes.BAD_REQUEST).send({ error: 'Wrong parameters' });
            return;
        }

        const oldPet = await pet.findByPk(id);

        if (oldPet === null) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Not Found' });
            return;
        }

        if (!name) {
            name = oldPet.name;
        }
        if (!age) {
            age = oldPet.age;
        }
        if (!gender) {
            gender = oldPet.gender;
        }
        if (!location) {
            location = oldPet.location;
        } if (!about) {
            about = oldPet.about;
        }

        const newPet = { name, age, gender, location, about }

        await pet.update(newPet, { where: { id: id } })
            .then(rows => {
                res.status(StatusCodes.OK).send({ rows_updated: rows['0'] });
            })
            .catch(err => {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
            });

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
});

export default petRouter;