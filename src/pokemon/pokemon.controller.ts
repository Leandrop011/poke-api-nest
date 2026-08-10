import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll() {
    return this.pokemonService.findAll();
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
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
