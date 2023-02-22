const mongoose = require("mongoose");
const uri =
  "mongodb+srv://medaziztaher:aziztaher1234@cluster0.ecqmfgj.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, (error) => {
  if (error) {
    console.log("error in db connection : ", error);
  } else {
    console.log("connect to DB");
  }
});
