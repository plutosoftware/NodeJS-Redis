const express = require("express");

const redis = require("redis");
const redisPort = 6379;
const client = redis.createClient(redisPort);

const app = express();
app.use(express.json());

app.get("/api/get/:id", async (req, res) => {
    client.get(req.params.id, async (err, jobs) => {
        if (jobs) {
            res.status(200).send({
                data: JSON.parse(jobs),
                message: "data retrieved from the cache",
            });
        } else {
            res.status(400).send({ message: "Not Found" });
        }
    });
});

// This example is used for scenerio where we want to append data into an array stored for a particular key into the datastore
app.post("/api/post", async (req, res) => {
    const { key, value } = req.body;

    client.get(key, async (err, data) => {
        if (data) {
            const data1 = JSON.parse(data);
            data1.push(value);
            client.set(key, JSON.stringify(data1));
        } else {
            client.set(key, JSON.stringify([value]));
        }
    });

    res.status(200).send({ message: "data stored into the cache" });
});

client.on("error", (err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log("Node server started");
});
