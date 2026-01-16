const API = "http://localhost:3000/pokemons";
const lista = document.getElementById("lista");
const search = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const btnReload = document.getElementById("btnReload");
async function cargar(q) {
  try {
    const url = q ? `${API}?q=${encodeURIComponent(q)}` : API;
    const res = await fetch(url);
    const data = await res.json();
    lista.innerHTML = data.map(p => {
      return `
        <div class="card">
          <h3>${p.nombre.toUpperCase()}</h3>
          <img src="${p.imagen || 'https://via.placeholder.com/96'}" alt="${p.nombre}">
          <div class="small">ID: ${p.id}</div>
          <div class="small">Tipo: ${p.tipo}</div>
          <a href="detail.html?id=${p.id}">Ver detalles</a>
        </div>
      `;
    }).join("");
  } catch (err) {
    lista.innerHTML = "<p>Error cargando lista</p>";
  }
}
btnSearch.addEventListener("click", () => cargar(search.value.trim()));
btnReload.addEventListener("click", () => { search.value = ""; cargar(); });
cargar();
