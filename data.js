const NAME = { energy: "⚡精力", diet: "🥗饮食", body: "🦴活力", mood: "😊心情" };

const SCENES = [
  {
    time: "06:30", sky: "dawn", emoji: "⏰", title: "闹钟响了",
    text: "昨晚刷手机到一点半，闹钟已响第三遍。窗帘缝里透进一点光。",
    choices: [
      { label: "🛏 再睡 20 分钟，就 20 分钟", good: false,
        effect: { energy: -5, mood: 3 },
        fact: "多睡20分钟常处浅睡，醒后“睡眠惯性”更重。固定起床时间，比回笼觉更提神。",
        tip: "固定起床时间，闹钟响了就起。" },
      { label: "🌅 立刻起床，拉开窗帘", good: true,
        effect: { energy: 8, mood: 5 },
        fact: "早晨的自然光能抑制褪黑素分泌、校准生物钟，是最便宜的“提神剂”。" }
    ]
  },
  {
    time: "07:00", sky: "dawn", emoji: "🍳", title: "早餐时间",
    text: "宿舍楼下有早餐店铺，食堂也开门了。你有 15 分钟。",
    choices: [
      { label: "🏃 来不及了，不吃直接走", good: false,
        effect: { energy: -10, diet: -8, mood: -3 },
        fact: "不吃早餐与上午注意力下降、血糖波动以及超重风险增加相关。《健康素养66条》倡导规律早餐",
        tip: "每天吃早餐，哪怕只是鸡蛋+牛奶。" },
      { label: "🥟 油条 + 甜豆浆", good: false,
        effect: { energy: 5, diet: -5 },
        fact: "一根油条含油约 10–15 g，接近全天推荐用油量（25–30g）的一半；甜豆浆往往额外加糖。偶尔可以，别天天。",
        tip: "早餐少油炸、少含糖饮品。" },
      { label: "🥚 鸡蛋 + 牛奶 + 全麦面包", good: true,
        effect: { energy: 8, diet: 10 },
        fact: "优质蛋白 + 全谷物 + 奶制品，是膳食指南推荐的早餐组合，饱腹感持久，上午不容易犯困。" }
    ]
  },
  {
    time: "08:00", sky: "morning", emoji: "🚲", title: "去教学楼",
    text: "从宿舍到教学楼 1.5 公里。室友喊你一起打车。",
    choices: [
      { label: "🚕 打车，省时间", good: false,
        effect: { body: -4 },
        fact: "成人每周需要至少 150 分钟中等强度活动。通勤步行/骑行是最容易坚持的运动来源。",
        tip: "把通勤变成运动：能走就走，能骑就骑。" },
      { label: "🚶 走路 / 骑车过去", good: true,
        effect: { body: 8, mood: 4 },
        fact: "1.5 公里步行约 2000 步、15 分钟。每天 6000–10000 步与心血管疾病风险降低显著相关。" }
    ]
  },
  {
    time: "10:00", sky: "morning", emoji: "📱", title: "课间十分钟",
    text: "连着两节课，脖子有点酸。课间大家都在低头刷手机。",
    choices: [
      { label: "📱 继续坐着刷短视频", good: false,
        effect: { body: -6, mood: -2 },
        fact: "低头 60° 时颈椎承受的压力约 27 kg，相当于脖子上挂了一个 8 岁小孩。久坐每小时应起身活动 2–3 分钟。",
        tip: "每坐 1 小时起身活动，少低头。" },
      { label: "🧘 起身走走，做一组颈肩拉伸", good: true,
        effect: { body: 6, energy: 4 },
        fact: "起身活动能打断久坐状态、改善下肢血液循环，拉伸可缓解颈肩肌肉紧张，还能提升下节课的注意力。" }
    ]
  },
  {
    time: "12:00", sky: "noon", emoji: "🍱", title: "午餐",
    text: "手机弹出外卖红包：麻辣香锅满 30 减 15。食堂今天有清蒸鱼。",
    choices: [
      { label: "🌶 点麻辣香锅外卖", good: false,
        effect: { diet: -10, energy: -3 },
        fact: "一份重口味外卖的盐可达 6–8 g，已超过全天推荐上限（< 5 g）。「三减」：减盐、减油、减糖，从一顿外卖开始。",
        tip: "午餐少重口外卖，优先一荤两素。" },
      { label: "🐟 食堂：一荤两素一饭", good: true,
        effect: { diet: 10, energy: 5 },
        fact: "每餐「一半蔬菜、四分之一主食、四分之一蛋白质」是膳食指南推荐的餐盘结构，营养均衡且不易餐后犯困。" }
    ]
  },
  {
    time: "13:00", sky: "noon", emoji: "😴", title: "午休",
    text: "下午还有三节课。你现在很困。",
    choices: [
      { label: "📺 不睡，刷一集剧", good: false,
        effect: { energy: -6, mood: 2 },
        fact: "午后 13–15 点是生理性低谷，不休息会让下午的注意力和反应速度明显下降。",
        tip: "午休 20–30 分钟，别超过 1 小时。" },
      { label: "🛌 趴桌子睡 40 分钟", good: false,
        effect: { energy: 3, body: -3 },
        fact: "趴睡压迫眼球和手臂神经，醒来容易手麻、视物模糊；超过 30 分钟进入深睡，醒来反而更昏沉。",
        tip: "午休尽量靠着睡、控制时长。" },
      { label: "💺 靠在椅背上小睡 20 分钟", good: true,
        effect: { energy: 10 },
        fact: "20–30 分钟的短睡被称为「能量小睡」，能恢复警觉度和记忆力，又不会进入深睡导致起床困难。" }
    ]
  },
  {
    time: "15:00", sky: "afternoon", emoji: "🧋", title: "下午茶",
    text: "群里有人发起奶茶拼单，还差一杯就免配送费。",
    choices: [
      { label: "🧋 全糖奶茶加料", good: false,
        effect: { diet: -10, mood: 5, energy: 3 },
        fact: "一杯全糖奶茶含糖可达 30–50 g，而每日添加糖建议 < 25 g。血糖快升快降，一小时后会更困。",
        tip: "含糖饮料每周不超过 1 次，选少糖/无糖。" },
      { label: "🍵 白开水或无糖茶", good: true,
        effect: { diet: 5, energy: 2 },
        fact: "成年人每天应饮水 1500–1700 ml（约 7–8 杯）。白开水是最好的饮料——这句话写在《健康素养 66 条》里。" }
    ]
  },
  {
    time: "17:30", sky: "afternoon", emoji: "🏀", title: "放学后",
    text: "操场上有人在打球。你也可以回宿舍躺着。",
    choices: [
      { label: "🛋 回宿舍躺着", good: false,
        effect: { body: -6, mood: -2 },
        fact: "18–30 岁是骨量累积的关键期，缺乏运动会降低一生的「骨本」。健康骨骼 = 运动 + 钙 + 维生素 D + 晒太阳。",
        tip: "每周至少 3 次、每次 30 分钟出汗的运动。" },
      { label: "⛹️ 打球 / 跑步 30 分钟", good: true,
        effect: { body: 12, mood: 8, energy: -3 },
        fact: "跑跳类负重运动能刺激骨骼增加密度，同时促进内啡肽分泌改善情绪——这是最便宜的「抗抑郁药」。" }
    ]
  },
  {
    time: "18:30", sky: "evening", emoji: "🍢", title: "晚餐",
    text: "朋友约你去校外烧烤摊，说「今天我请」。",
    choices: [
      { label: "🍺 烧烤 + 啤酒，吃到撑", good: false,
        effect: { diet: -12, body: -3, energy: -4 },
        fact: "酒精没有「安全饮用量」，烧烤高盐高油且产生苯并芘等致癌物。偶尔聚餐可以，频率和量要控制。",
        tip: "晚餐清淡七分饱，少烧烤、不劝酒。" },
      { label: "🥗 食堂清淡一点，七分饱", good: true,
        effect: { diet: 8, energy: 3 },
        fact: "晚餐吃到七分饱、以蔬菜和优质蛋白为主，有助于控制体重和睡眠质量。" }
    ]
  },
  {
    time: "20:00", sky: "evening", emoji: "🎮", title: "晚上",
    text: "室友开黑三缺一。你还有一份作业没写。",
    choices: [
      { label: "🎮 开黑三小时", good: false,
        effect: { energy: -8, body: -4, mood: 4 },
        fact: "连续用眼超过 1 小时建议遵循「20-20-20」法则：每 20 分钟看 6 米外 20 秒。久坐+用眼是近视与颈椎问题的双重风险。",
        tip: "娱乐屏幕时间每天控制在 2 小时内。" },
      { label: "📚 写完作业，下楼散步 20 分钟", good: true,
        effect: { mood: 4, body: 4, energy: 2 },
        fact: "晚饭后 30 分钟的轻度活动有助于餐后血糖平稳；完成任务带来的掌控感本身就能改善情绪。" }
    ]
  },
  {
    time: "22:30", sky: "night", emoji: "🍗", title: "夜宵诱惑",
    text: "宿舍群：「炸鸡拼单，10 分钟送到。」",
    choices: [
      { label: "🍗 拼一份炸鸡", good: false,
        effect: { diet: -10, energy: -3 },
        fact: "睡前 2–3 小时进食会增加胃食管反流风险、影响睡眠深度；夜宵的热量几乎全部储存为脂肪。",
        tip: "睡前 2–3 小时不进食，饿了喝杯温牛奶。" },
      { label: "🥛 一杯温牛奶，或者不吃", good: true,
        effect: { diet: 4, energy: 2 },
        fact: "牛奶补钙又不增加肠胃负担。如果真的饿，少量低脂高蛋白食物比高油高盐的炸物好得多。" }
    ]
  },
  {
    time: "23:30", sky: "night", emoji: "🌙", title: "该睡了",
    text: "灯关了。手机屏幕在黑暗里格外亮。",
    choices: [
      { label: "📱 关灯刷手机到两点", good: false,
        effect: { energy: -15, mood: -5, body: -3 },
        fact: "屏幕蓝光会抑制褪黑素分泌，推迟入睡；长期睡眠不足与肥胖、免疫力下降、情绪障碍密切相关。成人每天需要 7–8 小时睡眠。",
        tip: "23 点前放下手机，保证 7–8 小时睡眠。" },
      { label: "😴 手机放远，23 点前入睡", good: true,
        effect: { energy: 12, mood: 5, body: 3 },
        fact: "规律充足的睡眠是免疫、记忆巩固和情绪稳定的基础。明天的你，会感谢今晚的决定。" }
    ]
  }
];