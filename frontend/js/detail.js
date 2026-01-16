const info = document.getElementById("info");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
async function cargar() {
  try {
    const res = await fetch(`http://localhost:3000/pokemons/${id}`);
    if (!res.ok) return info.innerHTML = "<p>No encontrado</p>";
    const p = await res.json();
    info.innerHTML = `
      <h2>${p.nombre.toUpperCase()}</h2>
      <img src="${p.imagen || 'https://via.placeholder.com/140'}" alt="${p.nombre}">
      <p class="small">ID: ${p.id}</p>
      <p class="small">Tipo: ${p.tipo}</p>
      <p>${p.descripcion}</p>
    `;
  } catch (err) {
    info.innerHTML = "<p>Error cargando</p>";
  }
}
cargar();
