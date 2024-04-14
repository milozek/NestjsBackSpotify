import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlists.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/users.entity';
import { CreatePlaylistDTO } from './dto/create-playlist-dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
    @InjectRepository(Song) private songsRepository: Repository<Song>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(playlistDTO: CreatePlaylistDTO): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = playlistDTO.name;

    const songs = await this.songsRepository.findBy(playlistDTO.songs);
    playlist.songs = songs;

    const user = await this.usersRepository.findOneBy({ id: playlistDTO.user });
    playlist.user = user;

    return this.playlistsRepository.save(playlist);
  }
}
