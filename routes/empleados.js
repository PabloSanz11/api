const express = require('express');
const empleados = express.Router();
const db = require('../config/database');

empleados.post("/", async (req, res, next) =>
{
    const {nombre, apellidos, telefono, correo, contrasena, direccion} = req.body;

    if(nombre && apellidos && telefono && correo && direccion)
    {
        let query = "INSERT INTO empleados(nombre, apellidos, telefono, correo, contrasena, direccion)";
        query += `VALUES ('${nombre}', '${apellidos}', '${telefono}', '${correo}', '${contrasena}', '${direccion}');`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1)
        {
            return res.status(201).json({code: 201, message: "Empleado registrado correctamente"});
        }

        return res.status(200).json({code: 500, message: "El empleado no ha sido registrado"});
    }

    return res.status(200).json({code: 500, message: "Campos incompletos"});
});

empleados.delete("/:id([0-9]{1,3})", async (req, res, next) =>
{
    const query = `DELETE FROM empleados WHERE idEmpleado =${req.params.id}`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1)
    {
        return res.status(200).json({code: 200, message: "Empleado Eliminado Correctamente"});
    }

    return res.status(200).send({code: 404, message: "El empleado no ha sido encontrado"});
});

empleados.put("/:id([0-9]{1,3})", async (req, res, next) =>
{
    const {nombre, apellidos, telefono, correo, contrasena, direccion} = req.body;

    if(nombre && apellidos && telefono && correo && contrasena && direccion)
    {
        let query = `UPDATE empleados SET nombre='${nombre}', apellidos='${apellidos}',`;
        query += `telefono='${telefono}', correo='${correo}', contrasena='${contrasena}', direccion='${direccion}' WHERE idEmpleado = ${req.params.id}`;
        
        const rows = await db.query(query);
        
        if(rows.affectedRows == 1)
        {
            return res.status(200).json({code: 200, message: "Empleado Actualizado correctamente"});
        }

        return res.status(200).json({code: 500, message: "Empleado NO Actualizado"});
    }

    return res.status(200).json({code: 500, message: "Campos incompletos"});
});

empleados.get("/", async (req, res, next) =>
{
    const pkmn = await db.query("SELECT * FROM empleados");
    return res.status(200).json({code: 200, message: pkmn});
});

empleados.get('/:id([0-9]{1,3})', async (req, res, next) =>
{
    const id = req.params.id;
    
    if(id >= 1 && id <= 722)
    {
       const pkmn =  await db.query("SELECT * FROM empleados WHERE idEmpleado ="+ id);
       return res.status(200).json({code: 200, message: pkmn});
    }  
    
    return res.status(404).send({code: 404, message: "El empleado no ha sido encontrado"});

});

empleados.get('/:name([A-Za-z]+)', async (req, res, next) =>
{
    const nombre = req.params.name;
    const pkmn = await db.query("SELECT * FROM empleados WHERE nombre LIKE '"+'%' + nombre + '%'+"'");

    try 
    {
        if(pkmn.length > 0)
        {
            return res.status(200).json({code: 1, message: pkmn});
        }
        return res.status(200).send({code: 404, message: "El empleado no ha sido encontrado"});
    } catch (error) {
        console.log(error);
    }
});

module.exports = empleados;