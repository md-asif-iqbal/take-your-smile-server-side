const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a16moha.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const customerReviewsCollection = client.db("CustomerReviews").collection("reviews");
    const RecentEventCollection = client.db("HomePageFeathers").collection("RecentEvents");
    const SummeryCollection = client.db("HomePageFeathers").collection("Summery");

     // Get All Reviews from Customer Reviews collection

     app.get("/reviews", async (req, res) => {
      const query = req.body;
      const reviews = await customerReviewsCollection.find(query).toArray();
      res.send(reviews);
    });
    
    // Post a reviews from Customer Reviews collection

    app.post("/reviews", async (req, res) => {
      const query = req.body;
      const review = await customerReviewsCollection.insertOne(query);
      res.send(review);
    });

      // Get All Recent Event  from Home Pages Feathers collection

      app.get("/recentEvents", async (req, res) => {
        const query = req.body;
        const reviews = await RecentEventCollection.find(query).toArray();
        res.send(reviews);
      });

        // Get All Recent Event  from Home Pages Feathers collection

        app.get("/summery", async (req, res) => {
          const query = req.body;
          const reviews = await SummeryCollection.find(query).toArray();
          res.send(reviews);
        });

  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
