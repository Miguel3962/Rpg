// ================= STATUS =================

let nivel = 1;
let xp = 0;
let xpMax = 100;

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

// ================= MONSTRO =================

let monstroVida = 0;
let monstroVidaMax = 0;
let monstroNome = "";

// ================= LOJA =================

let lojaHoje = [];
let dataLoja = "";

// ================= SAVE =================

function salvarJogo(){

localStorage.setItem("vidaRPG", JSON.stringify({
nivel,xp,xpMax,
forca,inteligencia,carisma,
ouro,energia,vidaJogador,
inventario,pets
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

}

// ================= TELAS =================

function abrirTela(id){
document.querySelectorAll(".tela")
.forEach(t => t.classList.remove("ativa"));
document.getElementById(id).classList.add("ativa");
}

// ================= MISSÕES =================

function missao(tipo){

if(energia < 10){
alert("⚡ Energia insuficiente!");
return;
}

energia -= 10;

if(tipo==="estudar"){xp+=25;inteligencia++;}
if(tipo==="treinar"){xp+=25;forca++;}
if(tipo==="social"){xp+=25;carisma++;}

verificarLevelUp();
atualizarTela();
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
alert("⚔️ Termine o combate atual!");
return;
}

let monstros=["Goblin","Orc","Esqueleto"];
monstroNome=monstros[Math.floor(Math.random()*monstros.length)];

monstroVidaMax=50+(nivel*20);
monstroVida=monstroVidaMax;

document.getElementById("monstroNome").innerText=monstroNome;

atualizarMonstro();
}

function atacar(){

if(monstroVida<=0){
alert("Nenhum monstro.");
return;
}

if(energia<5){
alert("⚡ Sem energia!");
return;
}

energia-=5;

let dano=10+(forca*5);
monstroVida-=dano;

if(monstroVida<0) monstroVida=0;

if(monstroVida===0){
ouro+=50;
xp+=40;
alert("🏆 Monstro derrotado!");
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
{nome:"Espada +2 Força",tipo:"forca",valor:2,preco:50},
{nome:"Livro +2 Inteligência",tipo:"inteligencia",valor:2,preco:50},
{nome:"Anel +2 Carisma",tipo:"carisma",valor:2,preco:50}
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

let item=lojaHoje[index];

if(ouro<item.preco){
alert("❌ Ouro insuficiente!");
return;
}

ouro-=item.preco;

if(item.tipo==="forca") forca+=item.valor;
if(item.tipo==="inteligencia") inteligencia+=item.valor;
if(item.tipo==="carisma") carisma+=item.valor;

inventario.push(item.nome);

alert("🛒 Comprou: "+item.nome);

atualizarInventario();
atualizarTela();
}

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
imagem:"imagem/gato.png",
descricao:"Um pequeno guerreiro determinado."
};
}

if(raridade==="Raro"){
pet={
nome:"Lobo Sombrio",
raridade,
tipo:"forca",
valor:2,
imagem:"imagem/lobo.png",
descricao:"Um lobo feroz que aumenta seu ataque."
};
}

if(raridade==="Super Raro"){
pet={
nome:"Fênix Jovem",
raridade,
tipo:"inteligencia",
valor:3,
imagem:"imagem/fenix.png",
descricao:"Renascida das cinzas, fortalece sua mente."
};
}

if(raridade==="Épico"){
pet={
nome:"Grifo Dourado",
raridade,
tipo:"carisma",
valor:4,
imagem:"imagem/grifo.png",
descricao:"Majestoso e inspirador."
};
}

if(raridade==="Lendário"){
pet={
nome:"Dragão Ancestral",
raridade,
tipo:"forca",
valor:6,
imagem:"imagem/dragao.png",
descricao:"Uma criatura lendária de poder imenso."
};
}

if(raridade==="Divino"){
pet={
nome:"Fada Celestial",
raridade,
tipo:"inteligencia",
valor:10,
imagem:"imagem/fada.png",
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

<img src="${p.imagem}" class="pet-img">

<p>${p.descricao}</p>
<p><strong>Buff:</strong> +${p.valor} ${p.tipo}</p>

<button class="delete-pet"
onclick="removerPet(${i})">
🗑 Excluir Pet
</button>

</div>

</div>
`;
});
}
function removerPet(index){

let confirmar = confirm("Deseja realmente excluir este pet?");

if(!confirmar) return;

let pet = pets[index];

removerBuffPet(pet);

pets.splice(index,1);

alert("🗑 Pet removido!");

atualizarPets();
atualizarTela();
}
function removerBuffPet(p){

if(p.tipo==="forca") forca-=p.valor;
if(p.tipo==="inteligencia") inteligencia-=p.valor;
if(p.tipo==="carisma") carisma-=p.valor;

if(forca<0)forca=0;
if(inteligencia<0)inteligencia=0;
if(carisma<0)carisma=0;
}

function togglePet(i){
let el=document.getElementById("pet-"+i);
el.style.display=el.style.display==="none"?"block":"none";
}

// ================= UI =================

function atualizarInventario(){

let div=document.getElementById("inventario");
if(!div) return;

div.innerHTML="";

inventario.forEach(item=>{
div.innerHTML+="⚔ "+item+"<br>";
});
}

function atualizarTela(){

document.getElementById("nivel").innerText=nivel;
document.getElementById("forca").innerText=forca;
document.getElementById("inteligencia").innerText=inteligencia;
document.getElementById("carisma").innerText=carisma;
document.getElementById("ouro").innerText=ouro;

document.getElementById("xpBar").style.width=(xp/xpMax*100)+"%";
document.getElementById("vidaJogadorBar").style.width=(vidaJogador/vidaJogadorMax*100)+"%";
document.getElementById("energiaBar").style.width=(energia/energiaMax*100)+"%";

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
let labels=["atk","Int","Car","lv"];

let total=valores.length;
let max=20;

let cx=largura/2;
let cy=altura/2;
let raio=80;

ctx.strokeStyle="#333";

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
ctx.font="11px Georgia";
ctx.textAlign="center";

for(let i=0;i<total;i++){
let angulo=(Math.PI*2/total)*i - Math.PI/2;
let x=cx+Math.cos(angulo)*(raio+22);
let y=cy+Math.sin(angulo)*(raio+22);
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


// ================= START =================

carregarJogo();
gerarLoja();
atualizarInventario();
atualizarPets();
atualizarTela();