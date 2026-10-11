/* ===================== 状态 ===================== */
const state = {
  idx: 0,
  m: { energy: 60, diet: 60, body: 60, mood: 60 },
  log: []
};
const stage = document.getElementById("stage");
const hud   = document.getElementById("hud");

function render(html) {
  stage.innerHTML = `<section class="page">${html}</section>`;
  stage.scrollTop = 0;
}

/* ===================== 封面（P1） ===================== */
function showCover() {
  hud.classList.add("hidden");
  document.body.dataset.sky = "night";
  const best = localStorage.getItem("bestScore");
  render(`
    <div class="cover">
      <div class="sun"></div>
      <h1>健康重启计划</h1>
      <p class="sub">24 小时人生模拟器</p>
      <p class="desc">同样的一天，不同的选择，<br>看看你的身体会给出什么答案。</p>
      <button class="btn" onclick="showIntro()">▶ 开始这一天</button>
      <p class="tiny">${best ? "历史最佳：" + best + " 分" : "首次游玩"}</p>
    </div>`);
}

/* ===================== 说明页（P2） ===================== */
function showIntro() {
  render(`
    <div class="cover">
      <h1 style="font-size:26px">你的 4 个身体指标</h1>
      <div class="story" style="margin-top:20px;text-align:left">
        ⚡ <b>精力</b>：睡眠、作息决定<br>
        🥗 <b>饮食</b>：盐、油、糖和营养均衡<br>
        💪 <b>活力</b>：运动、久坐、骨骼健康<br>
        😊 <b>心情</b>：情绪与心理状态<br><br>
        每个指标初始 60 分。接下来 12 个时刻，每个选择都会让它们悄悄变化。<br>
        一天结束后，你会拿到一份"健康体检报告"。
      </div>
      <button class="btn" onclick="startDay()">我准备好了</button>
    </div>`);
}

function startDay() {
  state.idx = 0;
  state.m = { energy: 60, diet: 60, body: 60, mood: 60 };
  state.log = [];
  updateHUD();
  showScene(0);
}

/* ===================== 场景页（P3–P14） ===================== */
function showScene(i) {
  if (i >= SCENES.length) return showResult();
  const s = SCENES[i];
  state.idx = i;
  hud.classList.remove("hidden");
  document.body.dataset.sky = s.sky;
  setClock(s.time);

  render(`
    <div class="scene">
      <div class="emoji">${s.emoji}</div>
      <div class="tag">${s.time} · ${s.title}</div>
      <p class="story">${s.text}</p>
      <div class="choices">
        ${s.choices.map((c, j) =>
          `<button class="choice" onclick="choose(${j})">${c.label}</button>`).join("")}
      </div>
      <div class="progress">第 ${i + 1} / ${SCENES.length} 个时刻</div>
    </div>`);
}

function choose(j) {
  const s = SCENES[state.idx], c = s.choices[j];
  // 应用指标变化，限制在 0–100
  for (const k in c.effect) {
    state.m[k] = Math.max(0, Math.min(100, state.m[k] + c.effect[k]));
  }
  state.log.push({ time: s.time, title: s.title, label: c.label, good: c.good, tip: c.tip });
  updateHUD();

  const eff = Object.entries(c.effect).map(([k, v]) =>
    `<span class="${v >= 0 ? "up" : "down"}">${NAME[k]} ${v > 0 ? "+" : ""}${v}</span>`).join("");

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" id="modal">
      <div class="card">
        <div class="verdict ${c.good ? "ok" : "warn"}">
          ${c.good ? "👍 不错的选择" : "⚠️ 身体默默记了一笔"}
        </div>
        <div class="eff">${eff}</div>
        <p class="fact">${c.fact}</p>
        <small>资料来源：《中国公民健康素养——基本知识与技能》（健康素养66条）</small>
        <button class="btn" onclick="closeModal()">下一刻 →</button>
      </div>
    </div>`);
}

function closeModal() {
  document.getElementById("modal").remove();
  showScene(state.idx + 1);
}

/* ===================== 状态栏 ===================== */
function setClock(t) {
  const [h, m] = t.split(":").map(Number);
  const deg = ((h % 12) + m / 60) * 30;
  document.getElementById("hand").style.transform = `translateX(-50%) rotate(${deg}deg)`;
  document.getElementById("timeText").textContent = t;
}

function updateHUD() {
  for (const k in state.m) {
    const el = document.getElementById("m-" + k);
    const v = state.m[k];
    el.style.width = v + "%";
    el.className = v < 35 ? "low" : v < 60 ? "mid" : "";
  }
}

/* ===================== 报告页（P15） ===================== */
function showResult() {
  hud.classList.add("hidden");
  document.body.dataset.sky = "night";
  const m = state.m;
  const score = Math.round((m.energy + m.diet + m.body + m.mood) / 4);
  const grade = score >= 85 ? "S" : score >= 70 ? "A" : score >= 55 ? "B" : "C";
  const comment = {
    S: "健康达人！你的身体正在为你鼓掌。",
    A: "整体不错，还有几个小习惯可以更好。",
    B: "身体在发出小信号了，是时候做些调整。",
    C: "今天的你透支了明天。重启一次试试？"
  }[grade];

  // 更新历史最佳
  const best = Number(localStorage.getItem("bestScore") || 0);
  if (score > best) localStorage.setItem("bestScore", score);

  const bad = state.log.filter(x => !x.good);
  const rx = bad.length
    ? bad.map(x => `<li>▸ <b>${x.time}</b> ${x.tip}</li>`).join("")
    : "<li>🎉 今天的每个选择都很棒，继续保持！</li>";

  render(`
    <div class="report">
      <div class="grade">${grade}</div>
      <div class="score">综合健康评分 ${score} 分 · ${comment}</div>
      <canvas id="radar" width="520" height="520"></canvas>
      <div class="rx">
        <h3>📋 你的健康处方</h3>
        <ul>${rx}</ul>
      </div>
      <button class="btn" onclick="showPoster(${score}, '${grade}')">生成我的健康海报</button>
      <button class="btn ghost" onclick="startDay()">🔄 重启这一天</button>
    </div>`);

  drawRadar(document.getElementById("radar"), m);
  state.score = score; state.grade = grade;
}

function drawRadar(cv, m) {
  const ctx = cv.getContext("2d");
  const W = cv.width, c = W / 2, r = W * 0.34;
  const keys = ["energy", "diet", "body", "mood"];
  const angle = i => -Math.PI / 2 + i * Math.PI / 2;
  ctx.clearRect(0, 0, W, W);

  // 背景网格
  for (let lv = 1; lv <= 4; lv++) {
    ctx.beginPath();
    keys.forEach((k, i) => {
      const rr = r * lv / 4;
      ctx.lineTo(c + rr * Math.cos(angle(i)), c + rr * Math.sin(angle(i)));
    });
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 2; ctx.stroke();
  }
  // 数据多边形
  ctx.beginPath();
  keys.forEach((k, i) => {
    const rr = r * m[k] / 100;
    ctx.lineTo(c + rr * Math.cos(angle(i)), c + rr * Math.sin(angle(i)));
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(255,214,102,.55)"; ctx.fill();
  ctx.strokeStyle = "#ffd666"; ctx.lineWidth = 4; ctx.stroke();
  // 标签
  ctx.fillStyle = "#fff"; ctx.font = "bold 26px sans-serif"; ctx.textAlign = "center";
  keys.forEach((k, i) => {
    ctx.fillText(`${NAME[k]} ${m[k]}`,
      c + (r + 56) * Math.cos(angle(i)), c + (r + 56) * Math.sin(angle(i)) + 9);
  });
}

/* ===================== 海报页（P16） ===================== */
function showPoster(score, grade) {
  const cv = document.createElement("canvas");
  cv.width = 750; cv.height = 1334;
  const ctx = cv.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, 0, 1334);
  g.addColorStop(0, "#0f2027"); g.addColorStop(1, "#2c5364");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 750, 1334);

  ctx.fillStyle = "#fff"; ctx.textAlign = "center";
  ctx.font = "bold 56px sans-serif"; ctx.fillText("健康重启计划", 375, 150);
  ctx.font = "30px sans-serif";       ctx.fillText("24 小时人生模拟器", 375, 205);
  ctx.fillStyle = "#ffd666";
  ctx.font = "bold 220px sans-serif"; ctx.fillText(grade, 375, 480);
  ctx.fillStyle = "#fff";
  ctx.font = "36px sans-serif";       ctx.fillText(`综合健康评分 ${score} 分`, 375, 560);

  // 把雷达图画到海报里
  const radar = document.createElement("canvas");
  radar.width = radar.height = 520;
  drawRadar(radar, state.m);
  ctx.drawImage(radar, 115, 620, 520, 520);

  ctx.font = "28px sans-serif"; ctx.fillStyle = "rgba(255,255,255,.8)";
  ctx.fillText("同样的一天，不同的选择", 375, 1220);
  ctx.fillText("扫码体验 · 重启你的 24 小时", 375, 1270);

  render(`
    <div class="poster cover">
      <img src="${cv.toDataURL("image/png")}" alt="海报">
      <p class="tiny">长按图片保存，分享给朋友挑战</p>
      <button class="btn" onclick="showEnd()">查看作品信息</button>
    </div>`);
}

/* ===================== 封底（P17） ===================== */
function showEnd() {
  render(`
    <div class="end">
      <h2>关于本作品</h2>
      <p>作品：健康重启计划 · 24 小时人生模拟器</p>
      <p>团队：辽宁师范大学海华学院 试试就试试团队</p>
      <p>知识来源：《中国公民健康素养——基本知识与技能》（健康素养66条）<br>《中国居民膳食指南（2022）》<br>国家卫健委“全民健康生活方式行动·三减三健”</p>
      <button class="btn ghost" onclick="showCover()">返回封面</button>
    </div>`);
}

/* 启动 */
showCover();