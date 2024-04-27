const { json } = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGOURL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const createMongoEndpoints = (myServer) => {
  myServer.get("/bataa_bnuu", async (req, res) => {
    await client.connect();
    const untillcollection = await client
      .db("sample_restaurants")
      .collection("neighborhoods");
    const tilldata = await untillcollection.find().toArray();
    res.json(tilldata);
  });

  myServer.get("/bataa_bnuu/:id", async (req, res) => {
    const findbyidfunction = req.params.id;
    await client.connect();
    const untillcollection = await client
      .db("sample_restaurants")
      .collection("neighborhoods");
    const specificdata = await untillcollection
      .find({ _id: new ObjectId(String(findbyidfunction)) })
      .toArray();

    res.json(specificdata);
  });

  myServer.get("/bataa_bnuu/names/:name", async (req, res) => {
    const findbynamefunction = req.params.name;
    await client.connect();
    const untillcollection = await client
      .db("sample_restaurants")
      .collection("neighborhoods");
    const specificdata = await untillcollection
      .find({ name: findbynamefunction })
      .toArray();

    res.json(specificdata);
  });

  myServer.delete("/bataa_bnuu/deletebyid/:deletename", async (req, res) => {
    const deletebynamefunction = req.params.deletename;
    await client.connect();
    const untillcollection = await client
      .db("sample_restaurants")
      .collection("neighborhoods");
    const specificdata = await untillcollection.deleteOne({
      _id: new ObjectId(String(deletebynamefunction)),
    });

    res.json(specificdata);
  });

  myServer.delete("/bataa_bnuu/deletebyname/:deletename", async (req, res) => {
    const deletebynamefunction = req.params.deletename;
    await client.connect();
    const untillcollection = await client
      .db("sample_restaurants")
      .collection("neighborhoods");
    const specificdata = await untillcollection.deleteOne({
      name: deletebynamefunction,
    });

    res.json(specificdata);
  });

  myServer.post("/bataa_bnuu/create/", async (req, res) => {
    try {
      const createfunction = req.body;
      const requiredfields = ["id", "geometry", "name"];
      const values = Object.keys(createfunction);
      const missingfields = requiredfields.filter(
        (value) => !values.includes(value)
      );

      if (missingfields.length > 0) {
        throw new Error(
          `${missingfields.join(",")} - fields are missing value`
        );
      }
      const { id, geometry, name } = createfunction;
      await client.connect();
      const untillcollection = await client
        .db("sample_restaurants")
        .collection("neighborhoods");
      const specificdata = await untillcollection.insertOne({
        id,
        geometry,
        name,
      });

      res.json(specificdata);
    } catch (error) {
      res.json({ message: error.message });
    }
  });

  myServer.get("/stocks", async (req, res) => {
    await client.connect();
    const untillcollection = await client
      .db("stocks")
      .collection("aa-2024-03-14");
    const tilldata = await untillcollection.find().toArray();
    res.json(tilldata);
  });
};

module.exports = { createMongoEndpoints, client };
