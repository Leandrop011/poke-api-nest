import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    public readonly numPokemon!: number;
    
    @IsString()
    @MinLength(1)
    public name!: string;

}
