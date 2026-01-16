const formCreate = document.getElementById("formCreate");
formCreate.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const tipo = document.getElementById("tipo").value.trim();
  const imagen = document.getElementById("imagen").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  try {
    const res = await fetch("http://localhost:3000/pokemons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, imagen, descripcion })
    });
    const data = await res.json();
    alert("Creado: ID " + data.id);
    window.location.href = "../pages/list.html";
  } catch (err) {
    alert("Error al crear");
  }
});
