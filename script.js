// ─── Color themes ─────────────────────────────────────────────────────────────
const COLOR = {
  Red:    { bg:'var(--red-bg)',    text:'var(--red-text)',    border:'var(--red-border)'    },
  Green:  { bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)'  },
  Blue:   { bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)'   },
  Orange: { bg:'var(--orange-bg)',text:'var(--orange-text)',border:'var(--orange-border)' },
  Yellow: { bg:'var(--yellow-bg)',text:'var(--yellow-text)',border:'var(--yellow-border)' },
};

// ─── Group → band color (hardcoded) ──────────────────────────────────────────
// Orange: 1-3, Yellow: 4-6, Green: 7-8
const GROUP_COLOR = {
  1:'Orange', 2:'Orange', 3:'Orange',
  4:'Yellow', 5:'Yellow', 6:'Yellow',
  7:'Green',  8:'Green',
};

// ─── Tuesday rotation schedule ────────────────────────────────────────────────
// Group number (1-8) determines column; column determines all 4 rotations
const TUE_ROTATIONS = {
  1: ['NLC HSP Orientation',    'NLC Advising', 'TSI Math',                       'TSI ELAR'                        ],
  2: ['NLC Advising',    'NLC HSP Orientation', 'TSI ELAR',                       'TSI Math'                        ],
  3: ['TSI Math',                          'TSI ELAR',                       'NLC HSP Orientation', 'NLC Advising'  ],
  4: ['TSI ELAR',                          'TSI Math',                       'NLC Advising', 'NLC HSP Orientation'  ],
  5: ['NLC Advising',    'NLC HSP Orientation', 'TSI ELAR',                       'TSI Math'                        ],
  6: ['TSI Math',                          'TSI ELAR',                       'NLC HSP Orientation', 'NLC Advising'  ],
  7: ['TSI ELAR',                          'TSI Math',                       'NLC Advising', 'NLC HSP Orientation'  ],
  8: ['NLC HSP Orientation',    'NLC Advising', 'TSI Math',                       'TSI ELAR'                        ],
};

// Room for each activity by group number — stripped display version for students
// Teacher name included so teacher view can match; stripped for student display
const TUE_ROOMS = {
  'TSI ELAR': {
    1:'Miller-B207', 2:'Miller-B207', 3:'Miller-B207', 4:'Miller-B207',
    5:'Garcia-B206', 6:'Garcia-B206', 7:'Garcia-B206', 8:'Garcia-B206',
  },
  'TSI Math': {
    1:'Kennedy-B209', 2:'Kennedy-B209', 3:'Kennedy-B209', 4:'Kennedy-B209',
    5:'Tinoco-B221',  6:'Tinoco-B221',  7:'Tinoco-B221',  8:'Tinoco-B221',
  },
  'NLC Advising': {
    1:'Whitby-PLXY Bluebonnet',  2:'Harwell-PLXY Bluebonnet', 3:'Harwell-PLXY Bluebonnet',
    4:'Whitby-PLXY Bluebonnet',  5:'Mercado-PLXY Bluebonnet', 6:'Mercado-PLXY Bluebonnet',
    7:'Gilmore-PLXY Bluebonnet', 8:'Gilmore-PLXY Bluebonnet',
  },
  'NLC HSP Orientation': {
    1:'Whitby-PLXY 100',  2:'Harwell-PLXY 100', 3:'Harwell-PLXY 100',
    4:'Whitby-PLXY 100',  5:'Mercado-PLXY 100', 6:'Mercado-PLXY 100',
    7:'Gilmore-PLXY 100', 8:'Gilmore-PLXY 100',
  },
};

// Format room string for display
// ELAR/Math: "Miller-B207" → "Miller - 207"
// NLC: "Whitby-PLXY 100" → "PLXY 100" (no teacher name)
function formatRoom(roomStr) {
  if (!roomStr) return '';
  const i = roomStr.indexOf('-');
  if (i === -1) return roomStr;
  const teacher = roomStr.substring(0, i);
  const room = roomStr.substring(i + 1);
  // NLC rooms start with PLXY — just show the room
  if (room.startsWith('PLXY')) return room;
  const roomNum = room.startsWith('B') && !isNaN(room.substring(1)) ? room.substring(1) : room;
  return `${teacher} - ${roomNum}`;
}

// NLC travelers
const NLC_TRAVELERS = new Set(['Harwell','Mercado','Gilmore','Whitby']);

// ─── Tuesday full-group blocks ────────────────────────────────────────────────
const TUE_FULL_BLOCKS = [
  { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',  room:'JECA Commons' },
  { time:'8:30 – 8:40',   sortMin:510, activity:'Transition to Rotation 1', room:'' },
  { time:'9:45 – 9:50',   sortMin:585, activity:'Transition to Rotation 2', room:'' },
  { time:'10:55 – 11:15', sortMin:655, activity:'Transition to Exploration Rotation', room:'' },
  { time:'11:15 – 12:15', sortMin:675, activity:'Exploration Rotation',  room:'PLXY Bluebonnet' },
  { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                 room:'JECA Student Commons' },
  { time:'1:00 – 1:10',   sortMin:780, activity:'Transition to Rotation 3', room:'' },
  { time:'2:15 – 2:20',   sortMin:855, activity:'Transition to Rotation 4', room:'' },
  { time:'3:25 – 3:30',   sortMin:925, activity:'Transition to Dismissal', room:'' },
  { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',             room:'JECA Commons' },
];

const TUE_ROT_TIMES = [
  { time:'8:40 – 9:45',  sortMin:520 },
  { time:'9:50 – 10:55', sortMin:590 },
  { time:'1:10 – 2:15',  sortMin:790 },
  { time:'2:20 – 3:25',  sortMin:860 },
];

// ─── State ────────────────────────────────────────────────────────────────────
let rostersByDay = {};
let activeTeacher = null;

// ─── CSV loading ──────────────────────────────────────────────────────────────
async function loadAllRosters() {
  try {
    const res = await fetch('students_tue.csv');
    if (res.ok) {
      const text = await res.text();
      rostersByDay['tue'] = parseCSV(text);
    }
  } catch (_) {}
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

// ─── Student picker ───────────────────────────────────────────────────────────
function initPicker() {
  const select = document.getElementById('group-select');
  select.innerHTML = '<option value="">Select your group number…</option>';
  for (let n = 1; n <= 8; n++) {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    select.appendChild(opt);
  }
}

function onGroupSelect() {
  const val = document.getElementById('group-select').value;
  if (!val) return;
  showStudentSchedule(Number(val));
}

function showStudentSchedule(number) {
  const color = GROUP_COLOR[number] || '';
  const c = COLOR[color] || { bg:'var(--color-surface)', text:'var(--color-text)', border:'var(--color-border-strong)' };

  document.getElementById('student-badge').innerHTML = `
    <div class="student-badge" style="margin-bottom:1rem">
      <div class="badge-circle" style="background:${c.bg};color:${c.text};border-color:${c.border}">${number}</div>
      <div>
        <div class="badge-name">Group ${number}${color ? ' · ' + color : ''}</div>
        <div class="badge-group">Tuesday, June 9</div>
      </div>
    </div>`;

  // Build student schedule: full blocks + 4 rotation blocks, sorted
  const rotBlocks = TUE_ROT_TIMES.map((rt, i) => {
    const activity = TUE_ROTATIONS[number][i];
    const roomFull = TUE_ROOMS[activity]?.[number] || '';
    const room = formatRoom(roomFull);
    return { time: rt.time, sortMin: rt.sortMin, activity, room };
  });

  const allBlocks = [...TUE_FULL_BLOCKS, ...rotBlocks]
    .filter(b => !b.activity.startsWith('Transition'))
    .sort((a, b) => a.sortMin - b.sortMin);

  document.getElementById('student-blocks').innerHTML = allBlocks.map(b => `
    <div class="sched-block">
      <div class="sched-time">${b.time}</div>
      <div class="sched-activity">${b.activity}</div>
      ${b.room ? `<div class="sched-room">📍 ${b.room}</div>` : ''}
    </div>`).join('');

  document.getElementById('student-picker').style.display = 'none';
  document.getElementById('student-sched-view').style.display = '';
}

function clearStudentSchedule() {
  document.getElementById('student-sched-view').style.display = 'none';
  document.getElementById('student-picker').style.display = '';
  document.getElementById('group-select').value = '';
}

// ─── Teacher registry ─────────────────────────────────────────────────────────
const ALL_TEACHERS = [
  { name:'Garcia',   room:'B206' },
  { name:'Gilmore',  room:'B202' },
  { name:'Harwell',  room:'B227' },
  { name:'Kennedy',  room:'B209' },
  { name:'Mercado',  room:'B229' },
  { name:'Miller',   room:'B207' },
  { name:'Tinoco',   room:'B221' },
  { name:'Whitby',   room:'B208' },
].sort((a, b) => a.name.localeCompare(b.name));

// ─── Teacher schedule builder ─────────────────────────────────────────────────
function getTeacherScheduleTue(teacherName) {
  const students = rostersByDay['tue'] || [];

  return TUE_ROT_TIMES.map((rt, rotIdx) => {
    // Find every group number where this teacher's room matches this rotation
    const matchingGroups = [];
    for (let n = 1; n <= 8; n++) {
      const activity = TUE_ROTATIONS[n][rotIdx];
      const roomStr = TUE_ROOMS[activity]?.[n] || '';
      if (roomStr.startsWith(teacherName + '-')) {
        matchingGroups.push(n);
      }
    }

    // Get the activity and location from first matching group
    const activity = matchingGroups.length > 0
      ? TUE_ROTATIONS[matchingGroups[0]][rotIdx] : '';
    const roomFull = matchingGroups.length > 0
      ? TUE_ROOMS[activity]?.[matchingGroups[0]] || '' : '';
    const location = formatRoom(roomFull);
    const traveling = NLC_TRAVELERS.has(teacherName);

    return {
      time: rt.time,
      sortMin: rt.sortMin,
      activity,
      location,
      traveling,
      groups: matchingGroups, // group numbers coming to this teacher
    };
  });
}

// ─── Teacher search ───────────────────────────────────────────────────────────
function onTeacherSearch() {
  const q = document.getElementById('teacher-search').value.trim().toLowerCase();
  const out = document.getElementById('teacher-results');
  if (!q) { out.innerHTML = ''; return; }

  const matches = ALL_TEACHERS.filter(t => t.name.toLowerCase().includes(q));
  if (!matches.length) {
    out.innerHTML = `<div class="empty-msg">No teachers found for "${q}"</div>`;
    return;
  }

  out.innerHTML = matches.map(t => `
    <div class="result-row" onclick="selectTeacher('${t.name}')">
      <div class="teacher-avatar" style="width:36px;height:36px;font-size:14px">${t.name.charAt(0)}</div>
      <div>
        <div class="result-name">${t.name}</div>
        <div class="result-sub">${t.room}</div>
      </div>
    </div>`).join('');
}

function selectTeacher(name) {
  activeTeacher = name;
  document.getElementById('teacher-search').value = '';
  document.getElementById('teacher-results').innerHTML = '';
  document.getElementById('teacher-search-wrap').style.display = 'none';
  document.getElementById('teacher-sched-view').style.display = '';
  renderTeacherView();
}

function renderTeacherView() {
  const name = activeTeacher;
  const t = ALL_TEACHERS.find(t => t.name === name);
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

  // No day tabs — Tuesday only
  document.getElementById('teacher-day-tabs').innerHTML =
    `<p class="label" style="margin-bottom:1rem">Tuesday, June 9</p>`;

  const rotations = getTeacherScheduleTue(name);
  const teacherHomeRoom = t?.room || '';

  const notice = isNLCTraveler
    ? `<div class="nlc-travel-card">🚌 You are traveling to NLC today. Your location each rotation is listed below.</div>`
    : '';

  // Rotation rows — show all 4, not just ones with students
  const rotationRows = rotations.map((rot, i) => {
    const rotId = `rot-${i}`;

    // Group pills for each group coming to this teacher
    const groupPills = rot.groups.map(n => {
      const color = GROUP_COLOR[n] || '';
      const c = COLOR[color] || { bg:'var(--color-surface)', text:'var(--color-text)', border:'var(--color-border-strong)' };
      return `<span class="group-pill" style="background:${c.bg};color:${c.text};border:1px solid ${c.border};margin-right:4px">Group ${n}</span>`;
    }).join('');

    const locationHtml = rot.location
      ? `<div class="sched-room">📍 ${rot.location}</div>`
      : '';

    return {
      sortMin: rot.sortMin,
      html: `<div class="sched-block">
        <div class="sched-time">${rot.time}</div>
        <div class="sched-activity">${rot.activity || 'No students'}</div>
        <div style="margin-top:4px">${groupPills}</div>
        ${locationHtml}
      </div>`
    };
  });

  const fullGroupRows = TUE_FULL_BLOCKS
    .filter(b => !b.activity.startsWith('Transition'))
    .map(b => ({
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

  document.getElementById('teacher-blocks').innerHTML =
    notice + `<div class="card">${allRows}</div>`;
}

function clearTeacherSchedule() {
  activeTeacher = null;
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
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  await loadAllRosters();
  initPicker();
}
init();