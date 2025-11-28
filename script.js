
let appState = {
    tripType: "return", 
    from: "Hyderabad (HYD)",
    to: "New Delhi (DEL)",
    departDate: "",
    returnDate: "",
    travellers: 2,
    travelClass: "Economy",
    paymentMethod: "Any",
    landingMode: "takeoff", 
    selectedOutbound: "out-2",
    selectedReturn: "ret-2"
};


const outboundFlights = [
    { id: "out-1", dep: "05:25", arr: "07:35", dur: "02h 10m", stops: 0, price: 3550 },
    { id: "out-2", dep: "12:00", arr: "14:25", dur: "02h 25m", stops: 0, price: 3550 },
    { id: "out-3", dep: "21:30", arr: "00:05", dur: "02h 35m", stops: 0, price: 3550 },
    { id: "out-4", dep: "23:05", arr: "01:45", dur: "02h 40m", stops: 1, price: 4100 },
    { id: "out-5", dep: "16:15", arr: "18:40", dur: "02h 25m", stops: 0, price: 3650 }
];

const returnFlights = [
    { id: "ret-1", dep: "10:00", arr: "12:15", dur: "02h 15m", stops: 0, price: 3600 },
    { id: "ret-2", dep: "20:15", arr: "22:30", dur: "02h 15m", stops: 0, price: 3599 },
    { id: "ret-3", dep: "05:25", arr: "07:35", dur: "02h 10m", stops: 0, price: 3550 },
    { id: "ret-4", dep: "23:00", arr: "01:15", dur: "02h 15m", stops: 1, price: 4100 },
    { id: "ret-5", dep: "14:45", arr: "17:05", dur: "02h 20m", stops: 0, price: 3700 }
];


function toMins(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}


function renderFlights() {
    const out = document.getElementById("outbound-list");
    const ret = document.getElementById("return-list");
    out.innerHTML = "";
    ret.innerHTML = "";

    outboundFlights.forEach(f => out.appendChild(buildCard(f, "outbound")));
    if (appState.tripType === "return") {
        returnFlights.forEach(f => ret.appendChild(buildCard(f, "return")));
    }
    updateSummary();
}


function buildCard(f, type) {
    const isSelected = (type === "outbound"
        ? appState.selectedOutbound === f.id
        : appState.selectedReturn === f.id);

    const c = document.createElement("div");
    c.className = "flight-card" + (isSelected ? " selected" : "");

    c.innerHTML = `
    <div class="flight-card-header">
      <div class="flight-airline">
        <div class="flight-logo"></div> IndiGo
      </div>
      <div class="flight-on-time">90% on time</div>
    </div>

    <div class="flight-body">
      <div class="flight-time-block">
        <span class="flight-time-main">${f.dep}</span>
        <span class="flight-time-sub">${type === "outbound" ? appState.from : appState.to}</span>
      </div>

      <div class="flight-time-block">
        <span class="flight-time-main">${f.arr}</span>
        <span class="flight-time-sub">${type === "outbound" ? appState.to : appState.from}</span>
      </div>

      <div class="flight-time-block">
        <span class="flight-time-main">${f.dur}</span>
        <span class="flight-time-sub">${f.stops === 0 ? "Non-stop" : (f.stops === 1 ? "1 stop" : `${f.stops} stops`)}</span>
      </div>

      <div class="flight-time-block">
        <span class="flight-price">₹ ${f.price}</span>
        <span class="flight-meta">per adult</span>
      </div>
    </div>

    <div class="flight-radio">
      <input type="radio" name="${type}" value="${f.id}" ${isSelected ? "checked" : ""}>
    </div>
  `;

    const radio = c.querySelector("input[type='radio']");
    radio.onchange = () => {
        if (type === "outbound") appState.selectedOutbound = f.id;
        else appState.selectedReturn = f.id;

        // re-render ensures only one card per column has .selected
        renderFlights();
    };

    return c;
}


function updateSummary() {
    // route
    const routeEl = document.getElementById("summary-route");
    if (routeEl) routeEl.textContent = `${appState.from} → ${appState.to}`;

    
    const datesEl = document.getElementById("summary-dates");
    if (datesEl) {
        if (appState.tripType === "one-way") {
            datesEl.textContent = appState.departDate || "Select your dates";
        } else {
            datesEl.textContent = (appState.departDate && appState.returnDate) ? `${appState.departDate} · ${appState.returnDate}` : "Select your dates";
        }
    }

    
    const out = outboundFlights.find(f => f.id === appState.selectedOutbound) || { price: 0 };
    const ret = returnFlights.find(f => f.id === appState.selectedReturn) || { price: 0 };

    let total = out.price || 0;
    if (appState.tripType === "return" && (ret.price || 0) > 0) {
        total += ret.price;
        total -= 315; 
        if (total < 0) total = 0;
    }

    const totalEl = document.getElementById("summary-total");
    if (totalEl) totalEl.textContent = `₹ ${total}`;
}


document.getElementById("update-btn").onclick = () => {
    const from = document.getElementById("from-city");
    const to = document.getElementById("to-city");
    const depart = document.getElementById("depart-date");
    const retDate = document.getElementById("return-date");
    const trav = document.getElementById("travellers");
    const cls = document.getElementById("class");
    const pay = document.getElementById("payment-method");

    if (from) appState.from = from.value;
    if (to) appState.to = to.value;
    if (depart) appState.departDate = depart.value;
    if (retDate) appState.returnDate = retDate.value;

    
    if (trav) {
        // travellers select strings like "2 Travellers" — try parseInt, fallback to selectedIndex+1
        const num = parseInt(trav.value, 10);
        appState.travellers = isNaN(num) ? (trav.selectedIndex + 1) : num;
    }
    if (cls) appState.travelClass = cls.value;
    if (pay) appState.paymentMethod = pay.value;

    updateSummary();
    renderFlights();
};


document.getElementById("swap-btn").onclick = () => {
    const f = document.getElementById("from-city");
    const t = document.getElementById("to-city");
    if (!f || !t) return;
    [f.value, t.value] = [t.value, f.value];

    appState.from = f.value;
    appState.to = t.value;

    updateSummary();
    renderFlights();
};


document.querySelectorAll(".trip-toggle-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".trip-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const txt = btn.textContent.trim().toLowerCase();
        if (txt === "return") appState.tripType = "return";
        else if (txt === "one-way") appState.tripType = "one-way";
        else appState.tripType = "multi-city";

        const returnDateEl = document.getElementById("return-date");
        if (returnDateEl) returnDateEl.disabled = (appState.tripType === "one-way");

        renderFlights();
    };
});


document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const txt = btn.textContent.trim().toLowerCase();
        appState.landingMode = txt.includes("take") ? "takeoff" : "landing";
    };
});


document.addEventListener("DOMContentLoaded", () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const departEl = document.getElementById("depart-date");
    const returnEl = document.getElementById("return-date");
    if (departEl) departEl.value = d.toISOString().slice(0, 10);
    d.setDate(d.getDate() + 4);
    if (returnEl) returnEl.value = d.toISOString().slice(0, 10);

    appState.departDate = departEl ? departEl.value : "";
    appState.returnDate = returnEl ? returnEl.value : "";

    // sync selects to initial state
    const travSelect = document.getElementById("travellers");
    if (travSelect) travSelect.selectedIndex = Math.max(0, Math.min(travSelect.options.length - 1, appState.travellers - 1));
    const cls = document.getElementById("class");
    if (cls) cls.value = appState.travelClass;
    const pay = document.getElementById("payment-method");
    if (pay) pay.value = appState.paymentMethod;

    updateSummary();
    renderFlights();
});
