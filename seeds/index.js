const mongoose = require("mongoose");
const fetch = require("node-fetch");
const { places, descriptors, morePics, pics, users } = require("./seedHelpers");
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const words = () => {
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

const world = [
    {
      name: "USA",
      states: [
        {
          name: "California",
          cities: [
            { name: "Los Angeles", longitude: -118.248779, latitude: 34.052235 },
            { name: "San Francisco", longitude: -122.419418, latitude: 37.774929 },
          ],
        },
        {
          name: "New York",
          cities: [
            { name: "New York City", longitude: -74.006058, latitude: 40.712776 },
            { name: "Buffalo", longitude: -78.878372, latitude: 42.886444 },
          ],
        },
      ],
    },
    {
      name: "Canada",
      states: [
        {
          name: "Ontario",
          cities: [
            { name: "Toronto", longitude: -79.383186, latitude: 43.653225 },
            { name: "Ottawa", longitude: -75.697197, latitude: 45.421528 },
          ],
        },
        {
          name: "British Columbia",
          cities: [
            { name: "Vancouver", longitude: -123.121643, latitude: 49.282730 },
            { name: "Victoria", longitude: -123.365644, latitude: 48.428421 },
          ],
        },
      ],
    },
    {
      name: "Brazil",
      states: [
        {
          name: "São Paulo",
          cities: [
            { name: "São Paulo", longitude: -46.633309, latitude: -23.550520 },
            { name: "Rio de Janeiro", longitude: -43.172896, latitude: -22.906847 },
          ],
        },
        {
          name: "Bahia",
          cities: [
            { name: "Salvador", longitude: -38.501381, latitude: -12.973291 },
            { name: "Feira de Santana", longitude: -38.955654, latitude: -12.266951 },
          ],
        },
      ],
    },
    {
      name: "Germany",
      states: [
        {
          name: "Berlin",
          cities: [
            { name: "Berlin", longitude: 13.404954, latitude: 52.520007 },
          ],
        },
        {
          name: "Bavaria",
          cities: [
            { name: "Munich", longitude: 11.576124, latitude: 48.137154 },
            { name: "Nuremberg", longitude: 11.074822, latitude: 49.452102 },
          ],
        },
      ],
    },
    {
      name: "Japan",
      states: [
        {
          name: "Tokyo",
          cities: [
            { name: "Tokyo", longitude: 139.691711, latitude: 35.689487 },
            { name: "Yokohama", longitude: 139.642502, latitude: 35.443708 },
          ],
        },
        {
          name: "Osaka",
          cities: [
            { name: "Osaka", longitude: 135.502197, latitude: 34.693737 },
            { name: "Kobe", longitude: 135.196652, latitude: 34.690083 },
          ],
        },
      ],
    },
    {
      name: "Australia",
      states: [
        {
          name: "New South Wales",
          cities: [
            { name: "Sydney", longitude: 151.209290, latitude: -33.868820 },
            { name: "Newcastle", longitude: 151.785046, latitude: -32.928272 },
          ],
        },
        {
          name: "Victoria",
          cities: [
            { name: "Melbourne", longitude: 144.963158, latitude: -37.813629 },
            { name: "Geelong", longitude: 144.350960, latitude: -38.147286 },
          ],
        },
      ],
    },
    {
      name: "South Africa",
      states: [
        {
          name: "Gauteng",
          cities: [
            { name: "Johannesburg", longitude: 28.024345, latitude: -26.204103 },
            { name: "Pretoria", longitude: 28.229271, latitude: -25.747868 },
          ],
        },
        {
          name: "Western Cape",
          cities: [
            { name: "Cape Town", longitude: 18.424055, latitude: -33.924869 },
            { name: "Stellenbosch", longitude: 18.873969, latitude: -33.932104 },
          ],
        },
      ],
    },
  ];
  

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
    let random5 = Math.floor(Math.random() * 11);
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
      description: words(),
      price,
      views: 0,
      date: {
        createdOn: `${today}`,
      },
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
