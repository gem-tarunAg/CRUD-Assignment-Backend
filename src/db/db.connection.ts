import mongoose from "mongoose";

export const connectDB = async () => {
  const uri: any = process.env.MONGO_URI;
  //   console.log(uri);

  try {
    await mongoose
      .connect(uri)
      .then(() => console.log(`MongoDB Connected`))
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
