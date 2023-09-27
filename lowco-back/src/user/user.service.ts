import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schema/user.schema';
import { UserDetails } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model <UserDocument>) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }
  
  _getUserDetails(user: UserDocument): UserDetails{
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      metrisch: user.metrisch,
      quicks: user.quicks
    };  
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    
    if (!user) return null;
    return this._getUserDetails(user);
  }

  async findByMail(email: string): Promise<UserDocument | null>{
    return this.userModel.findOne({email}).exec();
  }

  async create(firstname: string, lastname:string, username: string, email:string, hashedPassword: string): Promise<UserDocument>{
    const newUser = new this.userModel({
      firstname,
      lastname,
      email,
      username,
      isAdmin:0,
      metrisch: 1,
      quicks: [],
      password:hashedPassword,
    });
    return newUser.save();
  }

  async changeName(id, firstname, lastname) {
    return this.userModel.updateOne({_id: id}, {$set: {firstname: firstname, lastname: lastname}});
  }

  async changePassword(id, newPW) {
    const hashedPassword = await this.hashPassword(newPW);
    return this.userModel.updateOne({_id: id}, {$set: {password: hashedPassword}});
  }

  async changeEmail(id, newEmail) {
    return this.userModel.updateOne({_id: id}, {$set: {email: newEmail}});
  }

  async changeMetric(id, metric) {
    return this.userModel.updateOne({_id: id}, {$set: {metrisch: metric}})
  }

  async changeQuicks(id: string, quicks: any): Promise<any> {
    return this.userModel.updateOne({_id: id}, {$set: {quicks: quicks}})
  }

  async getQuicks(id: string): Promise<any> {
    return this.userModel.find({_id: id}, {_id: false, quicks: true})
  }

  findAll() {
    return this.userModel.find();
  }
}
