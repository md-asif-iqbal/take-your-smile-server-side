const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const cors = require("cors",{
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
},
{
  origin: "*"
});
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const req = require('express/lib/request');
const res = require('express/lib/response');
require("dotenv").config();
app.use(cors());
app.use(express.json());



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
    const usersCollection = client.db("applicationUser").collection("users");
    const adminCollection = client.db("applicationUser").collection("admin");
    const blogsCollection = client.db("allBlogs").collection("blogs");
    const galleryCollection = client.db("gallery").collection("galleryData");
    const articleCollection = client.db("allBlogs").collection("blogs");

  
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

  // User Profile Update
   app.put('/user/:email', async(req, res) => {
    const email = req.params.email;
    const userInfo = req.body;
    const filter = {email: email};
    const options = { upsert: true };
    const updateDoc = {
            $set: userInfo
        };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
    });

    //admin/manager/editor Insert/Update
  app.put('/admin/:email', async(req, res) => {
    const email = req.params.email;
    const user = req.body;    
    const filter = {email: email};
    const options = { upsert: true };
     const updateDoc = {
      $set: user
    };
    const result = await adminCollection.updateOne(filter, updateDoc, options);
    const token = jwt.sign(filter, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
    res.send({result, token});
  });
        //user user details
        //user details
        app.get('/user/:email',verifyJWT, async (req, res) => {
          const email = req.params.email;
          const query = {email:email}
          const user = await usersCollection.findOne(query);
          res.send(user)
      })
    // blog post Rana Arju Vai
      // Get All Blog post
      app.post("/articles", async (req, res) => {
        const query = req.body;
        const article = await articleCollection.insertOne(query);
        res.send(article);
      });
            // Get All Blog post
  app.get("/articles", async (req, res) => {
        const articles = await articleCollection.find({}).toArray();
        res.send(articles);
      });
            // Get single Blog post
  app.get("/articles/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const articles = await articleCollection.findOne(query);
        res.send(articles);
      });
    // Blog post End here

          // Md Abdullah Vai start here 
          // Get All Reviews  Customer Reviews collection
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

      app.post("/recentEvents", async (req, res) => {
        const query = req.body;
        const review = await customerReviewsCollection.insertOne(query);
        res.send(review);
      });
        // Get All Recent Event  from Home Pages Feathers collection

        app.get("/summery", async (req, res) => {
          const query = req.body;
          const reviews = await SummeryCollection.find(query).toArray();
          res.send(reviews);
        });




        // Abdullaa vai starting services

    const PackageCollection = client.db("booking").collection("Packages");
    const LocationCollection = client.db("booking").collection("address");
    const decorationCollection = client.db("booking").collection("decoration");

        app.get("/package", async (req, res) => {
          const query = req.body;
          const package = await PackageCollection.find(query).toArray();
          res.send(package);
        });
    
        app.get("/package/:id", async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const query = { _id: ObjectId(id) };
          const package = await PackageCollection.findOne(query);
          res.send(package);
        });
    
        app.get("/address", async (req, res) => {
          const query = req.body;
          const address = await LocationCollection.find(query).toArray();
          res.send(address);
        });
    
        // decoration Collection Here
    
        app.get("/decoration", async (req, res) => {
          const query = req.body;
          const decoration = await decorationCollection.find(query).toArray();
          res.send(decoration);
        });
    
        app.get("/decoration/:id", async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const query = { _id: ObjectId(id) };
          const decoration = await LocationCollection.findOne(query);
          res.send(decoration);
        });
    
        app.get("/address/:id", async (req, res) => {
          const id = req.params.id;
          console.log(id);
          const query = { _id: ObjectId(id) };
          const decoration = await LocationCollection.findOne(query);
          res.send(decoration);
        });
    
        // Our Services Part
        const WeddingServiceCollection = client
          .db("OurServices")
          .collection("weddingEvent");
        const NonprofitServiceCollection = client
          .db("OurServices")
          .collection("NonProfit");
        const SocialServiceCollection = client
          .db("OurServices")
          .collection("Social");
        const CorporateServiceCollection = client
          .db("OurServices")
          .collection("Corporate");
    
        // Wedding Collection
        app.get("/wedding", async (req, res) => {
          const query = req.body;
          const wedding = await WeddingServiceCollection.find(query).toArray();
          res.send(wedding);
        });
    
        app.get("/wedding/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const wedding = await WeddingServiceCollection.findOne(query);
          res.send(wedding);
        });
        // Social Events
        app.get("/social", async (req, res) => {
          const query = req.body;
          const social = await SocialServiceCollection.find(query).toArray();
          res.send(social);
        });
    
        app.get("/social/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const Social = await SocialServiceCollection.findOne(query);
          res.send(Social);
        });
    
        // Non Profit Events
        app.get("/nonprofit", async (req, res) => {
          const query = req.body;
          const nonprofit = await NonprofitServiceCollection.find(query).toArray();
          res.send(nonprofit);
        });
    
        app.get("/nonprofit/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const nonprofit = await NonprofitServiceCollection.findOne(query);
          res.send(nonprofit);
        });
        // Corporate Events
        app.get("/corporate", async (req, res) => {
          const query = req.body;
          const corporate = await CorporateServiceCollection.find(query).toArray();
          res.send(corporate);
        });
    
        app.get("/corporate/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const corporate = await CorporateServiceCollection.findOne(query);
          res.send(corporate);
        });
    
        // Decration part
        const anniversaryCollection = client
          .db("wedding")
          .collection("anniversary");
        const engagementCollection = client.db("wedding").collection("engagement");
        const rehearshalCollection = client.db("wedding").collection("rehearshal");
        const weddingceremonyCollection = client
          .db("wedding")
          .collection("weddingceremony");
        const FLoralDesignCollection = client
          .db("wedding")
          .collection("FloralDesign");
        //Aniversary
        app.get("/floralDesign", async (req, res) => {
          const query = req.body;
          const floralDesign = await FLoralDesignCollection.find(query).toArray();
          res.send(floralDesign);
        });
    
        app.get("/floralDesign/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const floralDesign = await FLoralDesignCollection.findOne(query);
          res.send(floralDesign);
        });
    
        // Floral Design
        app.get("/anniversary", async (req, res) => {
          const query = req.body
          const anniversary = await anniversaryCollection.find(query).toArray();
          res.send(anniversary);
        });
    
        app.get("/anniversary/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const anniversary = await anniversaryCollection.findOne(query);
          res.send(anniversary);
        });
        //Engagement events
        app.get("/engagement", async (req, res) => {
          const query = req.body;
          const corporate = await engagementCollection.find(query).toArray();
          res.send(corporate);
        });
    
        app.get("/engagement/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await engagementCollection.findOne(query);
          res.send(result);
        });
    
        //wedding ceremony events
        app.get("/weddingceremony", async (req, res) => {
          const query = req.body;
          const weddingceremony = await weddingceremonyCollection
            .find(query)
            .toArray();
          res.send(weddingceremony);
        });
        app.get("/weddingceremony/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const weddingceremony = await weddingceremonyCollection.findOne(query);
          res.send(weddingceremony);
        });
        //rehearshal dinner events
        app.get("/rehearshal", async (req, res) => {
          const query = req.body;
          const rehearshal = await rehearshalCollection.find(query).toArray();
          res.send(rehearshal);
        });
    
        app.get("/rehearshal/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await rehearshalCollection.findone(query);
          res.send(result);
        });
    
        // social events collection
        const birthdayServiceCollection = client
          .db("SocialEvents")
          .collection("BirthdayParties");
        const retirementServiceCollection = client
          .db("SocialEvents")
          .collection("RetirementParties");
        const seasonalServiceCollection = client
          .db("SocialEvents")
          .collection("SeasonalCelebrations");
        const holidayServiceCollection = client
          .db("SocialEvents")
          .collection("HolidayEvents");
        const religiousServiceCollection = client
          .db("SocialEvents")
          .collection("ReligiousEvents");
        // social event
    
        // 1. Birthday Parties
        app.get("/birthday", async (req, res) => {
          const query = req.body;
          const birthday = await birthdayServiceCollection.find(query).toArray();
          res.send(birthday);
        });
    
        app.get("/birthday/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const birthday = await birthdayServiceCollection.findOne(query);
          res.send(birthday);
        });
    
        // 3. Retirement Parties.
        app.get("/retirement", async (req, res) => {
          const query = req.body;
          const retirement = await retirementServiceCollection
            .find(query)
            .toArray();
          res.send(retirement);
        });
    
        app.get("/retirement/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const retirement = await retirementServiceCollection.findOne(query);
          res.send(retirement);
        });
    
        // 4. Seasonal Celebrations.
        app.get("/seasonal", async (req, res) => {
          const query = req.body;
          const seasonal = await seasonalServiceCollection.find(query).toArray();
          res.send(seasonal);
        });
    
        app.get("/seasonal/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const seasonal = await seasonalServiceCollection.findOne(query);
          res.send(seasonal);
        });
    
        // 5. holiday.
        app.get("/holiday", async (req, res) => {
          const query = req.body;
          const holiday = await holidayServiceCollection.find(query).toArray();
          res.send(holiday);
        });
    
        app.get("/holiday/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const holiday = await holidayServiceCollection.findOne(query);
          res.send(holiday);
        });
        // 6. Religious events.
        app.get("/religious", async (req, res) => {
          const query = req.body;
          const religious = await religiousServiceCollection.find(query).toArray();
          res.send(religious);
        });
    
        app.get("/religious/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const religious = await religiousServiceCollection.findOne(query);
          res.send(religious);
        });
    
        // Corporate events collections
        const productServiceCollection = client
          .db("CorporateEvent")
          .collection("ProductLaunches");
        const salesServiceCollection = client
          .db("CorporateEvent")
          .collection("SalesEvents");
        const fashionServiceCollection = client
          .db("CorporateEvent")
          .collection("FashionCarnival");
        const educationalServiceCollection = client
          .db("CorporateEvent")
          .collection("EducationalSeminar");
        const newyearServiceCollection = client
          .db("CorporateEvent")
          .collection("NewYearEvents");
    
        // 1. ProductLunches events.
        app.get("/ProductLunches", async (req, res) => {
          const query = req.body;
          const ProductLunches = await productServiceCollection
            .find(query)
            .toArray();
          res.send(ProductLunches);
        });
    
        app.get("/ProductLunches/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const ProductLunches = await productServiceCollection.findOne(query);
          res.send(ProductLunches);
        });
    
        // 2. SalesEvents events.
        app.get("/SalesEvents", async (req, res) => {
          const query = req.body;
          const SalesEvents = await salesServiceCollection.find(query).toArray();
          res.send(SalesEvents);
        });
    
        app.get("/SalesEvents/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const SalesEvents = await salesServiceCollection.findOne(query);
          res.send(SalesEvents);
        });
    
        // 3. FashionCarnival events.
        app.get("/FashionCarnival", async (req, res) => {
          const query = req.body;
          const FashionCarnival = await fashionServiceCollection
            .find(query)
            .toArray();
          res.send(FashionCarnival);
        });
    
        app.get("/FashionCarnival/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const FashionCarnival = await fashionServiceCollection.findOne(query);
          res.send(FashionCarnival);
        });
    
        // 4. EducationalSeminar events.
        app.get("/EducationalSeminar", async (req, res) => {
          const query = req.body;
          const EducationalSeminar = await educationalServiceCollection
            .find(query)
            .toArray();
          res.send(EducationalSeminar);
        });
    
        app.get("/EducationalSeminar/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const EducationalSeminar = await educationalServiceCollection.findOne(
            query
          );
          res.send(EducationalSeminar);
        });
    
        // 5. NewYearEvents events.
        app.get("/NewYearEvents", async (req, res) => {
          const query = req.body;
          const NewYearEvents = await newyearServiceCollection
            .find(query)
            .toArray();
          res.send(NewYearEvents);
        });
    
        app.get("/NewYearEvents/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const NewYearEvents = await newyearServiceCollection.findOne(query);
          res.send(NewYearEvents);
        });
    
        // Non Profit Events
        const ConcertEventCollection = client
          .db("nonProfitEvent")
          .collection("concert");
        const HomeParitesCOllection = client
          .db("nonProfitEvent")
          .collection("HomeParites");
        const FundraisingCollection = client
          .db("nonProfitEvent")
          .collection("Fundraising");
        const FairsExposCollection = client
          .db("nonProfitEvent")
          .collection("fairsExpos");
        const PaintJamCollection = client
          .db("nonProfitEvent")
          .collection("PaintJam");
    
        // Conecert Events
        app.get("/concert", async (req, res) => {
          const query = req.body;
          const concert = await ConcertEventCollection.find(query).toArray();
          res.send(concert);
        });
    
        app.get("/concert/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const concert = await ConcertEventCollection.findOne(query);
          res.send(concert);
        });
    
        // Welcome Home Parties
        app.get("/home", async (req, res) => {
          const query = req.body;
          const home = await HomeParitesCOllection.find(query).toArray();
          res.send(home);
        });
    
        app.get("/home/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const home = await HomeParitesCOllection.findOne(query);
          res.send(home);
        });
    
        // fairsExpos event
        app.get("/fairsExpos", async (req, res) => {
          const query = req.body;
          const fairsExpos = await FairsExposCollection.find(query).toArray();
          res.send(fairsExpos);
        });
    
        app.get("/fairsExpos/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const fairsExpos = await FundraisingCollection.findOne(query);
          res.send(fairsExpos);
        });
    
        // Fundraising event
        app.get("/Fundraising", async (req, res) => {
          const query = req.body;
          const Fundraising = await FundraisingCollection.find(query).toArray();
          res.send(Fundraising);
        });
    
        app.get("/Fundraising/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const Fundraising = await FairsExposCollection.findOne(query);
          res.send(Fundraising);
        });
    
        // PaintJam event
        app.get("/PaintJam", async (req, res) => {
          const query = req.body;
          const PaintJam = await PaintJamCollection.find(query).toArray();
          res.send(PaintJam);
        });
    
        app.get("/PaintJam/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const PaintJam = await PaintJamCollection.findOne(query);
          res.send(PaintJam);
        });
    
        const BookingCollection = client.db("booking").collection("orders");
        app.post("/orders", async (req, res) => {
          const query = req.body;
          const booking = await BookingCollection.insertOne(query);
          res.send(booking);
        });
        app.get("/orders", async (req, res) => {
          const query = req.body;
          const booking = await BookingCollection.find(query).toArray();
          res.send(booking);
        });

          
        // Abdulla vai End services

    // Asif's Start here
    app.get("/gallerys", async (req, res) => {
      const query = req.body;
      const gallery = await galleryCollection.find(query).toArray();
      // console.log("abvx");
      res.send(gallery);
    });
  
    // Asif's End Here


  } 
  finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Event app listening on port ${port}`);
});

// hello



