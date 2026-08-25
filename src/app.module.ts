import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [

    // ? uso de environments (su importacion debe ser colocada antes de su uso)
    ConfigModule.forRoot({
      // * carga de una funcion que maneja las envs
      load: [ EnvConfiguration ], 
      // * validation schema adicional para la validacion de las envs
      // * pueden trabajar el load y el schema ambos a la vez, ambos son para 
      // * validar que el user inicialice las envs correctamente
      validationSchema: JoiValidationSchema,  
    }),

    ServeStaticModule.forRoot({ // ? servir contenido estatico(pagina web)
      rootPath: join(__dirname, '..', 'public'),
    }),

    // ? conexion a la base de datos de mongo usando la funcion que maneja las envs 
    MongooseModule.forRoot(process.env.MONGODBCONNECTION!, {
      dbName: 'pokeBdOn' // ? nombre de la bd
    }),

    PokemonModule,

    CommonModule,

    SeedModule,

  ],
})
export class AppModule {}
