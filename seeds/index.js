const mongoose = require("mongoose");
const fetch = require("node-fetch");
const {
  places,
  descriptors,
  morePics,
  pics,
  users,
  countries,
  sample,
  descriptions,
} = require("./seedHelpers");
const Campground = require("../models/campground");
const dbUrl = "mongodb://127.0.0.1:27017/yelpcamp";
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const world = countries;

const seedDB = async () => {
  await Campground.deleteMany({});
  //   await fetch(
  //     "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json"
  //   )
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log("done");
  //       world = json;
  //     })
  //     .catch((error) => {
  //       console.log("error => ", error);
  //     });
  for (let i = 0; i < 57; i++) {
    let country;
    let state;
    while (true) {
      country = sample(world);
      if (country.states.length === 0) {
        continue;
      }
      state = sample(country.states);
      if (state.cities.length) {
        break;
      } else {
        continue;
      }
    }
    let city = sample(state.cities);
    const price = Math.floor(Math.random() * 55) + 20;
    const today = new Date().toLocaleDateString();
    const camp = new Campground({
      author: `${sample(users)}`,
      location: `${city.name}, ${state.name}`,
      country: country.name,
      state: state.name,
      city: city.name,
      geometry: {
        type: "Point",
        coordinates: [city.longitude, city.latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: `https://source.unsplash.com/collection/${sample(morePics)}`,
      description: sample(descriptions),
      price,
      views: 0,
      date: {
        createdOn: `${today}`,
      },
      season: ["Summer","Fall"],
      images: [
        {
          url: `${sample(morePics)}`,
          filename: `${sample(pics)}`,
        },
        {
          url: `${sample(morePics)}`,
          filename: `${sample(pics)}`,
        },
        {
          url: `${sample(morePics)}`,
          filename: `${sample(pics)}`,
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
