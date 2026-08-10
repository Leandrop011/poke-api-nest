import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    // * transformar el model a un provider o service, referencial el nombre del model
    // * nos sirve para crear registros de la bd
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

  ){}
  
  // ! METODO QUE OBTENDRA TODOS LOS REGISTROS DE L bd
  async findAll() {
    return await this.pokemonModel.find().exec();
  }
  
  // ! METODO QUE ENCONTRARA UN POKEMON, SEGUN EL TERM(ID, NUMPOKEMON O NAMEPOKEMON)
  async findOne(term: string) {

    // * POKEMON QUE SE DEVOLVERA
    let pokemon: Pokemon | null = null;
    
    // * CASOS DE BUSQUEDA DEPENDIENDO LO QUE NOS MANDE EL USER(TERM)

    // * Busqueda por term
    if( !isNaN(+term) ){
      // * buscar el pokemon en la tabla numPokemon
      pokemon = await this.pokemonModel.findOne({numPokemon: +term});
    }

    // * Busqueda por MongoId
    // ? si no existe el pokemon(porque puede que en la primera condicion, como 
    // ? es un numero puede que sea por numero y no mongoid, pero si no lo encuentra pues
    // ? busca por mongoid) 
    // ? y es valido el mongoid realiza la busqueda
    if( !pokemon && isValidObjectId(term) ){
      pokemon = await this.pokemonModel.findById(term);
    }
    
    // * Busqueda por Name
    // ? en este punto no existiria el pokemon solo si, no es un numero, no existe el pokemon 
    // ? y no es un mongoid, entonces cumple que no existe y queda solo busqueda por nombre
    if (!pokemon) {
      // * se hace el tolowercase por si nos manda en mayusculas y tranformamos a lo que esta 
      // * en nuestra base de datos y el trim por si nos manda con un espacio ' '
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    // ? validacion de si existe o no al final de todo 
    if(!pokemon) 
      throw new NotFoundException(`Pokemon with id, name or numPokemon "${term}",not found`);

    return pokemon;
  }

  // ? async porque son asincronas las inserciones a la bd
  // ! METODO QUE CREA UN NUEVO REGISTRO EN LA BASE DE DATOS, SEGUN EL DTO QUE OBTENGAMOS
  async create(createPokemonDto: CreatePokemonDto) {
    
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    // * si todo sale bien
    try {
      // ? crear o insertar en la bd
      const pokemon = await this.pokemonModel.create(createPokemonDto);
  
      return pokemon;
    } catch (error: any) { // * si atrapa o detecta un error
      // ? el error code 11000 significa que al intentar insersatar ese pokemon
      // ? ya existe un registro con ese mismo name( y eso viola la clausula unique )
      this.handleExecptions(error);
    }

  }

  // ! METODO QUE ACTUALIZA UN REGISTRO SEGUN EL TERM(ID, NOMBRE, NUMPOKEMON)
  // ! SEGUN EL REGISTRO DEL POKEMON OBTENIDO ACTUALIZAREMOS ESE REGISTRO SEGUN EL DTO
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    // * Busqueda del Pokemon en la bd
    const pokemon = await this.findOne( term );
    
    // * si viene el name pues se aplica la logica correspondiente
    // ? actualizar el name con lo que viene, esto se realiza por si nos da el 
    // ? name con mayusculas 
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
      
    try {
      // ? actualizar el pokemon, con los datos que nos mande 
      // ? (el new es como un update a ese registro con los nuevos datos actualizados)
      // ? si no se lo coloca muestra el viejo registro
      await pokemon.updateOne(updatePokemonDto, {new: true});
    
      // * coloco las propiedades que tiene el pokemon( aun no actualizadas )
      // * y el sobreescribo con lo que viene en el DTO, y nos mostraria el objeto actualizado
      // * en lugar de mostrar el registro del pokemon viejo, muestra el nuevo (ESTO ES PARA LA VISUALIZACION DEL USER)
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch ( error: any ) {
      this.handleExecptions( error );
    }
  }

  // ! METODO QUE REMOVERA UN REGISTRO DE LA BASE DE DATOS SEGUN POR EL ID(ID, NAME, NUMPOKEMON)
  // ! SE BUSCARA PRIMERO EL REGISTRO DEL POKEMON(SI NO LO ENCUENTRA RETORNARA UN ERROR)
  // ! SI ENCUENTRA EL REGISTRO, LO USAREMOS CON UN METODO DE MONGOOSE PARA ELIMINARLO
  async remove(id: string) {
    // ? realizamos la busqueda y eliminacion dependiendo del 
    // ? mongoid(ya validado con un pipe personalizado), y esta implementacion de 
    // ? buscar y eliminar por el id con el metodo de mongoose, es mas optimo
    // ? que usar el metodo findOne(), porque de esta forma solo realizamos 1 sola 
    // ? consulta a la BD.
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    // ? eliminamos el registro de la BD que tenga el mismo id que recivimos del user
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    // ? obtenemos el total de eliminados (max 1 - min 0) y si es 0
    // ? pues ese id no existe en la BD y mandamos una exception
    if( deletedCount === 0 ) throw new BadRequestException(`Pokemon with id: '${id}' not found.`);

    return {status: `OK`};
  }

  // ! METODO QUE MANEJA NUESTROS ERRORES, SIEMPRE EDEVUELVE UN ERROR SI ENTRA EN EL CATCH
  private handleExecptions(error: any){
    if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException('Cant operation pokemon - Check server logs.');
  }
  
}
