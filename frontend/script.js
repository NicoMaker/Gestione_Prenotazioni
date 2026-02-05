// CONFIGURAZIONE
const API_URL = "/api";

let clienti = [];
let ordini = [];
let marche = [];
let modelli = [];
let utenti = [];
let allClienti = [];
let allOrdini = [];
let allMarche = [];
let allModelli = [];

// INIZIALIZZAZIONE
document.addEventListener("DOMContentLoaded", () => {
  const nomeUtente = localStorage.getItem("nomeUtente");
  if (!nomeUtente) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("currentUser").textContent = nomeUtente;

  const savedSection = localStorage.getItem("activeSection") || "clienti";
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
      mobileMenuToggle.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (
          !sidebar.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)
        ) {
          sidebar.classList.remove("mobile-open");
          mobileMenuToggle.classList.remove("active");
        }
      }
    });
  }

  // Setup navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const section = item.dataset.section;

      document
        .querySelectorAll(".nav-item")
        .forEach((i) => i.classList.remove("active"));
      document
        .querySelectorAll(".content-section")
        .forEach((s) => s.classList.remove("active"));

      item.classList.add("active");
      document.getElementById(`section-${section}`).classList.add("active");

      localStorage.setItem("activeSection", section);

      if (window.innerWidth <= 768) {
        sidebar.classList.remove("mobile-open");
        mobileMenuToggle.classList.remove("active");
      }

      // Carica dati sezione
      if (section === "clienti") loadClienti();
      if (section === "ordini") loadOrdini();
      if (section === "marche") loadMarche();
      if (section === "modelli") loadModelli();
      if (section === "utenti") loadUtenti();
    });
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.dataset.section === savedSection) {
      item.click();
    }
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("nomeUtente");
    localStorage.removeItem("utenteId");
    localStorage.removeItem("activeSection");
    window.location.href = "index.html";
  });

  // Sincronizzazione Marca / Modello negli ordini
  const ordineMarcaSelect = document.getElementById("ordineMarca");
  const ordineModelloSelect = document.getElementById("ordineModello");

  if (ordineMarcaSelect && ordineModelloSelect) {
    ordineMarcaSelect.addEventListener("change", () => {
      const marcaId = ordineMarcaSelect.value;
      populateOrdineModelliByMarca(marcaId);
      // quando cambio marca, azzero il modello
      ordineModelloSelect.value = "";
    });

    ordineModelloSelect.addEventListener("change", () => {
      const modelloId = ordineModelloSelect.value;
      if (!modelloId) return;
      const modello = allModelli.find(
        (m) => String(m.id) === String(modelloId)
      );
      if (modello && modello.marche_id) {
        ordineMarcaSelect.value = String(modello.marche_id);
      }
    });
  }
});

// ==================== CLIENTI ====================
async function loadClienti() {
  try {
    const res = await fetch(`${API_URL}/clienti`);
    allClienti = await res.json();
    clienti = allClienti;
    renderClienti();
  } catch (error) {
    console.error("Errore caricamento clienti:", error);
    showNotification("Errore caricamento clienti", "error");
  }
}

function renderClienti() {
  const tbody = document.getElementById("clientiTableBody");

  if (clienti.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Nessun cliente presente</td></tr>';
    return;
  }

  tbody.innerHTML = clienti
    .map(
      (c) => `
    <tr>
      <td><strong>${c.nome}</strong></td>
      <td>
        ${
          c.num_tel
            ? `
          <div class="contact-buttons">
            <a href="tel:${c.num_tel}" class="btn-contact btn-phone" title="Chiama">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              ${c.num_tel}
            </a>
            <a href="https://wa.me/${c.num_tel.replace(/[^0-9]/g, "")}" class="btn-contact btn-whatsapp" target="_blank" title="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        `
            : "-"
        }
      </td>
      <td>
        ${
          c.email
            ? `<a href="mailto:${c.email}" class="btn-contact btn-email" title="Invia Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            ${c.email}
          </a>`
            : "-"
        }
      </td>
      <td style="text-align: center">
        <span class="badge-count">${c.ordini_count || 0}</span>
      </td>
      <td class="text-right">
        <button class="btn-icon" onclick="editCliente(${c.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteCliente(${c.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

document.getElementById("filterClienti")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  clienti = allClienti.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm)) ||
      (c.num_tel && c.num_tel.includes(searchTerm))
  );
  renderClienti();
});

async function viewClienteOrdini(clienteId, clienteNome) {
  try {
    const res = await fetch(`${API_URL}/ordini/cliente/${clienteId}`);
    const ordini = await res.json();

    const ordiniHtml =
      ordini.length > 0
        ? ordini
            .map(
              (o) => `
      <div style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
        <strong>Data:</strong> ${formatDate(o.data_movimento)}<br/>
        <strong>Marca:</strong> ${o.marca_nome || "N/A"}<br/>
        <strong>Modello:</strong> ${o.modello_nome || "N/A"}<br/>
        <strong>Note:</strong> ${o.note || "-"}
      </div>
    `
            )
            .join("")
        : "<p>Nessun ordine trovato per questo cliente.</p>";

    showNotification(
      `<h3>Ordini di ${clienteNome}</h3>${ordiniHtml}`,
      "info",
      10000
    );
  } catch (error) {
    console.error("Errore caricamento ordini cliente:", error);
    showNotification("Errore caricamento ordini", "error");
  }
}

function openClienteModal(cliente = null) {
  const modal = document.getElementById("modalCliente");
  const title = document.getElementById("modalClienteTitle");
  const form = document.getElementById("formCliente");

  form.reset();

  if (cliente) {
    title.textContent = "Modifica Cliente";
    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("clienteNome").value = cliente.nome;
    document.getElementById("clienteTel").value = cliente.num_tel || "";
    document.getElementById("clienteEmail").value = cliente.email || "";
  } else {
    title.textContent = "Nuovo Cliente";
    document.getElementById("clienteId").value = "";
  }

  modal.classList.add("active");
}

function closeClienteModal() {
  document.getElementById("modalCliente").classList.remove("active");
}

function editCliente(id) {
  const cliente = clienti.find((c) => c.id === id);
  if (cliente) openClienteModal(cliente);
}

async function deleteCliente(id) {
  if (!confirm("Sei sicuro di voler eliminare questo cliente?")) return;

  try {
    const res = await fetch(`${API_URL}/clienti/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showNotification("Cliente eliminato con successo!", "success");
      loadClienti();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
}

document
  .getElementById("formCliente")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("clienteId").value;
    const nome = document.getElementById("clienteNome").value.trim();
    const num_tel = document.getElementById("clienteTel").value.trim();
    const email = document.getElementById("clienteEmail").value.trim();

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/clienti/${id}` : `${API_URL}/clienti`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, num_tel, email }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(
          id ? "Cliente aggiornato!" : "Cliente creato!",
          "success"
        );
        closeClienteModal();
        loadClienti();
      } else {
        showNotification(
          data.error || "Errore durante il salvataggio",
          "error"
        );
      }
    } catch (error) {
      showNotification("Errore di connessione", "error");
    }
  });

// ==================== ORDINI ====================
async function loadOrdini() {
  try {
    const res = await fetch(`${API_URL}/ordini`);
    allOrdini = await res.json();
    ordini = allOrdini;
    renderOrdini();
  } catch (error) {
    console.error("Errore caricamento ordini:", error);
    showNotification("Errore caricamento ordini", "error");
  }
}

function renderOrdini() {
  const tbody = document.getElementById("ordiniTableBody");

  if (ordini.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center">Nessun ordine presente</td></tr>';
    return;
  }

  tbody.innerHTML = ordini
    .map(
      (o) => `
    <tr>
      <td>${formatDate(o.data_movimento)}</td>
      <td><strong>${o.cliente_nome}</strong></td>
      <td>${o.marca_nome || "-"}</td>
      <td>${o.modello_nome || "-"}</td>
      <td>${o.note || "-"}</td>
      <td class="text-right">
        <button class="btn-icon" onclick="editOrdine(${o.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteOrdine(${o.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

document.getElementById("filterOrdini")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  ordini = allOrdini.filter(
    (o) =>
      o.cliente_nome.toLowerCase().includes(searchTerm) ||
      (o.marca_nome && o.marca_nome.toLowerCase().includes(searchTerm)) ||
      (o.modello_nome && o.modello_nome.toLowerCase().includes(searchTerm))
  );
  renderOrdini();
});

async function openOrdineModal(ordine = null) {
  const modal = document.getElementById("modalOrdine");
  const title = document.getElementById("modalOrdineTitle");
  const form = document.getElementById("formOrdine");

  // Carica clienti, marche e modelli per i select
  await Promise.all([
    loadClientiForSelect(),
    loadMarcheForSelect(),
    loadModelliForSelect(),
  ]);

  form.reset();

  if (ordine) {
    title.textContent = "Modifica Ordine";
    document.getElementById("ordineId").value = ordine.id;
    document.getElementById("ordineCliente").value = ordine.cliente_id;
    document.getElementById("ordineData").value = formatDateForInput(
      ordine.data_movimento
    );
    document.getElementById("ordineMarca").value = ordine.marca_id || "";
    document.getElementById("ordineModello").value = ordine.modello_id || "";
    document.getElementById("ordineNote").value = ordine.note || "";
  } else {
    title.textContent = "Nuovo Ordine";
    document.getElementById("ordineId").value = "";
    document.getElementById("ordineData").value = formatDateForInput(
      new Date().toISOString()
    );
  }

  modal.classList.add("active");
}

function closeOrdineModal() {
  document.getElementById("modalOrdine").classList.remove("active");
}

async function loadClientiForSelect() {
  try {
    const res = await fetch(`${API_URL}/clienti`);
    const clienti = await res.json();
    const select = document.getElementById("ordineCliente");
    select.innerHTML =
      '<option value="">Seleziona cliente</option>' +
      clienti.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");
  } catch (error) {
    console.error("Errore caricamento clienti:", error);
  }
}

async function loadMarcheForSelect() {
  try {
    const res = await fetch(`${API_URL}/marche`);
    const marche = await res.json();
    const selects = [
      document.getElementById("ordineMarca"),
      document.getElementById("modelloMarca"),
    ];
    selects.forEach((select) => {
      if (select) {
        select.innerHTML =
          '<option value="">Seleziona marca</option>' +
          marche.map((m) => `<option value="${m.id}">${m.nome}</option>`).join(
            ""
          );
      }
    });
  } catch (error) {
    console.error("Errore caricamento marche:", error);
  }
}

async function loadModelliForSelect() {
  try {
    const res = await fetch(`${API_URL}/modelli`);
    allModelli = await res.json();
    const currentMarcaId =
      document.getElementById("ordineMarca")?.value || "";
    populateOrdineModelliByMarca(currentMarcaId);
  } catch (error) {
    console.error("Errore caricamento modelli:", error);
  }
}

// Popola la select dei modelli filtrando per marca (se presente)
function populateOrdineModelliByMarca(marcaId) {
  const select = document.getElementById("ordineModello");
  if (!select) return;

  const source = Array.isArray(allModelli) ? allModelli : [];
  const filtered =
    marcaId && marcaId !== ""
      ? source.filter(
          (m) => m.marche_id && String(m.marche_id) === String(marcaId)
        )
      : source;

  select.innerHTML =
    '<option value="">Seleziona modello</option>' +
    filtered
      .map(
        (m) =>
          `<option value="${m.id}">${m.nome}${
            m.marca_nome ? ` (${m.marca_nome})` : ""
          }</option>`
      )
      .join("");
}

function editOrdine(id) {
  const ordine = ordini.find((o) => o.id === id);
  if (ordine) openOrdineModal(ordine);
}

async function deleteOrdine(id) {
  if (!confirm("Sei sicuro di voler eliminare questo ordine?")) return;

  try {
    const res = await fetch(`${API_URL}/ordini/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showNotification("Ordine eliminato con successo!", "success");
      loadOrdini();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
}

document.getElementById("formOrdine").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("ordineId").value;
  const cliente_id = document.getElementById("ordineCliente").value;
  const data_movimento = document.getElementById("ordineData").value;
  const marca_id = document.getElementById("ordineMarca").value || null;
  const modello_id = document.getElementById("ordineModello").value || null;
  const note = document.getElementById("ordineNote").value.trim();

  // Validazione coerenza Marca/Modello lato frontend
  if (modello_id) {
    const modello = allModelli.find(
      (m) => String(m.id) === String(modello_id)
    );
    if (!modello) {
      showNotification("Modello selezionato non valido.", "error");
      return;
    }
    if (marca_id && modello.marche_id) {
      if (String(modello.marche_id) !== String(marca_id)) {
        showNotification(
          "Il modello selezionato non appartiene alla marca indicata.",
          "error"
        );
        return;
      }
    }
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/ordini/${id}` : `${API_URL}/ordini`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id,
        data_movimento: data_movimento
          ? new Date(data_movimento).toISOString()
          : new Date().toISOString(),
        marca_id,
        modello_id,
        note,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showNotification(
        id ? "Ordine aggiornato!" : "Ordine creato!",
        "success"
      );
      closeOrdineModal();
      loadOrdini();
    } else {
      showNotification(data.error || "Errore durante il salvataggio", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
});

// ==================== MARCHE ====================
async function loadMarche() {
  try {
    const res = await fetch(`${API_URL}/marche`);
    allMarche = await res.json();
    marche = allMarche;
    renderMarche();
  } catch (error) {
    console.error("Errore caricamento marche:", error);
  }
}

function renderMarche() {
  const tbody = document.getElementById("marcheTableBody");

  if (marche.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="text-center">Nessuna marca presente</td></tr>';
    return;
  }

  tbody.innerHTML = marche
    .map(
      (m) => `
    <tr>
      <td><strong>${m.nome}</strong></td>
      <td class="text-center-badge">
        <span class="prodotti-badge ${
          m.prodotti_count > 0 ? "has-products" : "empty"
        }">
          ${m.prodotti_count || 0}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-icon" onclick="editMarca(${m.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteMarca(${m.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

document.getElementById("filterMarche")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  marche = allMarche.filter((m) => m.nome.toLowerCase().includes(searchTerm));
  renderMarche();
});

function openMarcaModal(marca = null) {
  const modal = document.getElementById("modalMarca");
  const title = document.getElementById("modalMarcaTitle");
  const form = document.getElementById("formMarca");

  form.reset();

  if (marca) {
    title.textContent = "Modifica Marca";
    document.getElementById("marcaId").value = marca.id;
    document.getElementById("marcaNome").value = marca.nome;
  } else {
    title.textContent = "Nuova Marca";
    document.getElementById("marcaId").value = "";
  }

  modal.classList.add("active");
}

function closeMarcaModal() {
  document.getElementById("modalMarca").classList.remove("active");
}

function editMarca(id) {
  const marca = marche.find((m) => m.id === id);
  if (marca) openMarcaModal(marca);
}

async function deleteMarca(id) {
  if (!confirm("Sei sicuro di voler eliminare questa marca?")) return;

  try {
    const res = await fetch(`${API_URL}/marche/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showNotification("Marca eliminata con successo!", "success");
      loadMarche();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
}

document.getElementById("formMarca").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("marcaId").value;
  const nome = document.getElementById("marcaNome").value.trim();

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/marche/${id}` : `${API_URL}/marche`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });

    const data = await res.json();

    if (res.ok) {
      showNotification(id ? "Marca aggiornata!" : "Marca creata!", "success");
      closeMarcaModal();
      loadMarche();
    } else {
      showNotification(data.error || "Errore durante il salvataggio", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
});

// ==================== MODELLI ====================
async function loadModelli() {
  try {
    const res = await fetch(`${API_URL}/modelli`);
    allModelli = await res.json();
    modelli = allModelli;
    renderModelli();
  } catch (error) {
    console.error("Errore caricamento modelli:", error);
  }
}

function renderModelli() {
  const tbody = document.getElementById("modelliTableBody");

  if (modelli.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center">Nessun modello presente</td></tr>';
    return;
  }

  tbody.innerHTML = modelli
    .map(
      (m) => `
    <tr>
      <td><strong>${m.nome}</strong></td>
      <td>${m.marca_nome || "-"}</td>
      <td class="text-center-badge">
        <span class="prodotti-badge ${
          m.ordini_count > 0 ? "has-products" : "empty"
        }">
          ${m.ordini_count || 0}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-icon" onclick="editModello(${m.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteModello(${m.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

document.getElementById("filterModelli")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  modelli = allModelli.filter(
    (m) =>
      m.nome.toLowerCase().includes(searchTerm) ||
      (m.marca_nome && m.marca_nome.toLowerCase().includes(searchTerm))
  );
  renderModelli();
});

async function openModelloModal(modello = null) {
  const modal = document.getElementById("modalModello");
  const title = document.getElementById("modalModelloTitle");
  const form = document.getElementById("formModello");

  await loadMarcheForSelect();

  form.reset();

  if (modello) {
    title.textContent = "Modifica Modello";
    document.getElementById("modelloId").value = modello.id;
    document.getElementById("modelloNome").value = modello.nome;
    document.getElementById("modelloMarca").value = modello.marche_id || "";
  } else {
    title.textContent = "Nuovo Modello";
    document.getElementById("modelloId").value = "";
  }

  modal.classList.add("active");
}

function closeModelloModal() {
  document.getElementById("modalModello").classList.remove("active");
}

function editModello(id) {
  const modello = modelli.find((m) => m.id === id);
  if (modello) openModelloModal(modello);
}

async function deleteModello(id) {
  if (!confirm("Sei sicuro di voler eliminare questo modello?")) return;

  try {
    const res = await fetch(`${API_URL}/modelli/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      showNotification("Modello eliminato con successo!", "success");
      loadModelli();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
}

document
  .getElementById("formModello")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("modelloId").value;
    const nome = document.getElementById("modelloNome").value.trim();
    const marche_id = document.getElementById("modelloMarca").value || null;

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/modelli/${id}` : `${API_URL}/modelli`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, marche_id }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(
          id ? "Modello aggiornato!" : "Modello creato!",
          "success"
        );
        closeModelloModal();
        loadModelli();
      } else {
        showNotification(
          data.error || "Errore durante il salvataggio",
          "error"
        );
      }
    } catch (error) {
      showNotification("Errore di connessione", "error");
    }
  });

// ==================== UTENTI ====================
async function loadUtenti() {
  try {
    const res = await fetch(`${API_URL}/utenti`);
    utenti = await res.json();
    renderUtenti();
  } catch (error) {
    console.error("Errore caricamento utenti:", error);
  }
}

function renderUtenti() {
  const tbody = document.getElementById("utentiTableBody");

  if (utenti.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="2" class="text-center">Nessun utente presente</td></tr>';
    return;
  }

  tbody.innerHTML = utenti
    .map(
      (u) => `
    <tr>
      <td><strong>${u.nome}</strong></td>
      <td class="text-right">
        <button class="btn-icon" onclick="editUtente(${u.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteUtente(${u.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

function openUtenteModal(utente = null) {
  const modal = document.getElementById("modalUtente");
  const title = document.getElementById("modalUtenteTitle");
  const form = document.getElementById("formUtente");
  const passwordInput = document.getElementById("utentePassword");

  form.reset();

  if (utente) {
    title.textContent = "Modifica Utente";
    document.getElementById("utenteId").value = utente.id;
    document.getElementById("utenteNome").value = utente.nome;
    passwordInput.removeAttribute("required");
  } else {
    title.textContent = "Nuovo Utente";
    document.getElementById("utenteId").value = "";
    passwordInput.setAttribute("required", "");
  }

  modal.classList.add("active");
}

function closeUtenteModal() {
  document.getElementById("modalUtente").classList.remove("active");
}

function editUtente(id) {
  const utente = utenti.find((u) => u.id === id);
  if (utente) openUtenteModal(utente);
}

async function deleteUtente(id) {
  if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;

  try {
    const res = await fetch(`${API_URL}/utenti/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showNotification("Utente eliminato con successo!", "success");
      loadUtenti();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch (error) {
    showNotification("Errore di connessione", "error");
  }
}

document
  .getElementById("formUtente")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("utenteId").value;
    const nome = document.getElementById("utenteNome").value.trim();
    const password = document.getElementById("utentePassword").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/utenti/${id}` : `${API_URL}/utenti`;

    const body = { nome };
    if (password) body.password = password;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(
          id ? "Utente aggiornato!" : "Utente creato!",
          "success"
        );
        closeUtenteModal();
        loadUtenti();
      } else {
        showNotification(
          data.error || "Errore durante il salvataggio",
          "error"
        );
      }
    } catch (error) {
      showNotification("Errore di connessione", "error");
    }
  });

// ==================== UTILITY ====================
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showNotification(message, type = "info", duration = 5000) {
  const container = document.getElementById("notificationContainer");
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}


// ==================== STAMPA ORDINI PER CLIENTE ====================

// riuso lo stesso JSON di company-loader.js, se già lo carichi lì
let companyInfoPrintCache = null;

/**
 * Carica le info aziendali per la stampa (riusa company-info.json)
 */
async function loadCompanyInfoForPrint() {
  try {
    if (companyInfoPrintCache) return companyInfoPrintCache;

    // se hai già companyInfo globale da company-loader.js puoi fare:
    if (typeof companyInfo !== 'undefined' && companyInfo) {
      companyInfoPrintCache = companyInfo;
      return companyInfoPrintCache;
    }

    const response = await fetch('company-info.json');
    if (!response.ok) {
      throw new Error(`Errore caricamento: ${response.status}`);
    }
    companyInfoPrintCache = await response.json();
    console.log('✅ Company info caricato per stampa:', companyInfoPrintCache);
    return companyInfoPrintCache;
  } catch (error) {
    console.error('❌ Errore caricamento company-info.json (stampa):', error);
    // fallback
    companyInfoPrintCache = {
      company: {
        name: 'Magazzino Moto',
        address: 'Via prova 123',
        city: 'Milano',
        cap: '20100',
        province: 'MI',
        country: 'Italia',
        piva: '1234567890',
        phone: '+39 02 1234567',
        email: 'info@magazzinomoto.it',
        website: 'www.magazzinomoto.it',
        logo: 'img/Logo.png',
      },
      settings: {
        currency: 'EUR',
        currencySymbol: '€',
        dateFormat: 'DD/MM/YYYY',
        decimalSeparator: ',',
        thousandsSeparator: '.',
      },
    };
    return companyInfoPrintCache;
  }
}

/**
 * Raggruppa gli ordini per cliente_id
 */
function groupOrdiniByCliente(ordini) {
  return ordini.reduce((groups, ordine) => {
    const clienteId = ordine.cliente_id;
    if (!groups[clienteId]) {
      groups[clienteId] = [];
    }
    groups[clienteId].push(ordine);
    return groups;
  }, {});
}

/**
 * Ordina gli ordini di un cliente per data decrescente
 */
function sortOrdiniByDateDesc(ordini) {
  return [...ordini].sort((a, b) => {
    const dateA = new Date(a.data_movimento);
    const dateB = new Date(b.data_movimento);
    return dateB - dateA; // più recente prima
  });
}

/**
 * Piccolo helper se vuoi una formatData separata
 */
function formatDataItStampa(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Intestazione HTML del PDF con logo e dati aziendali (presi da company-info)
 */
function generatePrintHeader(company) {
  return `
    <div class="print-header" style="text-align:center;margin-bottom:30px;border-bottom:2px solid #333;padding-bottom:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div style="flex:1;text-align:left;">
          <img src="${company.logo || 'img/Logo.png'}" alt="Logo" style="max-height:60px;width:auto;">
        </div>
        <div style="flex:2;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:bold;color:#000;">${company.name || 'MAGAZZINO'}</h1>
          <p style="margin:5px 0;font-size:12px;color:#666;">Registrazione ordini per cliente</p>
        </div>
        <div style="flex:1;"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:left;font-size:11px;color:#333;">
        <div>
          <p style="margin:3px 0;"><strong>Indirizzo:</strong> ${company.address || '-'}</p>
          <p style="margin:3px 0;"><strong>Città:</strong> ${company.cap || ''} ${company.city || ''} (${company.province || ''})</p>
          <p style="margin:3px 0;"><strong>Paese:</strong> ${company.country || 'Italia'}</p>
        </div>
        <div>
          <p style="margin:3px 0;"><strong>P.IVA:</strong> ${company.piva || '-'}</p>
          <p style="margin:3px 0;"><strong>Telefono:</strong> ${company.phone || '-'}</p>
          <p style="margin:3px 0;"><strong>Email:</strong> ${company.email || '-'}</p>
        </div>
      </div>

      <p style="margin-top:10px;font-size:10px;color:#999;">
        Stampato il: ${formatDataItStampa(new Date().toISOString())}
      </p>
    </div>
  `;
}

/**
 * Sezione HTML per un singolo cliente (ordini già passati e ordinati per data)
 */
function generateClienteSection(cliente, ordiniCliente) {
  const ordiniOrdinati = sortOrdiniByDateDesc(ordiniCliente);

  return `
    <div class="cliente-section" style="margin-bottom:30px;page-break-inside:avoid;">
      <div style="background-color:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:15px;border-left:4px solid #2980b9;">
        <h2 style="margin:0;font-size:16px;font-weight:bold;color:#2980b9;">
          ${cliente.nome || 'N/A'}
        </h2>
        <p style="margin:5px 0 0 0;font-size:12px;color:#666;">
          ${cliente.num_tel || '-'} | ${cliente.email || '-'}
        </p>
        <p style="margin:3px 0 0 0;font-size:10px;color:#999;">
          Totale ordini: ${ordiniOrdinati.length}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr style="background-color:#ecf0f1;border-bottom:2px solid #34495e;">
            <th style="padding:8px;text-align:left;border:1px solid #bdc3c7;">Data</th>
            <th style="padding:8px;text-align:left;border:1px solid #bdc3c7;">Marca</th>
            <th style="padding:8px;text-align:left;border:1px solid #bdc3c7;">Modello</th>
            <th style="padding:8px;text-align:left;border:1px solid #bdc3c7;">Note</th>
          </tr>
        </thead>
        <tbody>
          ${ordiniOrdinati
            .map(
              (o, i) => `
            <tr style="border-bottom:1px solid #ecf0f1;${i % 2 === 0 ? 'background-color:#fafafa;' : ''}">
              <td style="padding:8px;border:1px solid #ecf0f1;font-weight:bold;">
                ${formatDataItStampa(o.data_movimento)}
              </td>
              <td style="padding:8px;border:1px solid #ecf0f1;">
                ${o.marca_nome || '-'}
              </td>
              <td style="padding:8px;border:1px solid #ecf0f1;">
                ${o.modello_nome || '-'}
              </td>
              <td style="padding:8px;border:1px solid #ecf0f1;">
                ${o.note || '-'}
              </td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Genera l'HTML completo per la stampa (raggruppato per cliente)
 * - clienti in ordine alfabetico
 * - ordini interni in ordine di data decrescente
 */
function generatePrintDocumentOrdiniPerCliente(ordini, companyWrapper) {
  const company = companyWrapper.company || companyWrapper; // compatibile con company-info.json

  const gruppi = groupOrdiniByCliente(ordini);

  // lista di clienti unici (id, nome, tel, email), ordinati per nome
  const clientiUnici = Array.from(
    new Set(
      ordini.map((o) =>
        JSON.stringify({
          id: o.cliente_id,
          nome: o.cliente_nome,
          num_tel: o.cliente_tel,
          email: o.cliente_email,
        }),
      ),
    ),
  )
    .map((s) => JSON.parse(s))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'it'));

  const header = generatePrintHeader(company);

  const bodyClienti = clientiUnici
    .map((c) => {
      const ordiniCliente = gruppi[c.id] || [];
      return generateClienteSection(c, ordiniCliente);
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="it">
      <head>
        <meta charset="UTF-8" />
        <title>Stampa Ordini per Cliente</title>
        <style>
          body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            margin: 0;
            padding: 0;
          }
          .print-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background-color: #fff;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .print-container {
              max-width: 100%;
              padding: 0;
              margin: 0;
            }
            .cliente-section {
              page-break-inside: avoid;
              margin-bottom: 40px;
            }
          }
          .timestamp {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${header}
          ${bodyClienti}
          <div class="timestamp">
            Documento generato il: ${new Date().toLocaleString('it-IT')}
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Funzione principale: apre la finestra di stampa con ordini per cliente
 * - usa allOrdini già caricati da loadOrdini()
 */
async function printOrdiniPerCliente(ordiniInput) {
  try {
    console.log('🚀 Inizio generazione stampa ordini per cliente...');
    const ordiniDaStampare = ordiniInput || allOrdini;

    if (!ordiniDaStampare || !ordiniDaStampare.length) {
      showNotification('Nessun ordine da stampare', 'warning');
      return;
    }

    const companyInfo = await loadCompanyInfoForPrint();
    const html = generatePrintDocumentOrdiniPerCliente(ordiniDaStampare, companyInfo);

    const w = window.open('', '_blank');
    w.document.open();
    w.document.write(html);
    w.document.close();

    w.onload = () => {
      setTimeout(() => {
        w.print();
      }, 250);
    };

    console.log('✅ Finestra di stampa aperta');
  } catch (err) {
    console.error('❌ Errore nella stampa ordini per cliente:', err);
    showNotification('Errore nella generazione della stampa', 'error');
  }
}

// ==================== FUNZIONE EXPORT PDF (bonus) ====================
async function exportOrdiniPDF() {
  try {
    console.log('📥 Inizio export PDF ordini...');
    const ordiniDaEsportare = allOrdini;
    
    if (!ordiniDaEsportare || ordiniDaEsportare.length === 0) {
      showNotification('Nessun ordine da esportare', 'warning');
      return;
    }
    
    const companyInfo = await loadCompanyInfoForPrint();
    const html = generatePrintDocumentOrdiniPerCliente(ordiniDaEsportare, companyInfo);
    
    // Crea file HTML scaricabile (l'utente lo apre e stampa/salva come PDF)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ordini_per_cliente_${formatDataItStampa(new Date())}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('✅ File HTML scaricato! Aprilo e salva come PDF', 'success');
  } catch (error) {
    console.error('❌ Errore export PDF:', error);
    showNotification('Errore nell\'export del file', 'error');
  }
}

// ==================== AUTO-CARICA ORDINI ALL'AVVIO SEZIONE ORDINI ====================
document.addEventListener('DOMContentLoaded', () => {
  // Se l'utente apre direttamente sulla sezione ordini, carica subito
  const savedSection = localStorage.getItem('activeSection') || 'clienti';
  if (savedSection === 'ordini') {
    setTimeout(() => {
      loadOrdini();
      addPrintButtonsToOrdiniSection(); // se hai questa funzione
    }, 500);
  }
});

/**
 * 🖨️ STAMPA DIRETTA - sostituisce contenuto e chiama window.print()
 */
async function printOrdiniDiretta() {
  try {
    console.log('🖨️ Stampa diretta ordini per cliente...');
    
    if (!allOrdini || !allOrdini.length) {
      showNotification('Nessun ordine da stampare', 'warning');
      return;
    }

    const companyInfo = await loadCompanyInfoForPrint();
    const htmlPrint = generatePrintDocumentOrdiniPerCliente(allOrdini, companyInfo);
    
    // Sostituisce TUTTO il contenuto della pagina con la stampa
    document.body.innerHTML = htmlPrint;
    
    // Stampa immediatamente
    setTimeout(() => {
      window.print();
    }, 100);
    
  } catch (err) {
    console.error('❌ Errore stampa diretta:', err);
    showNotification('Errore nella stampa', 'error');
  }
}

// Esposizione globale
window.printOrdiniDiretta = printOrdiniDiretta;

/**
 * 🖨️ STAMPA DIRETTA - SOLO DIALOG STAMPA (niente web, niente sostituzione pagina)
 */
async function printOrdiniDiretta() {
  try {
    console.log('🖨️ Preparazione stampa diretta...');
    
    if (!allOrdini || !allOrdini.length) {
      showNotification('Nessun ordine da stampare', 'warning');
      return;
    }

    const companyInfo = await loadCompanyInfoForPrint();
    
    // Crea un FRAME INVISIBILE per la stampa
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
    
    // Genera HTML nel frame nascosto
    const htmlPrint = generatePrintDocumentOrdiniPerCliente(allOrdini, companyInfo);
    printFrame.contentDocument.open();
    printFrame.contentDocument.write(htmlPrint);
    printFrame.contentDocument.close();
    
    // Aspetta caricamento e STAMPA DIRETTAMENTE
    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow.print();
        // Rimuovi frame dopo stampa
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 250);
    };
    
    showNotification('🖨️ Dialog stampa aperto!', 'success');
    
  } catch (err) {
    console.error('❌ Errore stampa:', err);
    showNotification('Errore nella stampa', 'error');
  }
}

// Esposizione globale
window.printOrdiniDiretta = printOrdiniDiretta;
