import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.NEXT_MONGODB_URI;

export default async function dbconnect(collectionName) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  return client.db(process.env.DB_NAME).collection(collectionName);
}
