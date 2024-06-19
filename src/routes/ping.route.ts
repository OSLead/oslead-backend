import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();

// check connection to server
const devQuotes = [
  "We called ourselves developers only because of some open source nerds, who taught us how to code.",
  "Hacking is cool but protecting someone from hacking is cooler.",
  "Let's be the geeks of great products.",
  "Messy codes are illegal.",
  "Haa..Ha I am writing this instead of writing code.",
];
router.get("/", (req: Request, res: Response) => {
  const randomQuote = devQuotes[Math.floor(Math.random() * devQuotes.length)];
  res.status(200).send(`<h1><i>${randomQuote} ~Team OSLead<i></h1>`);
});

// check connection to server
router.get("/ping", (req: Request, res: Response) => {
  res.status(200).send({
    message: "pong",
    status: 200,
    success: true,
    timestamp: new Date(),
  });
});

// check connection to database
router.get("/ping/database", (req: Request, res: Response) => {
  const db = mongoose.connection.readyState;
  if (db === 1) {
    res.status(200).send({
      message: "connected",
      status: 200,
      success: true,
      timestamp: new Date(),
    });
  } else {
    res.status(500).send({
      message: "not connected",
      status: 500,
      success: false,
      timestamp: new Date(),
    });
  }
});
export default router;
