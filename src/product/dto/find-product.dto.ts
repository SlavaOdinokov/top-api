import { IsString } from 'class-validator';

export class FindProductDto {
  @IsString()
  category: string;

  @IsString()
  limit: string;
}
