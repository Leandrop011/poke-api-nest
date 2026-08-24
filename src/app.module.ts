import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

// ! SECTION ENV DOCKER AND DEPLOYMENT

@Module({
  imports: [

    // ? servir contenido estatico(pagina web)
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname, '..', 'public'),
    }),
    
    // ? conexion a la base de datos de mongo
    MongooseModule.forRoot(`${process.env.MONGODBCONNECTION}`),

    PokemonModule,

    CommonModule,

    SeedModule,

  ],
})
export class AppModule {}
