// ─── Color themes ─────────────────────────────────────────────────────────────
const COLOR = {
  Red:    { bg:'var(--red-bg)',    text:'var(--red-text)',    border:'var(--red-border)'    },
  Green:  { bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)' },
  Blue:   { bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)'  },
  Orange: { bg:'var(--orange-bg)',text:'var(--orange-text)',border:'var(--orange-border)' },
  Yellow: { bg:'var(--yellow-bg)',text:'var(--yellow-text)',border:'var(--yellow-border)' },
};

// ─── Room lookup tables ───────────────────────────────────────────────────────
// Mon / Thu: color determines room set, number (1-9) determines specific room within set
// Numbers 1-3 → tier A rooms, 4-6 → tier B rooms, 7-9 → tier C rooms
// Each color has one room per subject per tier
const ROOMS_MON_THU = {
  //       #1-3           #4-6           #7-9
  elar: { Red:'Miller-B207',  Green:'Garcia-B206',  Blue:'Gilmore-B202' },
  stem: { Red:'Brown-B226',   Green:'Mercado-B229', Blue:'Harwell-B227' },
  math: { Red:'Kennedy-B209', Green:'Tinoco-B221',  Blue:'Whitby-B208'  },
};

// Tue / Wed: color determines activity rotation, number (1 or 2) determines NLC room
// NLC rooms differ by number; ELAR/Math rooms differ by color
const ROOMS_TUE = {
  elar: { Orange:'Miller-B207',  Yellow:'Garcia-B206',  Green:'Miller-B207',  Blue:'Garcia-B206'  },
  math: { Orange:'Kennedy-B209', Yellow:'Tinoco-B221',  Green:'Kennedy-B209', Blue:'Tinoco-B221'  },
  nlc:  {
    // [number1 room, number2 room]
    Orange:['Brown-B226','Mercado-B229'],
    Yellow:['Mercado-B229','Brown-B226'],
    Green: ['Gilmore-B202','Harwell-B227'],
    Blue:  ['Harwell-B227','Gilmore-B202'],
  },
};
const ROOMS_WED = {
  elar: { Orange:'Garcia-B206',  Yellow:'Gilmore-B202', Green:'Garcia-B206',  Blue:'Gilmore-B202' },
  math: { Orange:'Tinoco-B221',  Yellow:'Whitby-B208',  Green:'Tinoco-B221',  Blue:'Whitby-B208'  },
  nlc:  {
    Orange:['Brown-B226','Mercado-B229'],
    Yellow:['Mercado-B229','Brown-B226'],
    Green: ['Miller-B207','Harwell-B227'],
    Blue:  ['Harwell-B227','Miller-B207'],
  },
};

// ─── Mon/Thu rotation logic ───────────────────────────────────────────────────
// Groups 1,4,7 → ELAR rot1 | 2,5,8 → STEM rot1 | 3,6,9 → Math rot1, etc.
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
const SCHEDULES = {
  mon: {
    label: 'Monday, June 8', shortLabel: 'Mon 6/8',
    csvFile: 'students_mon.csv', pendingAssignment: false,
    getSchedule(color, number) {
      const r1 = numberedBlock(color, number, 'rot1');
      const r2 = numberedBlock(color, number, 'rot2');
      const r3 = numberedBlock(color, number, 'rot3');
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',        room:'JECA Commons' },
        { time:'8:30 – 9:20',   activity:'Welcome Kickoff',             room:'JECA Commons' },
        { time:'9:30 – 10:45',  activity:'Rotation 1: ' + r1.activity, room: r1.room },
        { time:'10:50 – 12:05', activity:'Rotation 2: ' + r2.activity, room: r2.room },
        { time:'12:15 – 1:00',  activity:'Lunch',                       room:'JECA Commons' },
        { time:'1:05 – 1:35',   activity:'Games',                       room:'' },
        { time:'1:45 – 2:30',   activity:'Rotation 3: ' + r3.activity, room: r3.room },
        { time:'2:50 – 3:20',   activity:'P-TECH 101',                  room:'JECA Commons' },
        { time:'3:20 – 3:30',   activity:'Dismissal',                   room:'JECA Commons' },
      ];
    }
  },

  tue: {
    label: 'Tuesday, June 9', shortLabel: 'Tue 6/9',
    csvFile: 'students_tue.csv', pendingAssignment: true,
    getSchedule(color, number) {
      const nlcRoom = ROOMS_TUE.nlc[color][number - 1];
      const elarRoom = ROOMS_TUE.elar[color];
      const mathRoom = ROOMS_TUE.math[color];
      // Activity by color; NLC room varies by number
      const rots = {
        rot1: { Orange:['NLC Advising',        nlcRoom],
                Yellow:['NLC HSP Orientation', nlcRoom],
                Green: ['TSI ELAR',             elarRoom],
                Blue:  ['TSI Math',             mathRoom] },
        rot2: { Orange:['NLC HSP Orientation', nlcRoom],
                Yellow:['NLC Advising',         nlcRoom],
                Green: ['TSI Math',             mathRoom],
                Blue:  ['TSI ELAR',             elarRoom] },
        rot3: { Orange:['TSI ELAR',             elarRoom],
                Yellow:['TSI Math',             mathRoom],
                Green: ['NLC Advising',         nlcRoom],
                Blue:  ['NLC HSP Orientation',  nlcRoom] },
        rot4: { Orange:['TSI Math',             mathRoom],
                Yellow:['TSI ELAR',             elarRoom],
                Green: ['NLC HSP Orientation',  nlcRoom],
                Blue:  ['NLC Advising',         nlcRoom] },
      };
      const [a1,rm1] = rots.rot1[color]; const [a2,rm2] = rots.rot2[color];
      const [a3,rm3] = rots.rot3[color]; const [a4,rm4] = rots.rot4[color];
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',      room:'JECA Commons' },
        { time:'8:40 – 9:45',   activity:'Rotation 1: ' + a1,        room: rm1 },
        { time:'9:50 – 10:55',  activity:'Rotation 2: ' + a2,        room: rm2 },
        { time:'11:15 – 12:15', activity:'Exploration Rotation',      room:'PLXY Bluebonnet' },
        { time:'12:15 – 1:00',  activity:'Lunch',                     room:'' },
        { time:'1:10 – 2:15',   activity:'Rotation 3: ' + a3,        room: rm3 },
        { time:'2:20 – 3:25',   activity:'Rotation 4: ' + a4,        room: rm4 },
        { time:'3:30 – 4:00',   activity:'Dismissal',                 room:'JECA Commons' },
      ];
    }
  },

  wed: {
    label: 'Wednesday, June 10', shortLabel: 'Wed 6/10',
    csvFile: 'students_wed.csv', pendingAssignment: false,
    getSchedule(color, number) {
      const nlcRoom = ROOMS_WED.nlc[color][number - 1];
      const elarRoom = ROOMS_WED.elar[color];
      const mathRoom = ROOMS_WED.math[color];
      const rots = {
        rot1: { Orange:['NLC Presentation', nlcRoom],
                Yellow:['NLC Presentation', nlcRoom],
                Green: ['TSI ELAR',          elarRoom],
                Blue:  ['TSI Math',          mathRoom] },
        rot2: { Orange:['NLC Presentation', nlcRoom],
                Yellow:['NLC Presentation', nlcRoom],
                Green: ['TSI Math',          mathRoom],
                Blue:  ['TSI ELAR',          elarRoom] },
        rot3: { Orange:['TSI ELAR',          elarRoom],
                Yellow:['TSI Math',          mathRoom],
                Green: ['NLC Presentation',  nlcRoom],
                Blue:  ['NLC Presentation',  nlcRoom] },
        rot4: { Orange:['TSI Math',          mathRoom],
                Yellow:['TSI ELAR',          elarRoom],
                Green: ['NLC Presentation',  nlcRoom],
                Blue:  ['NLC Presentation',  nlcRoom] },
      };
      const [a1,rm1] = rots.rot1[color]; const [a2,rm2] = rots.rot2[color];
      const [a3,rm3] = rots.rot3[color]; const [a4,rm4] = rots.rot4[color];
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',     room:'JECA Commons' },
        { time:'8:40 – 9:55',   activity:'Rotation 1: ' + a1,       room: rm1 },
        { time:'10:00 – 11:15', activity:'Rotation 2: ' + a2,       room: rm2 },
        { time:'11:25 – 11:55', activity:'Lunch',                    room:'JECA Commons' },
        { time:'12:05 – 12:35', activity:'Games',                    room:'' },
        { time:'12:45 – 2:00',  activity:'Rotation 3: ' + a3,       room: rm3 },
        { time:'2:05 – 3:20',   activity:'Rotation 4: ' + a4,       room: rm4 },
        { time:'3:30 – 4:00',   activity:'Dismissal',                room:'JECA Commons' },
      ];
    }
  },

  thu: {
    label: 'Thursday, June 11', shortLabel: 'Thu 6/11',
    csvFile: 'students_thu.csv', pendingAssignment: false,
    getSchedule(color, number) {
      const r1 = numberedBlock(color, number, 'rot1');
      const r2 = numberedBlock(color, number, 'rot2');
      const r3 = numberedBlock(color, number, 'rot3');
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',        room:'JECA Commons' },
        { time:'8:40 – 9:45',   activity:'Rotation 1: ' + r1.activity, room: r1.room },
        { time:'9:50 – 10:55',  activity:'Rotation 2: ' + r2.activity, room: r2.room },
        { time:'11:00 – 12:05', activity:'Rotation 3: ' + r3.activity, room: r3.room },
        { time:'12:15 – 1:00',  activity:'Lunch',                       room:'' },
        { time:'1:10 – 1:45',   activity:'Games / Pep Rally Prep',      room:'' },
        { time:'2:30 – 3:30',   activity:'JISD/NLC Pep Rally',          room:'JECA Commons' },
        { time:'3:30 – 4:00',   activity:'Dismissal',                   room:'JECA Commons' },
      ];
    }
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
let rostersByDay = {};
let activeStudent = null;
let activeDay = 'mon';

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

// ─── Student search ───────────────────────────────────────────────────────────
function onStudentSearch() {
  const q = document.getElementById('student-search').value.trim().toLowerCase();
  const out = document.getElementById('student-results');
  if (!q) { out.innerHTML = ''; return; }

  // Collect unique students by name (first match wins for the badge preview)
  const seen = new Map();
  for (const [dayKey, students] of Object.entries(rostersByDay)) {
    for (const s of students) {
      if (s.name.toLowerCase().includes(q) && !seen.has(s.name)) {
        seen.set(s.name, { student: s, dayKey });
      }
    }
  }

  if (!seen.size) {
    out.innerHTML = `<div class="empty-msg">No students found for "${q}"</div>`;
    return;
  }

  let html = '';
  for (const { student: s } of seen.values()) {
    const c = COLOR[s.color] || COLOR.Blue;
    html += `<div class="result-row" onclick="selectStudent('${s.name.replace(/'/g,"\\'")}')">
      <div class="result-badge" style="background:${c.bg};color:${c.text};border-color:${c.border}">
        ${s.number}
      </div>
      <div>
        <div class="result-name">${s.name}</div>
        <div class="result-sub">${s.color} ${s.number}</div>
      </div>
    </div>`;
  }
  out.innerHTML = html;
}

// ─── Student view ─────────────────────────────────────────────────────────────
function selectStudent(name) {
  const records = {};
  for (const [dayKey, students] of Object.entries(rostersByDay)) {
    const match = students.find(s => s.name === name);
    if (match) records[dayKey] = match;
  }
  activeStudent = { name, records };
  activeDay = records['mon'] ? 'mon' : Object.keys(records)[0];

  document.getElementById('student-search').value = '';
  document.getElementById('student-results').innerHTML = '';
  document.getElementById('student-sched-view').style.display = '';
  renderStudentView();
}

function renderStudentView() {
  const { name, records } = activeStudent;
  const s = records[activeDay];
  const day = SCHEDULES[activeDay];
  const c = COLOR[s.color] || COLOR.Blue;

  // Identity badge
  document.getElementById('student-badge').innerHTML = `
    <div class="student-badge">
      <div class="badge-circle" style="background:${c.bg};color:${c.text};border-color:${c.border}">${s.number}</div>
      <div>
        <div class="badge-name">${name}</div>
        <div class="badge-group">${s.color} · ${s.number}</div>
      </div>
    </div>`;

  // Day tabs
  let tabsHtml = '';
  for (const dk of Object.keys(SCHEDULES)) {
    if (!records[dk]) continue;
    const isActive = dk === activeDay;
    const isToday = dk === 'mon';
    tabsHtml += `<button class="day-tab${isActive?' active':''}${isToday?' today':''}"
      onclick="switchDay('${dk}')">${SCHEDULES[dk].shortLabel}</button>`;
  }
  document.getElementById('student-day-tabs').innerHTML = `<div class="day-tabs">${tabsHtml}</div>`;

  // Schedule blocks
  const blocksEl = document.getElementById('student-blocks');
  if (day.pendingAssignment) {
    blocksEl.className = 'notice-card';
    blocksEl.innerHTML = `⏳ Group assignments for ${day.label.split(',')[0]} haven't been finalized yet. Check back soon!`;
  } else {
    const blocks = day.getSchedule(s.color, s.number);
    blocksEl.className = 'card';
    blocksEl.innerHTML = blocks.map(b => `
      <div class="sched-block">
        <div class="sched-time">${b.time}</div>
        <div class="sched-activity">${b.activity}</div>
        ${b.room ? `<div class="sched-room">📍 ${b.room}</div>` : ''}
      </div>`).join('');
  }
}

function switchDay(dayKey) {
  activeDay = dayKey;
  renderStudentView();
}

function clearStudentSchedule() {
  activeStudent = null;
  document.getElementById('student-sched-view').style.display = 'none';
  document.getElementById('student-search').focus();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
loadAllRosters();

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER VIEW
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Teacher registry ─────────────────────────────────────────────────────────
// Derived from room strings: "Miller-B207" → { name:"Miller", room:"B207" }
// All unique teachers across all days and subjects
const ALL_TEACHERS = (() => {
  const seen = new Set();
  const all = [];
  const roomStrings = [
    ...Object.values(ROOMS_MON_THU.elar),
    ...Object.values(ROOMS_MON_THU.stem),
    ...Object.values(ROOMS_MON_THU.math),
    ...Object.values(ROOMS_TUE.elar),
    ...Object.values(ROOMS_TUE.math),
    ...Object.values(ROOMS_TUE.nlc).flat(),
    ...Object.values(ROOMS_WED.elar),
    ...Object.values(ROOMS_WED.math),
    ...Object.values(ROOMS_WED.nlc).flat(),
  ];
  for (const rs of roomStrings) {
    const [name, room] = rs.split('-');
    if (!seen.has(name)) { seen.add(name); all.push({ name, room: 'B' + room.replace('B','') }); }
  }
  return all.sort((a, b) => a.name.localeCompare(b.name));
})();

// NLC travelers: teacher name → which days they travel
const NLC_TRAVELERS = {
  Whitby:  ['tue'],
  Gilmore: ['tue'],
  Kennedy: ['wed'],
  Miller:  ['wed'],
};

// ─── Build teacher schedule for a given day ───────────────────────────────────
// Returns an array of rotation blocks: { time, activity, location, students[] }
// Each student entry: { name, color, number }
function getTeacherSchedule(teacherName, dayKey) {
  const day = SCHEDULES[dayKey];
  const students = rostersByDay[dayKey] || [];
  const isNLCTraveler = NLC_TRAVELERS[teacherName]?.includes(dayKey);

  if (dayKey === 'mon' || dayKey === 'thu') {
    return getTeacherScheduleNumbered(teacherName, dayKey, students, isNLCTraveler);
  } else {
    return getTeacherScheduleColor(teacherName, dayKey, students, isNLCTraveler);
  }
}

// Mon / Thu: match teacher to subject+room per rotation slot
function getTeacherScheduleNumbered(teacherName, dayKey, students, isNLCTraveler) {
  const isMon = dayKey === 'mon';
  const rotSlots = ['rot1', 'rot2', 'rot3'];
  const times = isMon
    ? ['9:30 – 10:45', '10:50 – 12:05', '1:45 – 2:30']
    : ['8:40 – 9:45',  '9:50 – 10:55',  '11:00 – 12:05'];

  // Find which subject this teacher teaches (elar/stem/math) and their room color tier
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

  return rotSlots.map((slot, i) => {
    // Which numbers come to this teacher's subject this slot?
    const nums = MON_THU_ROTS[slot][teacherSubj];
    // Of those, which are in the teacher's color tier?
    // Color tier: Red=1-3, Green=4-6, Blue=7-9
    const tierRange = { Red:[1,2,3], Green:[4,5,6], Blue:[7,8,9] }[teacherColor];
    const matchNums = nums.filter(n => tierRange.includes(n));
    const incoming = students.filter(s => matchNums.includes(s.number));
    return {
      time: times[i],
      activity: MON_THU_LABELS[teacherSubj],
      location: teacherRoomStr,
      traveling: false,
      students: incoming,
    };
  });
}

// Tue / Wed: match teacher to their room string across all rotation slots
function getTeacherScheduleColor(teacherName, dayKey, students, isNLCTraveler) {
  const rooms = dayKey === 'tue' ? ROOMS_TUE : ROOMS_WED;
  const isTue = dayKey === 'tue';
  const times = isTue
    ? ['8:40 – 9:45', '9:50 – 10:55', '1:10 – 2:15', '2:20 – 3:25']
    : ['8:40 – 9:55', '10:00 – 11:15', '12:45 – 2:00', '2:05 – 3:20'];

  // For each rotation, find which color+number groups come to this teacher
  // We check all possible students and see if their computed room matches this teacher
  const day = SCHEDULES[dayKey];

  return [1, 2, 3, 4].map((rotNum, i) => {
    const rotKey = 'rot' + rotNum;
    const incoming = [];

    for (const s of students) {
      const nlcRoom = rooms.nlc[s.color]?.[s.number - 1];
      const elarRoom = rooms.elar[s.color];
      const mathRoom = rooms.math[s.color];

      // Determine which activity+room this student has this rotation
      // (same logic as getSchedule but we just need the room)
      let studentRoom = null;
      if (isTue) {
        const rotDef = {
          rot1: { Orange: nlcRoom,  Yellow: nlcRoom,  Green: elarRoom, Blue: mathRoom },
          rot2: { Orange: nlcRoom,  Yellow: nlcRoom,  Green: mathRoom, Blue: elarRoom },
          rot3: { Orange: elarRoom, Yellow: mathRoom, Green: nlcRoom,  Blue: nlcRoom  },
          rot4: { Orange: mathRoom, Yellow: elarRoom, Green: nlcRoom,  Blue: nlcRoom  },
        };
        studentRoom = rotDef[rotKey][s.color];
      } else {
        const rotDef = {
          rot1: { Orange: nlcRoom,  Yellow: nlcRoom,  Green: elarRoom, Blue: mathRoom },
          rot2: { Orange: nlcRoom,  Yellow: nlcRoom,  Green: mathRoom, Blue: elarRoom },
          rot3: { Orange: elarRoom, Yellow: mathRoom, Green: nlcRoom,  Blue: nlcRoom  },
          rot4: { Orange: mathRoom, Yellow: elarRoom, Green: nlcRoom,  Blue: nlcRoom  },
        };
        studentRoom = rotDef[rotKey][s.color];
      }

      if (studentRoom && studentRoom.startsWith(teacherName + '-')) {
        incoming.push(s);
      }
    }

    // Determine this teacher's own location this rotation
    // If they're an NLC traveler, their location is "Traveling to NLC" when they have students
    // Find one of the incoming students to get the room string (or fall back to home room)
    let location = '';
    let traveling = false;
    if (isNLCTraveler && incoming.length > 0) {
      // NLC traveler moves with their students — location is NLC
      location = 'PLXY Bluebonnet (NLC)';
      traveling = true;
    } else if (incoming.length > 0) {
      // Get the room from the first incoming student's assignment
      const s0 = incoming[0];
      const nlcR = rooms.nlc[s0.color]?.[s0.number - 1];
      const elarR = rooms.elar[s0.color];
      const mathR = rooms.math[s0.color];
      const rotDef = {
        rot1: { Orange: nlcR,  Yellow: nlcR,  Green: elarR, Blue: mathR },
        rot2: { Orange: nlcR,  Yellow: nlcR,  Green: mathR, Blue: elarR },
        rot3: { Orange: elarR, Yellow: mathR, Green: nlcR,  Blue: nlcR  },
        rot4: { Orange: mathR, Yellow: elarR, Green: nlcR,  Blue: nlcR  },
      };
      location = rotDef[rotKey][s0.color] || '';
    } else {
      // No students this rotation — teacher is free / prep time
      location = '';
    }

    // Determine activity label
    let activity = 'Prep / No students';
    if (incoming.length > 0) {
      if (isTue) {
        activity = { rot1:'Rotation 1', rot2:'Rotation 2', rot3:'Rotation 3', rot4:'Rotation 4' }[rotKey];
      } else {
        activity = { rot1:'Rotation 1', rot2:'Rotation 2', rot3:'Rotation 3', rot4:'Rotation 4' }[rotKey];
      }
    }

    return { time: times[i], activity, location, traveling, students: incoming };
  });
}

// ─── Teacher search ───────────────────────────────────────────────────────────
let activeTeacher = null;
let activeTeacherDay = 'mon';

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
        <div class="result-sub">Room ${t.room}</div>
      </div>
    </div>`).join('');
}

function selectTeacher(name) {
  activeTeacher = name;
  activeTeacherDay = 'mon';
  document.getElementById('teacher-search').value = '';
  document.getElementById('teacher-results').innerHTML = '';
  document.getElementById('teacher-sched-view').style.display = '';
  renderTeacherView();
}

function renderTeacherView() {
  const name = activeTeacher;
  const t = ALL_TEACHERS.find(t => t.name === name);
  const isNLCTraveler = !!NLC_TRAVELERS[name];

  // Badge
  document.getElementById('teacher-badge').innerHTML = `
    <div class="teacher-badge">
      <div class="teacher-avatar">${name.charAt(0)}</div>
      <div>
        <div class="teacher-name">${name}</div>
        <div class="teacher-room">Room ${t?.room || ''}${isNLCTraveler ? ' · NLC traveler' : ''}</div>
      </div>
    </div>`;

  // Day tabs — teachers are present all 4 days
  const tabsHtml = Object.entries(SCHEDULES).map(([dk, d]) => `
    <button class="day-tab${dk === activeTeacherDay ? ' active' : ''}${dk === 'mon' ? ' today' : ''}"
      onclick="switchTeacherDay('${dk}')">${d.shortLabel}</button>`).join('');
  document.getElementById('teacher-day-tabs').innerHTML = `<div class="day-tabs">${tabsHtml}</div>`;

  // Rotation blocks
  const dayKey = activeTeacherDay;
  const day = SCHEDULES[dayKey];
  const rotations = getTeacherSchedule(name, dayKey);

  if (!rotations.length) {
    document.getElementById('teacher-blocks').innerHTML =
      `<p class="empty-msg">No schedule data found for ${name} on ${day.label}.</p>`;
    return;
  }

  // NLC travel notice for days they travel
  const travelDays = NLC_TRAVELERS[name] || [];
  let notice = '';
  if (travelDays.includes(dayKey)) {
    notice = `<div class="nlc-travel-card">🚌 You are traveling to NLC today. You move with your assigned student group — your location each rotation is listed below.</div>`;
  }

  const blocksHtml = rotations.map(rot => {
    const groupBadge = rot.students.length
      ? rot.students.map(s => `
          <div class="student-chip">
            <div class="chip-name">${s.name}</div>
          </div>`).join('')
      : `<div class="no-students">No students this rotation</div>`;

    const locationHtml = rot.location
      ? `<div class="rot-location${rot.traveling ? ' traveling' : ''}">📍 ${rot.location}</div>`
      : '';

    return `<div class="rot-block">
      <div class="rot-header">
        <div class="rot-time">${rot.time}</div>
        <div class="rot-activity">${rot.activity}</div>
        ${locationHtml}
      </div>
      ${groupBadge}
    </div>`;
  }).join('');

  document.getElementById('teacher-blocks').innerHTML = notice + blocksHtml;
}

function switchTeacherDay(dayKey) {
  activeTeacherDay = dayKey;
  renderTeacherView();
}

function clearTeacherSchedule() {
  activeTeacher = null;
  document.getElementById('teacher-sched-view').style.display = 'none';
  document.getElementById('teacher-search').focus();
}

// ─── Tab switching ────────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', ['student','teacher'][i] === tabId);
  });
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}