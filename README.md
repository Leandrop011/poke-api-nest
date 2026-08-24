<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## POKE-API-NEST
PokeApiNest es una API REST de Pokémon simple, construida con NestJS, Mongoose y MongoDB dockerizado. Ofrece un CRUD completo de pokemons con búsqueda flexible por número, nombre o mongoid, validación de datos mediante DTOs y un seed para test.

# Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar
```
yarn install
yarn
```

3. Tener Nest CLI instalado
```
npm i -g @nest/cli
```

4. Levantar la base de datos
```
docker compose up -d
```

5. Levantar el proyecto
```
yarn start:dev
```

6. Cargar de data a la BD
```
http://localhost:3000/api/v1/seed/
```

## Stack usado
* MongoDB
* Nest

