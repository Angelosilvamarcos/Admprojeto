const ABA = 'Pedidos';
const CABECALHOS = [
  'ID','Data/Hora de Entrada','Canal','Nome','Produto','Tipo','Problema','Setor','Prioridade','Status','Resolução','Prazo (h)','Vencimento','Duplicidade','Mensagem','Data/Hora da Resolução','Tempo de Atendimento (h)','Observação da Gestão'
];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) sh = ss.insertSheet(ABA);
  if (sh.getLastRow() === 0) sh.appendRow(CABECALHOS);
  return sh;
}

function doGet() {
  setup();
  return json({ ok:true, sistema:'Conecta Mais 4.0', mensagem:'API ativa' });
}

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sh = setup();
    const action = d.action || 'insert';
    if (action === 'update') return atualizar(d, sh);
    return inserir(d, sh);
  } catch (err) {
    return json({ ok:false, erro:String(err) });
  }
}

function inserir(d, sh) {
  if (!d.id) d.id = 'CM-' + Date.now().toString().slice(-6);

  // Evita duplicar o mesmo protocolo se o navegador reenviar a requisição.
  const linha = localizarId(sh, d.id);
  if (linha) return json({ok:true, action:'already_exists', id:d.id, row:linha});

  sh.appendRow([
    d.id || '', d.dataHora || new Date().toISOString(), d.canal || 'Web',
    d.nome || '', d.produto || '', d.tipo || '', d.problema || '', d.setor || '',
    d.prioridade || '', d.status || 'Não atendido', d.resolucao || '', d.prazo || '',
    d.vencimento || '', d.duplicidade ? 'SIM' : 'NÃO', d.mensagem || '',
    d.dataResolucao || '', d.tempoAtendimento || '', d.observacao || ''
  ]);
  return json({ok:true, action:'insert', id:d.id});
}

function atualizar(d, sh) {
  if (!d.id) return json({ok:false, erro:'ID não informado'});
  const linha = localizarId(sh, d.id);
  if (!linha) return json({ok:false, erro:'Pedido não encontrado: '+d.id});

  const valores = [
    d.id, d.dataHora, d.canal, d.nome, d.produto, d.tipo, d.problema, d.setor,
    d.prioridade, d.status, d.resolucao, d.prazo, d.vencimento,
    d.duplicidade ? 'SIM' : 'NÃO', d.mensagem, d.dataResolucao,
    d.tempoAtendimento, d.observacao
  ];

  // Só substitui células com valor definido, preservando dados existentes.
  const atual = sh.getRange(linha,1,1,CABECALHOS.length).getValues()[0];
  for (let i=0; i<valores.length; i++) {
    if (valores[i] !== undefined && valores[i] !== null && valores[i] !== '') atual[i] = valores[i];
  }
  sh.getRange(linha,1,1,CABECALHOS.length).setValues([atual]);
  return json({ok:true, action:'update', id:d.id, row:linha});
}

function localizarId(sh, id) {
  if (sh.getLastRow() < 2) return null;
  const ids = sh.getRange(2,1,sh.getLastRow()-1,1).getValues();
  for (let i=0; i<ids.length; i++) if (String(ids[i][0]) === String(id)) return i+2;
  return null;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
