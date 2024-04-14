import { Song } from 'src/songs/songs.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.playlists)
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
}
