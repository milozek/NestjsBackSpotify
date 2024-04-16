import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SeedsModule } from './seeds/seeds.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { typeOrmAsyncConfig } from 'db/data-source';
import { validate } from 'env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`], // '.env.development', '.env.production'
      isGlobal: true,
      load: [config],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig) /** dataSourceOptions */,
    SongsModule,
    PlaylistsModule,
    UsersModule,
    AuthModule,
    ArtistsModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// { implements NestModule
//   provide: DevConfigService,
//   useClass: DevConfigService,
// },
// {
//   provide: 'CONFIG',
//   useFactory: () => {
//     return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
//   },
// },

// constructor(/*private dataSource: DataSource*/) {
//   // console.log('dbName: ', dataSource.driver.database);
// }
// configure(/**consumer: MiddlewareConsumer*/) {
//   // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option 1
//   // consumer
//   //   .apply(LoggerMiddleware)
//   //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); // option 2

//   // consumer.apply(LoggerMiddleware).forRoutes(SongsController); // option 3
// }
