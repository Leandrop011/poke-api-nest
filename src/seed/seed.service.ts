import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { PokeToDbInterface } from './interfaces/poke-to-db.interface';
import { AxiosAdapter } from '../common/adapter/axios.adapter';

// ! SERVICIO QUE TENDRA EL METODO DE CARGA DE DATA( SE CARGARA DATA PROVENIENTE DE LA API POKEAPI )
@Injectable()
export class SeedService {

  // ? INJECCION DEL MODEL DE POKEMON EN LA SEED
  constructor(
    // * model 
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    // * adaptador de paquete de peticiones http
    private readonly http: AxiosAdapter,
  ){}

  // ! METODO QUE CARGA DE DATA EN LA BD
  async populateDB() {

    // ? elimina todos los registros que exista en la BD para agregar nuevos
    await this.pokemonModel.deleteMany({}) // ! ===> Delete * from Pokemons 

    // ? REALIZAMOS UNA PETICION HTTP A POKEAPI Y QUE NOS DEVUELVA 100 REGISTROS(SOLO DESEAMOS LA DATA)
    // ? PARA TIPEAR LA DATA USAMOS UNA INTERFAZ O NUESTRA ENTIDAD PARA ACOPLARNOS A NUESTRAS REGLAS DE NEGOCIO. 
    const respToRequest = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');

    // * se creo un array de objetos que lucen como un registro de Pokemon
    // ? se la usara para crear un array de pokemons y luego insertar todos en una sola
    // ? instruccion (query)
    let pokemonToInsert: PokeToDbInterface[] = [];

    // ? DE LA DATA ITERAMOS CADA ELEMENTO PARA INSERTAR EN LA BD
    respToRequest.results.forEach(({name, url}) => {
      // * para obtener el numPokemon cortamos el penultimo digito en la 
      // * url de la imagen 
      const segments = url.split('/');
      // * obtenemos el numpokemon (el penultimo digito del arreglo)
      const numPokemon: number = +segments[segments.length - 2];
      
      // * llenamos el array de todos los pokemons
      pokemonToInsert.push({name, numPokemon});

    })

    // ! INSERTAMOS LOS REGISTROS EN UNA SOLA QUERY A LA BD
    // * y cuando ya termino el metodo y de iterar ejecutamos un await para una 
    // * sola ejecucion del metodo insertmany, para la insercion de multiples registros
    // ? y esto es mas optimo a realizar multiples consultas a la BD, solo realizamos una 
    // ? insertando todo el array
    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return `SEED EXECUTED`;
  }
}
