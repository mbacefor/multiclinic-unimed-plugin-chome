/**
 * Funcao que inicia o ajuste da pagina
 */
function ajustaPagina() {

  document.body.style.backgroundColor = 'red';

  //const LINK_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSfza8do4fbcgDcInipY_Dbd-vBmUn6jjE76LRtYy-mRmH2zkw/viewform?usp=pp_url&entry.89253311=DATA_HORA&entry.1826533171=SERVICO&entry.646313095=PROFISSIONAL&entry.83580986=Unimed&entry.2096031278=BENEFICIARIO&entry.1179655987=NUM_PROCEDIMENTO&entry.166796424=100&entry.1463770423=NUM_SOLICITACAO';

  const LINK_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdBUUyaruhKbdNJNcnOVqayBkvMWlp24w1PSYMGX13ZOQ4qKg/viewform?usp=pp_url&entry.89253311=DATA_HORA&entry.1826533171=SERVICO&entry.646313095=PROFISSIONAL&entry.83580986=Unimed&entry.2096031278=BENEFICIARIO&entry.1179655987=NUM_PROCEDIMENTO&entry.166796424=100&entry.1882838109=NUM_SOLICITACAO';

  const ID_TAB_UNIMED_PRODUCAO = 'linha';

  const PROFISSIONAIS = ['Alexandra', 'Domingos Jr', 'Edinho', 'Jonas', 'Juliane', 'Karine (Fisi)', 'Paula Abreu', 'Paulo Rafael', 'Rayara', 'Raphaela', 'Rayana (Fono)', 'Thaís de Sá'];

  const NUMERO_SOLICITACAO = 6;

  const COD_SERVICO = 7;

  const NUM_BENEFICIARIO = 4;

  const DATA_HORA = 0;

  /**
   * Gerar a TAG <A> com os paramentos para o formularios
   */
  function geraLinkFormulario(linha) {

    var a = document.createElement('A');
    var linkText = document.createTextNode('Link formulário:' + linha.cells[NUMERO_SOLICITACAO].innerHTML);
    a.appendChild(linkText);
    a.title = 'Link formulário:' + linha.cells[NUMERO_SOLICITACAO].innerHTML;
    var novoModeloData = linha.cells[DATA_HORA].innerHTML.substr(6, 4) + '-' + linha.cells[DATA_HORA].innerHTML.substr(3, 2) + '-' + linha.cells[DATA_HORA].innerHTML.substr(0, 2) + linha.cells[DATA_HORA].innerHTML.substr(10, 6);

    a.href = LINK_FORM.replace('DATA_HORA', novoModeloData);
    // Identifica o procedimento
    var servico = '';
    switch (linha.cells[COD_SERVICO].innerHTML) {
      case '5000008':
        servico = 'Terapia Ocupacional';
        break;
      case '5000047':
        servico = 'Psicologia';
        break;
      case '5000056':
        servico = 'Nutrição';
        break;
      case '5000061':
        servico = 'Fonoaudiologia';
        break;
        // case '20103220':
        // case '20103441':
        // case '20103484':
        // case '20103492':
        // case '20103506':
        // case '20103514':
        // case '20103662':
        // servico = 'Fonoaudiologia';
        //break;
      default:
        if (linha.cells[COD_SERVICO].innerHTML.substr(0, 4) == '2010')
          servico = 'Fisioterapia';
        else servico = 'Outros';
        break;
    }
    a.href = a.href.replace('SERVICO', servico);
    a.href = a.href.replace('PROFISSIONAL', document.getElementById('profissional').value);
    a.href = a.href.replace('BENEFICIARIO', linha.cells[NUM_BENEFICIARIO].innerHTML);
    a.href = a.href.replace('NUM_PROCEDIMENTO', linha.cells[COD_SERVICO].innerHTML);
    a.href = a.href.replace('NUM_SOLICITACAO', linha.cells[NUMERO_SOLICITACAO].innerHTML);
    a.target = "_blank";

    return a;
  }


  /**
   * Ajusta os links para o novo profissional selecionado no combox
   */
  function mudaProfissionalSelecionado() {
    var table = document.getElementById(ID_TAB_UNIMED_PRODUCAO);
    // Verifica se tem um table e se tem mais de uma linha
    if (table != null && table.rows.length > 1) {
      var linhas = table.rows;
      for (let index = 1; index < linhas.length; index++) {
        var novaCelula = document.getElementById('link' + index);
        if (novaCelula != null) {
          novaCelula.children[0].remove();
          var linha = linhas[index];
          var a = geraLinkFormulario(linha);
          novaCelula.appendChild(a);
        }
      }
    }
  }

  /** Gera o combox de profissionais */
  function adicionaSelectProfissional() {

    var idTitulo = document.getElementById('idTitulo');

    var x = document.createElement("SELECT");
    x.setAttribute("id", "profissional");
    x.onchange = mudaProfissionalSelecionado;
    idTitulo.appendChild(x);

    for (const profissional of PROFISSIONAIS) {
      var z = document.createElement("OPTION");
      z.setAttribute("value", profissional);
      var t = document.createTextNode(profissional);
      z.appendChild(t);
      document.getElementById("profissional").appendChild(z);
    }
  }

  /**
   * Adiciona nova coluna na tabela de produção e gera link para o formulario
   */
  function adicionaLinkTabela() {

    //testa se e o relatorio de producao
    var x = document.getElementsByClassName("nomeSistemaH3");

    if (x[1].innerText == 'Relatório Produção') {

      var table = document.getElementById(ID_TAB_UNIMED_PRODUCAO);
      // Verifica se tem um table e se tem mais de uma linha
      if (table != null && table.rows.length > 1) {

        var linhas = table.rows;

        //Add the header row.
        var novaCelula = linhas[0].insertCell(-1);
        var headerCell = document.createElement("TH");
        headerCell.setAttribute("id", "idTitulo");
        headerCell.innerHTML = "Link Cadastro";
        novaCelula.appendChild(headerCell);
        adicionaSelectProfissional();

        for (let index = 1; index < linhas.length; index++) {
          const linha = linhas[index];

          //adiciona link para aprovados
          if (linha.cells[5].innerHTML == 'Aprovado') {
            var novaCelula = linha.insertCell(-1);
            novaCelula.id = 'link' + index;
            var a = geraLinkFormulario(linha);
            novaCelula.appendChild(a);
          } else {
            var novaCelula = linha.insertCell(-1);
            var headerCell = document.createElement("TH");
            headerCell.innerHTML = linha.cells[5].innerHTML;
            novaCelula.appendChild(headerCell);
          }

        }
      }
    } else alert('Esse plug-in somente executa no Relatório de Produção!');

  }

  //chama adicionar link
  adicionaLinkTabela();
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    function: ajustaPagina
  });
});