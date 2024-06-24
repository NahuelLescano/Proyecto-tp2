import express from "express";
import { loginAdmin } from "../data/Admin.js";

const router = express.Router();


router.post("/loginAdmin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginAdmin(email, password);
    if (token instanceof Error) {
      return res.status(401).send(result.message);
    }
    res.send({ token });
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
