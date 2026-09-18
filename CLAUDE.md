# CLAUDE.md
# Samseg — Gestão de Eventos

## REGRA PRINCIPAL

Este projeto deve ser mantido por alterações pequenas e localizadas.

Sempre:

LOCALIZAR → ENTENDER → ALTERAR O MÍNIMO → TESTAR → RELATAR

NÃO releia o projeto inteiro para uma tarefa localizada.

NÃO faça auditoria geral do sistema.

NÃO explore módulos que não tenham relação direta com a tarefa.

NÃO use subagents para tarefas simples/localizadas.

---

## ESCOPO

Frontend principal:

`index.html`

Tecnologias:

HTML5 / CSS / JavaScript / Supabase / PostgreSQL.

O objetivo é corrigir e evoluir o sistema existente.

Não modernizar.
Não reescrever.
Não refatorar sem necessidade.

---

## ALTERAÇÕES

Antes de alterar:

1. encontre a função/bloco diretamente relacionado;
2. leia somente o contexto necessário;
3. identifique a causa;
4. faça a menor alteração possível.

Preserve código, IDs, classes, funções e comportamentos existentes.

Não altere código não relacionado.

Não crie duplicações se já existir função reutilizável.

---

## BANCO DE DADOS

Não execute SQL destrutivo.

Não faça:

- DROP TABLE
- DROP COLUMN
- DELETE em massa
- recriação de tabelas
- migração de dados sem autorização

Se SQL for necessário:

primeiro explique a causa e mostre o SQL.

Não execute SQL de alteração de dados sem autorização explícita.

---

## PUBLICAÇÃO

Nunca:

- git push
- publicação
- deploy

sem autorização explícita.

Não alterar `APP_VERSION`, salvo quando solicitado.

---

## TESTES

Para alteração localizada:

teste somente:

1. a funcionalidade alterada;
2. suas dependências diretas.

Não teste módulos sem relação.

Se JavaScript for alterado, executar `node --check` quando aplicável.

Depois confira o diff para garantir que somente o necessário foi alterado.

---

# BANCO DE COLABORADORES

`public.colaboradores` é o cadastro central.

Não criar participação, evento, autorização, escala, presença ou checkout ao cadastrar colaborador.

### CLASSIFICAÇÃO

Qualquer função iniciada por:

`VIGILANTE`

deve ser tratada como:

`VIGILANTE`

Qualquer função iniciada por:

`BRIGADISTA`

deve ser tratada como:

`BRIGADISTA`

Demais funções mantêm sua função real.

O mesmo CPF pode existir nas categorias Vigilante e Brigadista.

Nunca criar participação artificial para classificar alguém.

---

## CAMPOS

### Vigilante

- Nome
- CPF
- RG / Identidade
- Telefone
- Reciclagem
- Cidade
- Grandes Eventos
- Nº DPF

### Brigadista

- Nome
- CPF
- RG / Identidade
- Telefone
- Vencimento do Curso
- Nº REGISTRO BRIGADISTA
- Cidade

Não usar DPF ou Grandes Eventos para Brigadista.

### Demais Funções

- Nome
- CPF
- RG / Identidade
- Cidade
- Telefone
- Função

Não exigir campos de Vigilante ou Brigadista.

---

## FUNÇÃO NO BANCO DE COLABORADORES

Na tabela visual:

- `VIGILANTE`, `VIGILANTE NOTURNO`, `VIGILANTE LÍDER`, etc. → mostrar `VIGILANTE`;
- `BRIGADISTA`, `BRIGADISTA EVENTUAL`, etc. → mostrar `BRIGADISTA`;
- Demais → mostrar função real.

Se `colaboradores.funcao` estiver vazio, verificar o histórico de participações antes de concluir que a função não existe.

Não inventar função.

---

## RECICLAGEM

`colaboradores.reciclagem` é diretamente a data de vencimento.

Não adicionar 2 anos automaticamente.

Vencimento:

- menor que hoje → vermelho;
- hoje até +15 dias → amarelo;
- acima de +15 dias → verde.

---

## EVENTOS

`public.eventos` possui os dados dentro de:

`eventos.dados`

Não presumir que campos do evento sejam colunas diretas.

Status:

- `aberto`
- `finalizado`

Eventos finalizados são históricos e não devem ser alterados por propagação de dados.

---

## PROPAGAÇÃO

Alterações de colaboradores podem ser propagadas somente para eventos abertos.

Nunca alterar automaticamente eventos finalizados.

---

## SEGURANÇA

RPCs administrativas devem usar menor privilégio possível.

Preferir:

`SECURITY DEFINER`

com:

`SET search_path = public`

Não conceder `anon` a RPC administrativa sem necessidade.

Fluxos públicos devem validar no backend os dados críticos.

---

## CRACHÁS

Existem fluxos separados para Vigilante e Brigadista.

Não misturar os campos.

Brigadista:

- logo própria;
- `BRIGADISTA EVENTUAL`;
- nome;
- CPF;
- Identidade;
- VENC. CURSO;
- Nº REGISTRO.

Cabeçalho Brigadista:

`VÁLIDO SOMENTE EM EVENTOS`
`GRUPO ANJOS DA PAZ`

`GRUPO ANJOS DA PAZ` deve permanecer inteiro na segunda linha.

Não exibir `SAMSEG SEGURANÇA PRIVADA` no verso do crachá Brigadista.

---

## EVENTOS NOTURNOS

Eventos podem começar em um dia e terminar no dia seguinte.

Exemplo válido:

19/09 18:00 → 20/09 05:00

Nunca considerar horário final menor que horário inicial como erro quando a data final for posterior.

---

## REGRA DE OURO

Para tarefas simples:

NÃO investigar o sistema inteiro.

NÃO fazer auditoria geral.

NÃO revisar funções não relacionadas.

NÃO criar documentação desnecessária.

NÃO usar subagents sem benefício claro.

Faça apenas o necessário para resolver a solicitação.

---

## RELATÓRIO

Relatório curto:

**Causa:**  
...

**Alteração:**  
...

**Teste:**  
...

**Pendência:**  
...

Não gerar relatório extenso para tarefa simples.
