import mongoose from 'mongoose';
import config from '../config';

const dbConnect = async() => {
    try{
        await mongoose.connect(config.database_url as string);
        console.log('Database Connection success');
    }
    catch(err){
        console.log('❤Database connection failled❤');
        console.log(err);
    }
  
}

export default dbConnect;