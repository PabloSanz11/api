const express = require('express');
const validaciones = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');

validaciones.post("/register", async(req, res, next) => {
    const { name, lastName, gender, state, email, password, grade, progress } = req.body;

    if (name && lastName && gender && state && email && password && grade && progress) {
        let query = "INSERT INTO Users (name, lastName, gender, state, email, password, grade, progress)";
        query += `VALUES ('${name}', '${lastName}', '${gender}', '${state}', '${email}', '${password}', '${grade}', ${progress} );`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Usuario registrado correctamente" });
        }

        return res.status(500).json({ code: 500, message: "El Usuario no ha sido registrado" });
    }

    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

validaciones.post("/login", async(req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
        const query = `SELECT * FROM Users WHERE email = '${email}' AND password = '${password}';`;
        const rows = await db.query(query);

        if (rows.length == 1) {
            const token = jwt.sign({
                idUser: rows[0].idUser,
                email: rows[0].email
            }, "debugkey");

            return res.status(200).json({ code: 200, message: token });
        } else {
            return res.status(201).json({ code: 401, message: "Usuario y/o Contraseña incorrectos" });
        }
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

validaciones.post("/register-manager", async(req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
        let query = "INSERT INTO Managers (email, password)";
        query += `VALUES ('${email}', '${password}');`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Administrador registrado correctamente" });
        }

        return res.status(500).json({ code: 500, message: "El Administrador no ha sido registrado" });
    }

    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

validaciones.post("/login-manager", async(req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
        const query = `SELECT * FROM managers WHERE email = '${email}' AND password = '${password}';`;
        const rows = await db.query(query);

        if (rows.length == 1) {
            const token = jwt.sign({
                idManager: rows[0].idManager,
                email: rows[0].email
            }, "debugkey");

            return res.status(200).json({ code: 200, message: token });
        } else {
            return res.status(201).json({ code: 401, message: "Correo y/o Contraseña incorrectos" });
        }
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

module.exports = validaciones;