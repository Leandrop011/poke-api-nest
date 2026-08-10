import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
// ! PIPE PERSONALIZADO, SON UN PROVIDER LOS PIPESCUSTOM
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    
    // ? usamos el metodo de mongoose para saber si no es un mongoid
    if( !isValidObjectId(value) )
      throw new BadRequestException(`${ value } is not a valid MongoID`)
    
    return value;
  }

}
