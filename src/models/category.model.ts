import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";

@index({ name: 1 })
@pre<Category>("save", function (next) {
  this.id = this._id;
  next();
})
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Category {
  @prop()
  id: string;

  @prop({ required: true })
  image: string;

  @prop({ unique: true, required: true })
  name: string;
}

const categoryModel = getModelForClass(Category);
export default categoryModel;
