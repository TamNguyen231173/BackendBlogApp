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
  category: { _id: string; name: string };

  @prop({ default: "https://wallpaperaccess.com/full/397922.jpg" })
  logo: string;

  @prop({
    default:
      "https://res.cloudinary.com/zenbusiness/q_auto/v1/logaster/logaster-2022-07-one-piece-symbol.png",
  })
  image: string;

  @prop()
  images: string[];

  @prop({ required: true })
  userInfo: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

const postModel = getModelForClass(Post);
export default postModel;
