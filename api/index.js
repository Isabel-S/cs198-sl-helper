/* API Index
 *
 * Connects to the MongoDB Database and handles API routes to return 
 * JSON data (usually manipulated from MongoDB data).
*/

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

let DATABASE_NAME = "cs193x_project";
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";

/* Use Express middleware */
const api = express.Router();

let conn = null;
let db = null;
let Teach = null;
let Grade = null;

const initApi = async app => {
  app.set("json spaces", 2);
  app.use("/api", api);

  /* Initialize database connection */
  conn = await MongoClient.connect(MONGODB_URL)
  db = conn.db(DATABASE_NAME);

  /* Get database collections for Teach and Grade cards */
  Teach = db.collection("teach");
  Grade = db.collection("grade");
};

/* Set data limit to 500mb (for file uploads) */
api.use(bodyParser.json({ limit: "500mb" }));

/* CORS: Allow for secure cross-origin requests and data  
 * transfers between browsers and servers 
*/
api.use(cors());

/* Test endpoint: "/" should return "Hello, world!"" */
api.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

/* ENDPOINTS */

/* TEACH ENDPOINTS */
/* Adds teach card */
api.post("/teach", async (req, res) => {
  console.log(req.body.week);

  /* Checks if the week is a number */
  if (!/^\d+$/.test(req.body.week)){
    res.status(400).json({ error: `${req.body.week} is not a number` });
    return;
  }

  /* Checks if the link is valid */
  if (req.body.links != ""){
    for (const link of req.body.links){
      let urlTest = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      if (!urlTest.test(link)){
        res.status(400).json({ error: `${link} is not a valid link` });
        return;
      }
    }
  }

  Teach.insertOne(req.body);
  res.status(200).json({ success: `true` });
  return;
});

/* Sorts elements in reverse chronological order (newest)*/
function compareWeeks(a, b) {
  if ( a.week > b.week ){
    return -1;
  }
  return 0;
}

/* Returns an array of teach cards */
api.get("/teach/cards", async (req, res) => {
  let teachCards = await Teach.find().toArray();

  teachCards.sort(compareWeeks) // sort cards from latest week

  res.json({teachCards});
});

/* Deletes teachCard from mongoDb _id */
api.delete("/teach/:id", async (req, res) => {
  Teach.deleteOne({"_id": ObjectId(req.params.id)});
  res.status(200).json({ success: `true` });
  return;
});

/* GRADE ENDPOINTS */
/* Adds grade card */
api.post("/grade", async (req, res) => {
  console.log(req.body.assign);

  /* Checks if assignment number is a number */
  if (!/^\d+$/.test(req.body.assign)){
    res.status(400).json({ error: `${req.body.assign} is not a number` });
    return;
  }

  Grade.insertOne(req.body);
  res.status(200).json({ success: `true` });
  return;
});

function compareAssign(a, b) {
  if ( a.assign > b.assign ){
    return -1;
  }
  return 0;
}

/* Return an array of grade cards */
api.get("/grade/cards", async (req, res) => {
  let gradeCards = await Grade.find().toArray();
  gradeCards.sort(compareAssign) // sort cards from latest week
  res.json({gradeCards});
});

/* Deletes gradeCard from mongoDb _id */
api.delete("/grade/:id", async (req, res) => {
  Grade.deleteOne({"_id": ObjectId(req.params.id)});
  res.status(200).json({ success: `true` });
  return;
});

/* Return an array of assignment numbers */
api.get("/grade/assignments", async (req, res) => {
  let gradeAll = await Grade.find().toArray();

  let assignments = [];
  for (let gradeCard of gradeAll) {
    if (!assignments.includes(gradeCard.assign)){
      assignments.push(gradeCard.assign);
    }
  }

  res.json({ assignments });
});

/* Return an array of grade cards with that assignment number */
api.get("/grade/:num", async (req, res) => {
  let num = req.params.num;
  let gradeCards = await Grade.find({assign: num}).toArray();
  res.json({gradeCards});
});

export default initApi;
