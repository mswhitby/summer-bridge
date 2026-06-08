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
    csvFile: 'students_tue.csv', pendingAssignment: false,
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

// ─── Search ───────────────────────────────────────────────────────────────────
function onSearch() {
  const q = document.getElementById('search-input').value.trim().toLowerCase();
  const out = document.getElementById('search-results');
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

  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('sched-view').style.display = '';
  renderStudentView();
}

function renderStudentView() {
  const { name, records } = activeStudent;
  const s = records[activeDay];
  const day = SCHEDULES[activeDay];
  const c = COLOR[s.color] || COLOR.Blue;

  // Identity badge
  document.getElementById('sched-badge').innerHTML = `
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
  document.getElementById('sched-day-tabs').innerHTML = `<div class="day-tabs">${tabsHtml}</div>`;

  // Schedule blocks
  const blocksEl = document.getElementById('sched-blocks');
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

function clearSchedule() {
  activeStudent = null;
  document.getElementById('sched-view').style.display = 'none';
  document.getElementById('search-input').focus();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
loadAllRosters();