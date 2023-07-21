// pages/api/dbConnect.ts

import { MongoClient} from 'mongodb';

const uri = 'mongodb+srv://Jainth:jainth123@cluster0.06yxw5r.mongodb.net/';


export async function connectToDatabase() {
  const client = await MongoClient.connect(uri);
  return client;
}
