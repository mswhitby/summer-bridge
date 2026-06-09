// ─── Color themes ─────────────────────────────────────────────────────────────
const COLOR = {
  Red:    { bg:'var(--red-bg)',    text:'var(--red-text)',    border:'var(--red-border)'    },
  Green:  { bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)'  },
  Blue:   { bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)'   },
  Orange: { bg:'var(--orange-bg)',text:'var(--orange-text)',border:'var(--orange-border)' },
  Yellow: { bg:'var(--yellow-bg)',text:'var(--yellow-text)',border:'var(--yellow-border)' },
};

// ─── Tuesday: group number (1-8) is the primary key ──────────────────────────
// From the printed schedule photo:
// Col 1 (NLC Advising PLXY Bluebonnet → NLC HSP PLXY100 → TSI ELAR → TSI Math): groups 2, 5
// Col 2 (NLC HSP PLXY100 → NLC Advising PLXY Bluebonnet → TSI Math → TSI ELAR): groups 1, 8
// Col 3 (TSI ELAR → TSI Math → NLC Advising PLXY Bluebonnet → NLC HSP PLXY100): groups 7, 4
// Col 4 (TSI Math → TSI ELAR → NLC HSP PLXY100 → NLC Advising PLXY Bluebonnet): groups 3, 6

const TUE_ROTATIONS = {
  // [rot1, rot2, rot3, rot4] for each group number
  1: ['NLC HSP Orientation (PLXY 100)',    'NLC Advising (PLXY Bluebonnet)', 'TSI Math',                       'TSI ELAR'                       ],
  2: ['NLC Advising (PLXY Bluebonnet)',    'NLC HSP Orientation (PLXY 100)', 'TSI ELAR',                       'TSI Math'                        ],
  3: ['TSI Math',                          'TSI ELAR',                       'NLC HSP Orientation (PLXY 100)', 'NLC Advising (PLXY Bluebonnet)'  ],
  4: ['TSI ELAR',                          'TSI Math',                       'NLC Advising (PLXY Bluebonnet)', 'NLC HSP Orientation (PLXY 100)'  ],
  5: ['NLC Advising (PLXY Bluebonnet)',    'NLC HSP Orientation (PLXY 100)', 'TSI ELAR',                       'TSI Math'                        ],
  6: ['TSI Math',                          'TSI ELAR',                       'NLC HSP Orientation (PLXY 100)', 'NLC Advising (PLXY Bluebonnet)'  ],
  7: ['TSI ELAR',                          'TSI Math',                       'NLC Advising (PLXY Bluebonnet)', 'NLC HSP Orientation (PLXY 100)'  ],
  8: ['NLC HSP Orientation (PLXY 100)',    'NLC Advising (PLXY Bluebonnet)', 'TSI Math',                       'TSI ELAR'                        ],
};

// Tuesday teacher assignments per rotation slot and activity
// On campus all rotations: Kennedy+Miller (ELAR rot1&3 / Math rot2&4 for their groups)
//                          Tinoco+Garcia  (Math rot1&3 / ELAR rot2&4 for their groups)
// NLC travelers: Harwell+Mercado (rot1&3 NLC groups), Gilmore+Whitby (rot2&4 NLC groups)
//
// Groups in each column:
// Col1 (2,5): NLC Advising rot1, NLC HSP rot2, ELAR rot3, Math rot4
// Col2 (1,8): NLC HSP rot1, NLC Advising rot2, Math rot3, ELAR rot4
// Col3 (7,4): ELAR rot1, Math rot2, NLC Advising rot3, NLC HSP rot4
// Col4 (3,6): Math rot1, ELAR rot2, NLC HSP rot3, NLC Advising rot4

// Teacher room lookup for Tuesday — keyed by activity label
const TUE_TEACHER_ROOMS = {
  'TSI ELAR': { groups:[1,2,3,4,5,6,7,8],
    // Kennedy handles col1(2,5) rot3 and col2(1,8) rot4; Miller handles col3(7,4) rot1 and col4(3,6) rot2
    byGroup: { 1:'Kennedy-B209', 2:'Kennedy-B209', 3:'Miller-B207', 4:'Miller-B207',
               5:'Kennedy-B209', 6:'Miller-B207',  7:'Miller-B207', 8:'Kennedy-B209' } },
  'TSI Math': { groups:[1,2,3,4,5,6,7,8],
    byGroup: { 1:'Tinoco-B221', 2:'Tinoco-B221', 3:'Tinoco-B221', 4:'Garcia-B206',
               5:'Tinoco-B221', 6:'Tinoco-B221', 7:'Garcia-B206', 8:'Tinoco-B221' } },
  'NLC Advising (PLXY Bluebonnet)': { byGroup: {
    1:'Mercado-PLXY Bluebonnet', 2:'Harwell-PLXY Bluebonnet', 3:'Mercado-PLXY Bluebonnet',
    4:'Mercado-PLXY Bluebonnet', 5:'Harwell-PLXY Bluebonnet', 6:'Mercado-PLXY Bluebonnet',
    7:'Mercado-PLXY Bluebonnet', 8:'Harwell-PLXY Bluebonnet' } },
  'NLC HSP Orientation (PLXY 100)': { byGroup: {
    1:'Gilmore-PLXY 100', 2:'Whitby-PLXY 100', 3:'Gilmore-PLXY 100',
    4:'Gilmore-PLXY 100', 5:'Whitby-PLXY 100', 6:'Gilmore-PLXY 100',
    7:'Gilmore-PLXY 100', 8:'Whitby-PLXY 100' } },
};

// ─── Mon/Thu room assignments ─────────────────────────────────────────────────
const ROOMS_MON_THU = {
  elar: { Red:'Miller-B207',  Green:'Garcia-B206',  Blue:'Gilmore-B202' },
  stem: { Red:'Brown-B226',   Green:'Mercado-B229', Blue:'Harwell-B227' },
  math: { Red:'Kennedy-B209', Green:'Tinoco-B221',  Blue:'Whitby-B208'  },
};

const MON_THU_ROTS = {
  rot1: { elar:[1,4,7], stem:[2,5,8], math:[3,6,9] },
  rot2: { elar:[3,6,9], stem:[1,4,7], math:[2,5,8] },
  rot3: { elar:[2,5,8], stem:[3,6,9], math:[1,4,7] },
};
const MON_THU_LABELS = { elar:'TSIA ELAR', stem:'STEM Challenge', math:'TSIA Math' };

function numberedBlock(color, number, slot) {
  for (const [subj, nums] of Object.entries(MON_THU_ROTS[slot])) {
    if (nums.includes(number)) {
      return { activity: MON_THU_LABELS[subj], room: ROOMS_MON_THU[subj][color] };
    }
  }
}

// ─── Schedule definitions ─────────────────────────────────────────────────────
// Only Tuesday is active for students right now
const SCHEDULES = {
  mon: {
    label: 'Monday, June 8', shortLabel: 'Mon 6/8',
    numGroups: 9, csvFile: 'students_mon.csv', active: false,
    getSchedule(color, number) {
      const r1 = numberedBlock(color, number, 'rot1');
      const r2 = numberedBlock(color, number, 'rot2');
      const r3 = numberedBlock(color, number, 'rot3');
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',        room:'JECA Commons' },
        { time:'8:30 – 9:20',   activity:'Welcome Kickoff',             room:'JECA Commons' },
        { time:'9:30 – 10:45',  activity:'Rotation 1: ' + r1.activity, room:r1.room },
        { time:'10:50 – 12:05', activity:'Rotation 2: ' + r2.activity, room:r2.room },
        { time:'12:15 – 1:00',  activity:'Lunch',                       room:'JECA Commons' },
        { time:'1:05 – 1:35',   activity:'Games',                       room:'' },
        { time:'1:45 – 2:30',   activity:'Rotation 3: ' + r3.activity, room:r3.room },
        { time:'2:50 – 3:20',   activity:'P-TECH 101',                  room:'JECA Commons' },
        { time:'3:20 – 3:30',   activity:'Dismissal',                   room:'JECA Commons' },
      ];
    }
  },

  tue: {
    label: 'Tuesday, June 9', shortLabel: 'Tue 6/9',
    numGroups: 8, csvFile: 'students_tue.csv', active: true,
    getSchedule(_color, number) {
      const [a1, a2, a3, a4] = TUE_ROTATIONS[number];
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',   room:'JECA Commons' },
        { time:'8:30 – 8:40',   activity:'Transition to Rotation 1', room:'' },
        { time:'8:40 – 9:45',   activity:'Rotation 1: ' + a1,     room:'' },
        { time:'9:45 – 9:50',   activity:'Transition to Rotation 2', room:'' },
        { time:'9:50 – 10:55',  activity:'Rotation 2: ' + a2,     room:'' },
        { time:'10:55 – 11:15', activity:'Transition to PLXY Bluebonnet', room:'' },
        { time:'11:15 – 12:15', activity:'Exploration Rotation',   room:'PLXY Bluebonnet' },
        { time:'12:15 – 1:00',  activity:'Lunch',                  room:'JECA Student Commons' },
        { time:'1:00 – 1:10',   activity:'Transition to Rotation 3', room:'' },
        { time:'1:10 – 2:15',   activity:'Rotation 3: ' + a3,     room:'' },
        { time:'2:15 – 2:20',   activity:'Transition to Rotation 4', room:'' },
        { time:'2:20 – 3:25',   activity:'Rotation 4: ' + a4,     room:'' },
        { time:'3:25 – 3:30',   activity:'Transition to Dismissal', room:'' },
        { time:'3:30 – 4:00',   activity:'Dismissal',              room:'JECA Commons' },
      ];
    }
  },

  wed: {
    label: 'Wednesday, June 10', shortLabel: 'Wed 6/10',
    numGroups: 8, csvFile: 'students_wed.csv', active: false,
    getSchedule(_color, number) { return []; }
  },

  thu: {
    label: 'Thursday, June 11', shortLabel: 'Thu 6/11',
    numGroups: 9, csvFile: 'students_thu.csv', active: false,
    getSchedule(color, number) {
      const r1 = numberedBlock(color, number, 'rot1');
      const r2 = numberedBlock(color, number, 'rot2');
      const r3 = numberedBlock(color, number, 'rot3');
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',        room:'JECA Commons' },
        { time:'8:40 – 9:45',   activity:'Rotation 1: ' + r1.activity, room:r1.room },
        { time:'9:50 – 10:55',  activity:'Rotation 2: ' + r2.activity, room:r2.room },
        { time:'11:00 – 12:05', activity:'Rotation 3: ' + r3.activity, room:r3.room },
        { time:'12:15 – 1:00',  activity:'Lunch',                       room:'' },
        { time:'1:10 – 1:45',   activity:'Games / Pep Rally Prep',      room:'' },
        { time:'2:30 – 3:30',   activity:'JISD/NLC Pep Rally',          room:'JECA Commons' },
        { time:'3:30 – 4:00',   activity:'Dismissal',                   room:'JECA Commons' },
      ];
    }
  },
};

// Active day for students (only one shown at a time)
const ACTIVE_DAY = 'tue';

// ─── Student number picker ────────────────────────────────────────────────────
function initPicker() {
  const day = SCHEDULES[ACTIVE_DAY];
  const grid = document.getElementById('num-grid');
  grid.innerHTML = '';
  for (let n = 1; n <= day.numGroups; n++) {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = n;
    btn.onclick = () => showStudentSchedule(n);
    grid.appendChild(btn);
  }
}

function showStudentSchedule(number) {
  const day = SCHEDULES[ACTIVE_DAY];
  const blocks = day.getSchedule(null, number);

  document.getElementById('student-badge').innerHTML = `
    <div class="student-badge" style="margin-bottom:1rem">
      <div class="badge-circle" style="background:var(--color-surface);color:var(--color-text);border-color:var(--color-border-strong)">${number}</div>
      <div>
        <div class="badge-name">Group ${number}</div>
        <div class="badge-group">${day.label}</div>
      </div>
    </div>`;

  document.getElementById('student-blocks').innerHTML = blocks.map(b => `
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
}

// ─── Teacher registry ─────────────────────────────────────────────────────────
// All teachers derived from room strings across all schedule data
const ALL_TEACHERS = (() => {
  const seen = new Set();
  const all = [];
  const roomStrings = [
    ...Object.values(ROOMS_MON_THU.elar),
    ...Object.values(ROOMS_MON_THU.stem),
    ...Object.values(ROOMS_MON_THU.math),
    // Tuesday teachers from room lookup
    'Kennedy-B209','Miller-B207','Tinoco-B221','Garcia-B206',
    'Harwell-PLXY Bluebonnet','Mercado-PLXY Bluebonnet',
    'Gilmore-PLXY 100','Whitby-PLXY 100',
  ];
  for (const rs of roomStrings) {
    const dashIdx = rs.indexOf('-');
    const name = rs.substring(0, dashIdx);
    const room = rs.substring(dashIdx + 1);
    if (!seen.has(name)) { seen.add(name); all.push({ name, room }); }
  }
  return all.sort((a, b) => a.name.localeCompare(b.name));
})();

// NLC travelers on Tuesday
const NLC_TRAVELERS_TUE = new Set(['Harwell','Mercado','Gilmore','Whitby']);

// ─── Teacher schedule builder ─────────────────────────────────────────────────
function getTeacherScheduleTue(teacherName) {
  const students = rostersByDay['tue'] || [];

  // Rotation times with sortMin
  const rotTimes = [
    { time:'8:40 – 9:45',  sortMin: 520 },
    { time:'9:50 – 10:55', sortMin: 590 },
    { time:'1:10 – 2:15',  sortMin: 790 },
    { time:'2:20 – 3:25',  sortMin: 860 },
  ];

  return rotTimes.map((rt, i) => {
    const rotIdx = i; // 0-3

    // Find students whose rotation[rotIdx] sends them to this teacher
    const incoming = students.filter(s => {
      const activity = TUE_ROTATIONS[s.number]?.[rotIdx];
      if (!activity) return false;
      const roomStr = TUE_TEACHER_ROOMS[activity]?.byGroup?.[s.number] || '';
      return roomStr.startsWith(teacherName + '-');
    });

    // Location for this rotation
    let location = '';
    let traveling = false;
    if (incoming.length > 0) {
      const activity = TUE_ROTATIONS[incoming[0].number][rotIdx];
      const roomStr = TUE_TEACHER_ROOMS[activity]?.byGroup?.[incoming[0].number] || '';
      const dashIdx = roomStr.indexOf('-');
      location = roomStr.substring(dashIdx + 1);
      traveling = NLC_TRAVELERS_TUE.has(teacherName);
    }

    // Activity label from first student
    const activity = incoming.length > 0
      ? TUE_ROTATIONS[incoming[0].number][rotIdx]
      : '';

    return { time: rt.time, sortMin: rt.sortMin, activity, location, traveling, students: incoming };
  });
}

function getTeacherScheduleNumbered(teacherName, dayKey) {
  const students = rostersByDay[dayKey] || [];
  const isMon = dayKey === 'mon';
  const times = isMon
    ? [{ t:'9:30 – 10:45', s:570 }, { t:'10:50 – 12:05', s:650 }, { t:'1:45 – 2:30', s:825 }]
    : [{ t:'8:40 – 9:45',  s:520 }, { t:'9:50 – 10:55',  s:590 }, { t:'11:00 – 12:05', s:660 }];

  let teacherSubj = null;
  let teacherColor = null;
  for (const [subj, colorMap] of Object.entries(ROOMS_MON_THU)) {
    for (const [color, roomStr] of Object.entries(colorMap)) {
      if (roomStr.startsWith(teacherName + '-')) {
        teacherSubj = subj; teacherColor = color; break;
      }
    }
    if (teacherSubj) break;
  }
  if (!teacherSubj) return [];

  const teacherRoomStr = ROOMS_MON_THU[teacherSubj][teacherColor];
  const tierRange = { Red:[1,2,3], Green:[4,5,6], Blue:[7,8,9] }[teacherColor];

  return ['rot1','rot2','rot3'].map((slot, i) => {
    const nums = MON_THU_ROTS[slot][teacherSubj];
    const matchNums = nums.filter(n => tierRange.includes(n));
    const incoming = students.filter(s => matchNums.includes(s.number));
    return {
      time: times[i].t, sortMin: times[i].s,
      activity: MON_THU_LABELS[teacherSubj],
      location: teacherRoomStr, traveling: false,
      students: incoming,
    };
  });
}

// ─── Full-group blocks per day ────────────────────────────────────────────────
const FULL_GROUP_BLOCKS = {
  mon: [
    { time:'7:30 – 8:30',  sortMin:450,  activity:'Arrival & Breakfast', room:'JECA Commons' },
    { time:'8:30 – 9:20',  sortMin:510,  activity:'Welcome Kickoff',      room:'JECA Commons' },
    { time:'12:15 – 1:00', sortMin:735,  activity:'Lunch',                room:'JECA Commons' },
    { time:'1:05 – 1:35',  sortMin:785,  activity:'Games',                room:'' },
    { time:'2:50 – 3:20',  sortMin:890,  activity:'P-TECH 101',           room:'JECA Commons' },
    { time:'3:20 – 3:30',  sortMin:920,  activity:'Dismissal',            room:'JECA Commons' },
  ],
  tue: [
    { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast',  room:'JECA Commons' },
    { time:'11:15 – 12:15', sortMin:675, activity:'Exploration Rotation', room:'PLXY Bluebonnet' },
    { time:'12:15 – 1:00',  sortMin:735, activity:'Lunch',                room:'JECA Student Commons' },
    { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',            room:'JECA Commons' },
  ],
  wed: [
    { time:'7:30 – 8:30',   sortMin:450, activity:'Arrival & Breakfast', room:'JECA Commons' },
    { time:'11:25 – 11:55', sortMin:685, activity:'Lunch',               room:'JECA Commons' },
    { time:'12:05 – 12:35', sortMin:725, activity:'Games',               room:'' },
    { time:'3:30 – 4:00',   sortMin:930, activity:'Dismissal',           room:'JECA Commons' },
  ],
  thu: [
    { time:'7:30 – 8:30',  sortMin:450,  activity:'Arrival & Breakfast',    room:'JECA Commons' },
    { time:'12:15 – 1:00', sortMin:735,  activity:'Lunch',                  room:'' },
    { time:'1:10 – 1:45',  sortMin:790,  activity:'Games / Pep Rally Prep', room:'' },
    { time:'2:30 – 3:30',  sortMin:870,  activity:'JISD/NLC Pep Rally',     room:'JECA Commons' },
    { time:'3:30 – 4:00',  sortMin:930,  activity:'Dismissal',              room:'JECA Commons' },
  ],
};

// ─── State ────────────────────────────────────────────────────────────────────
let rostersByDay = {};
let activeTeacher = null;
let activeTeacherDay = 'tue';

// ─── CSV loading ──────────────────────────────────────────────────────────────
async function loadAllRosters() {
  for (const [dayKey, day] of Object.entries(SCHEDULES)) {
    try {
      const res = await fetch(day.csvFile);
      if (!res.ok) continue;
      const text = await res.text();
      rostersByDay[dayKey] = parseCSV(text);
    } catch (_) {}
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
  activeTeacherDay = 'tue';
  document.getElementById('teacher-search').value = '';
  document.getElementById('teacher-results').innerHTML = '';
  document.getElementById('teacher-search-wrap').style.display = 'none';
  document.getElementById('teacher-sched-view').style.display = '';
  renderTeacherView();
}

function renderTeacherView() {
  const name = activeTeacher;
  const t = ALL_TEACHERS.find(t => t.name === name);
  const isNLCTraveler = NLC_TRAVELERS_TUE.has(name);
  const dayKey = activeTeacherDay;

  // Badge
  document.getElementById('teacher-badge').innerHTML = `
    <div class="teacher-badge">
      <div class="teacher-avatar">${name.charAt(0)}</div>
      <div>
        <div class="teacher-name">${name}</div>
        <div class="teacher-room">${t?.room || ''}${isNLCTraveler ? ' · NLC traveler' : ''}</div>
      </div>
    </div>`;

  // Day tabs — only show active days
  const activeDays = Object.entries(SCHEDULES).filter(([,d]) => d.active || d === SCHEDULES.tue);
  // Teachers see all days since they need schedules for everything
  const tabsHtml = Object.entries(SCHEDULES).map(([dk, d]) => `
    <button class="day-tab${dk === dayKey ? ' active' : ''}${dk === 'mon' ? ' today' : ''}"
      onclick="switchTeacherDay('${dk}')">${d.shortLabel}</button>`).join('');
  document.getElementById('teacher-day-tabs').innerHTML = `<div class="day-tabs">${tabsHtml}</div>`;

  // Get rotations
  let rotations = [];
  if (dayKey === 'tue') {
    rotations = getTeacherScheduleTue(name);
  } else if (dayKey === 'mon' || dayKey === 'thu') {
    rotations = getTeacherScheduleNumbered(name, dayKey);
  }
  // Wed not yet implemented

  const teacherHomeRoom = t?.room || '';

  function stripRoom(roomStr) {
    if (!roomStr) return '';
    const dashIdx = roomStr.indexOf('-');
    return dashIdx > -1 ? roomStr.substring(dashIdx + 1) : roomStr;
  }

  const notice = (isNLCTraveler && dayKey === 'tue')
    ? `<div class="nlc-travel-card">🚌 You are traveling to NLC today. Your location each rotation is listed below.</div>`
    : '';

  const rotationRows = rotations
    .filter(rot => rot.students.length > 0)
    .map((rot, i) => {
      const rotId = `rot-${i}`;
      const count = rot.students.length;
      const firstStudent = rot.students[0];

      const groupPillHtml = firstStudent
        ? `<span class="group-pill" style="background:var(--color-surface);color:var(--color-text);border:1px solid var(--color-border-strong)">Group ${firstStudent.number}</span>`
        : '';

      const locStripped = stripRoom(rot.location);
      const awayFromRoom = locStripped && locStripped !== teacherHomeRoom;
      const locationHtml = awayFromRoom
        ? `<div class="sched-room${rot.traveling ? ' traveling' : ''}">📍 ${locStripped}</div>`
        : teacherHomeRoom ? `<div class="sched-room">📍 ${teacherHomeRoom}</div>` : '';

      const rosterRows = rot.students
        .map(s => `<div class="student-chip"><div class="chip-name">${s.name}</div></div>`).join('');

      return {
        sortMin: rot.sortMin,
        html: `<div class="sched-block">
          <div class="sched-time">${rot.time}</div>
          <div class="sched-activity">${rot.activity}</div>
          ${groupPillHtml}
          ${locationHtml}
          <div class="roster-toggle-row" onclick="toggleRoster('${rotId}')" style="cursor:pointer;margin-top:6px;display:flex;align-items:center;gap:6px">
            <span class="roster-count">${count} student${count !== 1 ? 's' : ''}</span>
            <span class="toggle-arrow" id="${rotId}-arrow">▸</span>
          </div>
          <div class="rot-roster" id="${rotId}" style="display:none;margin-top:4px">${rosterRows}</div>
        </div>`
      };
    });

  const fullGroupRows = (FULL_GROUP_BLOCKS[dayKey] || []).map(b => ({
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

function toggleRoster(id) {
  const roster = document.getElementById(id);
  const arrow = document.getElementById(id + '-arrow');
  const isOpen = roster.style.display !== 'none';
  roster.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
}

function switchTeacherDay(dayKey) {
  activeTeacherDay = dayKey;
  renderTeacherView();
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