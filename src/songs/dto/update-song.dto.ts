import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Artist } from 'src/artists/artist.entity';

export class UpdateSongDTO {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsArray()
  // @IsString({ each: true })
  @IsNumber({}, { each: true })
  readonly artists: Artist[];

  @IsOptional()
  @IsDateString()
  readonly releasedDate: Date;

  @IsOptional()
  @IsMilitaryTime()
  readonly duration: Date;

  @IsOptional()
  @IsString()
  readonly lyrics: string;
}
