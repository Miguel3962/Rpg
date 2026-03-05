// ================= STATUS =================
let monstroDano = 5;
let nivel = 1;
let xp = 0;
let xpMax = 100;
let monstrosDerrotados = 0;
let batalhaAtiva = false;

let forca = 5;
let inteligencia = 5;
let carisma = 5;
let ouro = 0;

let energia = 100;
let energiaMax = 100;

let vidaJogador = 100;
let vidaJogadorMax = 100;

let inventario = [];
let pets = [];
let itensConsumiveis = [];



// ================= MONSTRO =================
let monstroVida = 0;
let monstroVidaMax = 0;
let monstroNome = "";

// ================= MONSTRO =================
// (suas coisas de monstro aqui)


// ================= DROP BOSS =================
function dropBoss(){

let chance = Math.random()*100;

// 👑 COROA DAS TREVAS
if(chance <= 5){

let item = {
nome:"👑 Coroa das Trevas",
tipo:"all",
valor:3
};

inventario.push(item);

forca += 3;
inteligencia += 3;
carisma += 3;

narrar("🔥 DROP LENDÁRIO! Coroa das Trevas obtida!");

}

else if(chance <= 30){

let item = {
nome:"🗡 Espada Sombria",
tipo:"forca",
valor:5
};

inventario.push(item);
forca += 5;

narrar("⚔ DROP RARO! Espada Sombria obtida!");

}

else{
narrar("💨 O Boss não dropou item...");
}

atualizarMochila();
atualizarInventario();
atualizarTela();
salvarJogo();
}

// ================= LOJA =================
let lojaHoje = [];
let dataLoja = "";

// ================= SAVE =================
function salvarJogo(){
localStorage.setItem("vidaRPG", JSON.stringify({
nivel,xp,xpMax,
forca,inteligencia,carisma,
ouro,energia,vidaJogador,
inventario,pets,itensConsumiveis
}));
}

function carregarJogo(){
let dados = JSON.parse(localStorage.getItem("vidaRPG"));
if(!dados) return;

nivel = dados.nivel;
xp = dados.xp;
xpMax = dados.xpMax;
forca = dados.forca;
inteligencia = dados.inteligencia;
carisma = dados.carisma;
ouro = dados.ouro;
energia = dados.energia;
vidaJogador = dados.vidaJogador;
inventario = dados.inventario || [];
pets = dados.pets || [];
itensConsumiveis = dados.itensConsumiveis || [];
forca = Math.max(1, forca);
inteligencia = Math.max(1, inteligencia);
carisma = Math.max(1, carisma);
}

// ================= TELAS =================
function abrirTela(id){
document.querySelectorAll(".tela")
.forEach(t => t.classList.remove("ativa"));
document.getElementById(id).classList.add("ativa");
}

function gerarLojaFixa(){

let div = document.getElementById("lojaFixa");

div.innerHTML = `

<div class="loja-item">

<div>
<div class="loja-nome">❤️ Poção de Vida</div>
<div class="loja-preco">35 ouro</div>
</div>

<button class="btn-comprar" onclick="comprarItemFixo('vida')">
Comprar
</button>

</div>


<div class="loja-item">

<div>
<div class="loja-nome">⚡ Poção de Energia</div>
<div class="loja-preco">35 ouro</div>
</div>

<button class="btn-comprar" onclick="comprarItemFixo('energia')">
Comprar
</button>

</div>

`;

}
function mostrarMensagem(texto){

let msg = document.getElementById("mensagemCompra");

msg.innerText = texto;

msg.classList.add("mostrar");

setTimeout(()=>{
msg.classList.remove("mostrar");
},2000);

}
function comprarItemFixo(tipo){
if(ouro < 35){
alert("Ouro insuficiente!");
return;
}

ouro -= 35;

let item = {};

if(tipo === "vida"){

item = {
nome:"❤️ Poção de Vida",
tipo:"cura",
valor:40
};

}

if(tipo === "energia"){

item = {
nome:"⚡ Poção de Energia",
tipo:"energia",
valor:40
};

}

itensConsumiveis.push(item);

mostrarMensagem("🛒 Você comprou " + item.nome + "!");
atualizarBolsa();
atualizarTela();

}
// ================= LEVEL =================
function verificarLevelUp(){

if(xp >= xpMax){

xp -= xpMax;
nivel++;
xpMax += 50;

narrar("👑 LEVEL UP!");

atualizarRanking();

}

}

// ================= MONSTRO =================
function gerarMonstro(){

// se já tiver monstro vivo
if(monstroVida > 0){
narrar("⚔ Termine o combate atual!");
return;
}

// dificuldade
let dificuldade = Math.floor(monstrosDerrotados / 5);

let monstrosBase = [

{nome:"Slime",vida:30,dano:3,imagem:"imagem/Slime.png"},
{nome:"Goblin",vida:50,dano:6,imagem:"imagem/Goblin.png"},
{nome:"Orc",vida:80,dano:10,imagem:"imagem/GoblinG.png"},
{nome:"Cavaleiro Sombrio",vida:130,dano:15,imagem:"imagem/Soldado.png"},
{nome:"Dragão Jovem",vida:200,dano:25,imagem:"imagem/DragaoMal.png"}

];

// boss
if((monstrosDerrotados + 1) % 10 === 0){

monstroNome = "👑 BOSS - Senhor das Trevas";
monstroVidaMax = 400 + monstrosDerrotados * 5;
monstroVida = monstroVidaMax;
monstroDano = 35;

document.getElementById("imgMonstro").src = "Boss.png";

narrar("🔥 Um BOSS apareceu!");

}else{

let tier = Math.min(dificuldade, monstrosBase.length - 1);
let m = monstrosBase[tier];

monstroNome = m.nome;
monstroVidaMax = m.vida + dificuldade * 20;
monstroVida = monstroVidaMax;
monstroDano = m.dano + dificuldade * 3;

document.getElementById("imgMonstro").src = m.imagem;

narrar("👀 Um " + monstroNome + " apareceu!");
}

document.getElementById("monstroNome").innerText = monstroNome;

batalhaAtiva = true;

atualizarMonstro();
}

function atualizarRanking(){

let titulo = "🌱 Novato";

if(nivel >= 5) titulo = "🌟 Aventureiro";
if(nivel >= 10) titulo = "🗡 Guerreiro";
if(nivel >= 20) titulo = "⚔ Cavaleiro";
if(nivel >= 35) titulo = "🛡 Campeão";
if(nivel >= 50) titulo = "👑 Lenda";
if(nivel >= 75) titulo = "⚡ Mito";
if(nivel >= 100) titulo = "🔥 Deus da Guerra";

document.getElementById("nome").innerText = titulo;
}
function atacar(){

if(monstroVida <= 0){
narrar("⚠ Procure um monstro primeiro.");
return;
}

// verificar energia
if(energia < 5){
narrar("⚡ Sem energia!");
return;
}

energia -= 5;

// ===== DANO DO JOGADOR =====

let dano = Math.floor(forca * 4 + Math.random() * 6);

monstroVida -= dano;

if(monstroVida < 0) monstroVida = 0;

narrar("⚔ Você causou " + dano + " de dano.");

// ===== MONSTRO MORREU =====

if(monstroVida <= 0){

batalhaAtiva = false;

monstrosDerrotados++;

let ouroGanho = 20 + Math.floor(Math.random()*20);
let xpGanho = 30;

ouro += ouroGanho;
xp += xpGanho;

narrar("🏆 Monstro derrotado!");
narrar("💰 +" + ouroGanho + " ouro");
narrar("✨ +" + xpGanho + " XP");

if(monstroNome.includes("BOSS")){

dropBoss();

// reinicia ciclo
monstrosDerrotados = 0;

narrar("🌍 O mundo foi purificado! Novos monstros surgirão.");

}

// limpar monstro
monstroVida = 0;
monstroVidaMax = 0;
monstroNome = "";

document.getElementById("imgMonstro").src = "";
document.getElementById("monstroNome").innerText = "Nenhum monstro";

verificarLevelUp();

atualizarTela();
atualizarMonstro();

return;
}

// ===== ATAQUE DO MONSTRO =====

let danoRecebido = Math.floor(monstroDano + Math.random()*5);

vidaJogador -= danoRecebido;

narrar("🩸 Você recebeu " + danoRecebido + " de dano.");

// ===== JOGADOR MORREU =====

if(vidaJogador <= 0){

narrar("💀 Você morreu...");

vidaJogador = vidaJogadorMax;

// reinicia ciclo de monstros
monstrosDerrotados = 0;

// encerra batalha
batalhaAtiva = false;

monstroVida = 0;
monstroVidaMax = 0;
monstroNome = "";

document.getElementById("imgMonstro").src = "";
document.getElementById("monstroNome").innerText = "Nenhum monstro";

ouro = Math.max(0, ouro - 30);

narrar("💰 Perdeu 30 ouro.");
narrar("🔄 A aventura recomeçou.");

atualizarTela();
atualizarMonstro();

return;
}

// atualizar interface
atualizarTela();
atualizarMonstro();

}
// ================= LOJA =================
function gerarLoja(){

let hoje = new Date().toDateString();

let lojaSalva = JSON.parse(localStorage.getItem("lojaDia"));

if(lojaSalva && lojaSalva.data === hoje){

lojaHoje = lojaSalva.itens;
mostrarLoja();
return;

}

let itens = [

{nome:"Espada +2 Força", nomeLimpo:"Espada", tipo:"forca", valor:2, preco:50},
{nome:"Livro +2 Inteligência", nomeLimpo:"Livro", tipo:"inteligencia", valor:2, preco:50},
{nome:"Anel +2 Carisma", nomeLimpo:"Anel", tipo:"carisma", valor:2, preco:50}

];

lojaHoje = [];

for(let i=0;i<3;i++){

let item = {...itens[Math.floor(Math.random()*itens.length)]};

item.qtd = Math.floor(Math.random()*5) + 1;


lojaHoje.push(item);

}

localStorage.setItem("lojaDia",
JSON.stringify({
data:hoje,
itens:lojaHoje
}));

mostrarLoja();
}

function mostrarLoja(){

let div = document.getElementById("itensLoja");
div.innerHTML = "";

lojaHoje.forEach((item,index)=>{

div.innerHTML += `
<div class="loja-item">

<div>
<div class="loja-nome">${item.nome} (x${item.qtd})</div>
<div class="loja-preco">${item.preco} ouro</div>
</div>

<button class="btn-comprar" onclick="comprarItem(${index})">
Comprar
</button>

</div>
`;

});

}

function comprarItem(index){

let item = lojaHoje[index];
mostrarMensagem("🛒 Você comprou " + item.nome + "!");

if(ouro < item.preco){
alert("❌ Ouro insuficiente!");
return;
}

ouro -= item.preco;

if(item.tipo === "cura"){

itensConsumiveis.push({
nome:item.nomeLimpo,
tipo:item.tipo,
valor:item.valor
});

}else{

inventario.push({
nome:item.nomeLimpo,
tipo:item.tipo,
valor:item.valor
});

// 🔥 aplica buff corretamente
switch(item.tipo){

case "forca":
forca += Number(item.valor);
break;

case "inteligencia":
inteligencia += Number(item.valor);
break;

case "carisma":
carisma += Number(item.valor);
break;
}

narrar("⚔ Equipou "+item.nome);
}
item.qtd--;

if(item.qtd <= 0){
lojaHoje.splice(index,1);
}

mostrarLoja();

atualizarInventario();
atualizarMochila();
atualizarBolsa();
atualizarTela();
}

// ================= PETS =================
function gerarRaridade(){
let r=Math.random()*100;
if(r<50)return"Comum";
if(r<75)return"Raro";
if(r<90)return"Super Raro";
if(r<97)return"Épico";
if(r<99.5)return"Lendário";
return"Divino";
}

function gerarPet(raridade){

let pet={};

if(raridade==="Comum"){
pet={
nome:"Gato Guerreiro",
raridade,
tipo:"forca",
valor:1,
imagem:"imagem/Gato.png",
descricao:"Um pequeno guerreiro determinado."
};
}

if(raridade==="Raro"){
pet={
nome:"Lobo Sombrio",
raridade,
tipo:"forca",
valor:2,
imagem:"imagem/Lobo.png",
descricao:"Um lobo feroz que aumenta seu ataque."
};
}

if(raridade==="Super Raro"){
pet={
nome:"Fênix Jovem",
raridade,
tipo:"inteligencia",
valor:3,
imagem:"imagem/Fenix.png",
descricao:"Renascida das cinzas, fortalece sua mente."
};
}

if(raridade==="Épico"){
pet={
nome:"Grifo Dourado",
raridade,
tipo:"carisma",
valor:4,
imagem:"imagem/Grifo.png",
descricao:"Majestoso e inspirador."
};
}

if(raridade==="Lendário"){
pet={
nome:"Dragão Ancestral",
raridade,
tipo:"forca",
valor:6,
imagem:"imagem/Dragao.png",
descricao:"Uma criatura lendária de poder imenso."
};
}

if(raridade==="Divino"){
pet={
nome:"Fada Celestial",
raridade,
tipo:"inteligencia",
valor:10,
imagem:"imagem/Fada.png",
descricao:"Um espírito divino que ilumina seu destino."
};
}

return pet;
}

function aplicarBuffPet(p){
if(p.tipo==="forca")forca+=p.valor;
if(p.tipo==="inteligencia")inteligencia+=p.valor;
if(p.tipo==="carisma")carisma+=p.valor;
}

function comprarOvo(){

if(ouro<100){
alert("❌ Ouro insuficiente!");
return;
}

ouro-=100;


let raridade=gerarRaridade();
let pet=gerarPet(raridade);

pets.push(pet);
aplicarBuffPet(pet);

alert("🐣 Nasceu um pet!\n⭐ "+raridade+" - "+pet.nome);

atualizarPets();
atualizarTela();
}

function atualizarPets(){

let div=document.getElementById("listaPets");
if(!div)return;

div.innerHTML="";

pets.forEach((p,i)=>{

div.innerHTML+=`
<div class="pet-card">
<div onclick="togglePet(${i})" class="pet-header">
▸ ${p.raridade} - ${p.nome}
</div>

<div id="pet-${i}" class="pet-info" style="display:none">

<img src="${p.imagem}" 
onerror="this.src='imagem/padrao.png'" 
style="width:90px;margin:10px 0;">

<p>${p.descricao}</p>
<p><strong>Buff:</strong> +${p.valor} ${p.tipo}</p>

<button onclick="removerPet(${i})">🗑 Excluir Pet</button>
</div>
</div>
`;
});
}

function removerPet(index){

if(!confirm("Excluir pet?")) return;

let pet=pets[index];

if(pet.tipo==="forca")forca-=pet.valor;
if(pet.tipo==="inteligencia")inteligencia-=pet.valor;
if(pet.tipo==="carisma")carisma-=pet.valor;

pets.splice(index,1);
if(pet.tipo==="forca") forca -= pet.valor;
if(pet.tipo==="inteligencia") inteligencia -= pet.valor;
if(pet.tipo==="carisma") carisma -= pet.valor;

// nunca deixar negativo
forca = Math.max(1, forca);
inteligencia = Math.max(1, inteligencia);
carisma = Math.max(1, carisma);

atualizarPets();
atualizarTela();
}

function togglePet(i){
let el=document.getElementById("pet-"+i);
el.style.display=el.style.display==="none"?"block":"none";
}

// ================= INVENTÁRIO =================
function atualizarInventario(){

let div=document.getElementById("inventario");
if(!div) return;

div.innerHTML="";

inventario.forEach(item=>{
div.innerHTML+="⚔ "+item.nome+"<br>";
});
}

function atualizarMochila(){

let div = document.getElementById("listaItens");
if(!div) return;

div.innerHTML = "";

inventario.forEach((item,index)=>{

div.innerHTML += `
<div class="item-box">

<div class="item-nome">
${item.nome}
</div>

<div class="item-buff">
+${item.valor} ${item.tipo}
</div>

<button class="btn-remover"
onclick="removerItem(${index})">
🗑 Remover
</button>

</div>
`;

});
}

function removerItem(index){

if(!confirm("Excluir item?")) return;

let item = inventario[index];

// remove o buff
if(item.tipo==="forca") forca -= item.valor;
if(item.tipo==="inteligencia") inteligencia -= item.valor;
if(item.tipo==="carisma") carisma -= item.valor;

// 🔥 GARANTE QUE NUNCA FIQUE MENOR QUE 1
forca = Math.max(1, forca);
inteligencia = Math.max(1, inteligencia);
carisma = Math.max(1, carisma);

inventario.splice(index,1);

narrar("🗑 Item removido");

atualizarMochila();
atualizarInventario();
atualizarTela();
salvarJogo();
}

function toggleItem(index){
let el=document.getElementById("item-"+index);
el.style.display=el.style.display==="none"?"block":"none";
}

// ================= UI =================
function atualizarTela(){

// VIDA
document.getElementById("vidaJogadorTexto").innerText =
vidaJogador + " / " + vidaJogadorMax;

// ATRIBUTOS
document.getElementById("nivel").innerText = nivel;
document.getElementById("forca").innerText = forca ?? 1;
document.getElementById("inteligencia").innerText = inteligencia ?? 1;
document.getElementById("carisma").innerText = carisma ?? 1;
document.getElementById("ouro").innerText = ouro ?? 1;

// BARRAS
document.getElementById("xpBar").style.width =
(xp/xpMax*100)+"%";

document.getElementById("vidaJogadorBar").style.width =
(vidaJogador/vidaJogadorMax*100)+"%";

document.getElementById("energiaBar").style.width =
(energia/energiaMax*100)+"%";

// OUTROS
atualizarBolsa();
desenharGrafico();
salvarJogo();
}

function atualizarMonstro(){
document.getElementById("vidaMonstro").innerText=monstroVida;
document.getElementById("vidaMonstroBar").style.width=
(monstroVida/monstroVidaMax*100)+"%";
}

function atualizarMonstro(){

let txt = document.getElementById("vidaMonstroTexto");
let bar = document.getElementById("vidaMonstroBar");

if(monstroVidaMax <= 0){

txt.innerText = "0 / 0";
bar.style.width = "0%";
return;

}

txt.innerText = monstroVida + " / " + monstroVidaMax;

bar.style.width =
(monstroVida / monstroVidaMax * 100) + "%";

}

// ================= GRÁFICO =================
function desenharGrafico(){

let canvas=document.getElementById("graficoAtributos");
if(!canvas) return;

let ctx=canvas.getContext("2d");

let largura=canvas.width;
let altura=canvas.height;

ctx.clearRect(0,0,largura,altura);

let valores=[forca,inteligencia,carisma,nivel];
let labels=["ATK","INT","CAR","LV"];

let total=valores.length;
let max = Math.max(forca, inteligencia, carisma, nivel, 20);

let cx=largura/2;
let cy=altura/2;
let raio=80;

ctx.strokeStyle="#444";
ctx.lineWidth=1;

for(let r=1;r<=5;r++){
ctx.beginPath();
for(let i=0;i<total;i++){
let angulo=(Math.PI*2/total)*i - Math.PI/2;
let x=cx+Math.cos(angulo)*(raio*(r/5));
let y=cy+Math.sin(angulo)*(raio*(r/5));
if(i===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.closePath();
ctx.stroke();
}

for(let i=0;i<total;i++){
let angulo=(Math.PI*2/total)*i - Math.PI/2;
ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.lineTo(
cx+Math.cos(angulo)*raio,
cy+Math.sin(angulo)*raio
);
ctx.stroke();
}

ctx.beginPath();

for(let i=0;i<total;i++){
let angulo=(Math.PI*2/total)*i - Math.PI/2;
let normal=valores[i]/max;
let x=cx+Math.cos(angulo)*(raio*normal);
let y=cy+Math.sin(angulo)*(raio*normal);
if(i===0)ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}

ctx.closePath();
ctx.fillStyle="rgba(255,60,60,0.5)";
ctx.fill();
ctx.strokeStyle="red";
ctx.lineWidth=2;
ctx.stroke();

ctx.fillStyle="white";
ctx.font="12px Arial";
ctx.textAlign="center";

for(let i=0;i<total;i++){
let angulo=(Math.PI*2/total)*i - Math.PI/2;
let x=cx+Math.cos(angulo)*(raio+18);
let y=cy+Math.sin(angulo)*(raio+18);
ctx.fillText(labels[i],x,y);
}
}

// ================= ENERGIA =================
setInterval(()=>{
if(energia<energiaMax){
energia+=2;
atualizarTela();
}
},3000);
function narrar(texto){

let log = document.getElementById("logBatalha");
if(!log) return;

let linha = document.createElement("div");
linha.innerText = texto;

log.appendChild(linha);
log.scrollTop = log.scrollHeight;

}
// ================= BOLSA =================

function atualizarBolsa(){

let div=document.getElementById("bolsaBatalha");
if(!div) return;

div.innerHTML="";

if(itensConsumiveis.length===0){
div.innerHTML="<p>Sem itens</p>";
return;
}

itensConsumiveis.forEach((item,index)=>{

let btn=document.createElement("button");
btn.innerText="🧪 "+item.nome;

btn.onclick=function(){
usarItem(index);
};

div.appendChild(btn);
});
}

function usarItem(index){

let item = itensConsumiveis[index];
if(!item) return;

// POÇÃO DE VIDA
if(item.tipo === "cura"){

vidaJogador += item.valor;

if(vidaJogador > vidaJogadorMax)
vidaJogador = vidaJogadorMax;

narrar("❤️ Curou " + item.valor + " HP");

}

// POÇÃO DE ENERGIA
if(item.tipo === "energia"){

energia += item.valor;

if(energia > energiaMax)
energia = energiaMax;

narrar("⚡ Recuperou " + item.valor + " de energia");

}

itensConsumiveis.splice(index,1);

atualizarBolsa();
atualizarTela();
}
// ================= START =================
carregarJogo();
gerarLoja();
atualizarInventario();
atualizarPets();
atualizarMochila();
atualizarTela();
gerarLoja();
gerarLojaFixa();
