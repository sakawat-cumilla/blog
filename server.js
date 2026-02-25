require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://studentManagementWeb:12345678S@cluster0.dhnm5jt.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let studentCollection;

// 🔥 connect first
async function connectDB() {
  try {
    await client.connect();
    studentCollection = client.db('universityDB').collection('students');
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
}
connectDB();


// 🔥 route outside
app.post('/students', async (req, res) => {
  try {
    const student = req.body;
    const result = await studentCollection.insertOne(student);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Insert failed', error });
  }
});

app.post('/students/many', async (req, res) => {
  try {
    const student = req.body;
    const result = await studentCollection.insertMany(student);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Insert failed', error });
  }
});
app.get('/students', async (req, res) => {
  try {
    const students = await studentCollection.find().toArray();
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve students', error });
  }
});

const { ObjectId } = require('mongodb');

app.get('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };
    const student = await studentCollection.findOne(query);

    if (student) {
      res.send(student);
    } else {
      res.status(404).send({ message: 'Student not found' });
    }

  } catch (error) {
    res.status(500).send({ message: 'Invalid ID or Failed to retrieve student', error });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});