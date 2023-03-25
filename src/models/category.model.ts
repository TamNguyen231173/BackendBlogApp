import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";

@pre<Category>("save", function (next) {
  this.id = this._id;
  next();
})
@index({ category: 1 })
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Category {
  @prop()
  id: string;

  @prop({ unique: true, required: true })
  category: string;
}

const categoryModel = getModelForClass(Category);
export default categoryModel;
