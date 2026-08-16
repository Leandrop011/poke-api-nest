import { Injectable } from '@nestjs/common';
import { PokemonService } from '../pokemon/pokemon.service';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

// ! SERVICIO QUE TENDRA EL METODO DE CARGA DE DATA( SE CARGARA DATA PROVENIENTE DE LA API POKEAPI )

@Injectable()
export class SeedService {

  // ? INJECCION DE EL SERVICE DE POKEMON EN LA SEED
  constructor(
    private readonly pokemonService: PokemonService,
  ){}

  // ? CREACION DE LA INSTANCIA DE AXIOS(PAQUETE PARA REALIZAR PETICIONES HTTP)
  private readonly axios: AxiosInstance = axios;

  // ! METODO QUE CARGA DE DATA EN LA BD
  async populateDB() {
    
    // ? creamos nuevos registros en la BD segun la data de la SEED
    // POKEMONS_SEED_DATA.map( (pokemon) => this.pokemonService.create(pokemon) );

    // ? REALIZAMOS UNA PETICION HTTP A POKEAPI Y QUE NOS DEVUELVA 100 REGISTROS(SOLO DESEAMOS LA DATA)
    // ? PARA TIPEAR LA DATA USAMOS UNA INTERFAZ O NUESTRA ENTIDAD PARA ACOPLARNOS A NUESTRAS REGLAS DE NEGOCIO. 
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');

    // ? DE LA DATA ITERAMOS CADA ELEMENTO PARA INSERTAR EN LA BD
    data.results.forEach(({name, url}) => {
      // * para obtener el numPokemon cortamos el penultimo digito en la 
      // * url de la imagen 
      const segments = url.split('/');
      // * obtenemos el numpokemon (el penultimo digito del arreglo)
      const numPokemon: number = +segments[segments.length - 2];
      // * Insercion de los datos en la BD
      
    })
    
    return `SEED EXECUTED`;
  }
}
