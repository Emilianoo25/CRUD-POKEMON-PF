const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const DB_PATH = path.join(__dirname, "db.json");
app.use(cors());
app.use(express.json());
async function readDB() {
  const content = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(content);
}
async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
app.get("/pokemons", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase();
    const db = await readDB();
    let list = db.pokemon;
    if (q) {
      list = list.filter(p => p.nombre.toLowerCase().includes(q) || (p.tipo || "").toLowerCase().includes(q));
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo DB" });
  }
});
app.get("/pokemons/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDB();
    const item = db.pokemon.find(p => p.id === id);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo DB" });
  }
});
app.post("/pokemons", async (req, res) => {
  try {
    const db = await readDB();
    const payload = req.body;
    const maxId = db.pokemon.reduce((m, p) => Math.max(m, p.id), 0);
    const nuevo = {
      id: maxId + 1,
      nombre: payload.nombre || "",
      tipo: payload.tipo || "",
      imagen: payload.imagen || "",
      descripcion: payload.descripcion || ""
    };
    db.pokemon.push(nuevo);
    await writeDB(db);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error escribiendo DB" });
  }
});
app.put("/pokemons/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDB();
    const idx = db.pokemon.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "No encontrado" });
    const payload = req.body;
    const actualizado = {
      id,
      nombre: payload.nombre || "",
      tipo: payload.tipo || "",
      imagen: payload.imagen || "",
      descripcion: payload.descripcion || ""
    };
    db.pokemon[idx] = actualizado;
    await writeDB(db);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error escribiendo DB" });
  }
});
app.patch("/pokemons/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDB();
    const idx = db.pokemon.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "No encontrado" });
    const payload = req.body;
    const current = db.pokemon[idx];
    const updated = Object.assign({}, current, payload, { id: current.id });
    db.pokemon[idx] = updated;
    await writeDB(db);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error escribiendo DB" });
  }
});
app.delete("/pokemons/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDB();
    const idx = db.pokemon.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "No encontrado" });
    db.pokemon.splice(idx, 1);
    await writeDB(db);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Error escribiendo DB" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
