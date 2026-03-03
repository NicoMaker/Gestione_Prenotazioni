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

/**
 * Formatta un numero di telefono per la visualizzazione
 */
function formatPhoneNumber(phone) {
  if (!phone || phone === "-") return phone;
  let cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+39")) {
    return cleaned.replace(/(\+39)(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  } else if (cleaned.startsWith("+")) {
    return cleaned.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  } else if (cleaned.length > 6) {
    return cleaned.replace(/(\d{3})(?=\d)/g, "$1 ");
  }
  return phone;
}

/**
 * Determina se un numero è un cellulare (idoneo per WhatsApp)
 * Logica: numeri italiani che iniziano con 3xx oppure +393xx
 * oppure numeri stranieri con prefisso mobile noto
 */
function isMobileNumber(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\s+/g, "");

  // Numero italiano con prefisso +39 seguito da 3
  if (/^\+393\d{8,9}$/.test(cleaned)) return true;

  // Numero italiano senza prefisso che inizia con 3 (10 cifre)
  if (/^3\d{9}$/.test(cleaned)) return true;

  // Numero con prefisso internazionale generico +XX seguito da cifre (probabile mobile)
  // Accettiamo qualunque numero internazionale non italiano come potenziale WA
  if (
    cleaned.startsWith("+") &&
    !cleaned.startsWith("+390") &&
    !cleaned.startsWith("+39 0")
  ) {
    // Se inizia con +39 deve avere il 3 dopo
    if (cleaned.startsWith("+39")) {
      return /^\+393/.test(cleaned);
    }
    return true; // numero estero → assume mobile
  }

  return false;
}

/**
 * Genera il blocco contatti: numero leggibile + icone allineate
 * Mostra WhatsApp solo se il numero è un cellulare
 */
function buildContactCell(numTel) {
  if (!numTel) return `<span class="no-contact">No Cell</span>`;

  const telClean = numTel.replace(/[^0-9+]/g, "");
  const waClean = numTel.replace(/[^0-9]/g, "");
  const displayNum = formatPhoneNumber(numTel);
  const showWA = isMobileNumber(numTel);

  return `
    <div class="contact-cell-v2">
      <span class="contact-number">${displayNum}</span>
      <div class="contact-icons">
        <a href="tel:${telClean}" class="ci ci-phone" title="Chiama">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </a>
        <a href="sms:${telClean}" class="ci ci-sms" title="SMS">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </a>
        ${
          showWA
            ? `
        <a href="https://wa.me/${waClean}" class="ci ci-wa" target="_blank" title="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>`
            : ""
        }
      </div>
    </div>`;
}

/**
 * Genera il blocco email
 */
function buildEmailCell(email) {
  if (!email) return `<span class="no-contact">No Mail</span>`;
  return `
    <div class="email-cell-v2">
      <a href="mailto:${email}" class="email-link-v2" title="Invia Email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        ${email}
      </a>
    </div>`;
}

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
      if (window.innerWidth <= 1024) {
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

      if (window.innerWidth <= 1024) {
        sidebar.classList.remove("mobile-open");
        mobileMenuToggle.classList.remove("active");
      }

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
      ordineModelloSelect.value = "";
    });

    ordineModelloSelect.addEventListener("change", () => {
      const modelloId = ordineModelloSelect.value;
      if (!modelloId) return;
      const modello = allModelli.find(
        (m) => String(m.id) === String(modelloId),
      );
      if (modello && modello.marche_id) {
        ordineMarcaSelect.value = String(modello.marche_id);
      }
    });
  }

  // Toggle password utenti
  const togglePassword = document.getElementById("toggleUtentePassword");
  const passwordInput = document.getElementById("utentePassword");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.08 2.58" />
          <line x1="1" y1="1" x2="23" y2="23" />
        `;
        togglePassword.style.color = "#6366f1";
      } else {
        passwordInput.type = "password";
        togglePassword.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        `;
        togglePassword.style.color = "#64748b";
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
    restoreClientiFilters();
  } catch (error) {
    console.error("Errore caricamento clienti:", error);
    showNotification("Errore caricamento clienti", "error");
  }
}

function renderClienti() {
  const tbody = document.getElementById("clientiTableBody");

  if (clienti.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">Nessun cliente presente</td></tr>';
    return;
  }

  tbody.innerHTML = clienti
    .map(
      (c) => `
    <tr>
      <td><strong>${c.nome}</strong></td>
      <td>${buildContactCell(c.num_tel)}</td>
      <td>${buildEmailCell(c.email)}</td>
      <td style="position: relative;">
        <div class="editable-date-cell" onclick="toggleDateEdit(${c.id}, '${c.data_passaggio || ""}', event)">
          <span class="date-display">${c.data_passaggio ? formatDate(c.data_passaggio) : "No"}</span>
          <svg class="edit-icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; margin-left: 6px; opacity: 0.5;">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <input
          type="date"
          class="inline-date-input"
          id="dateInput_${c.id}"
          value="${c.data_passaggio || ""}"
          data-original-value="${c.data_passaggio || ""}"
          onblur="saveAndHideDateInput(${c.id})"
          onkeydown="handleDateKeydown(event, ${c.id})"
          style="display: none; width: 100%; padding: 4px; border: 2px solid #6366f1; border-radius: 4px;"
        />
      </td>
      <td style="text-align:center;">
        <button
          class="badge-ricontatto ${c.flag_ricontatto ? "si" : "no"}"
          onclick="toggleRicontatto(${c.id}, ${!c.flag_ricontatto})"
          title="Clicca per cambiare stato ricontatto"
        >
          ${c.flag_ricontatto ? "📱 Ricontattato" : "⏳ Da ricontattare"}
        </button>
      </td>
      <td style="text-align: center">
        <span class="prodotti-badge ${c.ordini_count > 0 ? "has-products" : "empty"}">
          ${c.ordini_count || 0}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-icon" onclick="editCliente(${c.id})" title="Modifica cliente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteCliente(${c.id})" title="Elimina cliente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `,
    )
    .join("");
}

// Salva e ripristina filtri clienti
function saveClientiFilters() {
  const searchTerm = document.getElementById("filterClienti")?.value || "";
  const dataPassaggio =
    document.getElementById("filterDataPassaggio")?.value || "";
  localStorage.setItem("filter_clienti_search", searchTerm);
  localStorage.setItem("filter_clienti_data", dataPassaggio);
}

function restoreClientiFilters() {
  const savedSearch = localStorage.getItem("filter_clienti_search") || "";
  const savedData = localStorage.getItem("filter_clienti_data") || "";
  const searchInput = document.getElementById("filterClienti");
  const dataInput = document.getElementById("filterDataPassaggio");
  if (searchInput) searchInput.value = savedSearch;
  if (dataInput) dataInput.value = savedData;
  applyClientiFilters();
}

document.getElementById("filterClienti")?.addEventListener("input", () => {
  saveClientiFilters();
  applyClientiFilters();
});

document
  .getElementById("filterDataPassaggio")
  ?.addEventListener("change", () => {
    saveClientiFilters();
    applyClientiFilters();
  });

function applyClientiFilters() {
  const searchTerm =
    document.getElementById("filterClienti")?.value.toLowerCase() || "";
  const dataPassaggio =
    document.getElementById("filterDataPassaggio")?.value || "";

  clienti = allClienti.filter((c) => {
    const matchesText =
      !searchTerm ||
      c.nome.toLowerCase().includes(searchTerm) ||
      (c.num_tel && c.num_tel.toLowerCase().includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes(searchTerm)) ||
      (c.data_passaggio && c.data_passaggio.includes(searchTerm));
    const matchesData =
      !dataPassaggio ||
      (c.data_passaggio && c.data_passaggio.startsWith(dataPassaggio));
    return matchesText && matchesData;
  });

  renderClienti();
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
    document.getElementById("clienteDataPassaggio").value =
      cliente.data_passaggio || "";
    setRicontattoModalState(cliente.flag_ricontatto == 1);
  } else {
    title.textContent = "Nuovo Cliente";
    document.getElementById("clienteId").value = "";
    document.getElementById("clienteDataPassaggio").value = "";
    setRicontattoModalState(false);
  }

  modal.classList.add("active");
}

function closeClienteModal() {
  document.getElementById("modalCliente").classList.remove("active");
}

function setRicontattoModalState(isRicontattato) {
  const hiddenInput = document.getElementById("clienteFlagRicontatto");
  const btn = document.getElementById("btnToggleRicontattoModal");
  if (!hiddenInput || !btn) return;
  hiddenInput.value = isRicontattato ? "1" : "0";
  if (isRicontattato) {
    btn.textContent = "📱 Ricontattato";
    btn.classList.remove("no");
    btn.classList.add("si");
  } else {
    btn.textContent = "⏳ Da ricontattare";
    btn.classList.remove("si");
    btn.classList.add("no");
  }
}

function toggleRicontattoModal() {
  const hiddenInput = document.getElementById("clienteFlagRicontatto");
  if (!hiddenInput) return;
  const current = hiddenInput.value === "1";
  setRicontattoModalState(!current);
}

function editCliente(id) {
  const cliente = clienti.find((c) => c.id === id);
  if (cliente) openClienteModal(cliente);
}

async function toggleRicontatto(clienteId, isChecked) {
  try {
    const res = await fetch(`${API_URL}/clienti/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag_ricontatto: isChecked }),
    });
    const data = await res.json();
    if (res.ok) {
      const c = allClienti.find((x) => x.id === clienteId);
      if (c) c.flag_ricontatto = isChecked ? 1 : 0;
      const cf = clienti.find((x) => x.id === clienteId);
      if (cf) cf.flag_ricontatto = isChecked ? 1 : 0;
      showNotification(
        isChecked
          ? "📱 Cliente segnato come ricontattato"
          : "⏳ Flag ricontatto rimosso",
        "success",
      );
      renderClienti();
    } else {
      showNotification(data.error || "Errore durante l'aggiornamento", "error");
      renderClienti();
    }
  } catch {
    showNotification("Errore di connessione", "error");
    renderClienti();
  }
}

// Editing inline data passaggio
function toggleDateEdit(clienteId, currentDate, event) {
  event.stopPropagation();
  document.querySelectorAll(".inline-date-input").forEach((input) => {
    input.style.display = "none";
    const dateCell = input.closest("td")?.querySelector(".editable-date-cell");
    if (dateCell) dateCell.style.display = "flex";
  });
  const dateInput = document.getElementById(`dateInput_${clienteId}`);
  const dateCell = dateInput.previousElementSibling;
  if (dateInput && dateCell) {
    dateCell.style.display = "none";
    dateInput.style.display = "block";
    dateInput.setAttribute("data-original-value", dateInput.value);
    setTimeout(() => {
      dateInput.focus();
      try {
        dateInput.showPicker();
      } catch (e) {}
    }, 50);
  }
}

function handleDateKeydown(event, clienteId) {
  if (event.key === "Escape") {
    const dateInput = document.getElementById(`dateInput_${clienteId}`);
    if (dateInput) {
      dateInput.value = dateInput.getAttribute("data-original-value") || "";
      cancelDateEdit(clienteId);
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById(`dateInput_${clienteId}`)?.blur();
  }
}

function cancelDateEdit(clienteId) {
  const dateInput = document.getElementById(`dateInput_${clienteId}`);
  const dateCell = dateInput?.previousElementSibling;
  if (dateInput && dateCell) {
    dateInput.style.display = "none";
    dateCell.style.display = "flex";
  }
}

function saveAndHideDateInput(clienteId) {
  const dateInput = document.getElementById(`dateInput_${clienteId}`);
  const originalValue = dateInput?.getAttribute("data-original-value") || "";
  const newValue = dateInput?.value || "";
  if (newValue !== originalValue) {
    updateDataPassaggio(clienteId, newValue);
  } else {
    cancelDateEdit(clienteId);
  }
}

async function updateDataPassaggio(clienteId, newDate) {
  try {
    const res = await fetch(`${API_URL}/clienti/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data_passaggio: newDate || null }),
    });
    const data = await res.json();
    if (res.ok) {
      const c = allClienti.find((x) => x.id === clienteId);
      if (c) c.data_passaggio = newDate || null;
      const cf = clienti.find((x) => x.id === clienteId);
      if (cf) cf.data_passaggio = newDate || null;
      const dateInput = document.getElementById(`dateInput_${clienteId}`);
      const dateCell = dateInput?.previousElementSibling;
      if (dateCell) {
        const dd = dateCell.querySelector(".date-display");
        if (dd) dd.textContent = newDate ? formatDate(newDate) : "-";
      }
      cancelDateEdit(clienteId);
      showNotification(
        newDate ? "Data passaggio aggiornata" : "Data passaggio rimossa",
        "success",
      );
    } else {
      showNotification(data.error || "Errore durante l'aggiornamento", "error");
      cancelDateEdit(clienteId);
      renderClienti();
    }
  } catch {
    showNotification("Errore di connessione", "error");
    cancelDateEdit(clienteId);
    renderClienti();
  }
}

async function deleteCliente(id) {
  const conferma = await showConfirmModal(
    "Sei sicuro di voler eliminare questo cliente?",
    "Conferma Eliminazione",
  );
  if (!conferma) return;
  try {
    const res = await fetch(`${API_URL}/clienti/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      showNotification("Cliente eliminato con successo!", "success");
      loadClienti();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch {
    showNotification("Errore di connessione", "error");
  }
}

document.getElementById("formCliente").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("clienteId").value;
  const nome = document.getElementById("clienteNome").value.trim();
  const num_tel = document.getElementById("clienteTel").value.trim();
  const email = document.getElementById("clienteEmail").value.trim();
  const data_passaggio = document.getElementById("clienteDataPassaggio").value;
  const flag_ricontatto =
    document.getElementById("clienteFlagRicontatto").value === "1";

  if (!num_tel && !email) {
    showNotification("Inserire almeno un contatto: cellulare o email", "error");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/clienti/${id}` : `${API_URL}/clienti`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        num_tel,
        email,
        data_passaggio,
        flag_ricontatto,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      showNotification(
        id ? "Cliente aggiornato!" : "Cliente creato!",
        "success",
      );
      closeClienteModal();
      loadClienti();
    } else {
      showNotification(data.error || "Errore durante il salvataggio", "error");
    }
  } catch {
    showNotification("Errore di connessione", "error");
  }
});

// ==================== PREVENTIVI ====================
async function loadOrdini() {
  try {
    const res = await fetch(`${API_URL}/ordini`);
    allOrdini = await res.json();
    ordini = allOrdini;
    restoreOrdiniFilter();
  } catch (error) {
    console.error("Errore caricamento preventivi:", error);
    showNotification("Errore caricamento preventivi", "error");
  }
}

function renderOrdini() {
  const tbody = document.getElementById("ordiniTableBody");

  if (ordini.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="10" class="text-center">Nessun preventivo presente</td></tr>';
    return;
  }

  tbody.innerHTML = ordini
    .map((o) => {
      const telefono = o.cliente_tel || "";
      const email = o.cliente_email || "";
      const dataPassaggio = o.cliente_data_passaggio || "";
      const flagRicontatto = o.cliente_flag_ricontatto || 0;

      return `
    <tr>
      <td>${formatDate(o.data_movimento)}</td>
      <td><strong>${o.cliente_nome}</strong></td>
      <td>
        <div class="ordine-contact-col">
          ${buildContactCell(telefono)}
          ${buildEmailCell(email)}
        </div>
      </td>
      <td>
        <input
          type="date"
          class="inline-date-input"
          value="${dataPassaggio}"
          onchange="updateClienteDataPassaggio(${o.cliente_id}, this.value)"
          title="Modifica data passaggio"
        />
      </td>
      <td class="text-center">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <button
            class="badge-ricontatto ${flagRicontatto ? "si" : "no"}"
            onclick="updateClienteFlagRicontatto(${o.cliente_id}, ${!flagRicontatto})"
            title="Clicca per cambiare stato ricontatto"
          >
            ${flagRicontatto ? "📱 Ricontattato" : "⏳ Da ricontattare"}
          </button>
          <button
            class="badge-contratto ${o.contratto_finito ? "si" : "no"}"
            onclick="updateContrattoFinito(${o.id}, ${!o.contratto_finito})"
            title="Clicca per cambiare stato contratto"
          >
            ${o.contratto_finito ? "✅ concluso" : "🔴 Non concluso"}
          </button>
        </div>
      </td>
      <td>${o.marca_nome || "-"}</td>
      <td>${o.modello_nome || "-"}</td>
      <td>${o.note || "-"}</td>
      <td class="text-right">
        <button class="btn-icon" onclick="editOrdine(${o.id})" title="Modifica preventivo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon" onclick="deleteOrdine(${o.id})" title="Elimina preventivo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>`;
    })
    .join("");
}

async function updateClienteDataPassaggio(clienteId, newDate) {
  try {
    const response = await fetch(`${API_URL}/clienti/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data_passaggio: newDate }),
    });
    if (!response.ok) throw new Error();
    showNotification("Data passaggio aggiornata", "success");
    await loadOrdini();
  } catch {
    showNotification("Errore aggiornamento data passaggio", "error");
    await loadOrdini();
  }
}

async function updateClienteFlagRicontatto(clienteId, checked) {
  try {
    const response = await fetch(`${API_URL}/clienti/${clienteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag_ricontatto: checked }),
    });
    if (!response.ok) throw new Error();
    allOrdini
      .filter((x) => x.cliente_id === clienteId)
      .forEach((x) => {
        x.cliente_flag_ricontatto = checked ? 1 : 0;
      });
    ordini
      .filter((x) => x.cliente_id === clienteId)
      .forEach((x) => {
        x.cliente_flag_ricontatto = checked ? 1 : 0;
      });
    showNotification(
      checked
        ? "📱 Cliente segnato come ricontattato"
        : "⏳ Flag ricontatto rimosso",
      "success",
    );
    renderOrdini();
  } catch {
    showNotification("Errore aggiornamento flag ricontatto", "error");
    await loadOrdini();
  }
}

async function updateContrattoFinito(ordineId, newValue) {
  try {
    const ordine = allOrdini.find((o) => o.id === ordineId);
    if (!ordine) {
      showNotification("Preventivo non trovato", "error");
      return;
    }
    const response = await fetch(`${API_URL}/ordini/${ordineId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: ordine.cliente_id,
        data_movimento: ordine.data_movimento,
        marca_id: ordine.marca_id || null,
        modello_id: ordine.modello_id || null,
        note: ordine.note || null,
        contratto_finito: newValue,
      }),
    });
    if (!response.ok) throw new Error();
    const oa = allOrdini.find((o) => o.id === ordineId);
    if (oa) oa.contratto_finito = newValue ? 1 : 0;
    const of2 = ordini.find((o) => o.id === ordineId);
    if (of2) of2.contratto_finito = newValue ? 1 : 0;
    showNotification(
      newValue
        ? "✅ Contratto segnato come concluso!"
        : "🔴 Contratto segnato come non concluso",
      "success",
    );
    renderOrdini();
  } catch {
    showNotification("Errore aggiornamento contratto finito", "error");
    await loadOrdini();
  }
}

function toggleContrattoModal() {
  const hidden = document.getElementById("ordineContrattoFinito");
  const inner = document.getElementById("contrattoToggleInner");
  const icon = document.getElementById("contrattoIcon");
  const label = document.getElementById("contrattoLabel");
  const isNowFinito = hidden.value !== "1";
  hidden.value = isNowFinito ? "1" : "0";
  if (isNowFinito) {
    inner.classList.add("is-finito");
    icon.textContent = "✅";
    label.textContent = "concluso";
  } else {
    inner.classList.remove("is-finito");
    icon.textContent = "🔴";
    label.textContent = "Non concluso";
  }
}

function setContrattoModalState(value) {
  const hidden = document.getElementById("ordineContrattoFinito");
  const inner = document.getElementById("contrattoToggleInner");
  const icon = document.getElementById("contrattoIcon");
  const label = document.getElementById("contrattoLabel");
  if (!hidden || !inner) return;
  hidden.value = value ? "1" : "0";
  if (value) {
    inner.classList.add("is-finito");
    icon.textContent = "✅";
    label.textContent = "concluso";
  } else {
    inner.classList.remove("is-finito");
    icon.textContent = "🔴";
    label.textContent = "Non concluso";
  }
}

function saveOrdiniFilter() {
  localStorage.setItem(
    "filter_ordini_search",
    document.getElementById("filterOrdini")?.value || "",
  );
  localStorage.setItem(
    "filter_ordini_data_passaggio",
    document.getElementById("filterOrdiniDataPassaggio")?.value || "",
  );
}

function restoreOrdiniFilter() {
  const savedSearch = localStorage.getItem("filter_ordini_search") || "";
  const savedData = localStorage.getItem("filter_ordini_data_passaggio") || "";
  const si = document.getElementById("filterOrdini");
  const di = document.getElementById("filterOrdiniDataPassaggio");
  if (si) si.value = savedSearch;
  if (di) di.value = savedData;
  applyOrdiniFilter(savedSearch.toLowerCase(), savedData);
}

function applyOrdiniFilter(searchTerm = "", dataPassaggio = "") {
  ordini = allOrdini.filter((o) => {
    const matchText =
      !searchTerm ||
      o.cliente_nome.toLowerCase().includes(searchTerm) ||
      (o.cliente_tel && o.cliente_tel.toLowerCase().includes(searchTerm)) ||
      (o.cliente_email && o.cliente_email.toLowerCase().includes(searchTerm)) ||
      (o.marca_nome && o.marca_nome.toLowerCase().includes(searchTerm)) ||
      (o.modello_nome && o.modello_nome.toLowerCase().includes(searchTerm));
    const matchData =
      !dataPassaggio ||
      (o.cliente_data_passaggio && o.cliente_data_passaggio === dataPassaggio);
    return matchText && matchData;
  });
  renderOrdini();
}

document.getElementById("filterOrdini")?.addEventListener("input", (e) => {
  saveOrdiniFilter();
  applyOrdiniFilter(
    e.target.value.toLowerCase(),
    document.getElementById("filterOrdiniDataPassaggio")?.value || "",
  );
});

document
  .getElementById("filterOrdiniDataPassaggio")
  ?.addEventListener("change", (e) => {
    saveOrdiniFilter();
    applyOrdiniFilter(
      document.getElementById("filterOrdini")?.value.toLowerCase() || "",
      e.target.value,
    );
  });

async function openOrdineModal(ordine = null) {
  await loadClientiForSelect();

  const modal = document.getElementById("modalOrdine");
  const title = document.getElementById("modalOrdineTitle");
  const form = document.getElementById("formOrdine");

  form.reset();
  setContrattoModalState(false);

  if (!clienteSearchOrdine || !marcaModelloSearchOrdine) {
    await initOrdineSearchableSelects();
  } else {
    clienteSearchOrdine.reset();
    marcaModelloSearchOrdine.reset();
    await clienteSearchOrdine.loadData();
    await marcaModelloSearchOrdine.loadData();
  }

  if (ordine) {
    title.textContent = "Modifica Preventivo";
    document.getElementById("ordineId").value = ordine.id;
    document.getElementById("ordineData").value = formatDateForInput(
      ordine.data_movimento,
    );
    document.getElementById("ordineNote").value = ordine.note || "";
    setContrattoModalState(ordine.contratto_finito == 1);
    if (ordine.cliente_id && clienteSearchOrdine) {
      await clienteSearchOrdine.loadData();
      clienteSearchOrdine.setValue(ordine.cliente_id);
    }
    if (ordine.modello_id && marcaModelloSearchOrdine) {
      await marcaModelloSearchOrdine.loadData();
      marcaModelloSearchOrdine.setValue(ordine.modello_id);
      if (ordine.marca_id) {
        const mh = document.getElementById("ordineMarca");
        if (mh) mh.value = ordine.marca_id;
      }
    }
  } else {
    title.textContent = "Nuovo Preventivo";
    document.getElementById("ordineId").value = "";
    document.getElementById("ordineData").value = new Date()
      .toISOString()
      .split("T")[0];
  }

  modal.classList.add("active");
}

function closeOrdineModal() {
  document.getElementById("modalOrdine").classList.remove("active");
}

async function loadClientiForSelect() {
  try {
    const res = await fetch(`${API_URL}/clienti`);
    allClienti = await res.json();
  } catch (e) {
    console.error("Errore caricamento clienti:", e);
  }
}

async function loadMarcheForSelect() {
  try {
    const res = await fetch(`${API_URL}/marche`);
    const marche = await res.json();
    ["ordineMarca", "modelloMarca"].forEach((id) => {
      const sel = document.getElementById(id);
      if (sel)
        sel.innerHTML =
          '<option value="">Seleziona marca</option>' +
          marche
            .map((m) => `<option value="${m.id}">${m.nome}</option>`)
            .join("");
    });
  } catch (e) {
    console.error("Errore caricamento marche:", e);
  }
}

async function loadModelliForSelect() {
  try {
    const res = await fetch(`${API_URL}/modelli`);
    allModelli = await res.json();
    populateOrdineModelliByMarca(
      document.getElementById("ordineMarca")?.value || "",
    );
  } catch (e) {
    console.error("Errore caricamento modelli:", e);
  }
}

function populateOrdineModelliByMarca(marcaId) {
  const select = document.getElementById("ordineModello");
  if (!select) return;
  const source = Array.isArray(allModelli) ? allModelli : [];
  const filtered = marcaId
    ? source.filter((m) => String(m.marche_id) === String(marcaId))
    : source;
  select.innerHTML =
    '<option value="">Seleziona modello</option>' +
    filtered
      .map(
        (m) =>
          `<option value="${m.id}">${m.nome}${m.marca_nome ? ` (${m.marca_nome})` : ""}</option>`,
      )
      .join("");
}

function editOrdine(id) {
  const ordine = ordini.find((o) => o.id === id);
  if (ordine) openOrdineModal(ordine);
}

async function deleteOrdine(id) {
  const conferma = await showConfirmModal(
    "Sei sicuro di voler eliminare questo preventivo?",
    "Conferma Eliminazione",
  );
  if (!conferma) return;
  try {
    const res = await fetch(`${API_URL}/ordini/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      showNotification("Preventivo eliminato con successo!", "success");
      loadOrdini();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch {
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
  const contratto_finito =
    document.getElementById("ordineContrattoFinito").value === "1";

  if (!cliente_id) {
    showNotification("Seleziona un cliente dalla lista", "warning");
    return;
  }

  if (modello_id && Array.isArray(allModelli) && allModelli.length > 0) {
    const modello = allModelli.find((m) => String(m.id) === String(modello_id));
    if (
      modello &&
      marca_id &&
      modello.marche_id &&
      String(modello.marche_id) !== String(marca_id)
    ) {
      showNotification(
        "Il modello selezionato non appartiene alla marca indicata.",
        "error",
      );
      return;
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
        contratto_finito,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      showNotification(
        id ? "Preventivo aggiornato!" : "Preventivo creato!",
        "success",
      );
      closeOrdineModal();
      loadOrdini();
    } else {
      showNotification(data.error || "Errore durante il salvataggio", "error");
    }
  } catch {
    showNotification("Errore di connessione", "error");
  }
});

// ==================== MARCHE ====================
async function loadMarche() {
  try {
    const res = await fetch(`${API_URL}/marche`);
    allMarche = await res.json();
    marche = allMarche;
    restoreMarcheFilter();
  } catch {
    console.error("Errore caricamento marche");
  }
}

function renderMarche() {
  const tbody = document.getElementById("marcheTableBody");
  if (marche.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center">Nessuna marca presente</td></tr>';
    return;
  }
  tbody.innerHTML = marche
    .map(
      (m) => `
    <tr>
      <td><strong>${m.nome}</strong></td>
      <td class="text-center-badge"><span class="prodotti-badge ${m.prodotti_count > 0 ? "has-products" : "empty"}">${m.prodotti_count || 0}</span></td>
      <td class="text-center-badge"><span class="prodotti-badge ${m.preventivi_count > 0 ? "has-products" : "empty"}">${m.preventivi_count || 0}</span></td>
      <td class="text-right">
        <button class="btn-icon" onclick="editMarca(${m.id})" title="Modifica marca">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" onclick="deleteMarca(${m.id})" title="Elimina marca">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>`,
    )
    .join("");
}

function saveMarcheFilter() {
  localStorage.setItem(
    "filter_marche_search",
    document.getElementById("filterMarche")?.value || "",
  );
}
function restoreMarcheFilter() {
  const s = localStorage.getItem("filter_marche_search") || "";
  const i = document.getElementById("filterMarche");
  if (i) i.value = s;
  applyMarcheFilter(s.toLowerCase());
}
function applyMarcheFilter(s) {
  marche = allMarche.filter((m) => m.nome.toLowerCase().includes(s));
  renderMarche();
}
document.getElementById("filterMarche")?.addEventListener("input", (e) => {
  saveMarcheFilter();
  applyMarcheFilter(e.target.value.toLowerCase());
});

function openMarcaModal(marca = null) {
  const modal = document.getElementById("modalMarca");
  document.getElementById("formMarca").reset();
  if (marca) {
    document.getElementById("modalMarcaTitle").textContent = "Modifica Marca";
    document.getElementById("marcaId").value = marca.id;
    document.getElementById("marcaNome").value = marca.nome;
  } else {
    document.getElementById("modalMarcaTitle").textContent = "Nuova Marca";
    document.getElementById("marcaId").value = "";
  }
  modal.classList.add("active");
}
function closeMarcaModal() {
  document.getElementById("modalMarca").classList.remove("active");
}
function editMarca(id) {
  const m = marche.find((x) => x.id === id);
  if (m) openMarcaModal(m);
}

async function deleteMarca(id) {
  const conferma = await showConfirmModal(
    "Sei sicuro di voler eliminare questa marca?",
    "Conferma Eliminazione",
  );
  if (!conferma) return;
  try {
    const res = await fetch(`${API_URL}/marche/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      showNotification("Marca eliminata con successo!", "success");
      loadMarche();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch {
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
  } catch {
    showNotification("Errore di connessione", "error");
  }
});

// ==================== MODELLI ====================
async function loadModelli() {
  try {
    const res = await fetch(`${API_URL}/modelli`);
    allModelli = await res.json();
    modelli = allModelli;
    restoreModelliFilter();
  } catch {
    console.error("Errore caricamento modelli");
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
      <td class="text-center-badge"><span class="prodotti-badge ${m.ordini_count > 0 ? "has-products" : "empty"}">${m.ordini_count || 0}</span></td>
      <td class="text-right">
        <button class="btn-icon" onclick="editModello(${m.id})" title="Modifica modello">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" onclick="deleteModello(${m.id})" title="Elimina modello">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>`,
    )
    .join("");
}

function saveModelliFilter() {
  localStorage.setItem(
    "filter_modelli_search",
    document.getElementById("filterModelli")?.value || "",
  );
}
function restoreModelliFilter() {
  const s = localStorage.getItem("filter_modelli_search") || "";
  const i = document.getElementById("filterModelli");
  if (i) i.value = s;
  applyModelliFilter(s.toLowerCase());
}
function applyModelliFilter(s) {
  modelli = allModelli.filter(
    (m) =>
      m.nome.toLowerCase().includes(s) ||
      (m.marca_nome && m.marca_nome.toLowerCase().includes(s)),
  );
  renderModelli();
}
document.getElementById("filterModelli")?.addEventListener("input", (e) => {
  saveModelliFilter();
  applyModelliFilter(e.target.value.toLowerCase());
});

async function openModelloModal(modello = null) {
  const modal = document.getElementById("modalModello");
  document.getElementById("formModello").reset();
  if (!marcaSearchModello) {
    await initModelloSearchableSelects();
  } else {
    marcaSearchModello.reset();
    await marcaSearchModello.loadData();
  }
  if (modello) {
    document.getElementById("modalModelloTitle").textContent =
      "Modifica Modello";
    document.getElementById("modelloId").value = modello.id;
    document.getElementById("modelloNome").value = modello.nome;
    if (modello.marche_id && marcaSearchModello) {
      await marcaSearchModello.loadData();
      marcaSearchModello.setValue(modello.marche_id);
    }
  } else {
    document.getElementById("modalModelloTitle").textContent = "Nuovo Modello";
    document.getElementById("modelloId").value = "";
  }
  modal.classList.add("active");
}

function closeModelloModal() {
  document.getElementById("modalModello").classList.remove("active");
}
function editModello(id) {
  const m = modelli.find((x) => x.id === id);
  if (m) openModelloModal(m);
}

async function deleteModello(id) {
  const conferma = await showConfirmModal(
    "Sei sicuro di voler eliminare questo modello?",
    "Conferma Eliminazione",
  );
  if (!conferma) return;
  try {
    const res = await fetch(`${API_URL}/modelli/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      showNotification("Modello eliminato con successo!", "success");
      loadModelli();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch {
    showNotification("Errore di connessione", "error");
  }
}

document.getElementById("formModello").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("modelloId").value;
  const nome = document.getElementById("modelloNome").value.trim();
  const marche_id = document.getElementById("modelloMarca").value;
  if (!marche_id || marche_id === "" || marche_id === "null") {
    showNotification("Seleziona una marca per il modello", "error");
    return;
  }
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
        "success",
      );
      closeModelloModal();
      loadModelli();
    } else {
      showNotification(data.error || "Errore durante il salvataggio", "error");
    }
  } catch {
    showNotification("Errore di connessione", "error");
  }
});

// ==================== UTENTI ====================
async function loadUtenti() {
  try {
    const res = await fetch(`${API_URL}/utenti`);
    utenti = await res.json();
    renderUtenti();
  } catch {
    console.error("Errore caricamento utenti");
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
        <button class="btn-icon" onclick="editUtente(${u.id})" title="Modifica utente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" onclick="deleteUtente(${u.id})" title="Elimina utente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    </tr>`,
    )
    .join("");
}

function openUtenteModal(utente = null) {
  const modal = document.getElementById("modalUtente");
  const passwordInput = document.getElementById("utentePassword");
  document.getElementById("formUtente").reset();
  const passwordLabel = document.getElementById("utentePasswordLabel");
  const passwordHelp = document.getElementById("passwordHelp");
  if (utente) {
    document.getElementById("modalUtenteTitle").textContent = "Modifica Utente";
    document.getElementById("utenteId").value = utente.id;
    document.getElementById("utenteNome").value = utente.nome;
    passwordInput.removeAttribute("required");
    passwordInput.placeholder = "Lascia vuoto per non cambiare";
    if (passwordLabel) passwordLabel.textContent = "Password";
    if (passwordHelp)
      passwordHelp.textContent =
        "Lascia vuoto per mantenere la password attuale";
  } else {
    document.getElementById("modalUtenteTitle").textContent = "Nuovo Utente";
    document.getElementById("utenteId").value = "";
    passwordInput.setAttribute("required", "");
    passwordInput.placeholder = "password";
    if (passwordLabel) passwordLabel.textContent = "Password *";
    if (passwordHelp)
      passwordHelp.textContent =
        "Minimo 8 caratteri, una maiuscola, una minuscola e un numero";
  }
  modal.classList.add("active");
}

function closeUtenteModal() {
  document.getElementById("modalUtente").classList.remove("active");
}
function editUtente(id) {
  const u = utenti.find((x) => x.id === id);
  if (u) openUtenteModal(u);
}

async function deleteUtente(id) {
  const conferma = await showConfirmModal(
    "Sei sicuro di voler eliminare questo utente?",
    "Conferma Eliminazione",
  );
  if (!conferma) return;
  try {
    const res = await fetch(`${API_URL}/utenti/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      showNotification("Utente eliminato con successo!", "success");
      loadUtenti();
    } else {
      showNotification(data.error || "Errore durante l'eliminazione", "error");
    }
  } catch {
    showNotification("Errore di connessione", "error");
  }
}

document.getElementById("formUtente").addEventListener("submit", async (e) => {
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
      showNotification(id ? "Utente aggiornato!" : "Utente creato!", "success");
      closeUtenteModal();
      loadUtenti();
    } else {
      showNotification(data.error || "Errore durante il salvataggio", "error");
    }
  } catch {
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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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

function showConfirmModal(message, title = "Conferma") {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.style.zIndex = "10000";
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header"><h2>${title}</h2></div>
        <div class="modal-body"><p style="font-size: 16px; line-height: 1.6; color: #334155;">${message}</p></div>
        <div class="modal-footer" style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" class="btn-cancel" style="padding: 10px 24px; border: 2px solid #e2e8f0; background: white; color: #64748b; border-radius: 8px; cursor: pointer; font-weight: 600;">Annulla</button>
          <button type="button" class="btn-confirm" style="padding: 10px 24px; border: none; background: #ef4444; color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">Conferma</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector(".btn-cancel").addEventListener("click", () => {
      modal.remove();
      resolve(false);
    });
    modal.querySelector(".btn-confirm").addEventListener("click", () => {
      modal.remove();
      resolve(true);
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(false);
      }
    });
  });
}

function closeConfirmModal() {
  document.getElementById("confirmModal")?.classList.remove("active");
}
function closeAlertModal() {
  document.getElementById("alertModal")?.classList.remove("active");
}

// ==================== STAMPA PREVENTIVI PER CLIENTE ====================
let companyInfoPrintCache = null;

async function loadCompanyInfoForPrint() {
  try {
    if (companyInfoPrintCache) return companyInfoPrintCache;
    if (typeof companyInfo !== "undefined" && companyInfo) {
      companyInfoPrintCache = companyInfo;
      return companyInfoPrintCache;
    }
    const response = await fetch("company-info.json");
    if (!response.ok) throw new Error();
    companyInfoPrintCache = await response.json();
    return companyInfoPrintCache;
  } catch {
    return companyInfoPrintCache;
  }
}

function groupOrdiniByCliente(ordini) {
  return ordini.reduce((groups, o) => {
    if (!groups[o.cliente_id]) groups[o.cliente_id] = [];
    groups[o.cliente_id].push(o);
    return groups;
  }, {});
}

function sortOrdiniByDateDesc(ordini) {
  return [...ordini].sort(
    (a, b) => new Date(b.data_movimento) - new Date(a.data_movimento),
  );
}

function generatePrintHeader(company) {
  const logoPath = company.logo || "img/Logo.png";
  return `
    <div class="print-header" style="text-align:center;margin-bottom:30px;border-bottom:3px solid #333;padding-bottom:25px;">
      <img src="${logoPath}" alt="Logo" style="max-width:200px;height:auto;margin-bottom:15px;display:block;margin-left:auto;margin-right:auto;" />
      <h1 style="margin:10px 0 5px 0;font-size:26px;font-weight:bold;color:#2c3e50;">${company.name || "Riepilogo Preventivi"}</h1>
      <p style="margin:3px 0;font-size:13px;color:#555;">${company.address || ""}, ${company.cap || ""} ${company.city || ""} (${company.province || ""})</p>
      <p style="margin:3px 0;font-size:12px;color:#555;">${company.country || "Italia"}</p>
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid #ddd;">
        <p style="margin:3px 0;font-size:11px;color:#666;"><strong>P.IVA:</strong> ${company.piva || ""}</p>
        <p style="margin:3px 0;font-size:11px;color:#666;"><strong>Tel:</strong> ${formatPhoneNumber(company.phone) || ""} | <strong>Email:</strong> ${company.email || ""}</p>
      </div>
    </div>`;
}

function generateClienteSection(cliente, ordiniCliente) {
  const ordiniOrdinati = sortOrdiniByDateDesc(ordiniCliente);
  return `
  <div class="cliente-section" style="margin-bottom:30px;page-break-inside:avoid;">
    <div style="background:#f5f5f5;padding:15px;border-radius:6px;margin-bottom:15px;border-left:5px solid #2980b9;">
      <h2 style="margin:0 0 8px 0;font-size:17px;color:#2980b9;font-weight:bold;">${cliente.nome || "N/A"}</h2>
      <p style="margin:4px 0;font-size:12px;color:#555;"><strong>📱 Cell:</strong> ${cliente.num_tel ? formatPhoneNumber(cliente.num_tel) : "No"}</p>
      <p style="margin:4px 0;font-size:12px;color:#555;"><strong>✉️ Email:</strong> ${cliente.email || "No"}</p>
      <p style="margin:4px 0;font-size:12px;color:#555;"><strong>📅 Data Passaggio/Ricontatto:</strong> ${cliente.data_passaggio ? formatDate(cliente.data_passaggio) : "No"}</p>
      <p style="margin:4px 0;"><span style="display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:700;${cliente.flag_ricontatto == 1 ? "background:#ede9fe;color:#4c1d95;border:1px solid #c4b5fd;" : "background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;"}">${cliente.flag_ricontatto == 1 ? "📱 Ricontattato" : "⏳ Da ricontattare"}</span></p>
      <p style="margin:8px 0 0 0;font-size:11px;color:#777;font-style:italic;">Totale preventivi: <strong>${ordiniOrdinati.length}</strong></p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead>
        <tr style="background:#ecf0f1;border-bottom:2px solid #34495e;">
          <th style="padding:10px;text-align:left;border:1px solid #bdc3c7;">Data Preventivo</th>
          <th style="padding:10px;text-align:left;border:1px solid #bdc3c7;">Marca</th>
          <th style="padding:10px;text-align:left;border:1px solid #bdc3c7;">Modello</th>
          <th style="padding:10px;text-align:center;border:1px solid #bdc3c7;">Contratto</th>
          <th style="padding:10px;text-align:left;border:1px solid #bdc3c7;">Note</th>
        </tr>
      </thead>
      <tbody>
        ${ordiniOrdinati
          .map(
            (o, i) => `
          <tr style="border-bottom:1px solid #ecf0f1;${i % 2 === 0 ? "background:#fafafa;" : ""}">
            <td style="padding:10px;border:1px solid #ecf0f1;font-weight:bold;white-space:nowrap;">${formatDate(o.data_movimento)}</td>
            <td style="padding:10px;border:1px solid #ecf0f1;">${o.marca_nome || "-"}</td>
            <td style="padding:10px;border:1px solid #ecf0f1;">${o.modello_nome || "-"}</td>
            <td style="padding:10px;border:1px solid #ecf0f1;text-align:center;">
              <span style="display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;${o.contratto_finito ? "background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;" : "background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;"}">
                ${o.contratto_finito ? "✅ concluso" : "🔴 Non concluso"}
              </span>
            </td>
            <td style="padding:10px;border:1px solid #ecf0f1;">${o.note || "-"}</td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function generatePrintDocumentOrdiniPerCliente(ordini, companyWrapper) {
  const company = companyWrapper.company || companyWrapper;
  const gruppi = groupOrdiniByCliente(ordini);
  const clientiUnici = Array.from(
    new Set(
      ordini.map((o) =>
        JSON.stringify({
          id: o.cliente_id,
          nome: o.cliente_nome,
          num_tel: o.cliente_tel,
          email: o.cliente_email,
          data_passaggio: o.cliente_data_passaggio,
          flag_ricontatto: o.cliente_flag_ricontatto,
        }),
      ),
    ),
  )
    .map((s) => JSON.parse(s))
    .sort((a, b) => a.nome.localeCompare(b.nome, "it"));

  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8" /><title>Stampa Preventivi per Cliente</title>
    <style>body{font-family:Arial,sans-serif;line-height:1.6;margin:0;padding:0;}.print-container{max-width:210mm;margin:0 auto;padding:20mm;}
    @media print{body{margin:0;padding:0;}.print-container{max-width:100%;padding:0;margin:0;}.cliente-section{page-break-inside:avoid;margin-bottom:40px;}}</style>
    </head><body><div class="print-container">${generatePrintHeader(company)}${clientiUnici.map((c) => generateClienteSection(c, gruppi[c.id] || [])).join("")}
    <div style="margin-top:20px;text-align:center;font-size:10px;color:#999;border-top:1px solid #ddd;padding-top:10px;">
      Documento generato il: ${new Date().toLocaleString("it-IT")}</div></div></body></html>`;
}

async function printOrdiniDiretta() {
  try {
    if (!ordini || !ordini.length) {
      showNotification(
        "Nessun preventivo da stampare. Controlla i filtri applicati.",
        "warning",
      );
      return;
    }
    companyInfo = await loadCompanyInfoForPrint();
    const htmlPrint = generatePrintDocumentOrdiniPerCliente(
      ordini,
      companyInfo,
    );
    const printFrame = document.createElement("iframe");
    printFrame.style.cssText =
      "position:absolute;left:-9999px;width:0;height:0;border:0;";
    document.body.appendChild(printFrame);
    printFrame.contentDocument.open();
    printFrame.contentDocument.write(htmlPrint);
    printFrame.contentDocument.close();
    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 250);
    };
    showNotification("Dialog stampa aperto!", "success");
  } catch {
    showNotification("Errore nella stampa", "error");
  }
}

window.printOrdiniDiretta = printOrdiniDiretta;

document.addEventListener("DOMContentLoaded", () => {
  const savedSection = localStorage.getItem("activeSection") || "clienti";
  if (savedSection === "ordini") {
    setTimeout(() => {
      loadOrdini();
    }, 500);
  }
});

// ==================== SEARCHABLE SELECT ====================
function createSearchableSelect(
  containerId,
  inputId,
  placeholder,
  getData,
  onSelect,
  required = false,
) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container ${containerId} non trovato`);
    return null;
  }

  container.innerHTML = `
    <div class="searchable-select-wrapper" style="position:relative;">
      <div class="searchable-input-wrapper" style="position:relative;">
        <input type="text" id="${inputId}_search" class="searchable-select-input" placeholder="${placeholder}" autocomplete="off"
          style="width:100%;padding:12px 50px 12px 18px;border:2px solid #e2e8f0;border-radius:12px;font-size:15px;transition:all 0.25s ease;background:white;"/>
        <button type="button" class="clear-selection-btn"
          style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:#ef4444;color:white;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;display:none;font-size:14px;font-weight:bold;transition:all 0.2s;">×</button>
      </div>
      <input type="hidden" id="${inputId}" name="${inputId}" />
      <div class="searchable-select-results" style="position:absolute;top:100%;left:0;right:0;max-height:300px;overflow-y:auto;background:white;border:2px solid #6366f1;border-top:none;border-radius:0 0 12px 12px;box-shadow:0 8px 20px rgba(0,0,0,0.15);display:none;z-index:1000;margin-top:-2px;"></div>
      <div class="selection-display" style="margin-top:8px;display:none;">
        <div style="background:linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%);padding:10px 14px;border-radius:8px;border-left:4px solid #10b981;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <span style="font-size:11px;color:#065f46;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Selezionato</span>
              <div class="selected-value-display" style="font-size:15px;color:#065f46;font-weight:700;margin-top:2px;"></div>
              <div class="selected-extra-display" style="font-size:12px;color:#047857;font-weight:600;margin-top:3px;"></div>
            </div>
            <span style="font-size:24px;">✓</span>
          </div>
        </div>
      </div>
    </div>`;

  const searchInput = container.querySelector(`#${inputId}_search`);
  const hiddenInput = container.querySelector(`#${inputId}`);
  const results = container.querySelector(".searchable-select-results");
  const clearBtn = container.querySelector(".clear-selection-btn");
  const selectionDisplay = container.querySelector(".selection-display");
  const selectedValueDisplay = container.querySelector(
    ".selected-value-display",
  );

  let allData = [],
    currentData = [],
    selectedValue = null,
    selectedName = null;

  async function loadData() {
    allData = await getData();
    currentData = allData;
  }

  function showResults(filteredData) {
    if (filteredData.length === 0) {
      results.innerHTML =
        '<div style="padding:20px;text-align:center;color:#64748b;">Nessun risultato trovato</div>';
      results.style.display = "block";
      return;
    }
    results.innerHTML = filteredData
      .map(
        (item) => `
      <div class="result-item" data-id="${item.id}" data-nome="${item.nome}" style="padding:12px 18px;cursor:pointer;transition:all 0.2s ease;border-bottom:1px solid #f1f5f9;">
        <div style="font-weight:600;color:#334155;">${highlightText(item.nome, searchInput.value)}</div>
        ${item.extra ? `<div style="font-size:11px;color:#64748b;margin-top:2px;">${highlightText(item.extra, searchInput.value)}</div>` : ""}
      </div>`,
      )
      .join("");
    results.style.display = "block";
    results.querySelectorAll(".result-item").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        el.style.background = "#f8fafc";
        el.style.paddingLeft = "22px";
      });
      el.addEventListener("mouseleave", () => {
        el.style.background = "white";
        el.style.paddingLeft = "18px";
      });
      el.addEventListener("click", () => {
        selectItem(el.dataset.id, el.dataset.nome);
      });
    });
  }

  function highlightText(text, search) {
    if (!search) return text;
    const regex = new RegExp(
      `(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    return text.replace(
      regex,
      '<mark style="background:#fef08a;color:#713f12;padding:2px 4px;border-radius:3px;font-weight:700;">$1</mark>',
    );
  }

  function selectItem(id, nome) {
    selectedValue = id;
    selectedName = nome;
    searchInput.value = "";
    hiddenInput.value = id;
    results.style.display = "none";
    searchInput.style.display = "none";
    selectionDisplay.style.display = "block";
    selectedValueDisplay.textContent = nome;
    const extraDisplay = container.querySelector(".selected-extra-display");
    if (extraDisplay) {
      const item = currentData.find((d) => String(d.id) === String(id));
      extraDisplay.textContent = item?.extra || "";
      extraDisplay.style.display = item?.extra ? "block" : "none";
    }
    clearBtn.style.display = "block";
    if (onSelect) onSelect(id, nome);
  }

  function reset() {
    selectedValue = null;
    selectedName = null;
    searchInput.value = "";
    hiddenInput.value = "";
    searchInput.style.display = "block";
    selectionDisplay.style.display = "none";
    selectedValueDisplay.textContent = "";
    const ed = container.querySelector(".selected-extra-display");
    if (ed) ed.textContent = "";
    clearBtn.style.display = "none";
    results.style.display = "none";
  }

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    reset();
    searchInput.focus();
  });

  searchInput.addEventListener("input", async (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (allData.length === 0) await loadData();
    const filtered =
      term === ""
        ? currentData
        : currentData.filter(
            (item) =>
              item.nome.toLowerCase().includes(term) ||
              (item.email && item.email.toLowerCase().includes(term)) ||
              (item.num_tel && item.num_tel.toLowerCase().includes(term)) ||
              (item.extra && item.extra.toLowerCase().includes(term)),
          );
    showResults(filtered);
  });

  searchInput.addEventListener("focus", async () => {
    if (allData.length === 0) await loadData();
    const term = searchInput.value.toLowerCase().trim();
    const filtered =
      term === ""
        ? currentData
        : currentData.filter(
            (item) =>
              item.nome.toLowerCase().includes(term) ||
              (item.email && item.email.toLowerCase().includes(term)) ||
              (item.num_tel && item.num_tel.toLowerCase().includes(term)),
          );
    showResults(filtered);
    searchInput.style.borderColor = "#6366f1";
    searchInput.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.1)";
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => {
      results.style.display = "none";
      searchInput.style.borderColor = "#e2e8f0";
      searchInput.style.boxShadow = "none";
    }, 200);
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) results.style.display = "none";
  });

  if (required) {
    const form = container.closest("form");
    if (form) {
      form.addEventListener(
        "submit",
        (e) => {
          if (!hiddenInput.value) {
            e.preventDefault();
            e.stopImmediatePropagation();
            searchInput.style.borderColor = "#ef4444";
            searchInput.style.boxShadow = "0 0 0 4px rgba(239, 68, 68, 0.1)";
            searchInput.placeholder = "⚠️ Campo obbligatorio!";
            searchInput.focus();
            setTimeout(() => {
              searchInput.style.borderColor = "#e2e8f0";
              searchInput.style.boxShadow = "none";
              searchInput.placeholder = placeholder;
            }, 3000);
          }
        },
        true,
      );
    }
  }

  return {
    loadData,
    reset,
    setValue: (id) => {
      const item = allData.find((d) => String(d.id) === String(id));
      if (item) selectItem(item.id, item.nome);
    },
    getValue: () => selectedValue,
    updateData: (newData) => {
      currentData = newData;
      allData = newData;
    },
    filterData: (newData) => {
      currentData = newData;
    },
    getSelectedName: () => selectedName,
  };
}

let clienteSearchOrdine = null;
let marcaModelloSearchOrdine = null;
let marcaSearchModello = null;

async function initOrdineSearchableSelects() {
  clienteSearchOrdine = createSearchableSelect(
    "ordineClienteSearch_container",
    "ordineCliente",
    "Cerca cliente...",
    async () => {
      const res = await fetch(`${API_URL}/clienti`);
      const clienti = await res.json();
      return clienti.map((c) => ({
        id: c.id,
        nome: c.nome,
        extra: [
          c.num_tel ? `📞 ${c.num_tel}` : "",
          c.email ? `✉️ ${c.email}` : "",
        ]
          .filter(Boolean)
          .join(" • "),
        num_tel: c.num_tel || "",
        email: c.email || "",
      }));
    },
    () => {},
    true,
  );

  marcaModelloSearchOrdine = createSearchableSelect(
    "ordineMarcaModelloSearch_container",
    "ordineModello",
    "Cerca marca o modello...",
    async () => {
      const res = await fetch(`${API_URL}/modelli`);
      const modelli = await res.json();
      allModelli = modelli;
      return modelli.map((m) => ({
        id: m.id,
        nome: m.nome,
        extra: m.marca_nome || "",
        marche_id: m.marche_id,
      }));
    },
    (id) => {
      const mod = allModelli.find((m) => String(m.id) === String(id));
      if (mod?.marche_id) {
        const mh = document.getElementById("ordineMarca");
        if (mh) mh.value = mod.marche_id;
      }
    },
    true,
  );

  if (clienteSearchOrdine) await clienteSearchOrdine.loadData();
  if (marcaModelloSearchOrdine) await marcaModelloSearchOrdine.loadData();
}

async function initModelloSearchableSelects() {
  marcaSearchModello = createSearchableSelect(
    "modelloMarcaSearch_container",
    "modelloMarca",
    "Cerca marca...",
    async () => {
      const res = await fetch(`${API_URL}/marche`);
      const marche = await res.json();
      return marche.map((m) => ({ id: m.id, nome: m.nome }));
    },
    () => {},
    true,
  );
  if (marcaSearchModello) await marcaSearchModello.loadData();
}

// Override openOrdineModal e openModelloModal con versioni searchable
window.openOrdineModal = openOrdineModal;
window.openModelloModal = openModelloModal;
