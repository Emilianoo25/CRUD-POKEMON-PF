const API_LOCAL = "http://localhost:3000/pokemons"

const lista = document.getElementById("lista")
const resultado = document.getElementById("resultado")
const mensaje = document.getElementById("mensaje")

const inputNombre = document.getElementById("nombre")
const inputImagen = document.getElementById("imagen")
const inputIdEditar = document.getElementById("idEditar")

// =======================
// MENSAJES
// =======================
function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto
  mensaje.className = `mensaje ${tipo}`
  mensaje.style.display = "block"

  setTimeout(() => {
    mensaje.style.display = "none"
  }, 3000)
}

// =======================
// LISTAR
// =======================
async function cargarPokemons() {
  lista.innerHTML = ""
  const res = await fetch(API_LOCAL)
  const data = await res.json()

  data.forEach(pokemon => {
    const li = document.createElement("li")
    li.innerHTML = `
      <strong>${pokemon.nombre}</strong>
      <img src="${pokemon.imagen}">
      <div class="acciones">
        <button onclick="editarPokemon(${pokemon.id}, '${pokemon.nombre}', '${pokemon.imagen}')">Editar</button>
        <button class="rojo" onclick="borrarPokemon(${pokemon.id})">Borrar</button>
      </div>
    `
    lista.appendChild(li)
  })
}

cargarPokemons()

// =======================
// CREAR / EDITAR
// =======================
document.getElementById("crear").addEventListener("click", async () => {
  const nombre = inputNombre.value.trim().toLowerCase()
  const imagen = inputImagen.value.trim()
  const id = inputIdEditar.value

  if (!nombre || !imagen) {
    mostrarMensaje("Completá todos los campos", "error")
    return
  }

  const res = await fetch(API_LOCAL)
  const data = await res.json()

  const duplicado = data.find(p => p.nombre === nombre && p.id != id)
  if (duplicado) {
    mostrarMensaje("Ese Pokémon ya existe en tu CRUD", "error")
    return
  }

  if (id) {
    await fetch(`${API_LOCAL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, imagen })
    })
    mostrarMensaje("Pokémon actualizado", "exito")
  } else {
    await fetch(API_LOCAL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, imagen })
    })
    mostrarMensaje("Pokémon creado", "exito")
  }

  limpiarFormulario()
  cargarPokemons()
})

function editarPokemon(id, nombre, imagen) {
  inputIdEditar.value = id
  inputNombre.value = nombre
  inputImagen.value = imagen
}

document.getElementById("cancelar").addEventListener("click", limpiarFormulario)

function limpiarFormulario() {
  inputIdEditar.value = ""
  inputNombre.value = ""
  inputImagen.value = ""
}

// =======================
// BORRAR
// =======================
async function borrarPokemon(id) {
  await fetch(`${API_LOCAL}/${id}`, { method: "DELETE" })
  mostrarMensaje("Pokémon eliminado", "exito")
  cargarPokemons()
}

// =======================
// BUSCAR EN POKEAPI
// =======================
document.getElementById("buscar").addEventListener("click", async () => {
  const nombre = document.getElementById("buscarPokemon").value.trim().toLowerCase()
  resultado.innerHTML = ""

  if (!nombre) return

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    if (!res.ok) throw new Error()

    const data = await res.json()

    resultado.innerHTML = `
      <h3>${data.name}</h3>
      <img src="${data.sprites.front_default}">
      <button id="guardarApi">Guardar en mi CRUD</button>
    `

    document.getElementById("guardarApi").addEventListener("click", async () => {
      const resLocal = await fetch(API_LOCAL)
      const dataLocal = await resLocal.json()

      if (dataLocal.find(p => p.nombre === data.name)) {
        mostrarMensaje("Ese Pokémon ya está guardado", "error")
        return
      }

      await fetch(API_LOCAL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.name,
          imagen: data.sprites.front_default
        })
      })

      mostrarMensaje("Pokémon agregado desde PokeAPI", "exito")
      cargarPokemons()
    })

  } catch {
    mostrarMensaje("Pokémon no encontrado", "error")
  }
})
