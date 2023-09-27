import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SurveyModule } from './survey/survey.module';
import { UserSurveyModule } from './user-survey/user-survey.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://lowCo2:lowcopass@cluster0.npdyv5h.mongodb.net/?retryWrites=true&w=majority',
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
