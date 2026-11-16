(function(){'use strict';
const copy={"en": {"badge": "Closed beta · 15 testers", "title": "Momo & Bibi need you!", "description": "Join our closed beta adventure! Free game codes for 15 selected testers.", "note": "For parents & guardians · Android. Selection isn’t guaranteed. Codes and testing instructions are sent by email.", "cta": "Count me in!", "later": "Maybe later — I’ll keep exploring", "reopen": "Join the beta · 15 testers", "close": "Close"}, "es": {"badge": "Beta cerrada · 15 participantes", "title": "¡Momo y Bibi te necesitan!", "description": "¡Únete a nuestra beta cerrada! Códigos gratis para 15 participantes seleccionados.", "note": "La inscripción es gratuita y no garantiza un código. Enviaremos a los seleccionados su código e instrucciones. Esta oferta está limitada a 15 participantes.", "cta": "¡Me apunto!", "later": "Quizás después — seguiré explorando", "reopen": "Únete a la beta · 15 participantes", "close": "Cerrar"}, "th": {"badge": "ทดสอบเบต้าแบบปิด · 15 คน", "title": "โมโม่กับบิบิต้องการคุณ!", "description": "ร่วมผจญภัยในเบต้าแบบปิด! โค้ดเกมฟรีสำหรับผู้ทดสอบที่ได้รับเลือก 15 คน", "note": "ลงทะเบียนฟรี แต่ไม่รับประกันว่าจะได้รับโค้ด เราจะส่งโค้ดและวิธีทดสอบทางอีเมลให้ผู้ที่ได้รับเลือก ข้อเสนอนี้จำกัดผู้ทดสอบ 15 คน", "cta": "ร่วมด้วย!", "later": "ไว้ก่อนนะ — ขอสำรวจต่อ", "reopen": "ร่วมทดสอบเบต้า · 15 คน", "close": "ปิด"}, "zh-CN": {"badge": "封闭测试 · 限 15 人", "title": "Momo 和 Bibi 需要你！", "description": "加入封闭测试冒险！15 名获选测试者可获得免费游戏兑换码。", "note": "报名免费，但不保证获得兑换码。我们将向获选者发送兑换码和测试说明。本次活动限 15 名测试者。", "cta": "算我一个！", "later": "以后再说 — 我想继续探索", "reopen": "加入测试 · 限 15 人", "close": "关闭"}};
const dialog=document.getElementById('beta-dialog');
const reopen=document.getElementById('beta-reopen');
const picker=document.getElementById('site-language');
let previousFocus;
function translate(){const language=document.documentElement.lang;const strings=copy[language]||copy.en;document.querySelectorAll('[data-beta]').forEach(el=>{el.textContent=strings[el.dataset.beta];});dialog.querySelector('.beta-close').setAttribute('aria-label',strings.close);}
function remember(){try{sessionStorage.setItem('momo-beta-invite-seen','1');}catch(_){}}
function open(){if(dialog.open)return;translate();previousFocus=document.activeElement;dialog.showModal();document.body.classList.add('beta-open');remember();}
dialog.querySelectorAll('[data-beta-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('close',()=>{document.body.classList.remove('beta-open');if(previousFocus&&previousFocus.isConnected)previousFocus.focus();});
reopen.addEventListener('click',open);
if(picker)picker.addEventListener('change',translate);
translate();
let seen=false;try{seen=sessionStorage.getItem('momo-beta-invite-seen')==='1';}catch(_){}
if(!seen)setTimeout(open,1800);
})();

