import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SurveyModule } from './survey/survey.module';
import { UserSurveyModule } from './user-survey/user-survey.module';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.ENV_MONGO_URL,
    ),
    UserModule,
    AuthModule,
    CategoryModule,
    SurveyModule,
    UserSurveyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
