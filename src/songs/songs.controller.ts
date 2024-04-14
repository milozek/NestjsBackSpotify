import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Param,
  Inject,
  Scope,
  Query,
  DefaultValuePipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song } from './songs.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/jwt-guard/artists-jwt-guard';

@Controller({ path: 'songs', scope: Scope.REQUEST })
export class SongsController {
  constructor(
    private songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(`Connection string: ${this.connection.CONNECTION_STRING}`);
  }

  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Request() req): Promise<Song> {
    console.log('req.user: ', req.user);
    return this.songsService.create(createSongDTO);
  }
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    try {
      return this.songsService.paginate({
        page,
        limit,
      });
    } catch (e) {
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  // findAll(): Promise<Song[]> {
  //   try {
  //     return this.songsService.findAll();
  //   } catch (error) {
  //     throw new HttpException(
  //       'Server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       { cause: error },
  //     );
  //   }
  // }

  @Get(':id')
  findOne(
    // @Param('id', ParseIntPipe) // option 1
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songsService.put(id, updateSongDTO);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
}
