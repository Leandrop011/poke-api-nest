import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // * Para que los dtos decorados decoradores del classvalidator
      // ? whitelist quite todo lo que manda el user y no este especificado en el dto 
      whitelist: true,
      // ? forbid para que mande error si no hay las properties esperadas
      forbidNonWhitelisted: true,
      // * Para que realice la transformacion de la data que se recive(queryparams, body)
      // * transformarla hacia lo que requiere el dto que se requiere llenar
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  )

  // ? lo que realiza esto es que todos los endpoint deben iniciar con /api/v1/... para 
  // ? su funcionamiento
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
