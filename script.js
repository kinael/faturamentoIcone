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
  }
}

function limpar() {
  document.getElementById('valorTotal').value = '';
  document.getElementById('valorTotalN').value = '';

  // Limpa as variáveis e esconde os resultados
  document.getElementById('resultado').textContent = 'XXX,XXX';
  document.getElementById('pisResult').textContent = 'XXX,XXX';
  document.getElementById('coffinsResult').textContent = 'XXX,XXX';
  document.getElementById('calculoNResult').textContent = 'XXX,XXX';

  document.getElementById('valorDesconto').classList.add('hidden');
  document.getElementById('pisValue').classList.add('hidden');
  document.getElementById('coffinsValue').classList.add('hidden');
  document.getElementById('calculoNValue').classList.add('hidden');
}
