import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // ! METODO GET QUE EJECUTA LA SEED
  @Get()
  public runSeed(){
    return this.seedService.populateDB();
  }

}
