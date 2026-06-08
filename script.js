// ─── Color theme map ─────────────────────────────────────────────────────────
// Keys: color group names or group numbers 1-9
const COLOR = {
  Orange: { bg: 'var(--orange-bg)', text: 'var(--orange-text)', border: 'var(--orange-border)' },
  Yellow: { bg: 'var(--yellow-bg)', text: 'var(--yellow-text)', border: 'var(--yellow-border)' },
  Green:  { bg: 'var(--green-bg)',  text: 'var(--green-text)',  border: 'var(--green-border)'  },
  Blue:   { bg: 'var(--blue-bg)',   text: 'var(--blue-text)',   border: 'var(--blue-border)'   },
  // Groups 1-3 → red band, 4-6 → green band, 7-9 → blue band
  1: { bg: 'var(--red-bg)',   text: 'var(--red-text)',   border: 'var(--red-border)'   },
  2: { bg: 'var(--red-bg)',   text: 'var(--red-text)',   border: 'var(--red-border)'   },
  3: { bg: 'var(--red-bg)',   text: 'var(--red-text)',   border: 'var(--red-border)'   },
  4: { bg: 'var(--green-bg)', text: 'var(--green-text)', border: 'var(--green-border)' },
  5: { bg: 'var(--green-bg)', text: 'var(--green-text)', border: 'var(--green-border)' },
  6: { bg: 'var(--green-bg)', text: 'var(--green-text)', border: 'var(--green-border)' },
  7: { bg: 'var(--blue-bg)',  text: 'var(--blue-text)',  border: 'var(--blue-border)'  },
  8: { bg: 'var(--blue-bg)',  text: 'var(--blue-text)',  border: 'var(--blue-border)'  },
  9: { bg: 'var(--blue-bg)',  text: 'var(--blue-text)',  border: 'var(--blue-border)'  },
};

// ─── Room assignments ─────────────────────────────────────────────────────────
// Monday / Thursday: rooms are the same layout
// Groups 1-3 share a room set, 4-6 share another, 7-9 share another
const ROOMS_MON_THU = {
  elar:  { 1:'Miller-B207',  2:'Miller-B207',  3:'Miller-B207',  4:'Garcia-B206',  5:'Garcia-B206',  6:'Garcia-B206',  7:'Gilmore-B202', 8:'Gilmore-B202', 9:'Gilmore-B202' },
  stem:  { 1:'Brown-B226',   2:'Brown-B226',   3:'Brown-B226',   4:'Mercado-B229', 5:'Mercado-B229', 6:'Mercado-B229', 7:'Harwell-B227', 8:'Harwell-B227', 9:'Harwell-B227' },
  math:  { 1:'Kennedy-B209', 2:'Kennedy-B209', 3:'Kennedy-B209', 4:'Tinoco-B221',  5:'Tinoco-B221',  6:'Tinoco-B221',  7:'Whitby-B208',  8:'Whitby-B208',  9:'Whitby-B208'  },
};

// Tuesday room lookup by color group and subject
// NLC has two sub-groups of rooms; Orange→NLC1[0], Yellow→NLC1[1], etc.
// NLC 1: Brown-B226, Mercado-B229, Gilmore-B202, Harwell-B227, Whitby-B208
// NLC 2: Mercado-B229, Brown-B226, Harwell-B227, Gilmore-B202
// For simplicity we map each color group to their NLC room
const ROOMS_TUE = {
  math: { Orange: 'Kennedy-B209', Yellow: 'Tinoco-B221', Green: 'Kennedy-B209', Blue: 'Tinoco-B221' },
  elar: { Orange: 'Miller-B207',  Yellow: 'Garcia-B206',  Green: 'Miller-B207',  Blue: 'Garcia-B206'  },
  nlc:  { Orange: 'Brown-B226',   Yellow: 'Mercado-B229', Green: 'Gilmore-B202', Blue: 'Harwell-B227'  },
};

// Wednesday room lookup by color group and subject
// NLC 1: Brown-B226, Mercado-B229, Miller-B207, Harwell-B227, Kennedy-B209
// Math: Tinoco-B221, Whitby-B208 | ELAR: Garcia-B206, Gilmore-B202
const ROOMS_WED = {
  math: { Orange: 'Tinoco-B221',  Yellow: 'Whitby-B208',  Green: 'Tinoco-B221',  Blue: 'Whitby-B208'  },
  elar: { Orange: 'Garcia-B206',  Yellow: 'Gilmore-B202', Green: 'Garcia-B206',  Blue: 'Gilmore-B202' },
  nlc:  { Orange: 'Brown-B226',   Yellow: 'Mercado-B229', Green: 'Miller-B207',  Blue: 'Harwell-B227'  },
};

// ─── Schedule data ────────────────────────────────────────────────────────────
// Rotation order for numbered days (Mon / Thu):
//   Rot1: groups 1,4,7 → ELAR | 2,5,8 → STEM | 3,6,9 → Math
//   Rot2: groups 3,6,9 → ELAR | 1,4,7 → STEM | 2,5,8 → Math
//   Rot3: groups 2,5,8 → ELAR | 3,6,9 → STEM | 1,4,7 → Math
function numberedActivity(group, slot) {
  // slot: 'rot1' | 'rot2' | 'rot3'
  const order = {
    rot1: { elar:[1,4,7], stem:[2,5,8], math:[3,6,9] },
    rot2: { elar:[3,6,9], stem:[1,4,7], math:[2,5,8] },
    rot3: { elar:[2,5,8], stem:[3,6,9], math:[1,4,7] },
  };
  for (const [subj, groups] of Object.entries(order[slot])) {
    if (groups.includes(group)) return subj;
  }
}

function numberedScheduleBlock(group, slot, rooms) {
  const subj = numberedActivity(group, slot);
  const labels = { elar:'TSIA ELAR', stem:'STEM Challenge', math:'TSIA Math' };
  return { activity: labels[subj], room: rooms[subj][group] };
}

const SCHEDULES = {
  mon: {
    label: 'Monday, June 8',
    type: 'numbered',
    pendingAssignment: false,
    getSchedule(group) {
      const r1 = numberedScheduleBlock(group, 'rot1', ROOMS_MON_THU);
      const r2 = numberedScheduleBlock(group, 'rot2', ROOMS_MON_THU);
      const r3 = numberedScheduleBlock(group, 'rot3', ROOMS_MON_THU);
      return [
        { time: '7:30 – 8:30',   activity: 'Arrival & Breakfast',       room: 'JECA Commons' },
        { time: '8:30 – 9:20',   activity: 'Welcome Kickoff',            room: 'JECA Commons' },
        { time: '9:30 – 10:45',  activity: 'Rotation 1: ' + r1.activity, room: r1.room },
        { time: '10:50 – 12:05', activity: 'Rotation 2: ' + r2.activity, room: r2.room },
        { time: '12:15 – 1:00',  activity: 'Lunch',                      room: 'JECA Commons' },
        { time: '1:05 – 1:35',   activity: 'Games',                      room: '' },
        { time: '1:45 – 2:30',   activity: 'Rotation 3: ' + r3.activity, room: r3.room },
        { time: '2:50 – 3:20',   activity: 'P-TECH 101',                 room: 'JECA Commons' },
        { time: '3:20 – 3:30',   activity: 'Dismissal',                  room: 'JECA Commons' },
      ];
    }
  },

  tue: {
    label: 'Tuesday, June 9',
    type: 'color',
    pendingAssignment: true,
    getSchedule(group) {
      // Rotation assignments by color group
      // Rot1: Orange→NLC Advising, Yellow→NLC HSP Orientation, Green→TSI ELAR, Blue→TSI Math
      // Rot2: flipped NLC, flipped TSI
      // Rot3: Orange→TSI ELAR, Yellow→TSI Math, Green→NLC Advising, Blue→NLC HSP Orientation
      // Rot4: Orange→TSI Math, Yellow→TSI ELAR, Green→NLC HSP Orientation, Blue→NLC Advising
      const rot = {
        rot1: { Orange: ['NLC Advising', ROOMS_TUE.nlc.Orange],           Yellow: ['NLC HSP Orientation', ROOMS_TUE.nlc.Yellow], Green: ['TSI ELAR', ROOMS_TUE.elar.Green], Blue: ['TSI Math', ROOMS_TUE.math.Blue] },
        rot2: { Orange: ['NLC HSP Orientation', ROOMS_TUE.nlc.Orange],    Yellow: ['NLC Advising', ROOMS_TUE.nlc.Yellow],          Green: ['TSI Math', ROOMS_TUE.math.Green],  Blue: ['TSI ELAR', ROOMS_TUE.elar.Blue] },
        rot3: { Orange: ['TSI ELAR', ROOMS_TUE.elar.Orange],              Yellow: ['TSI Math', ROOMS_TUE.math.Yellow],             Green: ['NLC Advising', ROOMS_TUE.nlc.Green], Blue: ['NLC HSP Orientation', ROOMS_TUE.nlc.Blue] },
        rot4: { Orange: ['TSI Math', ROOMS_TUE.math.Orange],              Yellow: ['TSI ELAR', ROOMS_TUE.elar.Yellow],             Green: ['NLC HSP Orientation', ROOMS_TUE.nlc.Green], Blue: ['NLC Advising', ROOMS_TUE.nlc.Blue] },
      };
      const [a1,rm1] = rot.rot1[group];
      const [a2,rm2] = rot.rot2[group];
      const [a3,rm3] = rot.rot3[group];
      const [a4,rm4] = rot.rot4[group];
      return [
        { time: '7:30 – 8:30',   activity: 'Arrival & Breakfast',      room: 'JECA Commons' },
        { time: '8:40 – 9:45',   activity: 'Rotation 1: ' + a1,        room: rm1 },
        { time: '9:50 – 10:55',  activity: 'Rotation 2: ' + a2,        room: rm2 },
        { time: '11:15 – 12:15', activity: 'Exploration Rotation',      room: 'PLXY Bluebonnet' },
        { time: '12:15 – 1:00',  activity: 'Lunch',                     room: '' },
        { time: '1:10 – 2:15',   activity: 'Rotation 3: ' + a3,        room: rm3 },
        { time: '2:20 – 3:25',   activity: 'Rotation 4: ' + a4,        room: rm4 },
        { time: '3:30 – 4:00',   activity: 'Dismissal',                 room: 'JECA Commons' },
      ];
    }
  },

  wed: {
    label: 'Wednesday, June 10',
    type: 'color',
    pendingAssignment: false,
    getSchedule(group) {
      const rot = {
        rot1: { Orange: ['NLC Presentation', ROOMS_WED.nlc.Orange],    Yellow: ['NLC Presentation', ROOMS_WED.nlc.Yellow], Green: ['TSI ELAR', ROOMS_WED.elar.Green], Blue: ['TSI Math', ROOMS_WED.math.Blue] },
        rot2: { Orange: ['NLC Presentation', ROOMS_WED.nlc.Orange],    Yellow: ['NLC Presentation', ROOMS_WED.nlc.Yellow], Green: ['TSI Math', ROOMS_WED.math.Green],  Blue: ['TSI ELAR', ROOMS_WED.elar.Blue] },
        rot3: { Orange: ['TSI ELAR', ROOMS_WED.elar.Orange],           Yellow: ['TSI Math', ROOMS_WED.math.Yellow],        Green: ['NLC Presentation', ROOMS_WED.nlc.Green], Blue: ['NLC Presentation', ROOMS_WED.nlc.Blue] },
        rot4: { Orange: ['TSI Math', ROOMS_WED.math.Orange],           Yellow: ['TSI ELAR', ROOMS_WED.elar.Yellow],        Green: ['NLC Presentation', ROOMS_WED.nlc.Green], Blue: ['NLC Presentation', ROOMS_WED.nlc.Blue] },
      };
      const [a1,rm1] = rot.rot1[group];
      const [a2,rm2] = rot.rot2[group];
      const [a3,rm3] = rot.rot3[group];
      const [a4,rm4] = rot.rot4[group];
      return [
        { time: '7:30 – 8:30',   activity: 'Arrival & Breakfast',     room: 'JECA Commons' },
        { time: '8:40 – 9:55',   activity: 'Rotation 1: ' + a1,       room: rm1 },
        { time: '10:00 – 11:15', activity: 'Rotation 2: ' + a2,       room: rm2 },
        { time: '11:25 – 11:55', activity: 'Lunch',                    room: 'JECA Commons' },
        { time: '12:05 – 12:35', activity: 'Games',                    room: '' },
        { time: '12:45 – 2:00',  activity: 'Rotation 3: ' + a3,       room: rm3 },
        { time: '2:05 – 3:20',   activity: 'Rotation 4: ' + a4,       room: rm4 },
        { time: '3:30 – 4:00',   activity: 'Dismissal',                room: 'JECA Commons' },
      ];
    }
  },

  thu: {
    label: 'Thursday, June 11',
    type: 'numbered',
    pendingAssignment: false,
    getSchedule(group) {
      // Thursday P-TECH uses groups 1-9, same ELAR/STEM/Math rotation structure
      // but 3 rotations before lunch, then Pep Rally
      const r1 = numberedScheduleBlock(group, 'rot1', ROOMS_MON_THU);
      const r2 = numberedScheduleBlock(group, 'rot2', ROOMS_MON_THU);
      const r3 = numberedScheduleBlock(group, 'rot3', ROOMS_MON_THU);
      return [
        { time: '7:30 – 8:30',   activity: 'Arrival & Breakfast',       room: 'JECA Commons' },
        { time: '8:40 – 9:45',   activity: 'Rotation 1: ' + r1.activity, room: r1.room },
        { time: '9:50 – 10:55',  activity: 'Rotation 2: ' + r2.activity, room: r2.room },
        { time: '11:00 – 12:05', activity: 'Rotation 3: ' + r3.activity, room: r3.room },
        { time: '12:15 – 1:00',  activity: 'Lunch',                      room: '' },
        { time: '1:10 – 1:45',   activity: 'Games / Pep Rally Prep',     room: '' },
        { time: '2:30 – 3:30',   activity: 'JISD/NLC Pep Rally',         room: 'JECA Commons' },
        { time: '3:30 – 4:00',   activity: 'Dismissal',                  room: 'JECA Commons' },
      ];
    }
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
let currentDay = 'mon';
let roster = [];

// ─── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach((btn, i) => {
    btn.classList.toggle('active', ['my-schedule', 'find-student', 'roster'][i] === tabId);
  });
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// ─── Day selection ─────────────────────────────────────────────────────────────
function selectDay(dayKey) {
  currentDay = dayKey;
  document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-' + dayKey).classList.add('active');

  const day = SCHEDULES[dayKey];
  let html = '';

  if (day.pendingAssignment) {
    html += `<div class="notice-card warning">
      ⏳ Group assignments for ${day.label.split(',')[0]} haven't been shared yet.
      Check back when the coordinator sends the list, or tap your color below if you already know it.
    </div>`;
  }

  if (day.type === 'numbered') {
    html += `<p class="label">What number is on your band?</p>
    <div class="num-grid">`;
    for (let n = 1; n <= 9; n++) {
      const c = COLOR[n];
      html += `<button class="num-btn" style="color:${c.text}" onclick="showSchedule(${n})">${n}</button>`;
    }
    html += '</div>';
  } else {
    html += `<p class="label">What color is your band?</p>
    <div class="group-grid">`;
    for (const g of ['Orange', 'Yellow', 'Green', 'Blue']) {
      const c = COLOR[g];
      html += `<button class="group-pill"
        style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border}"
        onclick="showSchedule('${g}')">${g}</button>`;
    }
    html += '</div>';
  }

  document.getElementById('group-picker').innerHTML = html;
  document.getElementById('step-day').style.display = '';
  document.getElementById('step-sched').style.display = 'none';
}

// ─── Schedule view ─────────────────────────────────────────────────────────────
function showSchedule(group) {
  const day = SCHEDULES[currentDay];
  const c = COLOR[group] || { bg: 'var(--color-surface)', text: 'var(--color-text)', border: 'var(--color-border)' };
  const blocks = day.getSchedule(group);

  const groupLabel = day.type === 'numbered' ? `Group ${group}` : `${group} Group`;

  let html = `<button class="back-btn" onclick="goBack()">← Back</button>
  <div class="group-badge" style="background:${c.bg};color:${c.text};border:1.5px solid ${c.border}">
    ${groupLabel} &mdash; ${day.label}
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

function goBack() {
  document.getElementById('step-sched').style.display = 'none';
  document.getElementById('step-day').style.display = '';
}

// ─── Student search ─────────────────────────────────────────────────────────────
function searchStudent() {
  const q = document.getElementById('search-input').value.trim().toLowerCase();
  const out = document.getElementById('search-results');

  if (!q) { out.innerHTML = ''; return; }

  if (roster.length === 0) {
    out.innerHTML = `<div class="card"><p class="empty-msg">No roster loaded yet. Paste a roster in the "Roster" tab first.</p></div>`;
    return;
  }

  const matches = roster.filter(r => r.name.toLowerCase().includes(q));

  if (!matches.length) {
    out.innerHTML = `<div class="card"><p class="empty-msg">No students found matching "${q}"</p></div>`;
    return;
  }

  let html = '<div class="card">';
  for (const m of matches) {
    const key = m.number ? Number(m.number) : m.group;
    const c = COLOR[key] || COLOR[m.group] || { bg: 'var(--color-surface)', text: 'var(--color-text)', border: 'var(--color-border)' };
    html += `<div class="roster-row">
      <div class="roster-name">${m.name}</div>
      <span class="group-tag" style="background:${c.bg};color:${c.text};border-color:${c.border}">
        ${m.group}${m.number ? ' · #' + m.number : ''}
      </span>
    </div>`;
  }
  html += '</div>';
  out.innerHTML = html;
}

// ─── Roster management ─────────────────────────────────────────────────────────
function parseRoster() {
  const raw = document.getElementById('roster-input').value.trim();
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  roster = [];
  let errors = 0;

  for (const line of lines) {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length < 1 || !parts[0]) { errors++; continue; }
    const name   = parts[0];
    const group  = parts[1] || '';
    const number = parts[2] || '';
    roster.push({ name, group, number });
  }

  document.getElementById('roster-status').innerHTML =
    `<p class="success-msg">✓ Loaded ${roster.length} student${roster.length !== 1 ? 's' : ''}${errors ? ` (${errors} lines skipped)` : ''}</p>`;

  renderRosterPreview();
}

function renderRosterPreview() {
  if (!roster.length) { document.getElementById('roster-preview').innerHTML = ''; return; }

  let html = '<div class="card"><p class="label" style="margin-bottom:10px">Loaded students</p>';
  const display = roster.slice(0, 25);
  for (const r of display) {
    const key = r.number ? Number(r.number) : r.group;
    const c = COLOR[key] || COLOR[r.group] || { bg: 'var(--color-surface)', text: 'var(--color-text)', border: 'var(--color-border)' };
    html += `<div class="roster-row">
      <div class="roster-name">${r.name}</div>
      <span class="group-tag" style="background:${c.bg};color:${c.text};border-color:${c.border}">
        ${r.group}${r.number ? ' · #' + r.number : ''}
      </span>
    </div>`;
  }
  if (roster.length > 25) {
    html += `<p style="font-size:12px;color:var(--color-text-hint);padding-top:8px">…and ${roster.length - 25} more</p>`;
  }
  html += '</div>';
  document.getElementById('roster-preview').innerHTML = html;
}

function clearRoster() {
  roster = [];
  document.getElementById('roster-input').value = '';
  document.getElementById('roster-status').innerHTML = '';
  document.getElementById('roster-preview').innerHTML = '';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
selectDay('mon');