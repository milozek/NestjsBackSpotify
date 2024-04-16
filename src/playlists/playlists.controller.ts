import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDTO } from './dto/create-playlist.dto';
import { Playlist } from './playlists.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlists')
@ApiTags('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlaylistDTO,
  ): Promise<Playlist> {
    return this.playlistsService.create(playlistDTO);
  }
}
