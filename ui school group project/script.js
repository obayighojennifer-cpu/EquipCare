let equipment = [
  {
    name: "Generator 01",
    location: "Faculty of science",
    type: "Generator",
    status: "Good"
  },
  {
    name: "Air Conditioner 04",
    location: "Administrative Block",
    type: "Air Conditioner",
    status: "Good"
  },
  {
    name: "Water Pump 02",
    location: "Student Hostels",
    type: "Water Pump",
    status: "Needs Maintenance"
  }
];

let scheduleRecords = [
  {
    equipment: "Generator 01",
    location: "Faculty of Science",
    type: "Servicing",
    date: "30 Sept 2026",
    status: "Scheduled",
    technician: "Maintenance Team"
  },
  {
    equipment: "Air Conditioner 04",
    location: "Administrative Block",
    type: "Inspection",
    date: "02 Oct 2026",
    status: "Pending",
    technician: "Maintenance Team"
  },
  {
    equipment: "Water Pump 02",
    location: "Student Hostel",
    type: "Repair",
    date: "05 Oct 2026",
    status: "Scheduled",
    technician: "Maintenance Team"
  }
];

let maintenanceHistory = [
  {
    equipment: "Generator 01",
    type: "Servicing",
    date: "01 Sept 2026",
    technician: "Maintenance Team",
    status: "Completed"
  },
  {
    equipment: "Air Conditioner 02",
    type: "Inspection",
    date: "15 Aug 2026",
    technician: "Maintenance Team",
    status: "Completed"
  },
  {
    equipment: "Water Pump 01",
    type: "Repair",
    date: "10 Aug 2026",
    technician: "Maintenance Team",
    status: "Completed"
  }
];

console.log("Equipment Maintenance System is running!");
console.log(equipment);

function showEquipmentForm() {
  const form = document.getElementById("equipmentForm");
  if (form) form.style.display = "block";
}

function hideEquipmentForm() {
  const form = document.getElementById("equipmentForm");
  if (form) form.style.display = "none";
}

function showScheduleForm() {
  setActivePage("schedule");
  const form = document.getElementById("scheduleForm");
  if (form) form.style.display = "block";
}

function hideScheduleForm() {
  const form = document.getElementById("scheduleForm");
  if (form) form.style.display = "none";
}

function formatDateDisplay(dateString) {
  if (!dateString) return "Not set";

  const date = new Date(dateString + "T00:00:00");
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function populateScheduleEquipmentOptions(selectedValue) {
  const select = document.getElementById("scheduleEquipment");
  if (!select) return;

  const currentValue = selectedValue || select.value;
  const options = [
    '<option value="">Select equipment</option>'
  ];

  equipment.forEach(function(item) {
    const chosen = item.name === currentValue ? "selected" : "";
    options.push(`<option value="${item.name}" ${chosen}>${item.name}</option>`);
  });

  select.innerHTML = options.join("");
}

function renderScheduleTable() {
  const tableBody = document.getElementById("scheduleTableBody");
  if (!tableBody) return;

  if (!scheduleRecords.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 20px;">No upcoming maintenance scheduled.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = scheduleRecords.map(function(item, index) {
    const statusClass = item.status === "Scheduled" ? "good" : "warning";

    return `
      <tr>
        <td><strong>${item.equipment}</strong></td>
        <td>${item.location}</td>
        <td>${item.type}</td>
        <td>${item.date}</td>
        <td>
          <span class="equipment-status ${statusClass}">
            ${item.status}
          </span>
        </td>
        <td>
          <button class="mark-complete-btn" data-index="${index}">
            Mark as Completed
          </button>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".mark-complete-btn").forEach(function(button) {
    button.addEventListener("click", function() {
      const index = Number(this.dataset.index);
      const item = scheduleRecords[index];
      if (!item) return;

      maintenanceHistory.unshift({
        equipment: item.equipment,
        type: item.type,
        date: item.date,
        technician: item.technician || "Maintenance Team",
        status: "Completed"
      });

      scheduleRecords.splice(index, 1);
      renderScheduleTable();
      renderHistoryTable();
    });
  });
}

function renderHistoryTable() {
  const tableBody = document.getElementById("historyTableBody");
  if (!tableBody) return;

  if (!maintenanceHistory.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 20px;">No maintenance history records found.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = maintenanceHistory.map(function(item) {
    const statusClass = item.status === "Completed" ? "good" : "warning";

    return `
      <tr>
        <td><strong>${item.equipment}</strong></td>
        <td>${item.type}</td>
        <td>${item.date}</td>
        <td>${item.technician}</td>
        <td>
          <span class="equipment-status ${statusClass}">
            ${item.status}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

function addSchedule() {
  const equipmentInput = document.getElementById("scheduleEquipment");
  const typeInput = document.getElementById("scheduleType");
  const dateInput = document.getElementById("scheduleDate");
  const technicianInput = document.getElementById("scheduleTechnician");
  const notesInput = document.getElementById("scheduleNotes");

  const equipmentName = equipmentInput ? equipmentInput.value.trim() : "";
  const type = typeInput ? typeInput.value.trim() : "";
  const dateValue = dateInput ? dateInput.value : "";
  const technician = technicianInput ? technicianInput.value.trim() || "Maintenance Team" : "Maintenance Team";
  const notes = notesInput ? notesInput.value.trim() : "";

  if (!equipmentName || !type || !dateValue) {
    alert("Please select equipment, maintenance type, and date.");
    return;
  }

  const equipmentItem = equipment.find(function(item) {
    return item.name === equipmentName;
  });

  scheduleRecords.unshift({
    equipment: equipmentName,
    location: equipmentItem ? equipmentItem.location : "General",
    type: type,
    date: formatDateDisplay(dateValue),
    status: "Scheduled",
    technician: technician,
    notes: notes
  });

  renderScheduleTable();

  if (equipmentInput) equipmentInput.value = "";
  if (typeInput) typeInput.value = "";
  if (dateInput) dateInput.value = "";
  if (technicianInput) technicianInput.value = "";
  if (notesInput) notesInput.value = "";

  hideScheduleForm();
  alert("Maintenance schedule saved successfully!");
}

function displayEquipment() {
  const tableBody = document.getElementById("equipmentTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  equipment.forEach(function(item) {
    const statusClass = item.status === "Good" ? "good" : "warning";

    tableBody.innerHTML += `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.type}</td>
        <td>${item.location}</td>
        <td>
          <span class="equipment-status ${statusClass}">
            ${item.status}
          </span>
        </td>
      </tr>
    `;
  });

  populateScheduleEquipmentOptions();
}

function addEquipment() {
  const nameInput = document.getElementById("equipmentName");
  const typeInput = document.getElementById("equipmentType");
  const locationInput = document.getElementById("equipmentLocation");
  const statusInput = document.getElementById("equipmentStatus");

  const name = nameInput ? nameInput.value.trim() : "";
  const type = typeInput ? typeInput.value.trim() : "";
  const location = locationInput ? locationInput.value.trim() : "";
  const status = statusInput ? statusInput.value : "Good";

  if (!name || !type || !location) {
    alert("Please fill in all required fields.");
    return;
  }

  equipment.push({
    name: name,
    type: type,
    location: location,
    status: status
  });

  displayEquipment();

  if (nameInput) nameInput.value = "";
  if (typeInput) typeInput.value = "";
  if (locationInput) locationInput.value = "";
  if (statusInput) statusInput.value = "Good";

  hideEquipmentForm();
  alert("Equipment added successfully!");
}

function viewHistory() {
  setActivePage("history");
  renderHistoryTable();
}

const pageOrder = ["dashboard", "equipment", "schedule", "history"];
const pages = {
  dashboard: document.querySelector(".dashboard-panel"),
  equipment: document.querySelector(".equipment-section"),
  schedule: document.querySelector(".schedule-section"),
  history: document.querySelector(".history-section")
};

const sidebarLinks = document.querySelectorAll(".sidebar nav a");

function setActivePage(pageName) {
  const validPage = pageOrder.includes(pageName) ? pageName : "dashboard";

  Object.entries(pages).forEach(([key, panel]) => {
    if (panel) {
      panel.classList.toggle("active", key === validPage);
      panel.style.display = key === validPage ? "block" : "none";
    }
  });

  sidebarLinks.forEach((link, index) => {
    link.classList.toggle("active", pageOrder[index] === validPage);
  });

  if (validPage === "history") {
    renderHistoryTable();
  }

  if (validPage === "schedule") {
    populateScheduleEquipmentOptions();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  hideEquipmentForm();
  hideScheduleForm();
  displayEquipment();
  renderScheduleTable();
  renderHistoryTable();

  const equipmentSearch = document.getElementById("equipmentSearch");
  if (equipmentSearch) {
    equipmentSearch.addEventListener("input", function () {
      const searchText = this.value.toLowerCase();
      const rows = document.querySelectorAll("#equipmentTableBody tr");
      rows.forEach(function (row) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? "" : "none";
      });
    });
  }

  sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      const page = pageOrder[index];
      setActivePage(page);
    });
  });

  document.querySelectorAll(".quick-action-btn").forEach(function(button) {
    button.addEventListener("click", function() {
      const page = this.dataset.page;
      if (!page || !pages[page]) return;
      setActivePage(page);
    });
  });

  setActivePage("dashboard");
});