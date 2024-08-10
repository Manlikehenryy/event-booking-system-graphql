import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import mongoose from "mongoose";
import schema from "./graphql/schema/index.js";
import resolvers from "./graphql/resolvers/index.js";
import isAuth from "./middleware/is-auth.js";

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(isAuth)

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("connected to DB");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
