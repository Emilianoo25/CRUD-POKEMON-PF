const btnLoad = document.getElementById("btnLoad");
const formEdit = document.getElementById("formEdit");
btnLoad.addEventListener("click", async () => {
  const id = document.getElementById("editId").value.trim();
  if (!id) return alert("ID requerido");
  try {
    const res = await fetch(`http://localhost:3000/pokemons/${id}`);
    if (!res.ok) return alert("No encontrado");
    const data = await res.json();
    document.getElementById("editNombre").value = data.nombre;
    document.getElementById("editTipo").value = data.tipo;
    document.getElementById("editImagen").value = data.imagen;
    document.getElementById("editDescripcion").value = data.descripcion;
    formEdit.style.display = "block";
  } catch (err) {
    alert("Error al cargar");
  }
});
formEdit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value.trim();
  const nombre = document.getElementById("editNombre").value.trim();
  const tipo = document.getElementById("editTipo").value.trim();
  const imagen = document.getElementById("editImagen").value.trim();
  const descripcion = document.getElementById("editDescripcion").value.trim();
  try {
    const res = await fetch(`http://localhost:3000/pokemons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, imagen, descripcion })
    });
    if (!res.ok) return alert("Error al actualizar");
    alert("Actualizado");
    window.location.href = "list.html";
  } catch (err) {
    alert("Error al actualizar");
  }
});
