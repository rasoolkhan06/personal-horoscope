import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/users.schema.js';
import { ZodiacSign } from '../common/enums/zodiac-sign.enum.js';

export type IHoroscope = Horoscope & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Horoscope {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true, default: () => new Date().setHours(0, 0, 0, 0) })
  date: Date;

  @Prop({ 
    type: String, 
    required: true, 
    enum: Object.values(ZodiacSign),
    index: true 
  })
  zodiacSign: ZodiacSign;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String })
  mood: string;

  @Prop({ type: Number, min: 1, max: 10 })
  compatibility: number;

  @Prop({ type: String })
  luckyNumber: string;

  @Prop({ type: String })
  luckyTime: string;

  @Prop({ type: String })
  luckyColor: string;

  // Virtual for user
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
  })
  user: User;
}

export const HoroscopeSchema = SchemaFactory.createForClass(Horoscope);

// Compound index to ensure only one horoscope per user per day
HoroscopeSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for querying horoscopes by zodiac sign and date
HoroscopeSchema.index({ zodiacSign: 1, date: 1 });