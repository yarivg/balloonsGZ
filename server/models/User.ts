import {mongoose} from "../dal/connection";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  facebook_id: String,
  phone_number: String,
  user_support_images: [{
    image: String,
    lat: Number,
    lng: Number,
  }],
});
const User = mongoose.model("users", userSchema);

export {
  userSchema,
  User,
};
