// Datos de ejemplo (sin servidor ni base de datos)
const productos = [
  { id: 1, nombre: "Ramo de rosas rojas", tipo: "Rosas", puesto: "Puesto 12 – Flores Doña Rosa", precio: 45, emoji: "🌹" },
  { id: 2, nombre: "Girasoles del valle (6 u.)", tipo: "Girasoles", puesto: "Puesto 7 – Sol de Acho", precio: 30, emoji: "🌻" },
  { id: 3, nombre: "Orquídea Phalaenopsis", tipo: "Orquídeas", puesto: "Puesto 3 – Orquídeas Lima", precio: 80, emoji: "🪻" },
  { id: 4, nombre: "Lirios blancos (docena)", tipo: "Lirios", puesto: "Puesto 15 – Jardín Blanco", precio: 55, emoji: "🌷" },
  { id: 5, nombre: "Claveles mixtos", tipo: "Claveles", puesto: "Puesto 9 – Claveles Pepe", precio: 25, emoji: "🌺" },
  { id: 6, nombre: "Tulipanes rosados (10 u.)", tipo: "Tulipanes", puesto: "Puesto 21 – Primavera", precio: 60, emoji: "🌷" },
  { id: 7, nombre: "Rosas rosadas (docena)", tipo: "Rosas", puesto: "Puesto 5 – Rosales del Rímac", precio: 50, emoji: "🌸" },
  { id: 8, nombre: "Orquídea Cattleya", tipo: "Orquídeas", puesto: "Puesto 18 – Flor Exótica", precio: 95, emoji: "🌼" }
];

// Costo de envío fijo por distrito (ejemplo)
const costosEnvio = { "Rímac": 5, "Miraflores": 10, "Surco": 12, "Otros": 15 };

// Carrito en memoria: { idProducto: cantidad }
const carrito = {};

const $ = (id) => document.getElementById(id);
const soles = (n) => "S/ " + n.toFixed(2);

function renderProductos() {
  const texto = $("buscador").value.trim().toLowerCase();
  const tipo = $("filtro-tipo").value;
  const filtrados = productos.filter((p) =>
    (tipo === "todos" || p.tipo === tipo) &&
    (p.nombre + " " + p.puesto + " " + p.tipo).toLowerCase().includes(texto)
  );

  $("grilla").innerHTML = filtrados.map((p) => `
    <article class="tarjeta">
      <div class="tarjeta__emoji" aria-hidden="true">${p.emoji}</div>
      <span class="tarjeta__tipo">${p.tipo}</span>
      <h3>${p.nombre}</h3>
      <p class="tarjeta__puesto">${p.puesto}</p>
      <p class="tarjeta__precio">${soles(p.precio)}</p>
      <button class="btn" type="button" data-id="${p.id}">Agregar al carrito</button>
    </article>`).join("");
  $("sin-resultados").hidden = filtrados.length > 0;
}

function renderCarrito() {
  const ids = Object.keys(carrito);
  let cantidadTotal = 0;
  let subtotal = 0;

  $("lista-carrito").innerHTML = ids.map((id) => {
    const p = productos.find((x) => x.id === Number(id));
    const c = carrito[id];
    cantidadTotal += c;
    subtotal += p.precio * c;
    return `
      <li>
        <span>${p.nombre}</span>
        <span class="cantidad">
          <button type="button" data-accion="menos" data-id="${id}" aria-label="Quitar uno">−</button>
          ${c}
          <button type="button" data-accion="mas" data-id="${id}" aria-label="Agregar uno">+</button>
        </span>
        <strong>${soles(p.precio * c)}</strong>
      </li>`;
  }).join("");

  const esDelivery = document.querySelector('input[name="entrega"]:checked').value === "delivery";
  const envio = esDelivery && ids.length ? costosEnvio[$("distrito").value] : 0;

  $("campo-distrito").hidden = !esDelivery;
  $("carrito-vacio").hidden = ids.length > 0;
  $("contador").textContent = cantidadTotal;
  $("subtotal").textContent = soles(subtotal);
  $("envio").textContent = soles(envio);
  $("total").textContent = soles(subtotal + envio);
}

function cambiarCantidad(id, delta) {
  carrito[id] = (carrito[id] || 0) + delta;
  if (carrito[id] <= 0) delete carrito[id];
  $("mensaje").textContent = "";
  renderCarrito();
}

$("buscador").addEventListener("input", renderProductos);
$("filtro-tipo").addEventListener("change", renderProductos);
$("distrito").addEventListener("change", renderCarrito);
document.querySelectorAll('input[name="entrega"]').forEach((r) => r.addEventListener("change", renderCarrito));

$("grilla").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (btn) cambiarCantidad(btn.dataset.id, 1);
});

$("lista-carrito").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-accion]");
  if (btn) cambiarCantidad(btn.dataset.id, btn.dataset.accion === "mas" ? 1 : -1);
});

$("btn-carrito").addEventListener("click", () => $("carrito").scrollIntoView({ behavior: "smooth" }));

$("btn-vaciar").addEventListener("click", () => {
  Object.keys(carrito).forEach((k) => delete carrito[k]);
  $("mensaje").textContent = "";
  renderCarrito();
});

$("btn-finalizar").addEventListener("click", () => {
  if (!Object.keys(carrito).length) {
    $("mensaje").textContent = "Agrega al menos un producto.";
    return;
  }
  Object.keys(carrito).forEach((k) => delete carrito[k]);
  renderCarrito();
  $("mensaje").textContent = "¡Gracias! Pedido simulado registrado (no se envió a ningún servidor).";
});

renderProductos();
renderCarrito();
