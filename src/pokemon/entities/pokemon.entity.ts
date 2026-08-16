import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
// * cada instancia de Pokemon en la bd
// * seria como una tabla o un registro
// ? el document es para crear el 'registro' en la bd de mongo 
// ? el decorador es para indicar que esto es un schema de base de datos
@Schema()
export class Pokemon extends Document{
    @Prop({ //? reglas de base de datos para que sea unico el name y tenga indices
        unique: true,
        index: true,
    })
    public name!: string;

    @Prop({
        unique: true,
        index: true,
    })
    public numPokemon!: number;
}

// ? creamos la coleccion en la BD ( crear, aun no conectarla eso es en el module )
export const PokemonSchema = SchemaFactory.createForClass( Pokemon );

