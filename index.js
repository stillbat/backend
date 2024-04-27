const { createMongoEndpoints, client } = require("./mongodb");
const express = require("express");
const { extractdatafromtwelvedata } = require("./stockexample");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const fs = require("fs");

const port = 1000;
const myServer = express();
const usersJson = require("./users.json");

const JWT_SECRET = "blablabla-secret";
myServer.use(express.json());
myServer.use(cors());

myServer.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json("no email or password");
    return;
  }
  await client.connect();
  const user = await client
    .db("users")
    .collection("users100")
    .findOne({ email });
  console.log(email);
  if (user) {
    const isMatching = await bcrypt.compare(password, user.password);
    if (isMatching) {
      const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1h",
      });
      res.json(token);
      return;
      f;
    } else {
      res.status(401).json("password does not match");
    }
    return;
  } else {
    res.status(401).json("user does not exist");
    return;
  }
});

myServer.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json("email or password required");
    return;
  }
  await client.connect();
  const user = await client
    .db("users")
    .collection("users100")
    .findOne({ email });
  console.log(email);
  if (user) {
    res.status(401).json("user already exists");
    return;
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userdata = { email: email, password: hashedPassword };
    const untillcollection = await client.db("users").collection("users100");
    const specificdata = await untillcollection.insertOne(userdata);
    const token = jwt.sign(
      { id: specificdata.insertedId.toString() },
      JWT_SECRET,
      { algorithm: "HS256", expiresIn: "1h" }
    );
    res.json(token);
    return;
  }
});

myServer.use(
  expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
  })
);

createMongoEndpoints(myServer);
extractdatafromtwelvedata(myServer);

myServer.get("/", (request, response) => {
  response.send(
    "Hello tanaihan manaihan nemsen tegvel garch irhel yostoidooo!"
  );
});

myServer.get("/users", (request, response) => {
  response.json(usersJson);
});

myServer.get("/users/:id", (request, response) => {
  const userID = request.params.id;
  const found = usersJson.find((user) => user.id == userID);
  if (found) {
    response.json(found);
  } else {
    response.send("User not found");
  }
});

myServer.post("/users/create", (request, response) => {
  const body = request.body;
  const { name } = body;
  usersJson.push({
    id: String(Number(usersJson[usersJson.length - 1].id) + 1),
    name: name,
  });
  fs.writeFileSync("./users.json", JSON.stringify(usersJson));
  response.send(usersJson);
});

myServer.put("/users/:id", (request, response) => {
  const body = request.body;
  const { name } = body;
  response.send("Called put " + name);
});

myServer.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const rest = usersJson.filter((value) => value.id !== userId);
  fs.writeFileSync("./users.json", JSON.stringify(rest));
  res.send(rest);
});

myServer.get("/Tokenavah", (req, res) => {
  const token = jwt.sign({ name: "anynameiamgiving" }, JWT_SECRET, {
    algorithm: "HS256",
  });
  res.json({ token: token });
});

myServer.post("/Tokenoouguu", (req, res) => {
  const { token } = req.body;
  const Tokenharah = jwt.verify(token, JWT_SECRET, { algorithm: "HS256" });
  res.json(Tokenharah);
});

myServer.get(
  "/protected",
  expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
  }),
  (req, res) => {
    res.json(req.auth);
  }
);

myServer.listen(port, () => {
  console.log("My server running!");
});
