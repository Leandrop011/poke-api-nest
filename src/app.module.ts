import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ // ? servir contenido estatico(pagina web)
      rootPath: join(__dirname, '..', 'public'),
    }),

    // ? conexion a la base de datos de mongo
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {}
