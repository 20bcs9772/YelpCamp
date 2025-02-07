if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require("mongoose");
const fetch = require("node-fetch");
const {
  places,
  descriptors,
  morePics,
  pics,
  userNames,
} = require("./seedHelpers");
const Campground = require("../models/campground");
const User = require("../models/user");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const generateRandomText = () => {
  let para = " ";
  for (let k = 0; k < 120; k++) {
    para =
      (Math.random() + 1)
        .toString(36)
        .substring(Math.floor(Math.random() * 4) + 7) +
      " " +
      para;
  }
  return para;
};

const worldDataUrl =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json";

let world;
let users = [];

const createUsers = async () => {
  await User.deleteMany({});
  const userPromises = [];
  const numUsers = Math.floor(Math.random() * 6) + 5;
  const uniqueUsernames = new Set();

  while (uniqueUsernames.size < numUsers) {
    let randomName = sample(userNames);

    if (uniqueUsernames.has(randomName)) {
      randomName += Math.floor(Math.random() * 1000);
    }
    uniqueUsernames.add(randomName);
  }

  for (let username of uniqueUsernames) {
    const email = `${username.toLowerCase()}@example.com`;
    const password = "password123";

    const user = new User({ email, username });
    userPromises.push(User.register(user, password));
  }

  users = await Promise.all(userPromises);
  console.log(`Created ${users.length} unique users.`);
};

const createCampgrounds = async () => {
  await Campground.deleteMany({});
  world = await fetch(worldDataUrl).then((res) => res.json());

  for (let i = 0; i < 57; i++) {
    let country, state, city;

    while (true) {
      country = sample(world);
      if (country.states.length === 0) continue;

      state = sample(country.states);
      if (state.cities.length) {
        city = sample(state.cities);
        break;
      }
    }

    const price = Math.floor(Math.random() * 55) + 20;
    const today = new Date().toLocaleDateString();
    const randomUser = sample(users);

    const camp = new Campground({
      author: randomUser._id,
      location: `${city.name}, ${state.name}`,
      country: country.name,
      state: state.name,
      city: city.name,
      geometry: {
        type: "Point",
        coordinates: [city.longitude, city.latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      description: generateRandomText(),
      price,
      views: 0,
      date: { createdOn: today },
      images: Array.from({ length: 10 }, () => ({
        url: sample(morePics),
        filename: sample(pics),
      })),
    });

    await camp.save();
  }
  console.log("Campgrounds seeded.");
};

const seedDB = async () => {
  await createUsers();
  await createCampgrounds();
  mongoose.connection.close();
};

seedDB();
