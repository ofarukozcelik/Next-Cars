import mongoose from "mongoose";

// MongoDB veritabanına bağlanma.
mongoose.connect(process.env.MONGODB_URL);

//MongoDB ayarlama.
mongoose.Promise = global.Promise;

//MongoDB şema oluşturma.
const VehicleSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  price: Number,
  color: String,
  mileage: Number,
  fuelType: String,
  transmission: String,
  condition: String,
  imageUrl: String,
});

//MongoDB model oluşturma.

//Performans açısından her importta yeni model oluşturmak yerine varsa oluşturulmuş olanı kullanır.
//Yoksa yeni oluşturur.
const Vehicle = mongoose.models?.Vehicle || mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
