import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

@index({ email: 1 })
@pre<User>("save", async function () {
  // Hash password if the password is new or was updated
  if (!this.isModified("password")) return;

  // Hash password with costFactor of 12
  this.password = await bcrypt.hash(this.password, 12);
})
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})

// Export the User class to be used as TypeScript type
export class User {
  @prop()
  name: string;

  @prop({ unique: true, required: true })
  email: string;

  @prop({ required: true, minlength: 8, maxLength: 32, select: false })
  password: string;

  @prop({ default: "https://avatarfiles.alphacoders.com/182/182133.jpg" })
  avatar: string;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: "user" })
  role: string;

  @prop()
  bookmarks: string[];

  @prop({ select: false })
  verificationCode: string | null;

  // Instance method to check if passwords match
  async comparePasswords(hashedPassword: string, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  createVerificationCode() {
    // Generate 4 digit number and convert it to string
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    this.verificationCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    return verificationCode;
  }
}

// Create the user model from the User class
const userModel = getModelForClass(User);
export default userModel;
