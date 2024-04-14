import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlists/playlists.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Jane',
    description: 'First name of the user',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Joohwald',
    description: 'Last name of the user',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'janejw@mail.com',
    description: 'Email of the user',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '12345abcde',
    description: 'Password of the user',
  })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    example: '1150503434',
    description: 'Optional: celphone number of the user',
  })
  @Column()
  phone: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column()
  apiKey: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];
}
