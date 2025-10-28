const sample = {
units:[{id:'u1',name:'Unidade Centro'},{id:'u2',name:'Unidade Norte'}],
categories:['Programação','Ficção','História','Ciências'],
works:[
{id:'w1',title:'Programação em JavaScript',authors:['Alex Silva'],isbn:'9788575221234',year:2020,cover:'JS',status:'available',unit:'u1',desc:'Uma introdução prática à programação com JavaScript.'},
{id:'w2',title:'Histórias do Mundo',authors:['Maria Souza'],isbn:'9788575229999',year:2015,cover:'HM',status:'loaned',unit:'u2',desc:'Coletânea de histórias históricas e curiosas.'},
{id:'w3',title:'Algoritmos e Lógica',authors:['Paulo T.'],isbn:'9788575220001',year:2019,cover:'AL',status:'available',unit:'u1',desc:'Conceitos fundamentais de algoritmos.'}
],
user:{id:'me',name:'Visitante',loans:[]}
}


// Init
document.getElementById('year').textContent = new Date().getFullYear();
const cCat = document.getElementById('filterCategory'); sample.categories.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;cCat.appendChild(o)})
const cUnit = document.getElementById('filterUnit'); sample.units.forEach(u=>{const o=document.createElement('option');o.value=u.id;o.textContent=u.name;cUnit.appendChild(o)})
const cYear = document.getElementById('filterYear'); [2025,2024,2020,2019,2018,2015].forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;cYear.appendChild(o)})


function renderCatalog(){
const q = (document.getElementById('searchInput').value||'').toLowerCase();
const avail = document.getElementById('filterAvailability').value;
let list = sample.works.filter(w=>{
if(q && !(w.title.toLowerCase().includes(q)||w.authors.join(' ').toLowerCase().includes(q)||w.isbn.includes(q))) return false;
if(avail!=='all' && w.status!==avail) return false;
return true;
})
const el = document.getElementById('catalog'); el.innerHTML='';
document.getElementById('resultCount').textContent = list.length;
list.forEach(w=>{
const b = document.createElement('div'); b.className='book'; b.onclick = ()=>openItem(w.id);
b.innerHTML = `<div class="cover">${w.cover}</div><div class="meta"><h4>${w.title}</h4><p>${w.authors.join(', ')} • ${w.year}</p></div><div><span class="badge ${w.status==='available'?'available':'loaned'}">${w.status==='available'?'Disponível':'Emprestado'}</span></div>`;
el.appendChild(b);
})
}
renderCatalog();


function openItem(id){
const w = sample.works.find(x=>x.id===id);
document.getElementById('itemCard').classList.remove('hidden');
document.getElementById('itemCover').textContent = w.cover;
document.getElementById('itemTitle').textContent = w.title;
document.getElementById('itemAuthors').textContent = w.authors.join(', ');
document.getElementById('itemDescription').textContent = w.desc;
document.getElementById('itemStatus').textContent = w.status==='available'?'Disponível':'Emprestado';
const copies = document.getElementById('itemCopies'); copies.innerHTML = `<div class="small">ISBN: ${w.isbn}</div><div class="small">Unidade: ${sample.units.find(u=>u.id===w.unit).name}</div>`;
window.scrollTo({top:200,behavior:'smooth'});
window._selectedWork = w;
}


function reserveSelected(){
const w = window._selectedWork; if(!w){alert('Selecione um item primeiro.');return}
alert('Reserva criada para: '+w.title+' (simulação)');
}


function navigate(screen){
// simple router: show/hide sections in #screens
const screens = {login:'loginScreen',signup:'signupScreen',dashboard:'dashboardScreen',balcao:'balcaoScreen',admin:'adminScreen',super:'superScreen'};
if(!screens[screen]){document.getElementById('itemCard').classList.remove('hidden');window.scrollTo({top:0});return}
// show appropriate
document.getElementById('itemCard').classList.add('hidden');
Object.values(screens).forEach(id=>document.getElementById(id).classList.add('hidden'));
document.getElementById(screens[screen]).classList.remove('hidden');
window.scrollTo({top:180});
}


function fakeLogin(){
sample.user.name = document.getElementById('loginEmail').value || 'Usuário';
alert('Logado como '+sample.user.name+' (simulação)');
navigate('dashboard');
// populate loans example
const tbody = document.getElementById('userLoans'); tbody.innerHTML = '';
const tr = document.createElement('tr'); tr.innerHTML = `<td>Programação em JavaScript</td><td>2025-11-10</td><td><span class="badge available">Ativo</span></td>`; tbody.appendChild(tr);
}
function fakeSignup(){alert('Conta criada (simulação). Faça login.');navigate('login')}


function quickSearch(e){ if(e.key!=='Enter') return; const q=e.target.value.toLowerCase(); const r = sample.works.find(w=>w.isbn.includes(q)||w.title.toLowerCase().includes(q)); document.getElementById('quickResult').textContent = r?`Encontrado: ${r.title} (${r.isbn})`:'Nenhum resultado'; }


function doLoan(){ alert('Empréstimo registrado (simulação). Comprovante pronto para impressão.'); }
function doReturn(){ alert('Devolução registrada (simulação).'); }
function openManage(section){ alert('Abrindo gerência: '+section+' (simulação).') }
function applyBranding(){ const c = document.getElementById('sysColor').value||'#2b6cb0'; document.documentElement.style.setProperty('--brand',c); }


// small helper to export labels / receipt example (print)
function printReceipt(html){ const w = window.open('','_blank'); w.document.write('<html><head><title>Comprovante</title></head><body>'+html+'</body></html>'); w.document.close(); w.print(); }


// expose some functions for testing in console
window.renderCatalog = renderCatalog; window.openItem = openItem; window.navigate=navigate;