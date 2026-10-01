const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const holidays = [
  {
    id: 1,
    employee: 'Alice Johnson',
    startDate: '2026-10-10',
    endDate: '2026-10-15',
    type: 'Annual Leave',
    status: 'Approved',
  },
  {
    id: 2,
    employee: 'Ben Carter',
    startDate: '2026-10-18',
    endDate: '2026-10-21',
    type: 'Study Leave',
    status: 'Pending',
  },
  {
    id: 3,
    employee: 'Priya Singh',
    startDate: '2026-11-02',
    endDate: '2026-11-06',
    type: 'Annual Leave',
    status: 'Approved',
  },
];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/holidays', (req, res) => {
  res.json(holidays);
});

app.post('/api/holidays', (req, res) => {
  const { employee, startDate, endDate, type, status } = req.body;

  if (!employee || !startDate || !endDate || !type) {
    return res.status(400).json({ message: 'Missing required holiday fields.' });
  }

  const newHoliday = {
    id: Date.now(),
    employee,
    startDate,
    endDate,
    type,
    status: status || 'Pending',
  };

  holidays.unshift(newHoliday);
  res.status(201).json(newHoliday);
});

app.put('/api/holidays/:id', (req, res) => {
  const { id } = req.params;
  const holidayIndex = holidays.findIndex((holiday) => holiday.id === Number(id));

  if (holidayIndex === -1) {
    return res.status(404).json({ message: 'Holiday not found.' });
  }

  const updatedHoliday = {
    ...holidays[holidayIndex],
    ...req.body,
  };

  holidays[holidayIndex] = updatedHoliday;
  res.json(updatedHoliday);
});

app.delete('/api/holidays/:id', (req, res) => {
  const { id } = req.params;
  const holidayIndex = holidays.findIndex((holiday) => holiday.id === Number(id));

  if (holidayIndex === -1) {
    return res.status(404).json({ message: 'Holiday not found.' });
  }

  const [removedHoliday] = holidays.splice(holidayIndex, 1);
  res.json({ message: 'Holiday removed.', holiday: removedHoliday });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Team Holidays Manager running on http://localhost:${PORT}`);
});
