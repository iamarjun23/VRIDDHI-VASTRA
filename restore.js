const mongoose = require('mongoose');
const dbConnect = require('./lib/mongodb').default;
const SiteConfig = require('./models/SiteConfig').default;

dbConnect().then(async () => {
  const defaultCollections = ["NEW ARRIVALS", "TRENDING", "BRIDAL COLLECTION", "MYSORE SILK", "BANARASI SILK", "KANCHIPURAM LUXURY", "FESTIVE VIBE", "VALUE FOR MONEY", "CEREMONY VIBE"];
  const defaultLookbook = [
    { title: "BRIDAL COLLECTION", image: "" },
    { title: "CEREMONY VIBE", image: "" },
    { title: "VALUE FOR MONEY", image: "" },
    { title: "FRESH FROM LOOMS", image: "" },
    { title: "FESTIVE VIBE", image: "" }
  ];

  await SiteConfig.findOneAndUpdate(
    { configId: "main" },
    { 
      $set: { 
        collectionsCategories: defaultCollections,
        lookbookBlocks: defaultLookbook,
        heroImage: "",
        featuredBlocks: [
          { title: "KANCHIPURAM LUXURY", image: "" },
          { title: "BANARASI SILK", image: "" },
          { title: "MYSORE SILK", image: "" },
          { title: "BRIDAL COLLECTION", image: "" }
        ],
        promoBanner: { image: "", heading: "Unwrap and Unlock Timeless Elegance\\nwith upto 50% Off", subtext: "Celebrate timeless beauty with handcrafted silk sarees at a price that feels good and looks stunning" }
      } 
    },
    { new: true, upsert: true }
  );
  console.log("Restored Original Settings");
  process.exit(0);
}).catch(console.error);
