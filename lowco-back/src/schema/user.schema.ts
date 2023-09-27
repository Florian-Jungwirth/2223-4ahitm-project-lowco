import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: 0, required: true })
  isAdmin: number

  @Prop({ required: true })
  password: string;

  @Prop({required: true, default: 1})
  metrisch: number;

  @Prop({required: false, default: []})
  quicks: Array<any>
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
