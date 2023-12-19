var historicoCalculos = [];

function formatarDataHora() {
  var agora = new Date();
  return agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR');
}

function adicionarAoHistorico(valor, pis, coffins, calculoN) {
  var dataHoraAtual = formatarDataHora();
  historicoCalculos.unshift({ valor: 'R$ ' + valor, data: dataHoraAtual, pis: pis, coffins: coffins, calculoN: calculoN });
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
  var valorTotal = parseFloat(document.getElementById('valorTotal').value);
  var valorTotalN = parseFloat(document.getElementById('valorTotalN').value);

  var resultado = document.getElementById('resultado');
  var valorDesconto = document.getElementById('valorDesconto');
  var pisResult = document.getElementById('pisResult');
  var coffinsResult = document.getElementById('coffinsResult');
  var calculoNResult = document.getElementById('calculoNResult');

  if (!isNaN(valorTotal) && !isNaN(valorTotalN)) {
    var pis = valorTotal * 0.0165;
    var coffins = valorTotal * 0.076;
    var calculo_N = valorTotalN * 0.07;

    var desconto = pis + coffins + calculo_N;
    resultado.textContent = desconto.toFixed(2);
    valorDesconto.classList.remove('hidden');
    pisResult.textContent = pis.toFixed(2);
    coffinsResult.textContent = coffins.toFixed(2);
    calculoNResult.textContent = calculo_N.toFixed(2);

    document.getElementById('pisValue').classList.remove('hidden');
    document.getElementById('coffinsValue').classList.remove('hidden');
    document.getElementById('calculoNValue').classList.remove('hidden');

    document.querySelectorAll('#valorDesconto, #pisValue, #coffinsValue, #calculoNValue').forEach(el => {
      el.classList.add('animated');
    });

    adicionarAoHistorico(desconto.toFixed(2), pis.toFixed(2), coffins.toFixed(2), calculo_N.toFixed(2));
  }
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

function carregarHistorico() {
  var historicoSalvo = localStorage.getItem('historicoCalculos');
  if (historicoSalvo) {
    historicoCalculos = JSON.parse(historicoSalvo);
    atualizarHistorico();
    document.querySelector('.historico').style.display = 'block';
  }
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

document.addEventListener('DOMContentLoaded', (event) => {
  carregarHistorico();
});
