async function fetchHolidays() {
  const response = await fetch('/api/holidays');
  const holidays = await response.json();
  renderSummary(holidays);
  renderTable(holidays);
}

function renderSummary(holidays) {
  const total = holidays.length;
  const approved = holidays.filter((holiday) => holiday.status === 'Approved').length;
  const pending = holidays.filter((holiday) => holiday.status === 'Pending').length;

  document.getElementById('totalRequests').textContent = total;
  document.getElementById('approvedCount').textContent = approved;
  document.getElementById('pendingCount').textContent = pending;
}

function renderTable(holidays) {
  const tableBody = document.getElementById('holidayTableBody');

  if (!holidays.length) {
    tableBody.innerHTML = '<tr><td colspan="5">No holiday requests yet.</td></tr>';
    return;
  }

  tableBody.innerHTML = holidays
    .map(
      (holiday) => `
        <tr>
          <td>${holiday.employee}</td>
          <td>${holiday.startDate} → ${holiday.endDate}</td>
          <td>${holiday.type}</td>
          <td>
            <span class="status-pill status-${holiday.status.toLowerCase()}">${holiday.status}</span>
          </td>
          <td>
            <button class="action-btn" data-action="approve" data-id="${holiday.id}">Approve</button>
            <button class="action-btn" data-action="reject" data-id="${holiday.id}">Reject</button>
            <button class="action-btn" data-action="delete" data-id="${holiday.id}">Delete</button>
          </td>
        </tr>
      `,
    )
    .join('');
}

async function addHoliday(event) {
  event.preventDefault();

  const payload = {
    employee: document.getElementById('employee').value.trim(),
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    type: document.getElementById('type').value,
    status: document.getElementById('status').value,
  };

  if (!payload.employee || !payload.startDate || !payload.endDate) {
    return;
  }

  await fetch('/api/holidays', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  event.target.reset();
  fetchHolidays();
}

async function handleTableAction(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'delete') {
    await fetch(`/api/holidays/${id}`, { method: 'DELETE' });
    fetchHolidays();
    return;
  }

  const status = action === 'approve' ? 'Approved' : 'Rejected';
  await fetch(`/api/holidays/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  fetchHolidays();
}

document.getElementById('holidayForm').addEventListener('submit', addHoliday);
document.getElementById('holidayTableBody').addEventListener('click', handleTableAction);
document.getElementById('refreshButton').addEventListener('click', fetchHolidays);

fetchHolidays();
