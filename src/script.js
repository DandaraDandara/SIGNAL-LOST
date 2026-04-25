
/**
 * PHANTOM-7 // PROTOCOL 
 * VERSÃO FINAL: Design image_fd035a + Fluxo SYSTEM_ADMIN + Registros Fixed
 */

const canvas = document.getElementById('terminal');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- CONFIGURAÇÕES DE CORES ---
const VERDE_BRILHANTE = "#00FF41";
const VERDE_ESCURO = "#003B00";
const PRETO_FUNDO = "#050505";
const AZUL_ERRO = "#0000AA"; 
const ALERTA_VERMELHO = "#FF3131";

// --- ESTADO DO SISTEMA ---
let paradoxo = 3; 
let confianca = 3;
let jogoIniciado = false;
let emArquivos = false;
let glitchAtivo = false;
let travandoSistema = false;
let frameCount = 0;
let loopCapa;

// --- BANCO DE DADOS (REGISTROS.SH) ---
let arquivosLiberados = [
    { data: "12/04/1987", log: "Sensores de áudio: Monitorando ressonância do núcleo." },
    { data: "15/04/1987", log: "Sincronia PHANTOM-7: Falha detectada. Instabilidade." },
    { data: "24/04/2026", log: "USER: SYSTEM_ADMIN. STATUS: Conexão Estabelecida." }
];

const sequenciaNotasCascata = [
    { label: "LOG 14/05/1987", nota: "NOTA 24", text: "A interface respondeu sozinha. Sinto que não estou só...", delay: 4000 },
    { label: "LOG 22/05/1987", nota: "NOTA 25", text: "O Phantom emite sussurros. Preciso sintonizar a entropia futura...", delay: 3500 },
    { label: "LOG 01/06/1987", nota: "NOTA 26", text: "Vi acessos de 'SYSTEM_ADMIN' em datas que não existem...", delay: 1500 },
    { label: "CRITICAL ERROR", nota: "NOTA 27", text: "O 7 é a chave. Eu vi 2026. POR QUE VOCÊ SÓ FICOU OLHANDO?", delay: 3000, critico: true }
];

// --- MOTOR GRÁFICO ---

function aplicarEfeitoTerminal() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    for (let i = 0; i < canvas.height; i += 4) ctx.fillRect(0, i, canvas.width, 1);
}

function desenharHUD() {
    if(travandoSistema || emArquivos) return;
    ctx.textAlign = "left";
    ctx.fillStyle = VERDE_BRILHANTE;
    ctx.font = "bold 18px 'Courier New'";
    ctx.fillText("PHANTOM-7 // PROTOCOL", 50, 45);
    
    const barP = "█".repeat(paradoxo) + "░".repeat(10 - paradoxo);
    const barC = "█".repeat(confianca) + "░".repeat(10 - paradoxo); 
    
    ctx.font = "14px 'Courier New'";
    ctx.fillText(`PARADOXO:  ${barP} ${paradoxo * 10}%`, 50, 80);
    ctx.fillText(`CONFIANÇA: ${barC} ${confianca * 10}%`, 450, 80); 
    
    ctx.strokeStyle = VERDE_BRILHANTE;
    ctx.strokeRect(50, 95, canvas.width - 100, 1);
}

// --- TELA DE ARQUIVOS (RESTAURADA) ---
function renderArquivos() {
    ctx.fillStyle = PRETO_FUNDO;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "left";
    ctx.fillStyle = VERDE_BRILHANTE;
    ctx.font = "16px 'Courier New'";
    ctx.fillText("📂 : /PHANTOM-7/REGISTROS", 50, 30);
    ctx.textAlign = "center";
    ctx.fillText("MAIN MENU", canvas.width / 2, 30);
    
    ctx.strokeStyle = VERDE_BRILHANTE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 45);
    ctx.lineTo(canvas.width - 30, 45);
    ctx.stroke();

    let xP = 60; let yP = 100;
    let larguraP = canvas.width - 120;
    let alturaP = canvas.height - 250;

    ctx.strokeStyle = VERDE_BRILHANTE;
    ctx.strokeRect(xP, yP, larguraP, alturaP);
    
    ctx.beginPath();
    ctx.moveTo(xP + 20, yP);
    ctx.lineTo(xP + 20, yP - 30);
    ctx.lineTo(xP + 250, yP - 30);
    ctx.lineTo(xP + 280, yP);
    ctx.stroke();
    ctx.font = "bold 18px 'Courier New'";
    ctx.fillText("Registros.sh", xP + 140, yP - 10);
    arquivosLiberados.forEach((arq, i) => {
        let yItem = yP + 60 + (i * 60);
        ctx.textAlign = "left";
        ctx.font = "20px 'Courier New'";
        ctx.fillStyle = VERDE_BRILHANTE;
        ctx.fillText(`${i + 1}. [${arq.data}] ${arq.log}`, xP + 50, yItem);
    });
    ctx.fillText(`${arquivosLiberados.length + 1}. Quit to Terminal`, xP + 50, yP + 60 + (arquivosLiberados.length * 60));
    
    // Rodapé de Interação
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 70);
    ctx.lineTo(canvas.width - 30, canvas.height - 70);
    ctx.stroke();

    ctx.font = "16px 'Courier New'";
    ctx.textAlign = "left";
    ctx.fillText("Type number, or use [V] to Return _", 40, canvas.height - 40);
    
    ctx.textAlign = "right";
    let dataAtual = new Date();
    ctx.fillText(`${dataAtual.toLocaleDateString()} ${dataAtual.getHours()}:${dataAtual.getMinutes()}`, canvas.width - 40, canvas.height - 40);

    aplicarEfeitoTerminal();
}

// --- CAPA E GLITCH ---
function desenharTituloComGlitch(x, y) {
    ctx.font = "bold 80px 'Courier New'";
    ctx.textAlign = "center";
    if (glitchAtivo && Math.random() > 0.3) {
        for (let i = 0; i < 3; i++) {
            let offset = Math.random() * 40 - 20;
            ctx.fillStyle = i === 0 ? "#FF00FF" : i === 1 ? "#00FFFF" : VERDE_BRILHANTE;
            ctx.globalAlpha = 0.6;
            ctx.fillText("PHANTOM-7", x + offset, y + (Math.random() * 10 - 5));
        }
        ctx.globalAlpha = 1.0;
    } else {
        ctx.fillStyle = VERDE_BRILHANTE;
        ctx.shadowBlur = 25;
        ctx.shadowColor = VERDE_BRILHANTE;
        ctx.fillText("PHANTOM-7", x, y);
    }
    ctx.shadowBlur = 0;
}

function animarCapa() {
    if (jogoIniciado) return;
    ctx.fillStyle = PRETO_FUNDO;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    frameCount++;
    if (frameCount % 30 === 0 && Math.random() > 0.4) glitchAtivo = true;
    if (glitchAtivo && Math.random() > 0.1 && Math.random() > 0.95) glitchAtivo = false;
    desenharTituloComGlitch(canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillStyle = VERDE_BRILHANTE;
    ctx.font = "16px 'Courier New'";
    ctx.fillText("[ COMUNICAÇÃO TEMPORAL ATIVA ]", canvas.width / 2, canvas.height / 2 + 20);
    if (Math.floor(Date.now() / 600) % 2) {
        ctx.fillStyle = VERDE_ESCURO;
        ctx.font = "bold 18px 'Courier New'";
        ctx.fillText("PRESSIONE [ENTER] PARA INICIAR CONEXÃO", canvas.width / 2, canvas.height / 2 + 150);
    }
    aplicarEfeitoTerminal();
    loopCapa = requestAnimationFrame(animarCapa);
}

// --- SISTEMA DE DIÁLOGO ---
class Cena {
    constructor(id, texto, opcoes, tipo = "normal") {
        this.id = id;
        this.texto = texto; this.opcoes = opcoes || []; this.tipo = tipo;
    }
    carregar() {
        if (this.tipo === "cascata") { new MotorCascata(sequenciaNotasCascata).iniciar(); return; }
        ctx.fillStyle = PRETO_FUNDO; ctx.fillRect(0, 0, canvas.width, canvas.height);
        desenharHUD(); this.escrever();
    }
    escrever() {
        let i = 0;
        const intv = setInterval(() => {
            if (emArquivos) { clearInterval(intv); return; }
            ctx.fillStyle = PRETO_FUNDO; ctx.fillRect(80, 150, canvas.width - 160, 120);
            ctx.fillStyle = VERDE_BRILHANTE; ctx.font = "18px 'Courier New'";
            ctx.fillText("> " + this.texto.slice(0, i) + "█", 80, 180);
            if(++i > this.texto.length) { clearInterval(intv); this.mostrarOpcoes(); }
        }, 30);
    }
    mostrarOpcoes() {
        let yBase = 450;
        this.opcoes.forEach((o, i) => {
            ctx.fillStyle = VERDE_BRILHANTE;
            ctx.fillText(`[ ${i+1} ] ${o.texto}`, 100, yBase + (i * 55));
        });
        ctx.fillStyle = VERDE_ESCURO; ctx.font = "13px 'Courier New'";
        ctx.fillText("[ F ] ACESSAR REGISTROS HISTÓRICOS", 100, yBase + (this.opcoes.length * 55) + 20);
        aplicarEfeitoTerminal();
    }
}
// --- NOVO COMPORTAMENTO: PROTOCOLO DE SACRIFÍCIO ---
   class CenaSacrificio extends Cena {
    constructor(id, texto, opcoes) {
        super(id, texto, opcoes);
    }

    // Polimorfismo: Sobrescreve o carregar para travar o sistema e gerar bugs
    carregar() {
        travandoSistema = true; 
        this.dispararBugs2099();
        this.exibirTextoCorrompido();
    }

    dispararBugs2099() {
        let i = 0;
        const intervalo = setInterval(() => {
            ctx.fillStyle = ALERTA_VERMELHO;
            ctx.font = "14px VT323";
            ctx.fillText(`[ERR: OVERHEAT_2099] > VOLTAGE_CRITICAL`, Math.random() * canvas.width, Math.random() * canvas.height);
            if (i++ > 60) clearInterval(intervalo);
        }, 80);
    }

    exibirTextoCorrompido() {
        // Efeito de "Vazamento de Memória Histórica"
        let textoFinal = "KAORI: 'Eu con_ [ERR: class CenaMap] sigo ver a saída! A fenda está se fechando... Obrigada por me ancorar.'";
        renderizarTexto(textoFinal, 100, 200);
        
        setTimeout(() => {
            this.telaAzulMorte();
        }, 7000);
    }

    telaAzulMorte() {
        ctx.fillStyle = AZUL_ERRO;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px VT323";
        ctx.fillText("*** FATAL ERROR: SYSTEM_ADMIN_CONSCIOUSNESS_FRY ***", 50, 100);
        ctx.font = "18px VT323";
        ctx.fillText("A EXCEÇÃO NÃO TRATADA EM 2099 GARANTIU A VIDA EM 1987.", 50, 160);
        ctx.fillText("CONEXÃO PERMANENTEMENTE ENCERRADA.", 50, 220);
        ctx.fillStyle = "#FFFF00";
        ctx.fillText("> STATUS KAORI: SALVA (ANCORADA)", 50, 320);
    }
}

// --- MOTOR CASCATA E COLAPSO ---
class JanelaPrompt {
    constructor(dados, x, y, critico = false) {
        this.dados = dados;
        this.x = x; this.y = y; this.critico = critico;
        this.largura = 480; this.altura = 260;
    }
    desenhar() {
        const cor = this.critico ? ALERTA_VERMELHO : VERDE_BRILHANTE;
        ctx.fillStyle = "rgba(5, 5, 5, 0.98)";
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        ctx.strokeStyle = cor; ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);
        ctx.fillStyle = cor; ctx.fillRect(this.x, this.y, this.largura, 28);
        ctx.fillStyle = PRETO_FUNDO; ctx.font = "bold 12px 'Courier New'";
        ctx.fillText(`C:\\PHANTOM\\SYSTEM32\\${this.dados.label}.exe`, this.x + 10, this.y + 19);
        ctx.fillStyle = cor; ctx.font = "bold 14px 'Courier New'";
        ctx.fillText(`> ${this.dados.nota}:`, this.x + 20, this.y + 60);
        ctx.fillStyle = this.critico ? ALERTA_VERMELHO : "#00CC00"; ctx.font = "14px 'Courier New'";
        this.wrap(this.dados.text, this.x + 20, this.y + 85);
        ctx.fillText("> _", this.x + 20, this.y + this.altura - 20);
    }
    wrap(t, x, y) {
        let words = t.split(' '), line = '', py = y;
        words.forEach(w => {
            if(ctx.measureText(line + w).width > this.largura - 40) {
                ctx.fillText(line, x, py); line = w + ' '; py += 22;
            } else { line += w + ' '; }
        });
        ctx.fillText(line, x, py);
    }
}

function iniciarColapsoFinal() {
    travandoSistema = true;
    let framesDeEfeito = 0;
    const loopObsessor = setInterval(() => {
        ctx.fillStyle = PRETO_FUNDO;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let i=0; i < 15; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? ALERTA_VERMELHO : VERDE_BRILHANTE;
            let tamanho = 20 + Math.random() * 40;
            ctx.font = `bold ${tamanho}px 'Courier New'`;
            ctx.globalAlpha = Math.random();
            ctx.fillText("POR QUE VOCÊ SÓ FICOU OLHANDO?", Math.random() * canvas.width - 100, Math.random() * canvas.height);
        }
        ctx.globalAlpha = 1.0;
        aplicarEfeitoTerminal();
        if (++framesDeEfeito > 50) { clearInterval(loopObsessor); dispararTelaAzul(); }
    }, 60);
}

function dispararTelaAzul() {
    let flashes = 0;
    const interval = setInterval(() => {
        ctx.fillStyle = flashes % 2 === 0 ? AZUL_ERRO : "#000033";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "left";
        ctx.font = "bold 24px 'Courier New'";
        ctx.fillText("A problem has been detected and PHANTOM-7 has been shut down.", 50, 60);
        ctx.fillText("*** STOP: 0x00000019 (BAD_POOL_HEADER)", 50, 100);
        ctx.font = "16px 'Courier New'";
        ctx.fillText("ALUCINAÇÃO DE DADOS NO NÚCLEO: VIOLAÇÃO TEMPORAL 1987-2026", 50, 160);
        ctx.fillText("USUÁRIO: SYSTEM_ADMIN (DandaraDandara)", 50, 185);
        ctx.fillText("CAUSA: TENTATIVA DE ALTERAÇÃO DO DESTINO DE 'KAORI'", 50, 210);
        if (++flashes > 25) { clearInterval(interval); cenaAtual = fluxoJogo["final"]; cenaAtual.carregar(); }
    }, 120);
}

class MotorCascata {
    constructor(dados) { this.dados = dados; this.janelas = []; this.idx = 0; }
    iniciar() { this.proxima(); }
    proxima() {
        if (this.idx < this.dados.length) {
            const info = this.dados[this.idx];
            this.janelas.push(new JanelaPrompt(info, 140 + (this.idx * 50), 160 + (this.idx * 40), info.critico));
            this.render(); this.idx++;
            setTimeout(() => this.proxima(), info.delay);
        } else { setTimeout(() => iniciarColapsoFinal(), 1200); }
    }
    render() {
        ctx.fillStyle = PRETO_FUNDO;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        desenharHUD(); this.janelas.forEach(j => j.desenhar());
        aplicarEfeitoTerminal();
    }
}

// --- ESTADO E MOTOR DO MAPA ---
let mapaAtivo = false;
let posicaoKaori = { x: 1, y: 3 }; 
let posicaoInvasores = { x: 3, y: 1 };
const LAYOUT_MAPA = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1], // O '2' agora é o centro vitorioso
    [1, 0, 0, 3, 1], 
    [1, 1, 1, 1, 1]
];

class MotorMapa {
    constructor() { this.passos = 0; this.maxPassos = 10; }
    desenhar() {
        ctx.fillStyle = PRETO_FUNDO; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        desenharHUD(); 

        const larguraJanela = 450;
        const alturaJanela = 350;
        const mX = (canvas.width / 2) - (larguraJanela / 2);
        const mY = (canvas.height / 2) - (alturaJanela / 2);

        ctx.strokeStyle = VERDE_BRILHANTE; 
        ctx.lineWidth = 2;
        ctx.strokeRect(mX, mY, larguraJanela, alturaJanela);
        
        ctx.fillStyle = VERDE_BRILHANTE;
        ctx.fillRect(mX, mY - 30, larguraJanela, 30);
        ctx.fillStyle = PRETO_FUNDO;
        ctx.font = "bold 14px 'Courier New'";
        ctx.textAlign = "center";
        ctx.fillText("MAPA_FUGA.MAP - SETOR 4", mX + larguraJanela/2, mY - 10);

        const t = 60;
        const offsetX = mX + (larguraJanela - (5 * t)) / 2;
        const offsetY = mY + 40;

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                let posX = offsetX + (c * t);
                let posY = offsetY + (r * t);

                if (LAYOUT_MAPA[r][c] === 1) { 
                    ctx.fillStyle = VERDE_ESCURO;
                    ctx.fillRect(posX, posY, t - 5, t - 5); 
                }
                if (LAYOUT_MAPA[r][c] === 2) { 
                    ctx.fillStyle = "#FFF";
                    ctx.font = "bold 12px Arial";
                    ctx.fillText("SAÍDA", posX + t/2, posY - 5);
                }
                
                if (posicaoKaori.x === c && posicaoKaori.y === r) { 
                    ctx.fillStyle = (Math.floor(Date.now() / 400) % 2) ? VERDE_BRILHANTE : "#FFF";
                    ctx.font = "bold 25px Arial"; 
                    ctx.textAlign = "center";
                    ctx.fillText("K", posX + t/2, posY + t/2 + 10);
                }
                
                if (posicaoInvasores.x === c && posicaoInvasores.y === r) {
                    ctx.fillStyle = ALERTA_VERMELHO;
                    ctx.font = "bold 25px Arial"; 
                    ctx.textAlign = "center";
                    ctx.fillText("X", posX + t/2, posY + t/2 + 10);
                }
            }
        }
        
        this.legenda(mX, mY, larguraJanela, alturaJanela);
        aplicarEfeitoTerminal();
    }

    legenda(mX, mY, largura, altura) {
        ctx.textAlign = "left";
        ctx.fillStyle = (this.passos >= 4) ? ALERTA_VERMELHO : VERDE_BRILHANTE;
        ctx.font = "14px 'Courier New'";
        ctx.fillText(`> TURNOS ATÉ CERCO: ${this.maxPassos - this.passos}`, mX + 20, mY + altura - 40);
        ctx.fillStyle = VERDE_BRILHANTE;
        ctx.fillText("> USE [W,A,S,D] PARA GUIAR", mX + 20, mY + altura - 20);
    }

    mover(k) {
    let n = { ...posicaoKaori };
    if (k === 'w') n.y--; if (k === 's') n.y++; if (k === 'a') n.x--; if (k === 'd') n.x++;
    
    if (LAYOUT_MAPA[n.y] && LAYOUT_MAPA[n.y][n.x] !== 1) {
        posicaoKaori = n;
        this.passos++;

        // BURLA: A IA só move se o número de passos for par
        if (this.passos % 2 === 0) {
            if (posicaoInvasores.x > n.x) posicaoInvasores.x--; 
            else if (posicaoInvasores.x < n.x) posicaoInvasores.x++;
            if (posicaoInvasores.y > n.y) posicaoInvasores.y--;
            else if (posicaoInvasores.y < n.y) posicaoInvasores.y++;
        }
        
        this.check();
    }
    this.desenhar();
}

    check() {
    // 1. Prioridade total para a VITÓRIA: se ela pisou na saída, ela escapou.
    if (LAYOUT_MAPA[posicaoKaori.y][posicaoKaori.x] === 2) { 
        mapaAtivo = false;
        fluxoJogo["kaori_salva"].carregar(); // Dispara o Protocolo de Sacrifício
        return; // Interrompe para não processar a captura
    } 
    
    // 2. Condição de DERROTA: Captura ou Tempo Esgotado
    const foiCapturada = (posicaoKaori.x === posicaoInvasores.x && posicaoKaori.y === posicaoInvasores.y);
    const tempoAcabou = (this.passos >= this.maxPassos);

    if (foiCapturada || tempoAcabou) {
        mapaAtivo = false;
        iniciarColapsoFinal(); // Dispara a Tela Azul / Falha
    }
}
}

// INSTÂNCIA DO MOTOR (ESSA LINHA É A ALTERAÇÃO NECESSÁRIA)
const motorMapa = new MotorMapa();

// --- FLUXO DO JOGO ---
const fluxoJogo = {
    "inicio": new Cena("inicio", "LINK ESTABELECIDO. TRANSCRIÇÃO DE ÁUDIO (1987): 'QUEM ESTÁ AÍ?'", [
        { texto: "Responder: 'Sou um operador de 2099'", destino: "kaori_ouviu" }, 
        { texto: "Manter silêncio (Apenas monitorar ambiente)", destino: "kaori_confronto" }
    ]),

    "kaori_ouviu": new Cena("kaori_ouviu", "KAORI: '2099? Isso é impossível... mas eu consigo ouvir sua voz. Você parece real. O que está acontecendo aqui?'", [
        { texto: "Avisar: 'Eles estão vindo pela porta 4. Fuja agora!'", destino: "kaori_fuga", p: 0, c: 3 },
        { texto: "Explicar: 'É uma dobra temporal. Você precisa sair daí.'", destino: "perigo", p: 1, c: 1 }
    ]),

    "kaori_confronto": new Cena("kaori_confronto", "KAORI: 'Eu sei que tem alguém aí... Eu sinto sua presença pelos monitores. Por que você não diz nada?'", [
        { texto: "Revelar-se: 'Eu sou um operador de 2099.'", destino: "kaori_ouviu" },
        { texto: "(Manter Silêncio Absoluto)", destino: "notas_experimento" }
    ]),

    "notas_experimento": new Cena("notas_experimento", "", [], "cascata"),

    "perigo": new Cena("perigo", "ALERTA: RUÍDO EXTERNO DETECTADO. '...ELA ESTÁ SOZINHA? PEGUEM OS ARQUIVOS!'", [
        { texto: "Tentar ajudar", destino: "kaori_fuga" },
        { texto: "Fim da Conexão", destino: "final" }
    ]),

    "final": { 
        carregar: () => { 
            ctx.fillStyle = PRETO_FUNDO; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = VERDE_BRILHANTE; ctx.font = "18px 'Courier New'";
            ctx.textAlign = "left";
            ctx.fillText("> CONEXÃO ENCERRADA.", 80, 300);
        }
    },

    "kaori_fuga": { 
        carregar: () => { 
            mapaAtivo = true; 
            motorMapa.desenhar(); 
        } 
    },

    "kaori_salva": new CenaSacrificio("kaori_salva", "", [])
};

let cenaAtual = fluxoJogo["inicio"];

// --- CONTROLE DE ENTRADA ---
window.addEventListener("keydown", (e) => {
    if (travandoSistema) return;
    const tecla = e.key.toLowerCase();

    if (mapaAtivo) {
        if (['w','a','s','d'].includes(tecla)) {
            motorMapa.mover(tecla);
        }
        return; 
    }

    if (jogoIniciado && tecla === 'f' && !emArquivos) { emArquivos = true; renderArquivos(); return; }
    if (emArquivos && (tecla === 'v' || tecla === '4' || tecla === 'escape')) { emArquivos = false; cenaAtual.carregar(); return; }
    
    if (!jogoIniciado && e.key === "Enter") { 
        jogoIniciado = true; 
        cancelAnimationFrame(loopCapa); 
        cenaAtual.carregar(); 
    } 
    else if (jogoIniciado && !emArquivos && cenaAtual.opcoes) {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < cenaAtual.opcoes.length) {
            const o = cenaAtual.opcoes[idx];
            paradoxo += (o.p || 0); 
            confianca += (o.c || 0);
            cenaAtual = fluxoJogo[o.destino]; 
            cenaAtual.carregar();
        }
    }
});

animarCapa();

