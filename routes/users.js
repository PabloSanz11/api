const express = require('express');
const users = express.Router();
const db = require('../config/database');

users.post("/", async(req, res, next) => {
    const { name, lastName, gender, state, email, password, grade, progress } = req.body;

    if (name && lastName && gender && state && email && grade && progress) {
        let query = "INSERT INTO Users (name, lastName, gender, state, email, password, grade, progress)";
        query += `VALUES ('${name}', '${lastName}', '${gender}', '${state}', '${email}', '${password}', '${grade}', ${progress} );`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Usuario registrado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "El Usuario no ha sido registrado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

users.delete("/:id([0-9]{1,3})", async(req, res, next) => {
    const query = `DELETE FROM users WHERE idUser =${req.params.id}`;

    const rows = await db.query(query);

    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Usuario Eliminado Correctamente" });
    }

    return res.status(200).send({ code: 404, message: "El Usuario no ha sido encontrado" });
});

users.put("/:id([0-9]{1,3})", async(req, res, next) => {
    const { name, lastName, gender, state, email, password, grade, progress } = req.body;

    if (name && lastName && gender && state && email && password && grade && progress) {
        let query = `UPDATE users SET name='${name}', lastName='${lastName}',`;
        query += `gender='${gender}', state='${state}', email='${email}', password='${password}', grade='${grade}', progress='${progress}' WHERE idUser = ${req.params.id}`;

        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Usuario Actualizado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "Usuario NO Actualizado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

users.get("/", async(req, res, next) => {
    const pkmn = await db.query("SELECT * FROM users");
    return res.status(200).json({ code: 200, message: pkmn });
});

users.get('/:id([0-9]{1,3})', async(req, res, next) => {
    const id = req.params.id;

    if (id >= 1 && id <= 722) {
        const pkmn = await db.query("SELECT * FROM users WHERE idUser =" + id);
        return res.status(200).json({ code: 200, message: pkmn });
    }

    return res.status(404).send({ code: 404, message: "El Usuario no ha sido encontrado" });

});

users.get('/:name([A-Za-z]+)', async(req, res, next) => {
    const nombre = req.params.name;
    const pkmn = await db.query("SELECT * FROM users WHERE name LIKE '" + '%' + nombre + '%' + "'");

    try {
        if (pkmn.length > 0) {
            return res.status(200).json({ code: 1, message: pkmn });
        }
        return res.status(200).send({ code: 404, message: "El Usuario no ha sido encontrado" });
    } catch (error) {
        console.log(error);
    }
});

module.exports = users;