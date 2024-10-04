var historicoCalculos = [];
var modoEscuroAtivado = false;

function exibirModalSobre() {
    var modalSobre = document.getElementById('modalSobre');
    modalSobre.style.display = 'block';
}


function fecharModalSobre() {
    var modalSobre = document.getElementById('modalSobre');
    modalSobre.style.display = 'none';
}

function formatarDataHora() {
  var agora = new Date();
  return agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR');
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor);
}

function adicionarAoHistorico(valor, pis, coffins, calculoN) {
  var dataHoraAtual = formatarDataHora();
  historicoCalculos.unshift({ valor: formatarMoeda(valor), data: dataHoraAtual, pis: formatarMoeda(pis), coffins: formatarMoeda(coffins), calculoN: formatarMoeda(calculoN) });
  if (historicoCalculos.length > 5) {
    historicoCalculos.pop();
  }
  atualizarHistorico();
  salvarHistorico();
  document.querySelector('.historico').style.display = 'block';
}

function exibirDetalhesHistorico(index) {
  var historicoItem = historicoCalculos[index];
  var mensagem = `PIS: ${historicoItem.pis}\nCOFINS: ${historicoItem.coffins}\nICMS: ${historicoItem.calculoN}`;
  alert(mensagem);
}

function atualizarHistorico() {
  var lista = document.getElementById('historicoLista');
  lista.innerHTML = '';
  historicoCalculos.forEach(function(item, index) {
    var li = document.createElement('li');
    li.innerHTML = `<span class="valor">${item.valor}</span> <span class="data">${item.data}</span>`;
    li.classList.add(index === 0 ? 'ultimo-calculo' : 'calculo-anterior');
    li.addEventListener('click', function() {
      exibirDetalhesHistorico(index);
    });
    lista.appendChild(li);
  });
}

function calcularDesconto() {
    // Obter os valores dos inputs
    var valorTotal = parseFloat(document.getElementById('valorTotal').value.replace(',', '.'));
    var valorNacionais = parseFloat(document.getElementById('valorTotalN').value.replace(',', '.'));

    // Cálculos dos impostos existentes
    var pis = valorTotal * 0.0065;
    var coffins = valorTotal * 0.03;
    var icms = valorNacionais * 0.12;

    // Cálculo de novos valores
    var totalImportados = valorTotal - valorNacionais;
    var totalICMS = totalImportados * 0.04;

    // Formatação dos valores
    var pisFormatado = formatarMoeda(pis);
    var coffinsFormatado = formatarMoeda(coffins);
    var icmsFormatado = formatarMoeda(icms);
    var totalImportadosFormatado = formatarMoeda(totalImportados);
    var totalICMSFormatado = formatarMoeda(totalICMS);

    
    // Exibir os resultados
    document.getElementById('pisResult').innerText = pisFormatado;
    document.getElementById('coffinsResult').innerText = coffinsFormatado;
    document.getElementById('calculoNResult').innerText = icmsFormatado;
    
    // Adicionar novos valores na interface
    var totalImportadosElem = document.createElement('p');
    totalImportadosElem.innerHTML = `<b>Total Importados: </b><span>${totalImportadosFormatado}</span>`;
    document.querySelector('.container').appendChild(totalImportadosElem);

    var totalICMSElem = document.createElement('p');
    totalICMSElem.innerHTML = `<b>Total ICMS: </b><span>${totalICMSFormatado}</span>`;
    document.querySelector('.container').appendChild(totalICMSElem);

    // Tornar os elementos visíveis
    document.getElementById('valorDesconto').classList.remove('hidden');
    document.getElementById('pisValue').classList.remove('hidden');
    document.getElementById('coffinsValue').classList.remove('hidden');
    document.getElementById('calculoNValue').classList.remove('hidden');

    // Adicionar ao histórico
    adicionarAoHistorico(valorTotal, pis, coffins, icms);
}


function limpar() {
  document.getElementById('valorTotal').value = '';
  document.getElementById('valorTotalN').value = '';

  document.getElementById('resultado').textContent = 'XXX,XXX';
  document.getElementById('pisResult').textContent = 'XXX,XXX';
  document.getElementById('coffinsResult').textContent = 'XXX,XXX';
  document.getElementById('calculoNResult').textContent = 'XXX,XXX';

  document.getElementById('valorDesconto').classList.add('hidden');
  document.getElementById('pisValue').classList.add('hidden');
  document.getElementById('coffinsValue').classList.add('hidden');
  document.getElementById('calculoNValue').classList.add('hidden');

  document.querySelectorAll('#valorDesconto, #pisValue, #coffinsValue, #calculoNValue').forEach(el => {
    el.classList.remove('animated');
  });
}

function limparHistorico() {
  historicoCalculos = [];
  salvarHistorico();
  atualizarHistorico();
}

function salvarHistorico() {
  localStorage.setItem('historicoCalculos', JSON.stringify(historicoCalculos));
}

function salvarModoEscuro() {
  localStorage.setItem('modoEscuro', modoEscuroAtivado);
}

function carregarHistorico() {
  var historicoSalvo = localStorage.getItem('historicoCalculos');
  if (historicoSalvo) {
    historicoCalculos = JSON.parse(historicoSalvo);
    atualizarHistorico();
    document.querySelector('.historico').style.display = 'block';
  }
}

function carregarModoEscuro() {
  var modoEscuroSalvo = localStorage.getItem('modoEscuro');
  if (modoEscuroSalvo !== null) {
    modoEscuroAtivado = JSON.parse(modoEscuroSalvo);
    aplicarModoEscuro();
  }
}

function aplicarModoEscuro() {
  var body = document.body;
  body.classList.toggle('dark-mode', modoEscuroAtivado);

  var modoEscuroBtn = document.querySelector('.modo-escuro-btn');
  modoEscuroBtn.textContent = modoEscuroAtivado ? 'Modo Claro' : 'Modo Escuro';
}

function alternarModo() {
  modoEscuroAtivado = !modoEscuroAtivado;
  salvarModoEscuro();
  aplicarModoEscuro();
}

function adicionarBotaoMinimizar() {
  var tituloHistorico = document.querySelector('.titulo-historico');
  var botaoMinimizar = document.createElement('button');
  botaoMinimizar.id = 'toggleHistorico';
  botaoMinimizar.title = 'Minimizar o histórico';
  botaoMinimizar.textContent = '-';
  tituloHistorico.appendChild(botaoMinimizar);

  botaoMinimizar.addEventListener('click', function() {
    var infoHistorico = document.getElementById('infoHistorico');
    var historicoLista = document.getElementById('historicoLista');
    var limparHistoricoBtn = document.getElementById('limparHistorico');
    var isHistoricoVisible = infoHistorico.style.visibility !== 'hidden';

    infoHistorico.style.visibility = isHistoricoVisible ? 'hidden' : 'visible';
    infoHistorico.style.height = isHistoricoVisible ? '0' : 'auto';

    historicoLista.style.visibility = isHistoricoVisible ? 'hidden' : 'visible';
    historicoLista.style.height = isHistoricoVisible ? '0' : 'auto';

    limparHistoricoBtn.style.display = isHistoricoVisible ? 'none' : 'block';

    this.title = isHistoricoVisible ? 'Maximizar o histórico' : 'Minimizar o histórico';
    this.textContent = isHistoricoVisible ? '+' : '-';
  });
}

adicionarBotaoMinimizar();

document.getElementById('limparHistorico').addEventListener('click', function() {
  if (confirm("Tem certeza que deseja limpar o histórico?")) {
    limparHistorico();
  }
});

document.getElementById('valorTotal').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    calcularDesconto();
  }
});

document.getElementById('valorTotalN').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    calcularDesconto();
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  carregarHistorico();
  carregarModoEscuro();
});
