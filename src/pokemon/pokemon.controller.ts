import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto, // ? obtener los queryparameters que coloca el user
  ) {
    return this.pokemonService.findAll( paginationDto );
  }
  
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Post()
  create(
    @Body() createPokemonDto: CreatePokemonDto
  ) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Patch(':term')
  update(
    @Param('term') term: string, 
    @Body() updatePokemonDto: UpdatePokemonDto
  ) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  // ? utilizamos un pipe personalizado para verificar que siempre sea un mongoid el que se recibe
  // ? lo valida y lo devuelve para el uso en el servicio
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
