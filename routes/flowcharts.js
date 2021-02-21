const express = require('express');
const flowchart = express.Router();
const db = require('../config/database');

flowchart.put("/", async(req, res, next) => {
    const { email, progress } = req.body;

    if (email && progress) {
        let query = `UPDATE users SET progress = '${progress}' WHERE email = '${email}';`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Progreso actualizado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "El progreso no ha sido registrado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

module.exports = flowchart;