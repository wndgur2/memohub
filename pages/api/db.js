const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.NEXT_MONGO_API_KEY;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error);
    }
}
run().catch(console.dir);

export async function writeData(data) {
    const database = client.db('memohub'); // 데이터베이스 이름 입력
    const collection = database.collection('memohub'); // 컬렉션 이름 입력

    const document = data;
    const result = await collection.insertOne(document);

    console.log(`Inserted ${result.insertedCount} document into the collection`);
}

export async function readData(id) {
    const database = client.db('memohub');
    const collection = database.collection('memohub');

    const query = { url: id };

    const cursor = collection.find(query);
    const documents = await cursor.toArray();
    return documents;
    console.log('Documents read from the collection:', documents);
}

export default (req, res) => {
    res.send('db is connected');
}
