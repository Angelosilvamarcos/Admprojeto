CONECTA MAIS 4.0 — CONEXÃO WEBAPP → GOOGLE SHEETS

Esta versão NÃO refaz o aplicativo. Ela usa o mesmo index.html do WebApp e o conecta ao endpoint do Google Apps Script já informado.

URL configurada no index.html:
https://script.google.com/macros/s/AKfycbyDr5RRXOLJgSMke1oZczJLdEzHw5TXwqcz6bFDJKEIM1ktBrnsHUtZ0ccEA4z8P2s/exec

1) Na planilha Google, abra Extensões > Apps Script.
2) Substitua o Code.gs pelo apps_script.gs deste pacote.
3) Salve.
4) IMPORTANTE: Implantar > Gerenciar implantações > editar a implantação do Web App > Nova versão > Implantar.
5) Confirme: Executar como você; Quem tem acesso: qualquer pessoa.
6) NÃO é necessário criar outro projeto nem outro link.
7) O WebApp continua sendo o seu aplicativo atual. A URL do aplicativo onde ele está hospedado permanece a mesma.
8) Ao enviar um pedido, o navegador faz POST para o Apps Script. O script grava na aba Pedidos.
9) Atualizações de status/resolução usam action=update e atualizam a mesma linha pelo ID, evitando duplicação.

TESTE:
- Abra o seu WebApp pelo endereço normal dele (não abra o arquivo index.html como file://).
- Envie um pedido fictício.
- Abra a aba Pedidos da planilha e procure o novo CM-xxxxxx.
- Depois altere o status na Área da equipe e confirme que a mesma linha foi atualizada.

OBSERVAÇÃO:
O fetch usa mode no-cors porque o Apps Script é um endpoint externo ao domínio do WebApp. O navegador pode não permitir ler a resposta, mas o POST é enviado. A confirmação definitiva é a nova linha na planilha.
