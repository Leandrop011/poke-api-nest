# ! DOCKERFILE QUE LEVANTARA NUESTRA APP DE NEST
# ! EN 3 PASOS

# ! 1
# ? Install dependencies only when needed
# * IMAGEN DE NODE
FROM node:24-alpine3.24 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# ? nos movemos a /app
WORKDIR /app
# ? copiamos el package y el yarn y lo colocamos en ./
COPY package.json yarn.lock ./
# ? e instalamos las dependencias
RUN yarn install --frozen-lockfile

# ! 2
# ? Build the app with cache dependencies
# * IMAGEN DE NODE
FROM node:24-alpine3.24 AS builder
# ? nos movemos a /app
WORKDIR /app
# ? copiamos los modulos de node en nuestro ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ? y contruimos la app 
RUN yarn build


# ! 3
# ? Production image, copy all the files and run next
# * IMAGEN DE NODE
FROM node:24-alpine3.24 AS runner

# ? Set working directory
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod
# ? copiamos del builder (imagen anterior) copiamos el dist y lo movemos a ./
COPY --from=builder /app/dist ./dist

# # ? Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # ? Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

# ? ejecute el comando de yarn start
CMD [ "node","dist/main" ]