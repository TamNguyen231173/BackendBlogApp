import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";

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

  @prop({ required: true })
  user_id: string;
}

const commentModel = getModelForClass(Comment);
export default commentModel;
