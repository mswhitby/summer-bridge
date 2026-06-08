// ─── Color theme map ──────────────────────────────────────────────────────────
const COLOR = {
  Orange: { bg:'var(--orange-bg)', text:'var(--orange-text)', border:'var(--orange-border)' },
  Yellow: { bg:'var(--yellow-bg)', text:'var(--yellow-text)', border:'var(--yellow-border)' },
  Green:  { bg:'var(--green-bg)',  text:'var(--green-text)',  border:'var(--green-border)'  },
  Blue:   { bg:'var(--blue-bg)',   text:'var(--blue-text)',   border:'var(--blue-border)'   },
  // Numbered groups: 1-3 red, 4-6 green, 7-9 blue
  1:{bg:'var(--red-bg)',   text:'var(--red-text)',   border:'var(--red-border)'  },
  2:{bg:'var(--red-bg)',   text:'var(--red-text)',   border:'var(--red-border)'  },
  3:{bg:'var(--red-bg)',   text:'var(--red-text)',   border:'var(--red-border)'  },
  4:{bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)'},
  5:{bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)'},
  6:{bg:'var(--green-bg)', text:'var(--green-text)', border:'var(--green-border)'},
  7:{bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)' },
  8:{bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)' },
  9:{bg:'var(--blue-bg)',  text:'var(--blue-text)',  border:'var(--blue-border)' },
};

// ─── Room assignments ─────────────────────────────────────────────────────────

// Monday & Thursday: 3 subject rooms per band-color tier
const ROOMS_MON_THU = {
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

// Tuesday: each color splits into sub-group 1 and 2
// NLC 1: Brown-B226, Mercado-B229, Gilmore-B202, Harwell-B227, Whitby-B208
// NLC 2: Mercado-B229, Brown-B226, Harwell-B227, Gilmore-B202
// Math:  Kennedy-B209, Tinoco-B221
// ELAR:  Miller-B207, Garcia-B206
const ROOMS_TUE = {
  //         [subgroup1,       subgroup2]
  math:   { Orange:['Kennedy-B209','Kennedy-B209'], Yellow:['Tinoco-B221','Tinoco-B221'],
            Green: ['Kennedy-B209','Kennedy-B209'], Blue:  ['Tinoco-B221','Tinoco-B221'] },
  elar:   { Orange:['Miller-B207','Miller-B207'],   Yellow:['Garcia-B206','Garcia-B206'],
            Green: ['Miller-B207','Miller-B207'],   Blue:  ['Garcia-B206','Garcia-B206'] },
  nlc:    { Orange:['Brown-B226','Mercado-B229'],   Yellow:['Mercado-B229','Brown-B226'],
            Green: ['Gilmore-B202','Harwell-B227'], Blue:  ['Harwell-B227','Gilmore-B202'] },
};

// Wednesday: same sub-group split concept
// NLC 1: Brown-B226, Mercado-B229, Miller-B207, Harwell-B227, Kennedy-B209
// NLC 2: Mercado-B229, Brown-B226, Harwell-B227, Miller-B207
// Math:  Tinoco-B221, Whitby-B208
// ELAR:  Garcia-B206, Gilmore-B202
const ROOMS_WED = {
  math:   { Orange:['Tinoco-B221','Tinoco-B221'],  Yellow:['Whitby-B208','Whitby-B208'],
            Green: ['Tinoco-B221','Tinoco-B221'],  Blue:  ['Whitby-B208','Whitby-B208'] },
  elar:   { Orange:['Garcia-B206','Garcia-B206'],  Yellow:['Gilmore-B202','Gilmore-B202'],
            Green: ['Garcia-B206','Garcia-B206'],  Blue:  ['Gilmore-B202','Gilmore-B202'] },
  nlc:    { Orange:['Brown-B226','Mercado-B229'],  Yellow:['Mercado-B229','Brown-B226'],
            Green: ['Miller-B207','Harwell-B227'], Blue:  ['Harwell-B227','Miller-B207'] },
};

// Helper: get room for color+subgroup (subgroup is 1 or 2, index as 0 or 1)
function room(table, color, subgroup, subj) {
  return table[subj][color][subgroup - 1];
}

// ─── Rotation logic for numbered days (Mon / Thu) ─────────────────────────────
const NUMBERED_ROTS = {
  rot1: { elar:[1,4,7], stem:[2,5,8], math:[3,6,9] },
  rot2: { elar:[3,6,9], stem:[1,4,7], math:[2,5,8] },
  rot3: { elar:[2,5,8], stem:[3,6,9], math:[1,4,7] },
};

function numberedBlock(group, slot, rooms) {
  for (const [subj, groups] of Object.entries(NUMBERED_ROTS[slot])) {
    if (groups.includes(group)) {
      const labels = { elar:'TSIA ELAR', stem:'STEM Challenge', math:'TSIA Math' };
      return { activity: labels[subj], room: rooms[subj][group] };
    }
  }
}

// ─── Schedule definitions ─────────────────────────────────────────────────────
const SCHEDULES = {
  mon: {
    label: 'Monday, June 8',
    type: 'numbered',
    pendingAssignment: false,
    csvFile: 'students_mon.csv',
    getSchedule(group, _sub) {
      const r1 = numberedBlock(group, 'rot1', ROOMS_MON_THU);
      const r2 = numberedBlock(group, 'rot2', ROOMS_MON_THU);
      const r3 = numberedBlock(group, 'rot3', ROOMS_MON_THU);
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',        room:'JECA Commons' },
        { time:'8:30 – 9:20',   activity:'Welcome Kickoff',             room:'JECA Commons' },
        { time:'9:30 – 10:45',  activity:'Rotation 1: ' + r1.activity,  room:r1.room },
        { time:'10:50 – 12:05', activity:'Rotation 2: ' + r2.activity,  room:r2.room },
        { time:'12:15 – 1:00',  activity:'Lunch',                       room:'JECA Commons' },
        { time:'1:05 – 1:35',   activity:'Games',                       room:'' },
        { time:'1:45 – 2:30',   activity:'Rotation 3: ' + r3.activity,  room:r3.room },
        { time:'2:50 – 3:20',   activity:'P-TECH 101',                  room:'JECA Commons' },
        { time:'3:20 – 3:30',   activity:'Dismissal',                   room:'JECA Commons' },
      ];
    }
  },

  tue: {
    label: 'Tuesday, June 9',
    type: 'color',
    pendingAssignment: true,
    csvFile: 'students_tue.csv',
    getSchedule(color, sub) {
      const r = (subj) => room(ROOMS_TUE, color, sub, subj);
      const rot = {
        rot1: { Orange:['NLC Advising',         r('nlc')],
                Yellow:['NLC HSP Orientation',  r('nlc')],
                Green: ['TSI ELAR',              r('elar')],
                Blue:  ['TSI Math',              r('math')] },
        rot2: { Orange:['NLC HSP Orientation',  r('nlc')],
                Yellow:['NLC Advising',          r('nlc')],
                Green: ['TSI Math',              r('math')],
                Blue:  ['TSI ELAR',              r('elar')] },
        rot3: { Orange:['TSI ELAR',              r('elar')],
                Yellow:['TSI Math',              r('math')],
                Green: ['NLC Advising',          r('nlc')],
                Blue:  ['NLC HSP Orientation',   r('nlc')] },
        rot4: { Orange:['TSI Math',              r('math')],
                Yellow:['TSI ELAR',              r('elar')],
                Green: ['NLC HSP Orientation',   r('nlc')],
                Blue:  ['NLC Advising',          r('nlc')] },
      };
      const [a1,rm1] = rot.rot1[color];
      const [a2,rm2] = rot.rot2[color];
      const [a3,rm3] = rot.rot3[color];
      const [a4,rm4] = rot.rot4[color];
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',       room:'JECA Commons' },
        { time:'8:40 – 9:45',   activity:'Rotation 1: ' + a1,         room:rm1 },
        { time:'9:50 – 10:55',  activity:'Rotation 2: ' + a2,         room:rm2 },
        { time:'11:15 – 12:15', activity:'Exploration Rotation',       room:'PLXY Bluebonnet' },
        { time:'12:15 – 1:00',  activity:'Lunch',                      room:'' },
        { time:'1:10 – 2:15',   activity:'Rotation 3: ' + a3,         room:rm3 },
        { time:'2:20 – 3:25',   activity:'Rotation 4: ' + a4,         room:rm4 },
        { time:'3:30 – 4:00',   activity:'Dismissal',                  room:'JECA Commons' },
      ];
    }
  },

  wed: {
    label: 'Wednesday, June 10',
    type: 'color',
    pendingAssignment: false,
    csvFile: 'students_wed.csv',
    getSchedule(color, sub) {
      const r = (subj) => room(ROOMS_WED, color, sub, subj);
      const rot = {
        rot1: { Orange:['NLC Presentation', r('nlc')],
                Yellow:['NLC Presentation', r('nlc')],
                Green: ['TSI ELAR',          r('elar')],
                Blue:  ['TSI Math',          r('math')] },
        rot2: { Orange:['NLC Presentation', r('nlc')],
                Yellow:['NLC Presentation', r('nlc')],
                Green: ['TSI Math',          r('math')],
                Blue:  ['TSI ELAR',          r('elar')] },
        rot3: { Orange:['TSI ELAR',          r('elar')],
                Yellow:['TSI Math',          r('math')],
                Green: ['NLC Presentation',  r('nlc')],
                Blue:  ['NLC Presentation',  r('nlc')] },
        rot4: { Orange:['TSI Math',          r('math')],
                Yellow:['TSI ELAR',          r('elar')],
                Green: ['NLC Presentation',  r('nlc')],
                Blue:  ['NLC Presentation',  r('nlc')] },
      };
      const [a1,rm1] = rot.rot1[color];
      const [a2,rm2] = rot.rot2[color];
      const [a3,rm3] = rot.rot3[color];
      const [a4,rm4] = rot.rot4[color];
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',      room:'JECA Commons' },
        { time:'8:40 – 9:55',   activity:'Rotation 1: ' + a1,        room:rm1 },
        { time:'10:00 – 11:15', activity:'Rotation 2: ' + a2,        room:rm2 },
        { time:'11:25 – 11:55', activity:'Lunch',                     room:'JECA Commons' },
        { time:'12:05 – 12:35', activity:'Games',                     room:'' },
        { time:'12:45 – 2:00',  activity:'Rotation 3: ' + a3,        room:rm3 },
        { time:'2:05 – 3:20',   activity:'Rotation 4: ' + a4,        room:rm4 },
        { time:'3:30 – 4:00',   activity:'Dismissal',                 room:'JECA Commons' },
      ];
    }
  },

  thu: {
    label: 'Thursday, June 11',
    type: 'numbered',
    pendingAssignment: false,
    csvFile: 'students_thu.csv',
    getSchedule(group, _sub) {
      const r1 = numberedBlock(group, 'rot1', ROOMS_MON_THU);
      const r2 = numberedBlock(group, 'rot2', ROOMS_MON_THU);
      const r3 = numberedBlock(group, 'rot3', ROOMS_MON_THU);
      return [
        { time:'7:30 – 8:30',   activity:'Arrival & Breakfast',        room:'JECA Commons' },
        { time:'8:40 – 9:45',   activity:'Rotation 1: ' + r1.activity,  room:r1.room },
        { time:'9:50 – 10:55',  activity:'Rotation 2: ' + r2.activity,  room:r2.room },
        { time:'11:00 – 12:05', activity:'Rotation 3: ' + r3.activity,  room:r3.room },
        { time:'12:15 – 1:00',  activity:'Lunch',                        room:'' },
        { time:'1:10 – 1:45',   activity:'Games / Pep Rally Prep',       room:'' },
        { time:'2:30 – 3:30',   activity:'JISD/NLC Pep Rally',           room:'JECA Commons' },
        { time:'3:30 – 4:00',   activity:'Dismissal',                    room:'JECA Commons' },
      ];
    }
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
let currentDay = 'mon';
let selectedColor = null;  // for color days: holds color before subgroup pick
let rostersByDay = {};     // keyed by day: array of { name, group, subgroup }

// ─── CSV loading ──────────────────────────────────────────────────────────────
// Loads all four CSVs on startup. Fails silently per day if not found.
async function loadAllRosters() {
  for (const [dayKey, day] of Object.entries(SCHEDULES)) {
    try {
      const res = await fetch(day.csvFile);
      if (!res.ok) continue;
      const text = await res.text();
      rostersByDay[dayKey] = parseCSV(text);
    } catch (_) {
      // file not found or network issue — ok, search just won't work for that day
    }
  }
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const students = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const vals = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    // normalize: color days have 'color', numbered days have 'group'
    students.push({
      name:     obj.name     || '',
      group:    obj.group    || obj.color || '',
      subgroup: obj.subgroup || '',
    });
  }
  return students;
}

// ─── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', ['my-schedule','find-student'][i] === tabId);
  });
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// ─── Day selection ─────────────────────────────────────────────────────────────
function selectDay(dayKey) {
  currentDay = dayKey;
  selectedColor = null;
  document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-' + dayKey).classList.add('active');

  const day = SCHEDULES[dayKey];
  let html = '';

  if (day.pendingAssignment) {
    html += `<div class="notice-card warning">
      ⏳ Group assignments for ${day.label.split(',')[0]} haven't been shared yet.
      Check back soon, or tap your color below if you already know it.
    </div>`;
  }

  if (day.type === 'numbered') {
    html += `<p class="label">What number is on your band?</p>
    <div class="num-grid">`;
    for (let n = 1; n <= 9; n++) {
      const c = COLOR[n];
      html += `<button class="num-btn" style="color:${c.text}" onclick="showSchedule(${n}, null)">${n}</button>`;
    }
    html += '</div>';
  } else {
    html += `<p class="label">What color is your band?</p>
    <div class="color-grid">`;
    for (const g of ['Orange','Yellow','Green','Blue']) {
      const c = COLOR[g];
      html += `<button class="color-btn"
        style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border}"
        onclick="pickSubgroup('${g}')">${g}</button>`;
    }
    html += '</div>';
  }

  document.getElementById('group-picker').innerHTML = html;
  document.getElementById('step-day').style.display = '';
  document.getElementById('step-sched').style.display = 'none';
}

// ─── Sub-group picker (color days only) ───────────────────────────────────────
function pickSubgroup(color) {
  selectedColor = color;
  const c = COLOR[color];
  const html = `
    <div class="subgroup-header">
      <span class="subgroup-color-pill"
        style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border}">${color}</span>
      <span style="font-size:14px;color:var(--color-text-muted)">What number is on your band?</span>
    </div>
    <div class="subgroup-grid">
      <button class="subgroup-btn" onclick="showSchedule('${color}', 1)">1</button>
      <button class="subgroup-btn" onclick="showSchedule('${color}', 2)">2</button>
    </div>
    <button class="back-btn" onclick="selectDay('${currentDay}')">← Back to colors</button>
  `;
  document.getElementById('group-picker').innerHTML = html;
}

// ─── Schedule view ─────────────────────────────────────────────────────────────
function showSchedule(group, subgroup) {
  const day = SCHEDULES[currentDay];
  const colorKey = day.type === 'color' ? group : group;
  const c = COLOR[colorKey] || { bg:'var(--color-surface)', text:'var(--color-text)', border:'var(--color-border)' };
  const blocks = day.getSchedule(group, subgroup);

  let groupLabel;
  if (day.type === 'numbered') {
    groupLabel = `Group ${group}`;
  } else {
    groupLabel = `${group} · Sub-group ${subgroup}`;
  }

  let html = `<button class="back-btn" onclick="${day.type === 'color' ? `pickSubgroup('${group}')` : `selectDay('${currentDay}')`}">← Back</button>
  <div class="group-badge" style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border}">
    ${groupLabel} — ${day.label}
  </div>
  <div class="card">`;

  for (const b of blocks) {
    html += `<div class="sched-block">
      <div class="sched-time">${b.time}</div>
      <div class="sched-activity">${b.activity}</div>
      ${b.room ? `<div class="sched-room">📍 ${b.room}</div>` : ''}
    </div>`;
  }
  html += '</div>';

  const schedEl = document.getElementById('step-sched');
  schedEl.innerHTML = html;
  schedEl.style.display = '';
  document.getElementById('step-day').style.display = 'none';
}

// ─── Student search ────────────────────────────────────────────────────────────
function searchStudent() {
  const q = document.getElementById('search-input').value.trim().toLowerCase();
  const out = document.getElementById('search-results');

  if (!q) { out.innerHTML = ''; return; }

  // Search across all days
  const allMatches = [];
  for (const [dayKey, students] of Object.entries(rostersByDay)) {
    const day = SCHEDULES[dayKey];
    for (const s of students) {
      if (s.name.toLowerCase().includes(q)) {
        allMatches.push({ ...s, dayKey, dayLabel: day.label, type: day.type });
      }
    }
  }

  if (!allMatches.length) {
    out.innerHTML = `<div class="card"><p class="empty-msg">No students found matching "${q}"</p></div>`;
    return;
  }

  let html = '<div class="card">';
  for (const m of allMatches) {
    const colorKey = m.type === 'numbered' ? Number(m.group) : m.group;
    const c = COLOR[colorKey] || { bg:'var(--color-surface)', text:'var(--color-text)', border:'var(--color-border)' };
    const tag = m.subgroup ? `${m.group} · Sub-group ${m.subgroup}` : m.group;
    html += `<div class="result-row">
      <div class="result-name">${m.name}</div>
      <div class="result-sub">
        ${m.dayLabel} &mdash;
        <span class="group-tag" style="background:${c.bg};color:${c.text};border-color:${c.border}">${tag}</span>
      </div>
    </div>`;
  }
  html += '</div>';
  out.innerHTML = html;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
loadAllRosters();
selectDay('mon');