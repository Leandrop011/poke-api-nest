import { Injectable } from '@nestjs/common';
import { PokemonService } from '../pokemon/pokemon.service';
import { POKEMONS_SEED_DATA } from './data/pokemons.seed';

@Injectable()
export class SeedService {

  // ? INJECCION DE EL SERVICE DE POKEMON EN LA SEED
  constructor(
    private readonly pokemonService: PokemonService,
  ){}

  // ! METODO QUE CARGA DE DATA EN LA BD
  public populateDB() {
    
    // ? creamos nuevos registros en la BD segun la data de la SEED
    POKEMONS_SEED_DATA.map( (pokemon) => this.pokemonService.create(pokemon) );
    
    return `SEED EXECUTED.`;
  }
}
