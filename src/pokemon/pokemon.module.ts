import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    // ? importar la entidad o schema de Pokemon, e insertamos esa entidad en mongo
    // * (agregar una nueva entidad en la base de datos)
    MongooseModule.forFeature([ 
      
      // * ENTIDAD POKEMON(AQUI SE CREA LA 'TABLA'/'SHCEMA'(NO REGISTRO, ESO ES EN EL SERVICE))
      {
        name: Pokemon.name, // ! no es la property name, es el name de la function
        schema: PokemonSchema, // ? schema pokemon
      },

    ])
  ],
  exports: [ PokemonService ], // ? solo exponemos el servicio para la seed
})
export class PokemonModule {}
