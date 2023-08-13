import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import PostsModel from "./models/Posts.js";
import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import UserModel from "./models/User.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.zciedjj.mongodb.net/isp1_trade?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(json());
app.use(cors());

app.get("/posts", async (req, res) => {
  try {
    const clothes = await PostsModel.find().populate({
      path: "user",
    });
    res.json(clothes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Неизвестная ошибка сервера" });
  }
});

app.get("/search", async (req, res) => {
  const findItems = await PostsModel.find({
    name: { $regex: req.query.value, $options: "i" },
  });
  res.json(findItems);
});

app.post("/delete-post", async (req, res) => {
  console.log(req.body.id);
  try {
    await PostsModel.deleteMany({ _id: req.body.id });
    res.json({ message: "Пост удалён" });
    console.log("Пост удалён");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Неизвестная ошибка сервера" });
  }
});

app.post("/make-post", async (req, res) => {
  try {
    const doc = new PostsModel({
      user: req.body.userId,
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
    });

    const newPost = await doc.save();

    // const user = await UserModel.findById(req.body.userId);
    // if (user) {
    //   user.orders.push(newOrder._id); // Добавляем идентификатор нового заказа в массив orders
    //   await user.save(); // Сохраняем изменения в пользователе
    //   console.log("Заказ успешно добавлен к пользователю:", user);
    // }

    res.status(200).json({ message: "Пост успешно создан" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Неизвестная ошибка сервера" });
  }
});

app.post("/auth/login", UserController.login);

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/auth/register", registerValidation, UserController.register);

app.listen(4000, (err) => {
  if (err) {
    throw Error(err);
  }
  // eslint-disable-next-line no-undef
  console.log("Сервер работает");
});
