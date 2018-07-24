import {mongoose} from "../dal/connection";

const userSchema = new mongoose.Schema({
  _id: String,
});
const User = mongoose.model("users", userSchema);

export {
  userSchema,
  User,
};
