import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Category {
  @Prop({ required: true })
  iconName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 1, required: false })
  activated: 1
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
