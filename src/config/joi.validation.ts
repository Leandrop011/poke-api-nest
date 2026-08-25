import * as Joi from "joi";

// ! VALIDATIONSCHEMA, VA A LUCIR CON LAS PROPIEDADES QUE SE ESPERAN 
// ! Y QUE RETORNE EL OBJETO EXACTO COMO SE ESPERA
// ? EL JOI SE ENCARGARA DE VERIFICAR QUE EN EL ENV SE INICIALICE CORRECTAMENTE LAS ENVS
// ? OBLIGAR AL USER QUE LAS INICIALICE
export const JoiValidationSchema = Joi.object({
    MONGODBCONNECTION: Joi.required(),
    PORT: Joi.number().default(3000),
    // * si no esta inicializado el env, le colocara el value de 5, en el env
    // * asi que cuando llegue al appconfig, ya tendra un value ese env
    // * pero es importante decir que el valor que coloca a la env va a ser un string(como todas las envs)
    // * entonces en el momento de su uso debe transformarse la data 
    DEFAULT_LIMIT: Joi.number().default(5),
});