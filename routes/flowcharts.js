const express = require('express');
const flowchart = express.Router();
const db = require('../config/database');

flowchart.put("/", async(req, res, next) => {
    const { email, progress } = req.body;

    if (email && progress) {
        let query = `UPDATE Users SET progress = 2 WHERE email = '${email}';`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Progreso actualizado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "El progreso no ha sido registrado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

flowchart.post("/email", async(req, res, next) => {
    const { email } = req.body;

    if (email) {
        let query = `SELECT progress FROM users WHERE email = '${email}';`;
        const pkmn = await db.query(query);

        try {
            if (pkmn.length > 0) {
                return res.status(200).json({ code: 1, message: pkmn });
            }
            return res.status(200).send({ code: 404, message: "El Correo no ha sido encontrado" });
        } catch (error) {
            console.log(error);
        }
    }
    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

module.exports = flowchart;