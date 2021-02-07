const express = require('express');
const contacts = express.Router();
const db = require('../config/database');

contacts.post("/", async(req, res, next) => {
    const { subjectContact, emailContact, messageContact } = req.body;

    if (subjectContact && emailContact && messageContact) {
        const query = `SELECT * FROM Users WHERE email = '${emailContact}';`;
        const rows = await db.query(query);

        if (rows.length == 1) {
            const idUser = rows[0].idUser;
            let query = "INSERT INTO contacts (subjectContact, emailContact, messageContact, idUser)";
            query += `VALUES ('${subjectContact}', '${emailContact}', '${messageContact}', '${idUser}');`;
            const rowsInsert = await db.query(query);

            if (rowsInsert.affectedRows == 1) {
                return res.status(201).json({ code: 201, message: "Correo enviado correctamente" });
            }
        } else {
            return res.status(200).json({ code: 500, message: "El correo no ha sido encontrado, utiliza el correo registrado en la plataforma" });
        }

        return res.status(200).json({ code: 500, message: "La solicitud no se pudo realizar, intentalo más tarde" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

contacts.delete("/:id([0-9]{1,3})", async(req, res, next) => {
    const query = `DELETE FROM contacts WHERE idContact =${req.params.id}`;

    const rows = await db.query(query);

    if (rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Correo Eliminado Correctamente" });
    }

    return res.status(200).send({ code: 404, message: "El correo no ha sido encontrado" });
});

contacts.put("/:id([0-9]{1,3})", async(req, res, next) => {
    const { subjectContact, emailContact, messageContact } = req.body;

    if (subjectContact && emailContact && messageContact) {
        let query = `UPDATE contacts SET subjectContact = CASE WHEN '${subjectContact}' != '' THEN '${subjectContact}' ELSE subjectContact END,
                            emailContact= CASE WHEN '${emailContact}' != '' THEN '${emailContact}' ELSE emailContact END,`;
        query += `messageContact= CASE WHEN '${messageContact}' != '' THEN '${messageContact}' ELSE messageContact END
                WHERE idUser = ${req.params.id}`;

        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Contacto Actualizado correctamente" });
        }

        return res.status(200).json({ code: 500, message: "Contacto no Actualizado" });
    }

    return res.status(200).json({ code: 500, message: "Campos incompletos" });
});

contacts.get("/", async(req, res, next) => {
    const pkmn = await db.query("SELECT * FROM contacts");
    return res.status(200).json({ code: 200, message: pkmn });
});

contacts.get('/:id([0-9]{1,3})', async(req, res, next) => {
    const id = req.params.id;

    if (id >= 1 && id <= 722) {
        const pkmn = await db.query("SELECT * FROM contacts WHERE idContact =" + id);
        return res.status(200).json({ code: 200, message: pkmn });
    }

    return res.status(404).send({ code: 404, message: "El Correo no ha sido encontrado" });

});

contacts.get('/:emailContact([A-Za-z]+)', async(req, res, next) => {
    const emailContact = req.params.emailContact;
    const pkmn = await db.query("SELECT * FROM contacts WHERE emailContact LIKE '" + '%' + emailContact + '%' + "'");

    try {
        if (pkmn.length > 0) {
            return res.status(200).json({ code: 1, message: pkmn });
        }
        return res.status(200).send({ code: 404, message: "El Contacto no ha sido encontrado" });
    } catch (error) {
        console.log(error);
    }
});

module.exports = contacts;