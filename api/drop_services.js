import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://23303156_db_user:IKA12UtLBton4q00@ork.lguixt1.mongodb.net/?appName=ork').then(async () => {
  try {
    await mongoose.connection.db.collection('services').drop();
    console.log('Services collection dropped successfully.');
  } catch (err) {
    console.log('Collection might not exist or error:', err.message);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
