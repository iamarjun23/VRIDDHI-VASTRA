const mongoose = require('mongoose');

const uri = "mongodb+srv://VRIDDHIVASTRA:VRIDDHIVASTRA123@cluster0.nnnfphv.mongodb.net/?appName=Cluster0";

async function dump() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    
    const db = mongoose.connection.db;
    const siteconfigs = await db.collection('siteconfigs').find({}).toArray();
    
    console.log("--- SiteConfig Documents ---");
    console.log(JSON.stringify(siteconfigs, null, 2));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

dump();
