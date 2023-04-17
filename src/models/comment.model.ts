import {
  getModelForClass,
  modelOptions,
  mongoose,
  pre,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { User } from "./user.model";

@pre<Comment>("save", function (next) {
  this.id = this._id;
  next();
})
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Comment {
  @prop()
  id: string;

  @prop({ required: true })
  comment: string;

  @prop()
  likes: string[];

  @prop({ required: true, ref: "users" })
  users: mongoose.Schema.Types.ObjectId;
}

const commentModel = getModelForClass(Comment);
export default commentModel;
