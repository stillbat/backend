const { client } = require("./mongodb")
const { ObjectId } = require('mongodb');



const extractdatafromtwelvedata = (myServer) => {
    myServer.get("/twelvedata000", async (req, res) => {
        try {
            const response = await fetch(
                "https://api.twelvedata.com/time_series?apikey=110574cb274041938b5bde5630eeb858&interval=1min&symbol=TSLA&type=stock&outputsize=5000&timezone=America/New_York&start_date=2024-03-14 09:30:00&format=JSON&end_date=2024-03-15 09:12:00"
            )
            const data = await response.json();
            await client.connect();
            const connectcollectiondb = await client.db("stocks").collection("aa-2024-03-14");
            await connectcollectiondb.insertMany(data.values)
            console.log(data)
            res.send("Successfully transferred data to MongoDB");
        } catch (e) {
            res.send("Error" + e.message);
        }
    });

    myServer.post("/twelvedata/create/", async (req, res) => {
        try {
            const createfunction = req.body;
            const requiredfields = ["datetime", "open", "high", "low", "close"];
            const values = Object.keys(createfunction);
            const missingfields = requiredfields.filter((value) => !values.includes(value));

            if (missingfields.length > 0) {
                throw new Error(
                    `${missingfields.join(",")} - fields are missing value`
                );
            }
            const { datetime, open, high, low, close } = createfunction;
            await client.connect();
            const untillcollection = await client.db("stocks").collection("dis-2024-02-29");
            const specificdata = await untillcollection.insertOne({
                datetime,
                open,
                high,
                low,
                close,
            });
            res.json(specificdata);

        } catch (error) {
            res.json({ message: error.message });
        }
    });
    myServer.delete("/twelvedata200/:deletename", async (req, res) => {
        const deletebynamefunction = req.params.deletename
        await client.connect();
        const untillcollection = await client.db("stocks").collection("dis-2024-02-29");
        const specificdata = await untillcollection.deleteOne({ _id: new ObjectId(String(deletebynamefunction)), });

        res.json(specificdata);
    });
    myServer.put("/twelvedata300/:id", async (req, res) => {
        try {
            const updateid = req.params.id
            const updatefunction = req.body;
            const requiredfields = ["datetime", "open", "high", "low", "close"];
            const values = Object.keys(updatefunction);
            const missingfields = requiredfields.filter((value) => !values.includes(value));

            if (missingfields.length > 0) {
                throw new Error(
                    `${missingfields.join(",")} - fields are missing value`
                );
            }
            const { datetime, open, high, low, close } = updatefunction;
            await client.connect();
            const untillcollection = await client.db("stocks").collection("dis-2024-02-29");
            const specificdata = await untillcollection.updateOne(
                {
                    _id: new ObjectId(String(updateid))
                },
                {$set:{
                    datetime,
                    open,
                    high,
                    low,
                    close,
                }}
            );
            res.json(specificdata);

        } catch (error) {
            res.json({ message: error.message });
        }
    });
};

module.exports = { extractdatafromtwelvedata }