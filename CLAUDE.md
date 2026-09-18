# CLAUDE.md
# Samseg — Gestão de Eventos

## 1. OBJETIVO DO PROJETO

Este é o sistema **Samseg — Gestão de Eventos**, utilizado pelo **Grupo Anjos da Paz**.

Tecnologias principais:
- HTML5
- CSS
- JavaScript
- Supabase
- PostgreSQL

O frontend principal está concentrado no arquivo:

`index.html`

O sistema deve ser mantido de forma incremental.

### Regra fundamental

O objetivo é **fazer o sistema funcionar corretamente**, e não modernizar, reestruturar ou reescrever o projeto.

Preserve o código existente sempre que possível.

Evite refatorações amplas quando uma alteração localizada resolver o problema.

---

# 2. REGRA PRINCIPAL DE TRABALHO

Para qualquer solicitação:

1. Localize exatamente onde o comportamento ocorre.
2. Leia somente o código necessário para entender aquele comportamento.
3. Identifique a causa antes de alterar.
4. Faça a menor alteração possível.
5. Preserve as funcionalidades existentes.
6. Teste a alteração.
7. Verifique possíveis efeitos colaterais diretos.
8. Mostre claramente o que foi alterado.

### IMPORTANTE

Não releia ou analise o projeto inteiro para resolver uma tarefa localizada.

Não faça exploração ampla sem necessidade.

Não reescreva `index.html` inteiro.

Não substitua blocos grandes de código quando uma alteração pontual for suficiente.

---

# 3. PROIBIÇÕES

Sem autorização explícita, NÃO:

- publique alterações;
- faça `git push`;
- altere produção;
- execute SQL destrutivo;
- utilize `DROP TABLE`;
- utilize `DROP COLUMN`;
- apague dados;
- faça exclusões em massa;
- recrie tabelas existentes;
- migre dados sem autorização;
- altere estruturas importantes do banco sem diagnóstico prévio;
- reescreva módulos inteiros;
- faça refatorações arquiteturais amplas;
- altere funcionalidades que não estejam diretamente relacionadas à solicitação.

### APP_VERSION

Não alterar `APP_VERSION` durante a implementação, a menos que isso seja solicitado explicitamente.

Quando o usuário pedir uma versão para publicação/teste, alterar somente o valor solicitado.

---

# 4. FLUXO DE IMPLEMENTAÇÃO

Use sempre este fluxo:

**LOCALIZAR → DIAGNOSTICAR → ALTERAR MINIMAMENTE → TESTAR → CONFERIR DIFF → RELATAR**

### Quando a tarefa for simples e localizada

Pode diagnosticar e implementar diretamente.

### Quando envolver banco, dados ou risco de perda de histórico

Primeiro:

1. identificar a causa;
2. explicar a alteração necessária;
3. apresentar o SQL necessário;
4. aguardar autorização do usuário antes de executar/aplicar mudanças de banco.

Nunca faça alterações destrutivas por iniciativa própria.

### Publicação

Publicação nunca deve ser presumida.

O usuário faz a publicação no GitHub.

Não alterar GitHub, Git ou produção sem autorização explícita.

---

# 5. TESTES

Após uma alteração:

- teste a funcionalidade modificada;
- teste as dependências diretamente relacionadas;
- faça apenas testes de regressão que tenham relação com a mudança.

Não desperdice tempo executando testes de módulos sem relação com a solicitação.

Quando houver alteração em JavaScript/HTML:

- executar `node --check` quando aplicável;
- verificar erros de sintaxe;
- revisar o diff;
- confirmar que nenhum bloco não relacionado foi alterado.

---

# 6. ESTRUTURA EMPRESARIAL

O sistema pertence ao:

**GRUPO ANJOS DA PAZ**

O grupo possui **5 CNPJs diferentes**.

Esses CNPJs são entidades jurídicas distintas, mas o sistema deve permitir gestão integrada como um grupo empresarial.

Nunca tratar os 5 CNPJs como se fossem uma única empresa juridicamente.

Ao criar novas funcionalidades administrativas, considerar essa estrutura de grupo.

---

# 7. BANCO DE COLABORADORES

A tabela:

`public.colaboradores`

é o cadastro central de colaboradores.

O cadastro central não deve criar artificialmente registros operacionais.

### IMPORTANTE

A ação:

`+ Novo Colaborador`

no Banco de Colaboradores deve:

- cadastrar/atualizar o colaborador central;
- NÃO criar evento;
- NÃO criar participação;
- NÃO autorizar CPF para evento;
- NÃO criar pré-escala;
- NÃO criar escala oficial;
- NÃO criar presença;
- NÃO criar checkout;
- NÃO criar fechamento financeiro.

O Banco de Colaboradores é cadastro central.

---

# 8. CLASSIFICAÇÃO DOS COLABORADORES

A classificação deve considerar a função atual do cadastro e o histórico de participações.

## Vigilantes

Considerar como Vigilante quando a função começar com:

`VIGILANTE`

Exemplos:

- VIGILANTE
- VIGILANTE NOTURNO
- VIGILANTE LÍDER DE EQUIPE

Usar lógica equivalente a:

`startsWith('VIGILANTE')`

Não exigir igualdade exata.

## Brigadistas

Considerar como Brigadista quando a função começar com:

`BRIGADISTA`

Exemplos:

- BRIGADISTA
- BRIGADISTA EVENTUAL

Usar lógica equivalente a:

`startsWith('BRIGADISTA')`

Não exigir igualdade exata.

## Demais Funções

Qualquer função que não comece com:

`VIGILANTE`

ou

`BRIGADISTA`

deve permanecer em:

**Demais Funções**

### Histórico

Participações históricas devem ser preservadas.

Participações anuladas não devem classificar o colaborador.

O mesmo CPF pode aparecer legitimamente em mais de uma categoria quando houver histórico real.

Exemplo:

um CPF pode ter atuado como Vigilante e também como Brigadista.

Nunca criar uma participação fictícia apenas para classificar um colaborador.

---

# 9. VIGILANTES

Campos administrativos principais:

- Nome
- CPF
- RG / Identidade
- Telefone
- Data de vencimento da reciclagem
- Cidade
- Grandes Eventos
- Nº DPF

### Reciclagem

O campo:

`colaboradores.reciclagem`

representa diretamente a data de vencimento da reciclagem.

Não adicionar automaticamente 2 anos.

### DPF

O Nº DPF é um campo de cadastro do Vigilante.

Não exigir DPF como pré-requisito quando a regra atual do sistema não exigir.

### Grandes Eventos

É específico dos Vigilantes.

Não deve aparecer no cadastro de Brigadistas.

Não deve aparecer em Demais Funções.

---

# 10. BRIGADISTAS

Campos:

- Nome
- CPF
- RG / Identidade
- Telefone
- Data de Vencimento do Curso
- Nº REGISTRO BRIGADISTA
- Cidade

### Regras

Para Brigadista:

`colaboradores.reciclagem`

representa diretamente a data de vencimento do curso.

O campo:

`numero_registro_brigadista`

representa o número de registro do Brigadista.

Não utilizar:

- Nº DPF
- Grandes Eventos
- Data de curso separada

### Crachá Brigadista

Existe uma identidade visual própria para Brigadista.

Utilizar:

`LOGO_BRIGADISTA_BASE64`

Frente:

- logo;
- `BRIGADISTA EVENTUAL`;
- nome completo.

Verso:

- CPF;
- Identidade;
- VENC. CURSO;
- Nº REGISTRO.

No verso do crachá Brigadista NÃO exibir:

`SAMSEG SEGURANÇA PRIVADA`

Também não exibir:

- Nº DPF;
- Grandes Eventos.

O cabeçalho deve utilizar:

`VÁLIDO SOMENTE EM EVENTOS DO GRUPO ANJOS DA PAZ`

---

# 11. DEMAIS FUNÇÕES

Campos:

- Nome
- CPF
- RG / Identidade
- Cidade
- Telefone
- Função

Não exibir:

- Data de curso;
- Reciclagem;
- Nº DPF;
- Grandes Eventos;
- Nº Registro Brigadista.

Nunca tratar Demais Funções como Vigilante por padrão.

Nunca exigir campos específicos de Vigilante para Demais Funções.

A função deve ser uma função real informada pelo usuário.

Não usar `VIGILANTE` ou `BRIGADISTA` como valor fictício.

RPC administrativo:

`upsert_colaborador_banco_demais_v1`

---

# 12. IDENTIDADE / RG

Reutilizar as funções existentes no sistema sempre que possível:

- `formatIdentidadeMG`
- `identidadeValida`
- `maskIdentidadeInput`

A identificação deve aceitar qualquer UF.

Formato esperado:

`UF-N.NNN.NNN`

ou

`UF-NN.NNN.NNN`

Não assumir automaticamente que toda identidade é de MG.

Não criar nova lógica de identidade se a lógica existente puder ser reutilizada.

---

# 13. RECICLAGEM / VALIDADE

Regra de exibição:

### Vermelho

Quando:

`reciclagem < hoje`

### Amarelo

Quando:

`reciclagem >= hoje`

e

`reciclagem <= hoje + 15 dias`

### Verde

Quando:

`reciclagem > hoje + 15 dias`

Hoje e exatamente +15 dias pertencem à condição amarela.

---

# 14. REGRAS DE ESCALA — VIGILANTES

Para Vigilante:

### Evento de um dia

A reciclagem deve ser válida até a data do evento.

Condição:

`reciclagem >= data do evento`

### Evento de vários dias

A reciclagem deve permanecer válida até o último dia do evento.

Condição:

`reciclagem >= data final do evento`

### Pré-Escala / link público

Quando a etapa exigir validação documental, verificar a validade da reciclagem.

### Escala Oficial manual

Não bloquear automaticamente um Vigilante sem data de reciclagem informada quando a regra atual permitir o cadastro manual.

Porém, quando houver uma data informada e ela estiver vencida, a validação deve considerar a data vencida.

---

# 15. EVENTOS

A tabela:

`public.eventos`

possui estrutura:

- `id`
- `criado_em`
- `atualizado_em`
- `dados`

Os dados do evento ficam em:

`eventos.dados`

que é `jsonb`.

Não presumir que campos como status, datas, horário, cliente ou equipe existam como colunas diretas.

Exemplo:

`eventos.dados.status`

### Status

Os estados utilizados são:

- `aberto`
- `finalizado`

---

# 16. EVENTOS FINALIZADOS

Evento finalizado representa histórico.

Não alterar histórico financeiro ou operacional de evento finalizado sem autorização explícita.

Especialmente:

`propagar_dados_colaborador`

deve atualizar somente eventos abertos.

Eventos finalizados devem permanecer preservados.

---

# 17. PROPAGAÇÃO DE DADOS DE COLABORADOR

Quando os dados de um colaborador forem alterados:

podem ser propagados para eventos ABERTOS relacionados.

Não alterar eventos FINALIZADOS.

A propagação não deve modificar histórico já encerrado.

---

# 18. PARTICIPAÇÕES

A tabela:

`participacoes`

possui, entre outros:

- `id`
- `evento_id`
- `cpf`
- `funcao`
- `telefone`
- `escalado`
- `desconto`
- `anulada`
- `anulada_em`
- `anulada_motivo`

A participação é registro operacional do evento.

Não criar participação apenas para alimentar cadastro central ou classificação.

---

# 19. PARTICIPAÇÃO POR DIA

A tabela:

`participacao_dias`

é alimentada pela rotina de definição da escala por dia.

Não presumir que toda confirmação de participação cria automaticamente um registro em `participacao_dias`.

A rotina:

`definir_escala_dia`

é responsável por essa definição quando utilizada pela interface.

---

# 20. PRESENÇAS

A tabela:

`presencas`

representa os registros de presença/check-in/check-out.

Não confundir:

- cadastro do colaborador;
- participação no evento;
- escala;
- presença.

Cada etapa possui função própria.

---

# 21. FECHAMENTO

Existe estrutura de fechamento financeiro do evento.

Não duplicar regras financeiras em vários pontos do frontend.

Sempre que possível, utilizar a lógica centralizada existente, incluindo:

`getEventFinancials`

Antes de alterar cálculos financeiros:

1. localizar a função existente;
2. entender sua origem;
3. verificar onde é usada;
4. alterar no ponto central quando isso evitar duplicidade.

---

# 22. RPCs E SEGURANÇA

RPCs administrativos devem seguir princípio de menor privilégio.

Preferir:

`SECURITY DEFINER`

com:

`SET search_path = public`

Quando a RPC for administrativa:

- evitar disponibilização para `anon`;
- conceder somente a roles necessárias;
- manter validações no backend.

### Fluxo público

RPCs públicas devem validar:

- evento;
- validade do link;
- CPF;
- autorização;
- função;
- campos obrigatórios;
- demais regras aplicáveis.

Nunca confiar somente na validação do frontend.

---

# 23. RPCs IMPORTANTES

Existem RPCs já utilizadas pelo sistema, incluindo:

`registrar_participacao`

`upsert_cpf_autorizado`

`listar_categorias_colaboradores`

`salvar_colaborador_cracha_v2`

`salvar_colaborador_cracha_v3`

`salvar_colaborador_cracha_brigadista_v1`

`upsert_colaborador_banco_brigadista_v1`

`upsert_colaborador_banco_demais_v1`

`propagar_dados_colaborador`

Antes de criar uma nova RPC, verificar se já existe uma função equivalente.

Não criar duplicações desnecessárias.

Quando for possível corrigir uma RPC existente com:

`CREATE OR REPLACE FUNCTION`

preferir essa abordagem, desde que a assinatura seja preservada ou a substituição esteja explicitamente autorizada.

---

# 24. NOVO COLABORADOR — REGRA DE FORMULÁRIO

O botão:

`+ Novo Colaborador`

deve identificar a aba atualmente selecionada.

### Vigilantes

Abrir formulário já direcionado para Vigilante.

Exibir os campos específicos de Vigilante.

### Brigadistas

Abrir formulário já direcionado para Brigadista.

Não exigir seleção manual da função quando ela já estiver determinada pela aba.

Exibir somente campos aplicáveis ao Brigadista.

### Demais Funções

Abrir formulário direcionado para Demais Funções.

Exibir:

- Nome;
- CPF;
- RG / Identidade;
- Cidade;
- Telefone;
- Função.

Não exibir campos de Vigilante ou Brigadista.

---

# 25. BANCO DE COLABORADORES — TABELAS VISUAIS

## Vigilantes

Colunas:

`FUNÇÃO | NOME | CPF | RG / IDENTIDADE | DATA DE VENCIMENTO DA RECICLAGEM | CIDADE | GRANDES EVENTOS | Nº DPF | TELEFONE`

## Brigadistas

Colunas:

`FUNÇÃO | NOME | CPF | RG / IDENTIDADE | DATA DE VENCIMENTO DO CURSO | CIDADE | Nº REGISTRO BRIGADISTA | TELEFONE`

## Demais Funções

Colunas:

`FUNÇÃO | NOME | CPF | RG / IDENTIDADE | CIDADE | TELEFONE`

Não colocar campos irrelevantes em cada categoria.

---

# 26. FILTROS DO BANCO DE COLABORADORES

Os filtros existentes incluem:

- Nome;
- CPF;
- Telefone;
- Cidade;
- Grandes Eventos;
- Situação da Reciclagem.

Os filtros devem funcionar de forma cumulativa.

Quando mais de um filtro estiver preenchido, utilizar lógica AND.

O filtro Cidade deve funcionar nas três categorias.

Grandes Eventos não se aplica a Brigadistas e Demais Funções.

---

# 27. CPF

Normalizar CPF antes de comparar ou salvar.

O formato visual deve ser:

`000.000.000-00`

Nunca usar CPF formatado como critério inconsistente de comparação no banco quando a rotina já trabalha com CPF normalizado.

---

# 28. EVENTOS NOTURNOS / VIRADA DE DATA

Eventos podem começar em um dia e terminar no dia seguinte.

Exemplo:

Início:

19/09/2026 18:00

Fim:

20/09/2026 05:00

Isso é um evento válido.

Nunca rejeitar automaticamente um evento somente porque a hora final é menor que a hora inicial.

Ao validar eventos noturnos, considerar a data e hora completas de início e fim.

---

# 29. EVENTOS COM VÁRIOS DIAS

Eventos podem possuir múltiplos dias de trabalho.

A escala por dia deve respeitar os dias efetivamente selecionados.

Quando houver conflito de colaborador em outro evento:

- mostrar o conflito;
- informar a data correspondente;
- informar o horário do outro evento;
- em eventos de vários dias, mostrar somente o dia em que o colaborador está escalado no outro evento.

Não bloquear automaticamente uma operação que o fluxo atual permita autorização manual, salvo quando a regra existente determinar bloqueio.

---

# 30. FLUXO DE AUTORIZAÇÃO POR CPF

O gestor pode autorizar CPF para determinado evento.

A autorização deve estar relacionada à função.

O mesmo CPF não pode ser autorizado de forma conflitante em eventos no mesmo período quando a regra de conflito aplicável impedir.

A autorização de CPF não deve ser confundida com escala.

Autorização ≠ Pré-Escala ≠ Escala Oficial ≠ Presença.

---

# 31. FLUXO OPERACIONAL DO EVENTO

A estrutura esperada das subabas dentro de cada evento é:

1. CPF Autorizado
2. Pré-Escala
3. Escala Oficial
4. Escala e Horário por Dia
5. Checkout por Dia
6. Valores por Função
7. Fechamento Financeiro
8. Aprovação do Gestor
9. Totais
10. Arquivos
11. Notas

Não alterar essa estrutura sem solicitação explícita.

---

# 32. COMUNICAÇÃO À POLÍCIA FEDERAL

Após a conclusão da:

`Escala Oficial`

existe uma etapa de comunicação à Polícia Federal.

Essa etapa deve permanecer imediatamente após a Escala Oficial no fluxo operacional.

Quando aplicável, a relação deve considerar os vigilantes efetivamente escalados.

Não mover essa etapa sem solicitação explícita.

---

# 33. CRACHÁS

Existem fluxos separados para:

- Vigilantes;
- Brigadistas.

Não misturar campos ou identidade visual entre eles.

Antes de modificar impressão de crachás:

1. localizar `renderImpressaoCrachas()`;
2. identificar bloco Vigilante;
3. identificar bloco Brigadista;
4. alterar somente o bloco necessário.

Preservar layout existente sempre que possível.

---

# 34. IMPRESSÃO — APROVAÇÃO DO GESTOR

Na aba:

`Aprovação do Gestor`

deve existir apenas o relatório definido pelo fluxo atual.

O relatório final deve conter:

- tabelas do evento;
- somas parciais por função;
- soma final do evento;
- soma final na última tabela do relatório.

Não criar relatório separado para a Presidência quando o fluxo atual determinar apenas um relatório.

---

# 35. EXCLUSÃO E REABERTURA DE EVENTOS

Excluir evento exige senha.

Reabrir evento finalizado exige senha diferente da senha de exclusão.

As duas credenciais devem permanecer independentes.

Nunca usar a mesma senha para as duas operações.

Não remover essa proteção durante correções.

---

# 36. REGRA DE ALTERAÇÃO DE CÓDIGO

Ao alterar `index.html`:

- reutilizar funções existentes;
- preservar IDs;
- preservar classes;
- preservar nomes de funções;
- preservar comportamento não relacionado;
- alterar somente os trechos necessários.

Antes de adicionar nova função:

verificar se já existe função equivalente.

Antes de adicionar novo HTML:

verificar se já existe estrutura reutilizável.

Antes de adicionar novo CSS:

verificar se já existe classe aplicável.

---

# 37. EVITAR DUPLICAÇÃO

Não duplicar:

- regras de validação;
- cálculos financeiros;
- filtros;
- classificação;
- componentes de formulário;
- consultas Supabase;
- máscaras;
- lógica de impressão.

Quando já existir uma função central adequada, reutilizá-la.

---

# 38. BANCO DE DADOS — CUIDADO EXTRA

Nunca assumir estrutura de tabela.

Antes de escrever SQL para uma tabela existente:

verificar a estrutura real.

Nunca presumir que um campo seja coluna direta se ele pode estar dentro de:

`dados jsonb`

Especialmente em:

`public.eventos`

---

# 39. HISTÓRICO E INTEGRIDADE

O sistema possui histórico operacional e financeiro.

Preservar:

- eventos finalizados;
- participações;
- presenças;
- fechamentos;
- dados históricos.

Uma correção do cadastro atual não pode modificar silenciosamente o histórico encerrado.

---

# 40. SUBAGENTS / EXPLORAÇÃO

Para tarefas simples em um único arquivo:

não utilizar exploração paralela ou subagentes sem necessidade.

Só usar exploração ampla quando houver benefício claro e concreto.

O objetivo é reduzir custo, tempo e risco de alterações desnecessárias.

---

# 41. CUSTO DE EXECUÇÃO

Priorizar comandos curtos e direcionados.

Não executar análise completa do projeto para uma alteração localizada.

Quando o problema estiver claramente localizado:

ler somente:

- função relevante;
- HTML relevante;
- CSS diretamente relacionado;
- RPC diretamente relacionada.

---

# 42. RELATÓRIO APÓS ALTERAÇÃO

Após realizar uma alteração, responder de forma compacta com:

### Diagnóstico
Qual era a causa.

### Alteração
O que foi modificado.

### Testes
O que foi testado.

### Resultado
Se passou ou se existe pendência.

### Banco
Informar claramente se algum SQL foi executado ou se apenas foi preparado.

### Publicação
Informar claramente que a publicação não foi realizada, salvo autorização explícita.

Não produzir relatórios longos quando a alteração for simples.

---

# 43. REGRA FINAL

Sempre seguir:

**LOCALIZAR → DIAGNOSTICAR → ALTERAR MINIMAMENTE → TESTAR → REVISAR DIFF → RELATAR**

O sistema deve evoluir por mudanças pequenas, controladas e reversíveis.

A prioridade é:

**FUNCIONAMENTO CORRETO + PRESERVAÇÃO DO HISTÓRICO + MÍNIMO RISCO + MÍNIMA ALTERAÇÃO**
