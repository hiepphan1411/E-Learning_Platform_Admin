import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 1) Kết nối đúng DB coursedb
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model("Course", courseSchema); 

const sendNotificationToAll = (notification) => {
  io.emit('new_notification', notification);
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // socket.emit('new_notification', {
  //   _id: new mongoose.Types.ObjectId().toString(),
  //   message: 'Welcome to the platform!',
  //   createdAt: new Date(),
  //   type: 'system',
  //   read: false
  // });
}); 

app.get("/api/all-data/:collectionName", async (req, res) => {
  const { collectionName } = req.params;

  try {
    const data = await mongoose.connection.db.collection(collectionName).find().toArray();
    res.json(data);
  } catch (err) {
    console.error(`Error fetching data from collection ${collectionName}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/all-data/:collectionName/by/:fieldName/:value", async (req, res) => {
  const { collectionName, fieldName, value } = req.params;

  try {
    const collection = mongoose.connection.db.collection(collectionName);

    const query = { [fieldName]: value };

    const document = await collection.findOne(query);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(document);
  } catch (err) {
    console.error(`Error querying ${collectionName} by ${fieldName}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/all-data/:collectionName/by/:fieldName/:value", async (req, res) => {
  const { collectionName, fieldName, value } = req.params;
  const updateData = req.body;

  try {
    const collection = mongoose.connection.db.collection(collectionName);

    const query = { [fieldName]: value };
    
    const result = await collection.updateOne(
      query, 
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const updatedDocument = await collection.findOne(query);

    res.json({ 
      message: `Document in ${collectionName} updated successfully`, 
      document: updatedDocument 
    });
  } catch (err) {
    console.error(`Error updating document in ${collectionName} by ${fieldName}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/all-data/:collectionName/by/:fieldName/:value", async (req, res) => {
  const { collectionName, fieldName, value } = req.params;

  try {
    const collection = mongoose.connection.db.collection(collectionName);

    const query = { [fieldName]: value };
    
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ 
      message: `Document in ${collectionName} deleted successfully`
    });
  } catch (err) {
    console.error(`Error deleting document in ${collectionName} by ${fieldName}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

//Xử lý thông báo
app.put("/api/all-data/:collectionName/by/_id/:value", async (req, res) => {
  const { collectionName, value } = req.params;
  const updateData = req.body;

  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const objectId = new ObjectId(value);
    
    const result = await collection.updateOne(
      { _id: objectId }, 
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const updatedDocument = await collection.findOne({ _id: objectId });
    
    res.json({ 
      message: `Document in ${collectionName} updated successfully`, 
      document: updatedDocument 
    });
  } catch (err) {
    console.error(`Error updating document in ${collectionName} by _id:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/all-data/:collectionName/by/_id/:value", async (req, res) => {
  const { collectionName, value } = req.params;

  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const objectId = new ObjectId(value);
    
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ 
      message: `Document in ${collectionName} deleted successfully`
    });
  } catch (err) {
    console.error(`Error deleting document in ${collectionName} by _id:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));