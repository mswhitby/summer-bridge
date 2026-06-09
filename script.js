// ─── Color themes ─────────────────────────────────────────────────────────────
const COLOR = {
  Red:    { bg:'var(--red-bg)',    text:'var(--red-text)',    border:'var(--red-border)'    },
  Green:  { bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)'  },
  Blue:   { bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)'   },
  Orange: { bg:'var(--orange-bg)',text:'var(--orange-text)',border:'var(--orange-border)' },
  Yellow: { bg:'var(--yellow-bg)',text:'var(--yellow-text)',border:'var(--yellow-border)' },
};

const GROUP_COLOR = {
  1:'Orange', 2:'Orange', 3:'Orange',
  4:'Yellow', 5:'Yellow', 6:'Yellow',
  7:'Green',  8:'Green',  9:'Green',
};

// ─── NLC travelers ────────────────────────────────────────────────────────────
const NLC_TRAVELERS = new Set(['Harwell','Mercado','Gilmore','Whitby']);

// ─── Format room for display ──────────────────────────────────────────────────
function formatRoom(roomStr) {
  if (!roomStr) return '';
  const i = roomStr.indexOf('-');
  if (i === -1) return roomStr;
  const teacher = roomStr.substring(0, i);
  const room = roomStr.substring(i + 1);
  if (room.startsWith('PLXY')) return room;
  return `${teacher} - ${room}`;
}

// ─── TUESDAY data ─────────────────────────────────────────────────────────────
const TUE_ROTATIONS = {
  1: ['NLC HSP Orientation', 'NLC Advising',        'TSI Math',           'TSI ELAR'           ],
  2: ['NLC Advising',        'NLC HSP Orientation', 'TSI ELAR',           'TSI Math'           ],
  3: ['TSI Math',            'TSI ELAR',            'NLC HSP Orientation','NLC Advising'       ],
  4: ['TSI ELAR',            'TSI Math',            'NLC Advising',       'NLC HSP Orientation'],
  5: ['NLC Advising',        'NLC HSP Orientation', 'TSI ELAR',           'TSI Math'           ],
  6: ['TSI Math',            'TSI ELAR',            'NLC HSP Orientation','NLC Advising'       ],
  7: ['TSI ELAR',            'TSI Math',            'NLC Advising',       'NLC HSP Orientation'],
  8: ['NLC HSP Orientation', 'NLC Advising',        'TSI Math',           'TSI ELAR'           ],
};

const TUE_ROOMS = {
  'TSI ELAR':           { 1:'Miller-B207', 2:'Miller-B207', 3:'Miller-B207', 4:'Miller-B207',
                          5:'Garcia-B206', 6:'Garcia-B206', 7:'Garcia-B206', 8:'Garcia-B206' },
  'TSI Math':           { 1:'Kennedy-B209',2:'Kennedy-B209',3:'Kennedy-B209',4:'Kennedy-B209',
                          5:'Tinoco-B221', 6:'Tinoco-B221', 7:'Tinoco-B221', 8:'Tinoco-B221' },
  'NLC Advising':       { 1:'Whitby-PLXY Bluebonnet',  2:'Harwell-PLXY Bluebonnet',
                          3:'Harwell-PLXY Bluebonnet',  4:'Whitby-PLXY Bluebonnet',
                          5:'Mercado-PLXY Bluebonnet',  6:'Mercado-PLXY Bluebonnet',
                          7:'Gilmore-PLXY Bluebonnet',  8:'Gilmore-PLXY Bluebonnet' },
  'NLC HSP Orientation':{ 1:'Whitby-PLXY 100',  2:'Harwell-PLXY 100',
                          3:'Harwell-PLXY 100',  4:'Whitby-PLXY 100',
                          5:'Mercado-PLXY 100',  6:'Mercado-PLXY 100',
                          7:'Gilmore-PLXY 100',  8:'Gilmore-PLXY 100' },
};

const TUE_ROT_TIMES = [
  { time:'8:40 – 9:45',  sortMin:520 },
  { time:'9:50 – 10:55', sortMin:590 },
  { time:'1:10 – 2:15',  sortMin:790 },
  { time:'2:20 – 3:25',  sortMin:860 },
];

// Student-facing full blocks (transitions filtered at render time)
const TUE_STUDENT_BLOCKS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
  { time:'8:30 – 8:40',   sortMin:510, activity:'Transition to Rotation 1', room:'' },
  { time:'9:45 – 9:50',   sortMin:585, activity:'Transition to Rotation 2', room:'' },
  { time:'10:55 – 11:15', sortMin:655, activity:'Transition to Exploration Rotation', room:'' },
  { time:'11:15 – 12:15', sortMin:675, activity:'Exploration Rotation',   room:'PLXY Bluebonnet' },
  { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                  room:'JECA Student Commons' },
  { time:'1:00 – 1:10',   sortMin:780, activity:'Transition to Rotation 3', room:'' },
  { time:'2:15 – 2:20',   sortMin:855, activity:'Transition to Rotation 4', room:'' },
  { time:'3:25 – 3:30',   sortMin:925, activity:'Transition to Dismissal', room:'' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',              room:'JECA Commons' },
];

// Teacher-facing full blocks — lunch has no location (on your own)
const TUE_TEACHER_BLOCKS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
  { time:'8:30 – 8:40',   sortMin:510, activity:'Transition to Rotation 1', room:'' },
  { time:'9:45 – 9:50',   sortMin:585, activity:'Transition to Rotation 2', room:'' },
  { time:'10:55 – 11:15', sortMin:655, activity:'Transition to Exploration Rotation', room:'' },
  { time:'11:15 – 12:15', sortMin:675, activity:'Exploration Rotation',   room:'PLXY Bluebonnet' },
  { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                  room:'' },
  { time:'1:00 – 1:10',   sortMin:780, activity:'Transition to Rotation 3', room:'' },
  { time:'2:15 – 2:20',   sortMin:855, activity:'Transition to Rotation 4', room:'' },
  { time:'3:25 – 3:30',   sortMin:925, activity:'Transition to Dismissal', room:'' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',              room:'JECA Commons' },
];

// ─── WEDNESDAY data ───────────────────────────────────────────────────────────
const WED_ROTATIONS = {
  1: ['NLC Support Services', 'NLC HSP Academics',   'TSI Math',           'TSI ELAR'          ],
  2: ['NLC HSP Academics',    'NLC Support Services', 'TSI ELAR',           'TSI Math'          ],
  3: ['TSI Math',             'TSI ELAR',             'NLC Support Services','NLC HSP Academics' ],
  4: ['TSI ELAR',             'TSI Math',             'NLC HSP Academics',  'NLC Support Services'],
  5: ['NLC HSP Academics',    'NLC Support Services', 'TSI ELAR',           'TSI Math'          ],
  6: ['TSI Math',             'TSI ELAR',             'NLC Support Services','NLC HSP Academics' ],
  7: ['TSI ELAR',             'TSI Math',             'NLC HSP Academics',  'NLC Support Services'],
  8: ['NLC Support Services', 'NLC HSP Academics',   'TSI Math',           'TSI ELAR'          ],
};

const WED_ROOMS = {
  'TSI ELAR':            { 1:'Miller-B207', 2:'Miller-B207', 3:'Miller-B207', 4:'Miller-B207',
                           5:'Garcia-B206', 6:'Garcia-B206', 7:'Garcia-B206', 8:'Garcia-B206' },
  'TSI Math':            { 1:'Kennedy-B209',2:'Kennedy-B209',3:'Kennedy-B209',4:'Kennedy-B209',
                           5:'Tinoco-B221', 6:'Tinoco-B221', 7:'Tinoco-B221', 8:'Tinoco-B221' },
  'NLC Support Services':{ 1:'Whitby-PLXY',  2:'Harwell-PLXY',
                           3:'Harwell-PLXY',  4:'Whitby-PLXY',
                           5:'Mercado-PLXY',  6:'Mercado-PLXY',
                           7:'Gilmore-PLXY',  8:'Gilmore-PLXY' },
  'NLC HSP Academics':   { 1:'Whitby-PLXY 100',  2:'Harwell-PLXY 100',
                           3:'Harwell-PLXY 100',  4:'Whitby-PLXY 100',
                           5:'Mercado-PLXY 100',  6:'Mercado-PLXY 100',
                           7:'Gilmore-PLXY 100',  8:'Gilmore-PLXY 100' },
};

const WED_ROT_TIMES = [
  { time:'8:40 – 9:45',  sortMin:520 },
  { time:'9:50 – 10:55', sortMin:590 },
  { time:'1:10 – 2:15',  sortMin:790 },
  { time:'2:20 – 3:25',  sortMin:860 },
];

const WED_STUDENT_BLOCKS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
  { time:'8:30 – 8:40',   sortMin:510, activity:'Transition to Rotation 1', room:'' },
  { time:'9:45 – 9:50',   sortMin:585, activity:'Transition to Rotation 2', room:'' },
  { time:'10:55 – 11:15', sortMin:655, activity:'Transition to Exploration Rotation', room:'' },
  { time:'11:15 – 12:15', sortMin:675, activity:'Exploration Rotation',   room:'PLXY Bluebonnet' },
  { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                  room:'PLXY Bluebonnet' },
  { time:'1:00 – 1:10',   sortMin:780, activity:'Transition to Rotation 3', room:'' },
  { time:'2:15 – 2:20',   sortMin:855, activity:'Transition to Rotation 4', room:'' },
  { time:'3:25 – 3:30',   sortMin:925, activity:'Transition to Dismissal', room:'' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',              room:'JECA Commons' },
];

// Teacher blocks differ by NLC vs on-campus for lunch/exploration
const WED_TEACHER_BLOCKS_ONCAMPUS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
  { time:'11:15 – 11:45', sortMin:675, activity:'Exploration Rotation',  room:'PLXY Bluebonnet' },
  { time:'11:45 – 12:15', sortMin:705, activity:'Exploration Rotation',  room:'PLXY Bluebonnet' },
  { time:'12:15 – 12:45', sortMin:735, activity:'Lunch',                 room:'' },
  { time:'12:45 – 1:00',  sortMin:765, activity:'Lunch Duty',            room:'PLXY Bluebonnet' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',             room:'JECA Commons' },
];

const WED_TEACHER_BLOCKS_NLC = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
  { time:'11:15 – 11:45', sortMin:675, activity:'Exploration Rotation',  room:'PLXY Bluebonnet' },
  { time:'11:45 – 12:15', sortMin:705, activity:'Lunch',                 room:'' },
  { time:'12:15 – 12:45', sortMin:735, activity:'Lunch Duty',            room:'PLXY Bluebonnet' },
  { time:'12:45 – 1:00',  sortMin:765, activity:'Lunch Duty',            room:'PLXY Bluebonnet' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',             room:'JECA Commons' },
];

// ─── MONDAY / THURSDAY shared data ───────────────────────────────────────────
// Groups 1-9: color determines room tier, number determines rotation slot
// Red=1-3, Green=4-6, Blue=7-9
const MON_THU_ROOMS = {
  elar: { 1:'Miller-B207',  2:'Miller-B207',  3:'Miller-B207',
          4:'Garcia-B206',  5:'Garcia-B206',  6:'Garcia-B206',
          7:'Gilmore-B202', 8:'Gilmore-B202', 9:'Gilmore-B202' },
  stem: { 1:'Brown-B226',   2:'Brown-B226',   3:'Brown-B226',
          4:'Mercado-B229', 5:'Mercado-B229', 6:'Mercado-B229',
          7:'Harwell-B227', 8:'Harwell-B227', 9:'Harwell-B227' },
  math: { 1:'Kennedy-B209', 2:'Kennedy-B209', 3:'Kennedy-B209',
          4:'Tinoco-B221',  5:'Tinoco-B221',  6:'Tinoco-B221',
          7:'Whitby-B208',  8:'Whitby-B208',  9:'Whitby-B208'  },
};

const MON_THU_ROTS = {
  rot1: { elar:[1,4,7], stem:[2,5,8], math:[3,6,9] },
  rot2: { elar:[3,6,9], stem:[1,4,7], math:[2,5,8] },
  rot3: { elar:[2,5,8], stem:[3,6,9], math:[1,4,7] },
};

function monThuActivity(number, slot) {
  for (const [subj, nums] of Object.entries(MON_THU_ROTS[slot])) {
    if (nums.includes(number)) return subj;
  }
}

function monThuBlock(number, slot, labelMap) {
  const subj = monThuActivity(number, slot);
  return { activity: labelMap[subj], room: MON_THU_ROOMS[subj][number] };
}

// Monday rotation schedule — returns array of 4 blocks for a given group number
function getMondayRotations(number) {
  const labels = { elar:'TSIA ELAR', stem:'STEM Challenge', math:'TSIA Math' };
  const r1 = monThuBlock(number, 'rot1', labels);
  const r2 = monThuBlock(number, 'rot2', labels);
  const r3 = monThuBlock(number, 'rot3', labels);
  return [
    { time:'9:30 – 10:45',  sortMin:570, activity:'Rotation 1: ' + r1.activity, room:r1.room },
    { time:'10:50 – 12:05', sortMin:650, activity:'Rotation 2: ' + r2.activity, room:r2.room },
    { time:'1:45 – 2:30',   sortMin:825, activity:'Rotation 3: ' + r3.activity, room:r3.room },
  ];
}

function getThursdayRotations(number) {
  const labels = { elar:'TSIA ELAR', stem:'STEM Challenge', math:'TSIA Math' };
  const r1 = monThuBlock(number, 'rot1', labels);
  const r2 = monThuBlock(number, 'rot2', labels);
  const r3 = monThuBlock(number, 'rot3', labels);
  return [
    { time:'8:40 – 9:45',   sortMin:520, activity:'Rotation 1: ' + r1.activity, room:r1.room },
    { time:'9:50 – 10:55',  sortMin:590, activity:'Rotation 2: ' + r2.activity, room:r2.room },
    { time:'11:00 – 12:05', sortMin:660, activity:'Rotation 3: ' + r3.activity, room:r3.room },
  ];
}

const MON_STUDENT_BLOCKS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',      room:'JECA Commons' },
  { time:'8:30 – 9:20',   sortMin:510, activity:'Welcome Kickoff',           room:'JECA Commons' },
  { time:'9:20 – 9:30',   sortMin:560, activity:'Transition to Rotation 1',  room:'' },
  { time:'10:45 – 10:50', sortMin:645, activity:'Transition to Rotation 2',  room:'' },
  { time:'12:05 – 12:15', sortMin:725, activity:'Transition to Lunch',        room:'' },
  { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                     room:'JECA Commons' },
  { time:'1:00 – 1:05',   sortMin:780, activity:'Transition to Games',        room:'' },
  { time:'1:05 – 1:35',   sortMin:785, activity:'Games',                     room:'' },
  { time:'1:35 – 1:45',   sortMin:815, activity:'Transition to Rotation 3',  room:'' },
  { time:'2:30 – 2:50',   sortMin:870, activity:'Transition to P-TECH 101',  room:'' },
  { time:'2:50 – 3:20',   sortMin:890, activity:'P-TECH 101',                room:'JECA Commons' },
  { time:'3:20 – 3:30',   sortMin:920, activity:'Dismissal',                 room:'JECA Commons' },
];

const THU_STUDENT_BLOCKS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',      room:'JECA Commons' },
  { time:'8:30 – 8:40',   sortMin:510, activity:'Transition to Rotation 1', room:'' },
  { time:'9:45 – 9:50',   sortMin:585, activity:'Transition to Rotation 2', room:'' },
  { time:'10:55 – 11:00', sortMin:655, activity:'Transition to Rotation 3', room:'' },
  { time:'12:05 – 12:15', sortMin:725, activity:'Transition to Lunch',       room:'' },
  { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                    room:'' },
  { time:'1:00 – 1:10',   sortMin:780, activity:'Transition to Pep Rally Prep', room:'' },
  { time:'1:10 – 1:45',   sortMin:790, activity:'Games / Pep Rally Prep',   room:'' },
  { time:'2:30 – 2:40',   sortMin:870, activity:'Transition to Pep Rally',  room:'' },
  { time:'2:30 – 3:30',   sortMin:875, activity:'JISD/NLC Pep Rally',       room:'JECA Commons' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',                room:'JECA Commons' },
];

const FRI_STUDENT_BLOCKS = [
  { time:'TBD', sortMin:480, activity:'TSI Test', room:'' },
];

// ─── Day config ───────────────────────────────────────────────────────────────
const DAYS = {
  mon: {
    label: 'Monday, June 8', short: 'Mon 6/8',
    type: 'monThu', numGroups: 9, studentOnly: false,
    studentBlocks: MON_STUDENT_BLOCKS,
    csvFile: 'students_mon.csv',
    getRotations: getMondayRotations,
  },
  tue: {
    label: 'Tuesday, June 9', short: 'Tue 6/9',
    type: 'color', studentOnly: false,
    rotations: TUE_ROTATIONS, rooms: TUE_ROOMS, rotTimes: TUE_ROT_TIMES,
    studentBlocks: TUE_STUDENT_BLOCKS, teacherBlocks: TUE_TEACHER_BLOCKS,
    csvFile: 'students_tue.csv', numGroups: 8,
  },
  wed: {
    label: 'Wednesday, June 10', short: 'Wed 6/10',
    type: 'color', studentOnly: false,
    rotations: WED_ROTATIONS, rooms: WED_ROOMS, rotTimes: WED_ROT_TIMES,
    studentBlocks: WED_STUDENT_BLOCKS,
    csvFile: 'students_wed.csv', numGroups: 8,
  },
  thu: {
    label: 'Thursday, June 11', short: 'Thu 6/11',
    type: 'monThu', numGroups: 9, studentOnly: false,
    studentBlocks: THU_STUDENT_BLOCKS,
    csvFile: 'students_thu.csv',
    getRotations: getThursdayRotations,
  },
  fri: {
    label: 'Friday, June 12', short: 'Fri 6/12',
    type: 'noRotations', numGroups: 0, studentOnly: true,
    studentBlocks: FRI_STUDENT_BLOCKS,
    csvFile: null,
  },
};

// Date-based active day
function getActiveDay() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  if (month === 6 && date === 8)  return 'mon';
  if (month === 6 && date === 9)  return 'tue';
  if (month === 6 && date === 10) return 'wed';
  if (month === 6 && date === 11) return 'thu';
  if (month === 6 && date === 12) return 'fri';
  return 'thu'; // fallback
}

const ACTIVE_DAY = getActiveDay();

// ─── State ────────────────────────────────────────────────────────────────────
let rostersByDay = {};
let activeTeacher = null;
let activeStudentDay = ACTIVE_DAY;
let activeTeacherDay = ACTIVE_DAY;

// ─── CSV loading ──────────────────────────────────────────────────────────────
async function loadAllRosters() {
  const bust = '?v=' + Date.now();
  let master = [];
  try {
    const res = await fetch('students_master.csv' + bust);
    if (res.ok) master = parseCSV(await res.text());
  } catch (_) {}

  for (const [dayKey, day] of Object.entries(DAYS)) {
    if (!day.csvFile) { rostersByDay[dayKey] = master; continue; }
    let overrides = [];
    try {
      const res = await fetch(day.csvFile + bust);
      if (res.ok) overrides = parseCSV(await res.text());
    } catch (_) {}

    if (overrides.length) {
      const overrideMap = new Map(overrides.map(s => [s.name, s]));
      rostersByDay[dayKey] = master.map(s => overrideMap.has(s.name) ? overrideMap.get(s.name) : s);
      for (const s of overrides) {
        if (!master.find(m => m.name === s.name)) rostersByDay[dayKey].push(s);
      }
    } else {
      rostersByDay[dayKey] = master;
    }
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    return { name: obj.name, color: obj.color, number: Number(obj.number) };
  });
}

// ─── Student picker + search ──────────────────────────────────────────────────
function initPicker() {
  updateGroupPicker(ACTIVE_DAY);
}

function switchStudentDay(dayKey) {
  const savedNumber = sessionStorage.getItem('sb_student_number');
  const savedName   = sessionStorage.getItem('sb_student_name');

  // If we have a name, look up their actual group for this day from the roster
  if (savedName) {
    const students = rostersByDay[dayKey] || [];
    const s = students.find(s => s.name === savedName);
    if (s) {
      showStudentSchedule(dayKey, s.number, s.name);
      return;
    }
  }

  // Fall back to saved number if no name match
  if (savedNumber) {
    showStudentSchedule(dayKey, Number(savedNumber), savedName || undefined);
  } else {
    showStudentSchedule(dayKey, null);
  }
}

function getSelectedStudentDay() {
  const active = document.querySelector('#student-day-tabs .day-tab.active');
  if (active) {
    const match = active.getAttribute('onclick').match(/'(\w+)'/);
    if (match) return match[1];
  }
  return sessionStorage.getItem('sb_student_day') || ACTIVE_DAY;
}

function updateGroupPicker(dayKey) {
  const day = DAYS[dayKey];
  const groupLabel = document.getElementById('group-picker-label');
  const groupSelect = document.getElementById('group-select');

  if (day.type === 'noRotations') {
    if (groupLabel) groupLabel.style.display = 'none';
    groupSelect.style.display = 'none';
    groupSelect.onchange = null;
    return;
  }
  if (groupLabel) groupLabel.style.display = '';
  groupSelect.style.display = '';
  groupSelect.value = '';
  groupSelect.innerHTML = '<option value="">Select your group number…</option>';
  for (let n = 1; n <= 9; n++) {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    groupSelect.appendChild(opt);
  }
  groupSelect.onchange = () => {
    const val = groupSelect.value;
    if (val) showStudentSchedule(ACTIVE_DAY, Number(val));
  };
}

function onStudentSearch() {
  const q = document.getElementById('student-search').value.trim().toLowerCase();
  const out = document.getElementById('student-search-results');
  if (!q) { out.innerHTML = ''; return; }

  const dayKey = getSelectedStudentDay();
  const students = rostersByDay[dayKey] || [];
  const matches = students.filter(s => s.name.toLowerCase().includes(q));

  if (!matches.length) {
    out.innerHTML = `<div class="empty-msg">No students found for "${q}"</div>`;
    return;
  }

  const seen = new Set();
  const unique = [];
  for (const s of matches) {
    if (!seen.has(s.name)) { seen.add(s.name); unique.push(s); }
  }
  unique.sort((a, b) => a.name.localeCompare(b.name));

  out.innerHTML = unique.map(s =>
    `<div class="result-row" onclick="selectStudentByName('${s.name.replace(/'/g,"\\'")}')">
      <div class="result-name">${s.name}</div>
    </div>`).join('');
}

function selectStudentByName(name) {
  const dayKey = getSelectedStudentDay();
  const students = rostersByDay[dayKey] || [];
  const s = students.find(s => s.name === name);
  if (!s) return;
  document.getElementById('student-search').value = '';
  document.getElementById('student-search-results').innerHTML = '';
  showStudentSchedule(dayKey, s.number, s.name);
}

function showStudentSchedule(dayKey, number, studentName) {
  activeStudentDay = dayKey;
  const day = DAYS[dayKey];
  const color = GROUP_COLOR[number] || '';
  const c = COLOR[color] || { bg:'var(--color-surface)', text:'var(--color-text)', border:'var(--color-border-strong)' };

  const nameDisplay = studentName || `Group ${number}`;
  document.getElementById('student-badge').innerHTML = number ? `
    <div class="student-badge" style="margin-bottom:1rem">
      <div class="badge-circle" style="background:${c.bg};color:${c.text};border-color:${c.border}">${number}</div>
      <div>
        <div class="badge-name">${nameDisplay}</div>
        <div class="badge-group">Group ${number}${color ? ' · ' + color : ''} · ${day.label}</div>
      </div>
    </div>` : '';

  // Group 9 has no rotations on Tue/Wed — show notice instead of schedule
  if (number === 9 && (dayKey === 'tue' || dayKey === 'wed')) {
    document.getElementById('student-blocks').className = '';
    document.getElementById('student-blocks').innerHTML = `
      <div class="notice-card warning">
        Group 9 has been reassigned for ${day.label.split(',')[0]}.
        Go back and search your name to find your group for today.
      </div>`;
  } else {

  const rotBlocks = day.type === 'monThu'
    ? day.getRotations(number)
    : day.type === 'noRotations'
    ? []
    : day.rotTimes.map((rt, i) => {
        const activity = day.rotations[number][i];
        const roomFull = day.rooms[activity]?.[number] || '';
        return { time: rt.time, sortMin: rt.sortMin, activity, room: formatRoom(roomFull) };
      });

  // Combine, filter transitions and lunch duty, sort
  const allBlocks = [
    ...day.studentBlocks
      .filter(b => !b.activity.startsWith('Transition') && b.activity !== 'Lunch Duty')
      .map(b => ({ time: b.time, sortMin: b.sortMin, activity: b.activity, room: b.room })),
    ...rotBlocks
  ].sort((a, b) => a.sortMin - b.sortMin);

  // Merge consecutive blocks with same activity+room into one time range
  const merged = [];
  for (const b of allBlocks) {
    const prev = merged[merged.length - 1];
    if (prev && prev.activity === b.activity && prev.room === b.room) {
      // Extend the end time of the previous block
      prev.time = prev.time.split('–')[0].trim() + ' – ' + b.time.split('–')[1]?.trim();
    } else {
      merged.push({ ...b });
    }
  }

  document.getElementById('student-blocks').innerHTML = merged.map(b => {
    const displayTime = b.activity === 'Dismissal' ? b.time.split('–')[0].trim() : b.time;
    return `<div class="sched-block">
      <div class="sched-time">${displayTime}</div>
      <div class="sched-activity">${b.activity}</div>
      ${b.room ? `<div class="sched-room">📍 ${b.room}</div>` : ''}
    </div>`;
  }).join('');
  document.getElementById('student-blocks').className = 'card';
  } // end else (not group 9 on Tue/Wed)

  // Render day tabs in schedule view
  const tabsEl = document.getElementById('student-day-tabs');
  if (tabsEl) {
    tabsEl.innerHTML = Object.entries(DAYS).map(([key, day]) =>
      `<button class="day-tab${key === dayKey ? ' active' : ''}"
        onclick="switchStudentDay('${key}')">${day.short}</button>`
    ).join('');
  }

  sessionStorage.setItem('sb_student_number', number);
  sessionStorage.setItem('sb_student_name', studentName || '');
  sessionStorage.setItem('sb_student_day', dayKey);
  sessionStorage.setItem('sb_tab', 'student');
  sessionStorage.setItem('sb_saved_at', Date.now());
  document.getElementById('student-picker').style.display = 'none';
  document.getElementById('student-sched-view').style.display = '';
}

function clearStudentSchedule() {
  sessionStorage.removeItem('sb_student_number');
  sessionStorage.removeItem('sb_student_name');
  sessionStorage.removeItem('sb_student_day');
  document.getElementById('student-sched-view').style.display = 'none';
  document.getElementById('student-picker').style.display = '';
  document.getElementById('group-select').value = '';
  document.getElementById('student-search').value = '';
  document.getElementById('student-search-results').innerHTML = '';
}

// ─── Teacher registry ─────────────────────────────────────────────────────────
const ALL_TEACHERS = [
  { name:'Brown',   room:'B226' },
  { name:'Garcia',  room:'B206' },
  { name:'Gilmore', room:'B202' },
  { name:'Harwell', room:'B227' },
  { name:'Kennedy', room:'B209' },
  { name:'Mercado', room:'B229' },
  { name:'Miller',  room:'B207' },
  { name:'Tinoco',  room:'B221' },
  { name:'Whitby',  room:'B208' },
].sort((a, b) => a.name.localeCompare(b.name));

// Teachers with no schedule on specific days
const TEACHER_ABSENT = {
  Brown: ['tue', 'wed'],
};

// ─── Teacher schedule builder ─────────────────────────────────────────────────
function getTeacherSchedule(teacherName, dayKey) {
  const day = DAYS[dayKey];

  // Mon/Thu: numbered rotation system
  if (day.type === 'monThu') {
    const rotSlots = ['rot1', 'rot2', 'rot3'];
    const times = dayKey === 'mon'
      ? [{ time:'9:30 – 10:45', sortMin:570 }, { time:'10:50 – 12:05', sortMin:650 }, { time:'1:45 – 2:30', sortMin:825 }]
      : [{ time:'8:40 – 9:45',  sortMin:520 }, { time:'9:50 – 10:55',  sortMin:590 }, { time:'11:00 – 12:05',sortMin:660 }];

    // Find which subject+tier this teacher covers
    let teacherSubj = null, teacherTier = null;
    for (const [subj, groups] of Object.entries(MON_THU_ROOMS)) {
      for (const [num, roomStr] of Object.entries(groups)) {
        if (roomStr.startsWith(teacherName + '-')) {
          teacherSubj = subj;
          teacherTier = Number(num) <= 3 ? [1,2,3] : Number(num) <= 6 ? [4,5,6] : [7,8,9];
          break;
        }
      }
      if (teacherSubj) break;
    }
    if (!teacherSubj) return [];

    const labelMap = { elar:'TSIA ELAR', stem:'STEM Challenge', math:'TSIA Math' };
    const roomStr = MON_THU_ROOMS[teacherSubj][teacherTier[0]];

    return rotSlots.map((slot, i) => {
      const groups = MON_THU_ROTS[slot][teacherSubj].filter(n => teacherTier.includes(n));
      return {
        time: times[i].time, sortMin: times[i].sortMin,
        activity: labelMap[teacherSubj],
        location: formatRoom(roomStr),
        groups,
      };
    });
  }

  // Tue/Wed: color rotation system
  return day.rotTimes.map((rt, rotIdx) => {
    const matchingGroups = [];
    for (let n = 1; n <= day.numGroups; n++) {
      const activity = day.rotations[n][rotIdx];
      const roomStr = day.rooms[activity]?.[n] || '';
      if (roomStr.startsWith(teacherName + '-')) matchingGroups.push(n);
    }
    const activity = matchingGroups.length > 0 ? day.rotations[matchingGroups[0]][rotIdx] : '';
    const roomFull = matchingGroups.length > 0 ? day.rooms[activity]?.[matchingGroups[0]] || '' : '';
    return { time: rt.time, sortMin: rt.sortMin, activity, location: formatRoom(roomFull), groups: matchingGroups };
  });
}

// ─── Teacher search ───────────────────────────────────────────────────────────
function onTeacherSearch() {
  const q = document.getElementById('teacher-search').value.trim().toLowerCase();
  const out = document.getElementById('teacher-results');
  if (!q) { out.innerHTML = ''; return; }
  const matches = ALL_TEACHERS.filter(t => t.name.toLowerCase().includes(q));
  if (!matches.length) { out.innerHTML = `<div class="empty-msg">No teachers found for "${q}"</div>`; return; }
  out.innerHTML = matches.map(t => `
    <div class="result-row" onclick="selectTeacher('${t.name}')">
      <div class="teacher-avatar" style="width:36px;height:36px;font-size:14px">${t.name.charAt(0)}</div>
      <div><div class="result-name">${t.name}</div><div class="result-sub">${t.room}</div></div>
    </div>`).join('');
}

function selectTeacher(name) {
  activeTeacher = name;
  activeTeacherDay = ACTIVE_DAY;
  sessionStorage.setItem('sb_teacher', name);
  sessionStorage.setItem('sb_tab', 'teacher');
  sessionStorage.setItem('sb_saved_at', Date.now());
  document.getElementById('teacher-search').value = '';
  document.getElementById('teacher-results').innerHTML = '';
  document.getElementById('teacher-search-wrap').style.display = 'none';
  document.getElementById('teacher-sched-view').style.display = '';
  renderTeacherView();
}

function renderTeacherView() {
  const name = activeTeacher;
  const t = ALL_TEACHERS.find(t => t.name === name);
  const dayKey = activeTeacherDay;
  const day = DAYS[dayKey];
  const isNLCTraveler = NLC_TRAVELERS.has(name);

  // Badge
  document.getElementById('teacher-badge').innerHTML = `
    <div class="teacher-badge">
      <div class="teacher-avatar">${name.charAt(0)}</div>
      <div>
        <div class="teacher-name">${name}</div>
        <div class="teacher-room">${t?.room || ''}</div>
      </div>
    </div>`;

  // Day tabs — exclude student-only days
  const tabsHtml = Object.entries(DAYS)
    .filter(([, d]) => !d.studentOnly)
    .map(([dk, d]) =>
      `<button class="day-tab${dk === dayKey ? ' active' : ''}" onclick="switchTeacherDay('${dk}')">${d.short}</button>`
    ).join('');
  document.getElementById('teacher-day-tabs').innerHTML = `<div class="day-tabs">${tabsHtml}</div>`;

  const notice = isNLCTraveler && (dayKey === 'tue' || dayKey === 'wed')
    ? `<div class="nlc-travel-card">🚌 You are traveling to NLC today. Your location each rotation is listed below.</div>`
    : '';

  // Teacher absent on this day — show notice instead of schedule
  if (TEACHER_ABSENT[name]?.includes(dayKey)) {
    document.getElementById('teacher-blocks').innerHTML =
      `<div class="notice-card warning">No schedule found for ${day.label.split(',')[0]}.</div>`;
    return;
  }

  const rotations = getTeacherSchedule(name, dayKey);
  const students = rostersByDay[dayKey] || [];

  const rotationRows = rotations.map((rot, i) => {
    const rotId = `rot-${i}`;
    const groupPills = rot.groups.map(n => {
      const color = GROUP_COLOR[n] || '';
      const c = COLOR[color] || { bg:'var(--color-surface)', text:'var(--color-text)', border:'var(--color-border-strong)' };
      return `<span class="group-pill" style="background:${c.bg};color:${c.text};border:1px solid ${c.border};margin-right:4px">Group ${n}</span>`;
    }).join('');

    const incomingStudents = students
      .filter(s => rot.groups.includes(s.number))
      .sort((a, b) => a.name.localeCompare(b.name));
    const count = incomingStudents.length;
    const rosterRows = count
      ? incomingStudents.map(s => `<div class="student-chip"><div class="chip-name">${s.name}</div></div>`).join('')
      : '<div class="no-students">No roster loaded</div>';

    const locationHtml = rot.location ? `<div class="sched-room">📍 ${rot.location}</div>` : '';

    return {
      sortMin: rot.sortMin,
      html: `<div class="sched-block">
        <div class="sched-time">${rot.time}</div>
        <div class="sched-activity">${rot.activity || '—'}</div>
        <div style="margin-top:4px">${groupPills}</div>
        ${locationHtml}
        <div class="roster-toggle-row" onclick="toggleRoster('${rotId}')" style="cursor:pointer;margin-top:6px;display:flex;align-items:center;gap:6px">
          <span class="roster-count">${count} student${count !== 1 ? 's' : ''}</span>
          <span class="toggle-arrow" id="${rotId}-arrow">▸</span>
        </div>
        <div class="rot-roster" id="${rotId}" style="display:none;margin-top:4px">${rosterRows}</div>
      </div>`
    };
  });

  // Full-group blocks — by day
  let fullBlocks;
  if (dayKey === 'wed') {
    fullBlocks = isNLCTraveler ? WED_TEACHER_BLOCKS_NLC : WED_TEACHER_BLOCKS_ONCAMPUS;
  } else if (dayKey === 'mon') {
    fullBlocks = isNLCTraveler ? [
      { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast', room:'JECA Commons' },
      { time:'8:30 – 9:20',   sortMin:510, activity:'Welcome Kickoff',      room:'JECA Commons' },
      { time:'12:15 – 12:30', sortMin:735, activity:'Lunch Duty',           room:'JECA Commons' },
      { time:'12:30 – 1:00',  sortMin:750, activity:'Lunch',                room:'' },
      { time:'1:05 – 1:35',   sortMin:785, activity:'Games',                room:'' },
      { time:'2:50 – 3:20',   sortMin:890, activity:'P-TECH 101',           room:'JECA Commons' },
      { time:'3:20 – 3:30',   sortMin:920, activity:'Dismissal',            room:'JECA Commons' },
    ] : [
      { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast', room:'JECA Commons' },
      { time:'8:30 – 9:20',   sortMin:510, activity:'Welcome Kickoff',      room:'JECA Commons' },
      { time:'12:15 – 12:45', sortMin:735, activity:'Lunch',                room:'' },
      { time:'12:45 – 1:00',  sortMin:765, activity:'Lunch Duty',           room:'JECA Commons' },
      { time:'1:05 – 1:35',   sortMin:785, activity:'Games',                room:'' },
      { time:'2:50 – 3:20',   sortMin:890, activity:'P-TECH 101',           room:'JECA Commons' },
      { time:'3:20 – 3:30',   sortMin:920, activity:'Dismissal',            room:'JECA Commons' },
    ];
  } else if (dayKey === 'thu') {
    fullBlocks = isNLCTraveler ? [
      { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
      { time:'12:15 – 12:30', sortMin:735, activity:'Lunch Duty',            room:'JECA Commons' },
      { time:'12:30 – 1:00',  sortMin:750, activity:'Lunch',                 room:'' },
      { time:'1:10 – 1:45',   sortMin:790, activity:'Games / Pep Rally Prep',room:'' },
      { time:'2:30 – 3:30',   sortMin:870, activity:'JISD/NLC Pep Rally',    room:'JECA Commons' },
      { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',             room:'JECA Commons' },
    ] : [
      { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',   room:'JECA Commons' },
      { time:'12:15 – 12:45', sortMin:735, activity:'Lunch',                 room:'' },
      { time:'12:45 – 1:00',  sortMin:765, activity:'Lunch Duty',            room:'JECA Commons' },
      { time:'1:10 – 1:45',   sortMin:790, activity:'Games / Pep Rally Prep',room:'' },
      { time:'2:30 – 3:30',   sortMin:870, activity:'JISD/NLC Pep Rally',    room:'JECA Commons' },
      { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',             room:'JECA Commons' },
    ];
  } else {
    fullBlocks = TUE_TEACHER_BLOCKS;
  }

  // Merge consecutive identical activity+room blocks
  function mergeBlocks(blocks) {
    const merged = [];
    for (const b of blocks) {
      const prev = merged[merged.length - 1];
      if (prev && prev.activity === b.activity && prev.room === b.room) {
        prev.time = prev.time.split('–')[0].trim() + ' – ' + b.time.split('–')[1]?.trim();
      } else {
        merged.push({ ...b });
      }
    }
    return merged;
  }

  const fullGroupRows = mergeBlocks(fullBlocks.filter(b => !b.activity.startsWith('Transition'))).map(b => ({
    sortMin: b.sortMin,
    html: `<div class="sched-block">
      <div class="sched-time">${b.time}</div>
      <div class="sched-activity">${b.activity}</div>
      ${b.room ? `<div class="sched-room">📍 ${b.room}</div>` : ''}
    </div>`
  }));

  const allRows = [...rotationRows, ...fullGroupRows]
    .sort((a, b) => a.sortMin - b.sortMin)
    .map(r => r.html).join('');

  document.getElementById('teacher-blocks').innerHTML = notice + `<div class="card">${allRows}</div>`;
}

function switchTeacherDay(dayKey) {
  activeTeacherDay = dayKey;
  renderTeacherView();
}

function toggleRoster(id) {
  const roster = document.getElementById(id);
  const arrow = document.getElementById(id + '-arrow');
  const isOpen = roster.style.display !== 'none';
  roster.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
}

function clearTeacherSchedule() {
  activeTeacher = null;
  sessionStorage.removeItem('sb_teacher');
  document.getElementById('teacher-sched-view').style.display = 'none';
  document.getElementById('teacher-search-wrap').style.display = '';
  document.getElementById('teacher-search').focus();
}

// ─── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', ['student','teacher'][i] === tabId);
  });
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  // Only update saved tab if switching to teacher, or no teacher is active
  if (tabId === 'teacher' || !sessionStorage.getItem('sb_teacher')) {
    sessionStorage.setItem('sb_tab', tabId);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await loadAllRosters();
  initPicker();

  const savedAt = Number(sessionStorage.getItem('sb_saved_at') || 0);
  const eightHours = 8 * 60 * 60 * 1000;
  if (Date.now() - savedAt > eightHours) {
    ['sb_tab','sb_student_number','sb_student_name','sb_student_day','sb_teacher'].forEach(k => sessionStorage.removeItem(k));
  }

  const savedTab     = sessionStorage.getItem('sb_tab');
  const savedNumber  = sessionStorage.getItem('sb_student_number');
  const savedName    = sessionStorage.getItem('sb_student_name');
  const savedDay     = sessionStorage.getItem('sb_student_day') || ACTIVE_DAY;
  const savedTeacher = sessionStorage.getItem('sb_teacher');

  if (savedTab) switchTab(savedTab);

  // Restore teacher regardless of current tab — persists until another teacher is selected
  if (savedTeacher) {
    activeTeacher = savedTeacher;
    if (savedTab === 'teacher') {
      selectTeacher(savedTeacher);
    }
  }
  if (savedNumber && savedTab !== 'teacher') {
    if (savedDay) switchStudentDay(savedDay);
    showStudentSchedule(savedDay, Number(savedNumber), savedName || undefined);
  }
}
init();