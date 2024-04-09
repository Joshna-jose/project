const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const url = "mongodb://127.0.0.1:27017";
const port = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client"));

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const database = client.db('conference_management');
        const users = database.collection('users');

        const user = await users.findOne({ email: email });

        if (user && user.password === password) {
            res.send("Login Successful");
        } else {
            res.send("Login failed");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

app.get("/submissions", async (req, res) => {
    const { email, password } = req.query; // Assuming credentials are passed as query parameters

    const client = new MongoClient(url);

    try {
        await client.connect();

        const database = client.db('conference_management');
        const submissions = database.collection('submissions');

        // Assuming you have a field 'submittedBy' in your submissions collection
        const submittedPapers = await submissions.find({ submittedBy: email }).toArray();

        res.json(submittedPapers);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
