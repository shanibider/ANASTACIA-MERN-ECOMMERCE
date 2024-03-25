// import Mongoose library, Object Data Modeling (ODM) library for MongoDB and Node.js that provides a higher-level, schema-based abstraction over MongoDB.
import mongoose from 'mongoose';

// Defining the User Schema- sets up a Mongoose schema and model for a user.
// mongoose.Schema constructor define the structure of the user document in MongoDB collection.
// Each field specified with its data type (String, Boolean) and optional properties such as required and unique.

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,     //  option automatically adds createdAt and updatedAt fields to the document, tracking when it was created and last updated.
  }
);

// The mongoose.model function creates a Mongoose model based on the defined schema.
// The first argument is the name of the model, second argument is the schema that defines the structure of the documents.
const User = mongoose.model('User', userSchema);

export default User;