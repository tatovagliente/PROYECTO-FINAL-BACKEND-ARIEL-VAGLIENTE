export const procesaErrores=(res, error)=>{
    console.log(error);
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`${error.message}`
        }
    )
}

export const validateNumericId = (req, res, next) => {
    const idParams = Object.values(req.params);

    for (const id of idParams) {
        if (isNaN(Number(id))) {
            return res.status(400).send(`El ID '${id}' debe ser un número.`);
        }
    }

    next();
};