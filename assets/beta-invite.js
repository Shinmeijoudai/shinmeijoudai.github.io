(function(){'use strict';
const copy={"en":{"badge":"Closed beta · 15 testers","title":"Help Momo test her next adventure!","description":"Parents and guardians: register your interest in testing Momo Math Island or Momo Puzzle World on Android. Up to 15 selected testers will receive a free game promo code by email.","note":"Registration is free. A code is not guaranteed. We will email selected testers with their code and testing instructions. Promo codes are limited to this 15-tester offer.","cta":"Register for beta testing","later":"Maybe later","reopen":"Join the beta · 15 testers","close":"Close"},"es":{"badge":"Beta cerrada · 15 participantes","title":"¡Ayuda a Momo a probar su próxima aventura!","description":"Madres, padres y tutores: inscríbanse para probar Momo Math Island o Momo Puzzle World en Android. Hasta 15 participantes seleccionados recibirán por correo un código promocional gratuito para un juego.","note":"La inscripción es gratuita y no garantiza un código. Enviaremos a los seleccionados su código e instrucciones. Esta oferta está limitada a 15 participantes.","cta":"Inscribirse en la beta","later":"Quizás después","reopen":"Únete a la beta · 15 participantes","close":"Cerrar"},"th":{"badge":"ทดสอบเบต้าแบบปิด · 15 คน","title":"มาช่วยโมโม่ทดสอบการผจญภัยครั้งใหม่!","description":"ผู้ปกครองลงทะเบียนแสดงความสนใจทดสอบ Momo Math Island หรือ Momo Puzzle World บน Android ผู้ทดสอบที่ได้รับเลือกสูงสุด 15 คนจะได้รับโค้ดเกมฟรีทางอีเมล","note":"ลงทะเบียนฟรี แต่ไม่รับประกันว่าจะได้รับโค้ด เราจะส่งโค้ดและวิธีทดสอบทางอีเมลให้ผู้ที่ได้รับเลือก ข้อเสนอนี้จำกัดผู้ทดสอบ 15 คน","cta":"ลงทะเบียนทดสอบเบต้า","later":"ไว้ก่อนนะ","reopen":"ร่วมทดสอบเบต้า · 15 คน","close":"ปิด"},"zh-CN":{"badge":"封闭测试 · 限 15 人","title":"帮助 Momo 测试下一场冒险！","description":"欢迎家长和监护人报名，在 Android 上测试 Momo Math Island 或 Momo Puzzle World。最多 15 名获选测试者将通过电子邮件收到免费游戏兑换码。","note":"报名免费，但不保证获得兑换码。我们将向获选者发送兑换码和测试说明。本次活动限 15 名测试者。","cta":"报名参加测试","later":"以后再说","reopen":"加入测试 · 限 15 人","close":"关闭"}};
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
