const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require('express');
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const app= express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

// mongoDB Connected
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a16moha.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// verify Authentication

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!authHeader) {
      return res.status(404).send({message: "Unauthorize access"})
    }
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
          return res.status(403).send({message: "Forbidden access"})
        }
   req.decoded= decoded;
   next();
});
}
    
}
async function run() {
    try {
      await client.connect();
      const usersCollection = client.db("applicationUser").collection("users");
      const customerReviewsCollection = client.db("CustomerReviews").collection("reviews");
      const RecentEventCollection = client.db("HomePageFeathers").collection("RecentEvents");
      const SummeryCollection = client.db("HomePageFeathers").collection("Summery");
      // create a document to insert
    //   const verifyAdmin =async(req, res, next)=>{
    //   const requester = req.decoded.email;
    //   const requesterAccount = await usersCollection.findOne({email: requester});
    //   if (requesterAccount.role === 'admin') {
    //     next();
    //   }else{
    //     res.status(403).send({message: "forbidden access"})
    //   }
    // }
  
     //User Get
    app.get('/user',verifyJWT,async(req, res) => {
        const users = await usersCollection.find({}).toArray();
        res.send(users);
     });
      //User Insert/Update
    app.put('/user/:email', async(req, res) => {
      const email = req.params.email;
      const user = req.body;
      const role = {role: "user"}
      
      const filter = {email: email};
      const options = { upsert: true };
       const updateDoc = {
        $set: user
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign(filter, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
      res.send({result, token});
    });
            // Md Abdullah Vai start here 
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
      // await client.close();
    }
  }
  run().catch(console.dir);
  


app.get("/", (req, res) => {
    res.send("Welcome to 'Take Your Smile??!")
  });
  app.listen(port, () => {
      console.log('server is running port of', port);
  })