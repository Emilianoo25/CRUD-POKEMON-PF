const btnDelete = document.getElementById("btnDelete");
btnDelete.addEventListener("click", async () => {
  const id = document.getElementById("delId").value.trim();
  if (!id) return alert("ID requerido");
  try {
    const res = await fetch(`http://localhost:3000/pokemons/${id}`, { method: "DELETE" });
    if (res.status === 204) {
      alert("Eliminado");
      window.location.href = "list.html";
    } else {
      alert("No se eliminó");
    }
  } catch (err) {
    alert("Error al eliminar");
  }
});
