const express = require('express');
const notices = express.Router();
const db = require('../config/database');

notices.post("/", async(req, res, next) => {
    const { titleNotice, descriptionNotice, pictureNotice, visibleNotice } = req.body;

    if (titleNotice && descriptionNotice && pictureNotice && visibleNotice) {
        let query = "INSERT INTO notices (titleNotice, descriptionNotice, pictureNotice, visibleNotice)";
        query += `VALUES ('${titleNotice}', '${descriptionNotice}', '${pictureNotice}', ${visibleNotice});`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Aviso registrado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "El Aviso no ha sido registrado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

notices.delete("/:id([0-9]{1,3})", async(req, res, next) => {
    const query = `DELETE FROM notices WHERE idNotice =${req.params.id}`;

    const rows = await db.query(query);

    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Aviso Eliminado Correctamente" });
    }

    return res.status(200).send({ code: 404, message: "El Aviso no ha sido encontrado" });
});

notices.put("/:id([0-9]{1,3})", async(req, res, next) => {
    const { titleNotice, descriptionNotice, pictureNotice, visibleNotice } = req.body;

    if (titleNotice && descriptionNotice && pictureNotice && visibleNotice) {
        let query = `UPDATE notice SET titleNotice='${titleNotice}', descriptionNotice='${descriptionNotice}',`;
        query += `pictureNotice='${pictureNotice}', visibleNotice='${visibleNotice}' WHERE idNotice = ${req.params.id}`;

        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Aviso Actualizado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "Aviso NO Actualizado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

notices.get("/", async(req, res, next) => {
    const pkmn = await db.query("SELECT * FROM notices");
    return res.status(200).json({ code: 200, message: pkmn });
});

notices.get('/:id([0-9]{1,3})', async(req, res, next) => {
    const id = req.params.id;

    if (id >= 1 && id <= 722) {
        const pkmn = await db.query("SELECT * FROM notices WHERE idNotice =" + id);
        return res.status(200).json({ code: 200, message: pkmn });
    }

    return res.status(404).send({ code: 404, message: "El Aviso no ha sido encontrado" });

});

notices.get('/:name([A-Za-z]+)', async(req, res, next) => {
    const title = req.params.name;
    const pkmn = await db.query("SELECT * FROM notices WHERE titleNotice LIKE '" + '%' + title + '%' + "'");

    try {
        if (pkmn.length > 0) {
            return res.status(200).json({ code: 1, message: pkmn });
        }
        return res.status(200).send({ code: 404, message: "El Aviso no ha sido encontrado" });
    } catch (error) {
        console.log(error);
    }
});

module.exports = notices;