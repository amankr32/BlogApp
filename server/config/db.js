const mongoose = require("mongoose");
require('dotenv').config();


mongoose.set('strictQuery', false);


mongoose.connect(process.env.MONGO_URI || "mongodb+srv://amanku6936_db_user:ElSZ4O5ONpP3womd@cluster0.hhkg4ew.mongodb.net/?appName=Cluster0").then(()=>{
    console.log("connected!");
}).catch((err)=>{
    console.log(err);
})