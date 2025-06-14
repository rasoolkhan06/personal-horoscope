import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IUser = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ 
    required: true, 
    unique: true,
    index: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, type: Date })
  birthdate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
