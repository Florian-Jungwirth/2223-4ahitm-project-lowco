import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from './category.schema';

  const Measurements = {
    Distanz: {
      name: 'd',
      units: {
        metrisch: {
          m: 1,
          km: 1000
        },
        imperial: {
          mi: 1609.344,
          ft: 0.3048
        }
      }
    },
    Anzahl: {
      name: 'a'
    },
    Zeit: {
      name: 'z',
      units: {
        h: 3600,
        min: 60,
        s: 1
      }
    }
  }

enum Types {
  Einfach = 'e',
  Anzahl = 'a'
}

@Schema()
export class Survey {
  @Prop({ required: true })
  iconName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  measurement: string;

  @Prop({ required: true })
  standardValue: number;

  @Prop({ required: true })
  type: Types

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true })
  category: Category

  @Prop({ default: 1, required: false })
  activated: 1
}

export { Measurements, Types }
export type SurveyDocument = Survey & Document;
export const SurveySchema = SchemaFactory.createForClass(Survey);
