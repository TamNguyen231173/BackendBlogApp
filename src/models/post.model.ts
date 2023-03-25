import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";

@pre<Post>("save", function (next) {
  this.id = this._id;
  next();
})
@index({ title: 1 })
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
export class Post {
  @prop()
  id: string;

  @prop({ unique: true, required: true })
  title: string;

  @prop({ required: true })
  content: string;

  @prop()
  category: string;

  @prop({ default: "default.png" })
  logo: string;

  @prop({ default: "default.png" })
  image: string;

  @prop()
  images: string[];

  @prop({ required: true })
  author: string;
}

const postModel = getModelForClass(Post);
export default postModel;
