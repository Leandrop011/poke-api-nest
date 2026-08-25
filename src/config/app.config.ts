
// ! FUNCION QUE MANEJA NUESTRAS ENVS Y LE DA UN VALOR OPCIONAL SI NO VIENE ALGUNA DE ELLAS

export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    // ? no se le proporciona un valor opcional pq, se desea que ejecute un error especifico,
    // ? si el user no levanta la bd
    mongoDb: process.env.MONGODBCONNECTION, 
    port: process.env.PORT || 3000,
    default_limit: +process.env.DEFAULT_LIMIT! || 3,
})
