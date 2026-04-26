const QUESTIONS_PER_ROUND = 10;
const XP_PER_CORRECT = 20;
const MAX_WRONG = 3;
const MAX_LEVEL = 3;
const STORAGE_KEY = "smartlearn-rpg-save";

const pages = document.querySelectorAll(".page");
const toast = document.getElementById("toast");
const resultOverlay = document.getElementById("resultOverlay");
const questionCard = document.getElementById("questionCard");
const feedbackText = document.getElementById("feedbackText");
const bossPanel = document.getElementById("bossPanel");
const bossHpFill = document.getElementById("bossHpFill");
const bossStatus = document.getElementById("bossStatus");
const bossFace = document.querySelector(".boss-face");

const stageMeta = {
  html: {
    name: "HTML Island",
    mission: "เรียนรู้โครงสร้างเว็บให้แม่นก่อนบุกด่านถัดไป",
    icon: "🏝️",
    boss: "👾"
  },
  css: {
    name: "CSS Castle",
    mission: "ฝึกแต่งหน้าเว็บให้สวยและ responsive แบบนักเวทดีไซน์",
    icon: "🎨",
    boss: "🧙"
  },
  js: {
    name: "JS Dungeon",
    mission: "ท้าดวล logic, DOM และ async ให้ผ่านบอส JavaScript",
    icon: "⚡",
    boss: "🐉"
  }
};

const quizBank = [
  { q: "HTML คืออะไร?", a: ["โครงสร้างเว็บ", "AI", "Database", "Game Engine"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <a> ใช้ทำอะไร?", a: ["สร้างลิงก์", "ใส่รูป", "สร้างหัวข้อ", "สร้างตาราง"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <img> ใช้สำหรับอะไร?", a: ["แสดงรูปภาพ", "สร้างลิงก์", "เล่นเสียง", "เขียน CSS"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <p> มักใช้กับอะไร?", a: ["ย่อหน้า", "ตาราง", "วิดีโอ", "ปุ่มส่งข้อมูล"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <h1> ถึง <h6> ใช้ทำอะไร?", a: ["หัวข้อ", "รายการ", "รูปภาพ", "ลิงก์"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <ul> ใช้สร้างอะไร?", a: ["รายการแบบไม่มีลำดับ", "แบบฟอร์ม", "รูปภาพ", "ส่วนหัว"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <ol> ใช้สร้างอะไร?", a: ["รายการแบบมีลำดับ", "ตาราง", "วิดีโอ", "ลิงก์"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <li> ใช้อยู่ภายในอะไรบ่อยที่สุด?", a: ["รายการ", "รูปภาพ", "ส่วนหัว", "สคริปต์"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <br> ใช้ทำอะไร?", a: ["ขึ้นบรรทัดใหม่", "ใส่รูป", "ทำตัวหนา", "ลบข้อความ"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <strong> มีหน้าที่หลักอะไร?", a: ["เน้นข้อความ", "สร้างปุ่ม", "เล่นเสียง", "เชื่อมไฟล์ CSS"], c: 0, lv: 1, stage: "html" },
  { q: "Attribute href มักใช้กับ tag ไหน?", a: ["<a>", "<img>", "<p>", "<div>"], c: 0, lv: 1, stage: "html" },
  { q: "Attribute src มักใช้กับอะไร?", a: ["ไฟล์ต้นทางของรูปหรือสคริปต์", "สีตัวอักษร", "ขนาดตัวอักษร", "ชื่อคลาส"], c: 0, lv: 1, stage: "html" },
  { q: "Doctype ใน HTML ใช้บอกอะไร?", a: ["ชนิดเอกสาร", "สีพื้นหลัง", "ภาษาโปรแกรม", "ขนาดหน้าจอ"], c: 0, lv: 1, stage: "html" },
  { q: 'lang="th" ใน <html> มีไว้เพื่ออะไร?', a: ["ระบุภาษาหลักของหน้า", "เพิ่มความเร็วเว็บ", "โหลดรูปอัตโนมัติ", "ซ่อนข้อความ"], c: 0, lv: 1, stage: "html" },
  { q: "ส่วน <head> ของ HTML มักเก็บอะไร?", a: ["ข้อมูลตั้งค่าและลิงก์ไฟล์", "เนื้อหาหลักทั้งหมด", "ปุ่มคำตอบ", "คลังรูปภาพ"], c: 0, lv: 1, stage: "html" },
  { q: "ส่วน <body> ของ HTML ใช้ใส่อะไร?", a: ["เนื้อหาที่ผู้ใช้เห็น", "ค่าภาษาเครื่อง", "การตั้งค่าเซิร์ฟเวอร์", "ฐานข้อมูล"], c: 0, lv: 1, stage: "html" },
  { q: "Tag <button> ใช้ทำอะไร?", a: ["สร้างปุ่ม", "สร้างลิงก์", "สร้างหัวข้อ", "ใส่รูป"], c: 0, lv: 1, stage: "html" },
  { q: "placeholder มักใช้กับ element ใด?", a: ["input", "div", "h1", "script"], c: 0, lv: 2, stage: "html" },
  { q: "value ใน input ใช้เก็บอะไร?", a: ["ค่าปัจจุบันของช่องกรอก", "ชื่อคลาส", "สีพื้นหลัง", "ความกว้าง"], c: 0, lv: 2, stage: "html" },
  { q: "ข้อใดคือการเชื่อมไฟล์ CSS ภายนอก?", a: ['<link rel="stylesheet" href="style.css">', '<script src="style.css"></script>', '<style src="style.css"></style>', '<css href="style.css">'], c: 0, lv: 2, stage: "html" },
  { q: "ข้อใดคือการเชื่อมไฟล์ JavaScript ภายนอก?", a: ['<script src="script.js"></script>', '<js href="script.js">', '<link rel="script" href="script.js">', '<script link="script.js"></script>'], c: 0, lv: 2, stage: "html" },

  { q: "CSS ใช้ทำอะไร?", a: ["ตกแต่งเว็บ", "คำนวณ", "Server", "AI"], c: 0, lv: 1, stage: "css" },
  { q: "CSS ย่อมาจากอะไร?", a: ["Cascading Style Sheets", "Creative Style System", "Computer Styled Syntax", "Color Sheet Standard"], c: 0, lv: 1, stage: "css" },
  { q: "การเขียน CSS เพื่อเปลี่ยนสีตัวอักษรใช้ property ใด?", a: ["color", "font-style", "background-image", "align"], c: 0, lv: 1, stage: "css" },
  { q: "การกำหนดพื้นหลังใช้ property ไหน?", a: ["background", "border", "font-weight", "position"], c: 0, lv: 1, stage: "css" },
  { q: "ถ้าต้องการทำตัวอักษรหนาใน CSS ควรใช้?", a: ["font-weight", "font-space", "text-size", "line-style"], c: 0, lv: 1, stage: "css" },
  { q: "ถ้าต้องการเปลี่ยนขนาดตัวอักษรใช้?", a: ["font-size", "text-weight", "letter-gap", "display"], c: 0, lv: 1, stage: "css" },
  { q: "Property ใดใช้ทำขอบมน?", a: ["border-radius", "border-style", "radius-border", "corner-size"], c: 0, lv: 1, stage: "css" },
  { q: "margin ใช้กับอะไร?", a: ["ระยะห่างด้านนอก", "ระยะห่างด้านใน", "ความหนาเส้นขอบ", "ลำดับการซ้อน"], c: 0, lv: 1, stage: "css" },
  { q: "padding ใช้กับอะไร?", a: ["ระยะห่างด้านใน", "ระยะห่างด้านนอก", "ความกว้างหน้าเว็บ", "การซ่อนวัตถุ"], c: 0, lv: 1, stage: "css" },
  { q: "ถ้าต้องการซ่อน element ชั่วคราวแบบไม่แสดงผล ใช้ค่าใด?", a: ["display: none", "opacity: 100", "font-size: 0", "position: auto"], c: 0, lv: 1, stage: "css" },
  { q: "display: block ทำให้ element เป็นแบบไหน?", a: ["ขึ้นบรรทัดใหม่และกินความกว้างได้", "เรียงในบรรทัดเดียวเสมอ", "หายไป", "ลอยซ้ายเสมอ"], c: 0, lv: 1, stage: "css" },
  { q: "display: flex ใช้บ่อยเพื่ออะไร?", a: ["จัด layout", "ลบข้อความ", "โหลดภาพ", "สร้างตัวแปร"], c: 0, lv: 2, stage: "css" },
  { q: "justify-content ใน Flexbox ใช้ควบคุมอะไร?", a: ["การจัดวางตามแกนหลัก", "สีพื้นหลัง", "ความหนาเส้นขอบ", "ชื่อคลาส"], c: 0, lv: 2, stage: "css" },
  { q: "align-items ใน Flexbox ใช้ควบคุมอะไร?", a: ["การจัดวางตามแกนรอง", "ขนาดฟอนต์", "การสุ่มคำถาม", "ความเร็ว animation"], c: 0, lv: 2, stage: "css" },
  { q: "cursor: pointer มักใช้กับอะไร?", a: ["สิ่งที่คลิกได้", "รูปภาพพื้นหลัง", "ตารางข้อมูล", "ตัวแปร"], c: 0, lv: 2, stage: "css" },
  { q: "transition ใน CSS มีไว้ทำอะไร?", a: ["ทำให้การเปลี่ยนค่าดูลื่นขึ้น", "สร้างฐานข้อมูล", "เพิ่ม event click", "โหลดไฟล์ JS"], c: 0, lv: 2, stage: "css" },
  { q: "box-shadow ใช้กับอะไร?", a: ["เงาของกล่อง", "ความกว้างตัวอักษร", "ชนิดลูป", "ตำแหน่งเมาส์"], c: 0, lv: 2, stage: "css" },
  { q: "backdrop-filter: blur() ให้ผลแบบใด?", a: ["เบลอพื้นหลังด้านหลัง element", "ทำให้ข้อความคมขึ้น", "ซ่อนปุ่มทั้งหมด", "สร้างแสงเงา"], c: 0, lv: 2, stage: "css" },
  { q: "@media ใช้ทำอะไรใน CSS?", a: ["กำหนด style ตามขนาดหน้าจอหรือเงื่อนไข", "ฝังวิดีโอ", "สร้างตัวแปร JS", "อ่านค่าจาก API"], c: 0, lv: 3, stage: "css" },
  { q: "Responsive design คืออะไร?", a: ["หน้าเว็บที่ปรับตามขนาดหน้าจอ", "เว็บที่มีรูปเยอะ", "เว็บที่ใช้แต่ JavaScript", "เว็บที่ไม่มี CSS"], c: 0, lv: 3, stage: "css" },
  { q: "min-height: 100vh หมายถึงอะไร?", a: ["ความสูงขั้นต่ำเท่าหน้าจอ", "ความกว้างเต็มจอ", "ตัวอักษรสูง 100px", "ซ่อน overflow"], c: 0, lv: 3, stage: "css" },
  { q: "overflow-x: hidden ใช้ทำอะไร?", a: ["ซ่อนการเลื่อนแนวนอน", "ซ่อนการเลื่อนแนวตั้ง", "ล็อกปุ่มเมาส์", "ปิด animation"], c: 0, lv: 3, stage: "css" },
  { q: "opacity: 0 ทำให้เกิดอะไรขึ้น?", a: ["โปร่งใส", "ตัวอักษรหนา", "ลบ element ออก DOM", "ขึ้นบรรทัดใหม่"], c: 0, lv: 3, stage: "css" },
  { q: "position: fixed มีลักษณะอย่างไร?", a: ["ยึดกับหน้าจอ", "ยึดกับ element แม่เท่านั้น", "ซ่อน element", "จัดให้อยู่กึ่งกลางแนวตั้งเสมอ"], c: 0, lv: 3, stage: "css" },
  { q: "z-index ใช้ควบคุมอะไร?", a: ["ลำดับการซ้อนของ element", "ความกว้าง element", "เวลาหน่วง animation", "สีตัวอักษร"], c: 0, lv: 3, stage: "css" },

  { q: "JavaScript ใช้ทำอะไร?", a: ["ทำเว็บโต้ตอบ", "วาดรูปอย่างเดียว", "พิมพ์เอกสาร", "เก็บไฟล์อย่างเดียว"], c: 0, lv: 1, stage: "js" },
  { q: "DOM คืออะไร?", a: ["โครงสร้างหน้าเว็บที่ JS เข้าถึงได้", "ฐานข้อมูล", "ระบบออกแบบสี", "ชนิดไฟล์ภาพ"], c: 0, lv: 1, stage: "js" },
  { q: "HTTP 404 หมายถึงอะไร?", a: ["ไม่พบหน้า", "สำเร็จ", "สร้างใหม่", "เชื่อมต่อฐานข้อมูล"], c: 0, lv: 1, stage: "js" },
  { q: "คำสั่งใดใช้เลือก element จาก id ใน JavaScript?", a: ["document.getElementById()", "document.getElementsByClass()", "query.id()", "window.findId()"], c: 0, lv: 1, stage: "js" },
  { q: "document.querySelector() ใช้ทำอะไร?", a: ["เลือก element ตัวแรกที่ตรง selector", "เลือกทุกไฟล์ CSS", "บันทึกข้อมูลลง server", "สร้าง event ใหม่"], c: 0, lv: 1, stage: "js" },
  { q: "ถ้าต้องการเปลี่ยนข้อความใน element มักใช้ property ใด?", a: ["innerText", "styleSheet", "src", "href"], c: 0, lv: 1, stage: "js" },
  { q: "Array ใน JavaScript คืออะไร?", a: ["ชุดข้อมูลหลายค่า", "คำสั่งเปลี่ยนสี", "ชนิดของ HTML tag", "ระบบจัด layout"], c: 0, lv: 1, stage: "js" },
  { q: "Object ใน JavaScript มักเก็บข้อมูลแบบใด?", a: ["คู่ key-value", "เฉพาะตัวเลขเท่านั้น", "เฉพาะรูปภาพ", "เฉพาะ CSS"], c: 0, lv: 1, stage: "js" },
  { q: "if ใช้ทำอะไร?", a: ["ตรวจเงื่อนไข", "สร้างลิงก์", "ใส่สีพื้นหลัง", "ลบไฟล์"], c: 0, lv: 1, stage: "js" },
  { q: "else ทำงานเมื่อใด?", a: ["เมื่อเงื่อนไขก่อนหน้าไม่เป็นจริง", "เมื่อเว็บโหลดเสร็จ", "เมื่อมีรูปภาพ", "เมื่อ CSS พัง"], c: 0, lv: 1, stage: "js" },
  { q: "function ใช้ทำอะไร?", a: ["เก็บชุดคำสั่งไว้เรียกใช้", "เปลี่ยนฟอนต์โดยตรง", "สร้างฐานข้อมูล", "เชื่อมอินเทอร์เน็ต"], c: 0, lv: 1, stage: "js" },
  { q: "return ใน function มีไว้ทำอะไร?", a: ["ส่งค่ากลับ", "หยุด CSS", "สร้าง HTML tag", "ลบ event"], c: 0, lv: 1, stage: "js" },
  { q: "onclick ใช้กับอะไร?", a: ["เหตุการณ์ตอนคลิก", "สีปุ่ม", "ขนาดรูป", "ค่าตัวแปรระบบ"], c: 0, lv: 1, stage: "js" },
  { q: "addEventListener ใช้เพื่ออะไร?", a: ["ผูก event กับ element", "คัดลอกไฟล์", "ลบ style ทั้งหมด", "เพิ่มความเร็ว CPU"], c: 0, lv: 2, stage: "js" },
  { q: "classList.add() ใช้ทำอะไร?", a: ["เพิ่ม class ให้ element", "ลบ element", "เปลี่ยน id", "แปลงเป็น array"], c: 0, lv: 2, stage: "js" },
  { q: "classList.remove() ใช้ทำอะไร?", a: ["ลบ class ออกจาก element", "ซ่อนทั้งหน้าเว็บเสมอ", "เปลี่ยนข้อความอัตโนมัติ", "สร้าง CSS ใหม่"], c: 0, lv: 2, stage: "js" },
  { q: "ข้อใดใช้สร้างปุ่มใหม่ด้วย JavaScript?", a: ["document.createElement('button')", "document.newButton()", "button.create()", "append.button()"], c: 0, lv: 2, stage: "js" },
  { q: "appendChild() ใช้ทำอะไร?", a: ["เพิ่ม node เข้าไปใน element", "ลบ node ทั้งหมด", "เปลี่ยนสีพื้นหลัง", "อ่านไฟล์ CSS"], c: 0, lv: 2, stage: "js" },
  { q: "Math.random() ให้ค่าแบบใด?", a: ["ตัวเลขสุ่มระหว่าง 0 ถึงน้อยกว่า 1", "จำนวนเต็ม 1 ถึง 100 เท่านั้น", "ข้อความสุ่ม", "สีสุ่มเสมอ"], c: 0, lv: 2, stage: "js" },
  { q: "setTimeout() ใช้ทำอะไร?", a: ["หน่วงเวลาการทำงาน", "โหลดรูปซ้ำ", "สร้างตาราง", "เปลี่ยนภาษาเว็บ"], c: 0, lv: 2, stage: "js" },
  { q: "console.log() ใช้ทำอะไร?", a: ["แสดงข้อมูลใน console", "สร้าง popup เสมอ", "เปลี่ยนข้อความหน้าเว็บ", "ลบ error"], c: 0, lv: 2, stage: "js" },
  { q: "const ใช้เมื่อใด?", a: ["เมื่อต้องการตัวแปรที่ไม่อยาก reassigned", "เมื่อต้องการลบค่า", "เมื่อทำ CSS", "เมื่อสร้าง tag ใหม่"], c: 0, lv: 2, stage: "js" },
  { q: "Promise ใช้ทำอะไร?", a: ["จัดการงาน async", "ใส่สไตล์", "วาดรูป", "เก็บฟอนต์"], c: 0, lv: 3, stage: "js" },
  { q: "async/await ช่วยเรื่องอะไร?", a: ["เขียน async code ให้อ่านง่ายขึ้น", "เพิ่มความคมของรูป", "จัด Flexbox", "สร้าง HTML อัตโนมัติ"], c: 0, lv: 3, stage: "js" },
  { q: "fetch() ใช้ทำอะไรบ่อย?", a: ["ดึงข้อมูลจาก URL", "สร้าง animation", "เปลี่ยนสีข้อความ", "สร้าง event"], c: 0, lv: 3, stage: "js" },
  { q: "JSON.parse() ใช้ทำอะไร?", a: ["แปลงข้อความ JSON เป็น object", "แปลง object เป็น JSON", "สุ่มคำถาม", "ล้าง localStorage"], c: 0, lv: 3, stage: "js" },
  { q: "JSON.stringify() ใช้ทำอะไร?", a: ["แปลง object เป็นข้อความ JSON", "แปลง CSS เป็น JS", "รวมไฟล์รูป", "สร้าง class"], c: 0, lv: 3, stage: "js" },
  { q: "localStorage ใช้เก็บข้อมูลแบบใด?", a: ["ข้อมูลในเบราว์เซอร์แบบคงอยู่", "ข้อมูลใน RAM ชั่วคราวเท่านั้น", "รูปภาพความละเอียดสูง", "CSS animation"], c: 0, lv: 3, stage: "js" }
];

let xp = 0;
let level = 1;
let combo = 0;

let currentStageKey = null;
let quiz = [];
let currentIndex = 0;
let score = 0;
let wrong = 0;
let lockAnswer = false;
let bossDefeated = false;

const usedQuestionsByStage = {
  html: new Set(),
  css: new Set(),
  js: new Set()
};

function saveProgress() {
  const payload = {
    xp,
    level,
    combo,
    usedQuestionsByStage: {
      html: [...usedQuestionsByStage.html],
      css: [...usedQuestionsByStage.css],
      js: [...usedQuestionsByStage.js]
    }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const data = JSON.parse(raw);
    xp = Number.isFinite(data.xp) ? data.xp : 0;
    level = Number.isFinite(data.level) ? data.level : 1;
    combo = Number.isFinite(data.combo) ? data.combo : 0;

    if (data.usedQuestionsByStage) {
      usedQuestionsByStage.html = new Set(data.usedQuestionsByStage.html || []);
      usedQuestionsByStage.css = new Set(data.usedQuestionsByStage.css || []);
      usedQuestionsByStage.js = new Set(data.usedQuestionsByStage.js || []);
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function showPage(id) {
  pages.forEach((page) => page.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function shuffle(list) {
  const cloned = [...list];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function shuffleAnswers(question) {
  const answers = question.a.map((text, index) => ({
    text,
    isCorrect: index === question.c
  }));
  const shuffledAnswers = shuffle(answers);

  return {
    ...question,
    a: shuffledAnswers.map((item) => item.text),
    c: shuffledAnswers.findIndex((item) => item.isCorrect)
  };
}

function getEligibleQuestions(currentLevel) {
  return quizBank.filter(
    (item) => item.stage === currentStageKey && item.lv <= Math.min(currentLevel + 1, MAX_LEVEL)
  );
}

function getQuizForLevel(currentLevel) {
  const eligibleQuestions = getEligibleQuestions(currentLevel);
  let usedQuestions = usedQuestionsByStage[currentStageKey];
  let remainingQuestions = eligibleQuestions.filter((item) => !usedQuestions.has(item.q));

  if (remainingQuestions.length < QUESTIONS_PER_ROUND) {
    usedQuestionsByStage[currentStageKey] = new Set();
    usedQuestions = usedQuestionsByStage[currentStageKey];
    remainingQuestions = [...eligibleQuestions];
  }

  const selectedQuestions = shuffle(remainingQuestions).slice(
    0,
    Math.min(QUESTIONS_PER_ROUND, remainingQuestions.length)
  );

  selectedQuestions.forEach((item) => usedQuestions.add(item.q));
  saveProgress();
  return selectedQuestions.map(shuffleAnswers);
}

function updateHud() {
  document.getElementById("xp").innerText = xp;
  document.getElementById("level").innerText = level;
  document.getElementById("combo").innerText = `x${combo}`;
  document.getElementById("xpFill").style.width = `${xp}%`;
}

function updateBattleHud() {
  document.getElementById("progressText").innerText = `${Math.min(currentIndex + 1, quiz.length)}/${quiz.length || QUESTIONS_PER_ROUND}`;
  document.getElementById("livesText").innerText = `${Math.max(0, MAX_WRONG - wrong)}`;
  document.getElementById("scoreText").innerText = `${score}`;
}

function updateBossHud() {
  const totalSteps = quiz.length || QUESTIONS_PER_ROUND;
  const bossHealth = Math.max(0, 100 - (score/ totalSteps) * 100);
  bossHpFill.style.width = `${bossHealth}%`;

  if (wrong >= MAX_WRONG - 1) {
    bossStatus.innerText = "Boss enraged! ระวังพลาดอีกไม่ได้";
  } else if (currentIndex >= totalSteps - 2) {
    bossStatus.innerText = "Boss ใกล้แตกแล้ว ลุยต่ออีกนิด";
  } else {
    bossStatus.innerText = `Boss HP ${Math.round(bossHealth)}%`;
  }
}

function setFeedback(message, type = "") {
  feedbackText.className = "feedback-text";
  if (type) {
    feedbackText.classList.add(type);
  }
  feedbackText.innerText = message;
}

function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function pulseQuestionCard(className) {
  questionCard.classList.remove("correct-hit", "wrong-hit");
  void questionCard.offsetWidth;
  questionCard.classList.add(className);
  clearTimeout(pulseQuestionCard.timer);
  pulseQuestionCard.timer = setTimeout(() => {
    questionCard.classList.remove(className);
  }, 420);
}

function triggerLevelUpEffect() {
  document.body.classList.add("level-up-flash");
  clearTimeout(triggerLevelUpEffect.timer);
  triggerLevelUpEffect.timer = setTimeout(() => {
    document.body.classList.remove("level-up-flash");
  }, 820);
}

function triggerWrongEffect() {
  document.body.classList.add("screen-shake");
  clearTimeout(triggerWrongEffect.timer);
  triggerWrongEffect.timer = setTimeout(() => {
    document.body.classList.remove("screen-shake");
  }, 320);
}

function resetBossState() {
  bossDefeated = false;
  bossPanel.classList.remove("is-danger", "is-defeated", "is-winning");
  bossHpFill.style.width = "100%";
  bossStatus.innerText = "Boss is waiting...";
  if (currentStageKey) {
    bossFace.innerText = stageMeta[currentStageKey].boss;
  }
}

function triggerBossDamage() {
  bossPanel.classList.remove("is-danger");
  bossPanel.classList.add("is-winning");
  clearTimeout(triggerBossDamage.timer);
  triggerBossDamage.timer = setTimeout(() => {
    bossPanel.classList.remove("is-winning");
  }, 300);
}

function triggerBossEnrage() {
  bossPanel.classList.add("is-danger");
  clearTimeout(triggerBossEnrage.timer);
  triggerBossEnrage.timer = setTimeout(() => {
    bossPanel.classList.remove("is-danger");
  }, 320);
}

function playBossDefeat() {
  bossDefeated = true;
  bossPanel.classList.remove("is-danger", "is-winning");
  bossPanel.classList.add("is-defeated");
  bossHpFill.style.width = "0%";
  bossFace.innerText = "💀";
  bossStatus.innerText = "Boss defeated!";
}

function gainXp(amount) {
  xp += amount;
  let didLevelUp = false;

  while (xp >= 100) {
    xp -= 100;
    level += 1;
    didLevelUp = true;
  }

  updateHud();
  saveProgress();

  if (didLevelUp) {
    setFeedback(`LEVEL UP! ตอนนี้คุณอยู่เลเวล ${level}`, "levelup");
    showToast(`LEVEL UP! คุณขึ้นเลเวล ${level}`);
    triggerLevelUpEffect();
  }
}

function startStage(name) {
  currentStageKey = name;
  const stage = stageMeta[name];

  document.getElementById("stageIcon").innerText = stage.icon;
  document.getElementById("stageTitle").innerText = stage.name;
  document.getElementById("missionText").innerText = stage.mission;
  document.getElementById("battleStageName").innerText = stage.name;
  bossFace.innerText = stage.boss;
  resultOverlay.classList.add("hidden");
  showPage("mission");
}

function startQuiz() {
  quiz = getQuizForLevel(level);
  currentIndex = 0;
  score = 0;
  wrong = 0;
  combo = 0;
  lockAnswer = false;
  resetBossState();
  updateHud();
  updateBattleHud();
  updateBossHud();
  resultOverlay.classList.add("hidden");

  if (quiz.length === 0) {
    document.getElementById("question").innerText = "ยังไม่มีคำถามสำหรับด่านนี้";
    document.getElementById("difficultyText").innerText = "No Data";
    document.getElementById("answers").innerHTML = "";
    setFeedback("กลับไปเลือกด่านอื่นก่อนได้เลย");
    showPage("quiz");
    return;
  }

  showPage("quiz");
  renderQuestion();
}

function renderQuestion() {
  if (wrong >= MAX_WRONG) {
    endGame(false);
    return;
  }

  if (currentIndex >= quiz.length) {
    endGame(true);
    return;
  }

  lockAnswer = false;
  const currentQuestion = quiz[currentIndex];
  document.getElementById("question").innerText = currentQuestion.q;
  document.getElementById("difficultyText").innerText = `Lv.${currentQuestion.lv} Challenge`;
  updateBattleHud();
  updateBossHud();
  setFeedback(combo >= 2 ? `Combo x${combo} กำลังติดเครื่อง` : "พร้อมลุยแล้ว เลือกคำตอบได้เลย");

  const answersEl = document.getElementById("answers");
  answersEl.innerHTML = "";

  currentQuestion.a.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.innerText = choice;
    button.addEventListener("click", () => handleAnswer(index, button));
    answersEl.appendChild(button);
  });
}

function handleAnswer(selectedIndex, selectedButton) {
  if (lockAnswer) {
    return;
  }

  lockAnswer = true;
  const currentQuestion = quiz[currentIndex];
  const answerButtons = [...document.querySelectorAll(".answer-btn")];
  const isCorrect = selectedIndex === currentQuestion.c;

  answerButtons.forEach((button, index) => {
    button.disabled = true;
    if (index === currentQuestion.c) {
      button.classList.add("is-correct");
    } else if (button === selectedButton && !isCorrect) {
      button.classList.add("is-wrong");
    } else {
      button.classList.add("is-dimmed");
    }
  });

  if (isCorrect) {
    score += 1;
    combo += 1;
    const bonusXp = combo >= 3 ? 10 : 0;
    gainXp(XP_PER_CORRECT + bonusXp);
    setFeedback(
      bonusXp > 0
        ? `ตอบถูก! COMBO x${combo} รับ ${XP_PER_CORRECT + bonusXp} XP`
        : `ตอบถูก! รับ ${XP_PER_CORRECT} XP`,
      "success"
    );
    showToast(combo >= 3 ? `Perfect Chain x${combo}` : "Correct +20 XP");
    pulseQuestionCard("correct-hit");
    triggerBossDamage();
  } else {
    wrong += 1;
    combo = 0;
    updateHud();
    saveProgress();
    setFeedback(`ยังไม่ใช่ ข้อผิดพลาด ${wrong}/${MAX_WRONG}`, "error");
    showToast("Miss! ลองใหม่ข้อถัดไป");
    pulseQuestionCard("wrong-hit");
    triggerWrongEffect();
    triggerBossEnrage();
  }

  updateBattleHud();
  updateBossHud();

  setTimeout(() => {
    currentIndex += 1;
    renderQuestion();
  }, 850);
}

function endGame(win) {
  if (win && !bossDefeated) {
    playBossDefeat();
    setTimeout(() => endGame(true), 950);
    return;
  }

  const percent = quiz.length ? score / quiz.length : 0;
  let rank = "FAILED";

  if (win) {
    if (percent >= 0.9) {
      rank = "S RANK";
    } else if (percent >= 0.7) {
      rank = "A RANK";
    } else if (percent >= 0.5) {
      rank = "B RANK";
    } else {
      rank = "C RANK";
    }
  }

  const stage = stageMeta[currentStageKey];
  const questionsLeft = getEligibleQuestions(level).length - usedQuestionsByStage[currentStageKey].size;

  document.getElementById("resultEyebrow").innerText = win ? "Quest Cleared" : "Mission Failed";
  document.getElementById("resultTitle").innerText = win ? "BOSS CLEAR!" : "GAME OVER";
  document.getElementById("resultRank").innerText = rank;
  document.getElementById("resultScore").innerText = `${score}/${quiz.length}`;
  document.getElementById("resultWrong").innerText = `${wrong}/${MAX_WRONG}`;
  document.getElementById("resultStage").innerText = stage.name;
  document.getElementById("resultLeft").innerText = `${Math.max(0, questionsLeft)} Questions`;

  resultOverlay.classList.remove("hidden");
  setFeedback(win ? `จบด่าน ${stage.name} แล้ว ลองทำ S RANK ดูได้เลย` : "พลาดครบ 3 ครั้งแล้ว ลองรีแมตช์อีกรอบ");
}

document.querySelectorAll("[data-stage]").forEach((button) => {
  button.addEventListener("click", () => startStage(button.dataset.stage));
});

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    resultOverlay.classList.add("hidden");
    showPage(button.dataset.page);
  });
});

document.getElementById("battleBtn").addEventListener("click", startQuiz);
document.getElementById("retryBtn").addEventListener("click", () => {
  resultOverlay.classList.add("hidden");
  startQuiz();
});

loadProgress();
updateHud();
