const side=document.querySelector('#side'), msgs=document.querySelector('#messages'), welcome=document.querySelector('#welcome'), input=document.querySelector('#input');
const sessionId=crypto.randomUUID();
document.querySelector('#collapse').onclick=()=>side.classList.toggle('collapsed');
document.querySelector('#menu').onclick=()=>side.classList.toggle('open');
document.querySelector('#new').onclick=()=>{msgs.innerHTML='';welcome.hidden=false;input.focus()};
document.querySelector('#mic').onclick=()=>alert('O botão de voz já está na interface. A conversa por voz em tempo real entra na próxima etapa.');
function add(text,who){welcome.hidden=true;const d=document.createElement('div');d.className='msg '+who;d.textContent=text;msgs.append(d);msgs.scrollTop=msgs.scrollHeight;return d}
document.querySelector('#form').onsubmit=async e=>{e.preventDefault();const text=input.value.trim();if(!text)return;input.value='';add(text,'user');const wait=add('Pensando…','ai');try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,sessionId})});const j=await r.json();wait.textContent=j.reply||('Erro: '+j.error)}catch{wait.textContent='Não consegui conectar ao servidor.'}};
