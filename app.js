const express = require('express');
const path = require('path');
const cors = require("cors")
const fs = require("fs");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

const Song = require("./songSchema")

app.use(cors())
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("conencted to Mongo");
  })
  .catch((err) => {
    console.log("error connecting to Mongo ", err.message);
  });

app.get("/api/getall", async (req, res) => {
  const songs = await Song.find({}).catch((err) => {
    console.log(err.message);
  });

  res.json(songs);
})

app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  Song.findById(id)
    .then((song) => {
      if (song) {
        res.json(song);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).json({ error: `Song with the id ${id} was not found` });
    });
})

app.post("/api/add", (req, res) => {
  const {title, artist, songLength} = req.body;

  const song = new Song({
    title,
    artist,
    songLength,
  });

  song.save()
  .then(response => {
    res.json(response)
  })
  .catch(e => {
    res.status(400).json({ error: "Deleting unsuccessful" });
  })
})

app.put("/api/update/:id", (req, res) => {
  const id = req.params.id;
  const { title, artist, length } = req.body;

  const updatedSong = { title: title, artist: artist, length };

  Song.findByIdAndUpdate(id, updatedSong, { new: true })
    .then((responseSong) => {
      res.json(responseSong);
    })
    .catch(() => res.status(400).end());

})

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;

  Song.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: "Delete success" });
    })
    .catch((err) => {
      console.log("deleting unsuccessful", err.message);
      res.status(400).json({ error: "Deleting unsuccessful" });
    });
})

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
