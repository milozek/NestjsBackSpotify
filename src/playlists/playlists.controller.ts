import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDTO } from './dto/create-playlist-dto';
import { Playlist } from './playlists.entity';

@Controller('playlists')
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
