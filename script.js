// ================= STATUS =================
let monstroDano = 5;
let nivel = 1;
let xp = 0;
let xpMax = 100;
let monstrosDerrotados = 0;

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

// ================= LEVEL =================
function verificarLevelUp(){
if(xp>=xpMax){
xp-=xpMax;
nivel++;
xpMax+=50;
alert("👑 LEVEL UP!");
}
}

// ================= MONSTRO =================
function gerarMonstro(){

if(monstroVida>0){
narrar("⚔ Termine o combate atual!");
return;
}

// dificuldade baseada em quantos já matou
let dificuldade = Math.floor(monstrosDerrotados / 5);

let monstrosBase = [

{
nome:"Slime",
vida:30,
dano:3,
imagem:"imagem/Slime.png"
},

{
nome:"Goblin",
vida:50,
dano:6,
imagem:"imagem/Goblin.png"
},

{
nome:"Orc",
vida:80,
dano:10,
imagem:"imagem/GoblinG.png"
},

{
nome:"Cavaleiro Sombrio",
vida:130,
dano:15,
imagem:"imagem/Soldado.png"
},

{
nome:"Dragão Jovem",
vida:200,
dano:25,
imagem:"imagem/DragaoMal.png"
}

];

// BOSS A CADA 10
if((monstrosDerrotados + 1) % 10 === 0){

monstroNome = "👑 BOSS - Senhor das Trevas";
monstroVidaMax = 400 + (monstrosDerrotados*5);
monstroVida = monstroVidaMax;
monstroDano = 35;

let img = document.getElementById("imgMonstro");

img.src = "Boss.png";

// 🔥 se der erro carrega padrão
img.onerror = function(){
this.src = "imagem/padrao.png";
};

narrar("🔥 Um BOSS apareceu!");
}
else{

let tier = Math.min(dificuldade, monstrosBase.length-1);
let m = monstrosBase[tier];
let img = document.getElementById("imgMonstro");
img.src = m.imagem;

monstroNome = m.nome;
monstroVidaMax = m.vida + (dificuldade*20);
monstroVida = monstroVidaMax;
monstroDano = m.dano + (dificuldade*3);

narrar("👀 Um " + monstroNome + " apareceu!");
}

document.getElementById("monstroNome").innerText=monstroNome;
atualizarMonstro();
// trocar imagem
let img = document.getElementById("imgMonstro");

if(imagensMonstros[monstroNome]){
img.src = imagensMonstros[monstroNome];
}
}

function atacar(){

if(monstroVida<=0){
narrar("⚠ Nenhum monstro.");
return;
}

if(energia<5){
narrar("⚡ Sem energia!");
return;
}

energia-=5;

/* ===== ESQUIVA ===== */

let esquivaPlayer = Math.random() < (carisma*0.01);
let esquivaMonstro = Math.random() < 0.10;

/* ===== DANO PLAYER ===== */

let danoBase = forca*4 + nivel*2;
let variacao = Math.random()*5;

let dano = Math.floor(danoBase + variacao);

// nunca deixar dano baixo se jogador forte
dano = Math.max(dano, forca*2);

let critico = Math.random() < (0.10 + inteligencia*0.002);

if(critico){
dano*=2;
narrar("💥 CRÍTICO!");
}

if(!esquivaMonstro){

monstroVida-=dano;
if(monstroVida<0) monstroVida=0;

narrar(
"⚔ Você causou "+dano+
" dano | Vida do monstro: "+
monstroVida+"/"+monstroVidaMax
);

}else{
narrar("👹 O monstro ESQUIVOU!");
}

/* ===== ATAQUE MONSTRO ===== */

if(monstroVida>0){

if(!esquivaPlayer){

let danoRecebido =
Math.floor(monstroDano + Math.random()*5);

vidaJogador-=danoRecebido;

narrar(
"🩸 Você recebeu "+danoRecebido+
" dano | Sua vida: "+
vidaJogador+"/"+vidaJogadorMax
);

}else{
narrar("✨ Você ESQUIVOU do ataque!");
}

if(vidaJogador<=0){

narrar("💀 Você morreu...");
vidaJogador=vidaJogadorMax;
narrar("🔄 A aventura recomeçou...");
// RESET TOTAL DA PROGRESSÃO
monstrosDerrotados = 0;
nivel = 1;
xp = 0;
xpMax = 100;
vidaJogador = vidaJogadorMax;
monstroVida = 0;
monstroVidaMax = 0;
monstroNome = "";
document.getElementById("monstroNome").innerText="Nenhum monstro";
ouro=Math.max(0,ouro-30);

narrar("☠ Perdeu 30 ouro.");
}


}else{

monstrosDerrotados++;

// SE FOR BOSS
if(monstroNome.includes("BOSS")){
dropBoss();
}

let recompensaOuro=60+(monstrosDerrotados*5);
let recompensaXP=50+(monstrosDerrotados*5);

ouro+=recompensaOuro;
xp+=recompensaXP;

narrar(
"🏆 Vitória! +"+
recompensaOuro+" ouro | +"+
recompensaXP+" XP"
);

verificarLevelUp();
}

atualizarTela();
atualizarMonstro();
}
// ================= LOJA =================
function gerarLoja(){

let hoje=new Date().toLocaleDateString();
if(dataLoja===hoje) return;
dataLoja=hoje;

let itens=[

{nome:"Espada +2 Força", nomeLimpo:"Espada", tipo:"forca", valor:2, preco:50},

{nome:"Livro +2 Inteligência", nomeLimpo:"Livro", tipo:"inteligencia", valor:2, preco:50},

{nome:"Anel +2 Carisma", nomeLimpo:"Anel", tipo:"carisma", valor:2, preco:50},

{nome:"Poção de Vida", nomeLimpo:"Poção", tipo:"cura", valor:40, preco:35},

{nome:"Poção Grande", nomeLimpo:"Poção Grande", tipo:"cura", valor:80, preco:70}

];

lojaHoje=[];
for(let i=0;i<3;i++){
lojaHoje.push(itens[Math.floor(Math.random()*itens.length)]);
}

mostrarLoja();
}

function mostrarLoja(){

let div=document.getElementById("itensLoja");
if(!div) return;

div.innerHTML="";

lojaHoje.forEach((item,index)=>{
let botao=document.createElement("button");
botao.innerText=item.nome+" - "+item.preco+" ouro";
botao.onclick=()=>comprarItem(index);
div.appendChild(botao);
div.appendChild(document.createElement("br"));
});
}

function comprarItem(index){

let item = lojaHoje[index];

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
let max=20;

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

let item=itensConsumiveis[index];
if(!item) return;

vidaJogador+=item.valor;

if(vidaJogador>vidaJogadorMax)
vidaJogador=vidaJogadorMax;

narrar("❤️ Curou "+item.valor+" HP");

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