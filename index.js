// implement your API here
const express = require("express");

const server = express();

const db = require("./data/db.js");

server.use(express.json());

server.get("/", (req, res) => {
  res.send("hola guey");
});

server.get("/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "error retrieving users" });
    });
});

server.get("/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      }
      res.status(404).json({ message: "user does not exist" });
    })
    .catch(err => {
      res.status(500).json({ message: "error retrieving user" });
    });
});

server.post("/users", (req, res) => {
  const userInfo = req.body;
  console.log("user information", userInfo);
  if (userInfo.name === "" || userInfo.bio === "") {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.insert(userInfo)
    .then(user => res.status(201).json(user))
    .catch(error => {
      res.status(500).json({ message: "error creating the user" });
    });
});

server.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  if (updates.name === "" || updates.bio === "") {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.update(id, updates)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated);
      }
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be modified." })
    );
});

server.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({ message: "error deleting the user" });
    });
});

server.listen(3005, () => {
  console.log("\n** API up and running on port 3005");
});
