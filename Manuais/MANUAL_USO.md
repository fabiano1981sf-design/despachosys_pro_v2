# DespachoSys Pro v2.0 - Manual de Uso

## Introdução

O **DespachoSys Pro** é um sistema ERP/CRM integrado que permite gerenciar todos os aspectos operacionais de uma empresa de despachos, logística e vendas. Este manual fornece instruções detalhadas sobre como utilizar cada módulo do sistema.

---

## Acesso ao Sistema

### Login

1. Acesse o endereço do sistema em seu navegador (ex: `http://seu-dominio.com`)
2. Clique em **"Entrar com Manus"** para fazer login
3. Insira suas credenciais de acesso
4. Você será redirecionado para o **Dashboard** principal

### Dashboard

O Dashboard apresenta uma visão geral do sistema com os seguintes indicadores:

| Indicador | Descrição |
|-----------|-----------|
| Total de Mercadorias | Quantidade de produtos cadastrados |
| Estoque Total | Unidades em estoque |
| Clientes | Número de clientes cadastrados |
| Despachos | Total de despachos registrados |
| Pedidos de Venda | Quantidade de pedidos |
| Oportunidades | Leads e oportunidades ativas |
| Contas a Pagar Vencidas | Contas com vencimento próximo |
| Contas a Receber Vencidas | Recebimentos pendentes |

---

## Módulo WMS & Logística

### Mercadorias

O módulo de Mercadorias permite gerenciar o catálogo de produtos da empresa.

**Acessar**: Menu lateral → **Mercadorias**

**Funcionalidades**:
- **Criar Mercadoria**: Clique em "Nova Mercadoria" e preencha os dados do produto
- **Editar**: Clique no ícone de lápis para modificar informações
- **Deletar**: Clique no ícone de lixeira para remover
- **Campos Principais**: Nome, SKU, Descrição, Categoria, Preço de Custo, Preço de Venda, Quantidade em Estoque

**Dica**: Mantenha os SKUs únicos e padronizados para facilitar rastreamento.

### Categorias

Organize as mercadorias em categorias para melhor gestão.

**Acessar**: Menu lateral → **Categorias**

**Funcionalidades**:
- Criar novas categorias de produtos
- Editar nomes e descrições
- Deletar categorias (se não tiverem produtos associados)

### Transportadoras

Cadastre as transportadoras utilizadas para despachos.

**Acessar**: Menu lateral → **Transportadoras**

**Campos Importantes**:
- Nome da Transportadora
- CNPJ
- Telefone
- Email
- Endereço
- Observações

### Despachos

Gerencie todos os despachos de mercadorias para clientes.

**Acessar**: Menu lateral → **Despachos**

**Criar Despacho**:
1. Clique em "Novo Despacho"
2. Selecione o Cliente
3. Escolha a Mercadoria e Quantidade
4. Insira o Código de Rastreio (opcional)
5. Selecione a Transportadora
6. Defina o Status (Pendente, Em Trânsito, Entregue, Cancelado)
7. Clique em "Salvar"

**Acompanhamento**: O código de rastreio permite que clientes acompanhem seus despachos na página pública de rastreamento.

### Movimentação de Estoque

Registre todas as entradas e saídas de mercadorias.

**Acessar**: Menu lateral → **Movimentação**

**Tipos de Movimentação**:
- **Entrada**: Compras, devoluções de clientes, ajustes
- **Saída**: Vendas, perdas, ajustes

**Criar Movimentação**:
1. Clique em "Nova Movimentação"
2. Selecione a Mercadoria
3. Escolha o Tipo (Entrada ou Saída)
4. Insira a Quantidade
5. Adicione um Motivo (obrigatório para auditoria)
6. Clique em "Registrar"

**Importante**: Movimentações não podem ser deletadas por questões de auditoria.

---

## Módulo CRM & Vendas

### Clientes

Gerencie o banco de dados de clientes.

**Acessar**: Menu lateral → **Clientes**

**Tipos de Cliente**:
- **Pessoa Física**: CPF, Nome
- **Pessoa Jurídica**: CNPJ, Razão Social, Nome Fantasia

**Informações Importantes**:
- Dados de contato (email, telefone)
- Endereço completo
- Limite de crédito
- Histórico de compras

### Oportunidades

Gerencie o pipeline de vendas com oportunidades.

**Acessar**: Menu lateral → **Oportunidades**

**Estágios da Oportunidade**:
1. **Prospecção**: Identificação de potencial cliente
2. **Qualificação**: Validação do interesse
3. **Proposta**: Apresentação de solução
4. **Negociação**: Discussão de termos
5. **Ganho**: Venda concretizada
6. **Perdido**: Oportunidade não realizada

**Criar Oportunidade**:
1. Clique em "Nova Oportunidade"
2. Insira um Título descritivo
3. Selecione o Cliente
4. Defina o Valor Estimado
5. Escolha a Probabilidade (0%, 25%, 50%, 75%, 100%)
6. Selecione o Estágio
7. Adicione Descrição (opcional)
8. Clique em "Salvar"

**Acompanhamento**: Atualize regularmente o estágio das oportunidades para manter o pipeline preciso.

### Pedidos de Venda

Crie e gerencie pedidos de venda com múltiplos itens.

**Acessar**: Menu lateral → **Pedidos de Venda**

**Criar Pedido**:
1. Clique em "Novo Pedido"
2. Selecione o Cliente
3. Adicione Itens:
   - Escolha a Mercadoria
   - Insira a Quantidade
   - Confirme o Preço Unitário
   - Clique em "+" para adicionar
4. Revise o Total Calculado
5. Defina o Status (Rascunho, Aprovado, Faturado, Cancelado)
6. Clique em "Criar Pedido"

**Cálculo Automático**: O sistema calcula automaticamente o total do pedido multiplicando quantidade × preço unitário.

---

## Módulo Financeiro

### Plano de Contas

Estruture a hierarquia contábil da empresa.

**Acessar**: Menu lateral → **Plano de Contas**

**Tipos de Conta**:
- **Receita**: Vendas, serviços, outras receitas
- **Despesa**: Custos operacionais, impostos, etc.

**Criar Conta**:
1. Clique em "Nova Conta"
2. Insira um Código (ex: 1.1.01)
3. Insira o Nome da Conta
4. Selecione o Tipo
5. Selecione Conta Pai (opcional, para criar hierarquia)
6. Clique em "Salvar"

**Estrutura Hierárquica**: Você pode criar contas pai e contas filhas para organizar melhor a estrutura contábil.

### Contas a Pagar

Gerencie os pagamentos que a empresa deve realizar.

**Acessar**: Menu lateral → **Contas a Pagar**

**Criar Conta a Pagar**:
1. Clique em "Nova Conta"
2. Insira uma Descrição
3. Insira o Fornecedor (opcional)
4. Insira o Valor
5. Defina a Data de Vencimento
6. Selecione a Conta Contábil (opcional)
7. Clique em "Salvar"

**Status Disponíveis**:
- **Aberto**: Conta não paga
- **Pago**: Conta quitada (insira Data de Pagamento)
- **Vencido**: Conta com vencimento passado
- **Cancelado**: Conta cancelada

**Alerta de Vencimento**: O sistema marca automaticamente como "Vencido" contas com data de vencimento no passado.

### Contas a Receber

Gerencie os recebimentos que a empresa deve receber.

**Acessar**: Menu lateral → **Contas a Receber**

**Criar Conta a Receber**:
1. Clique em "Nova Conta"
2. Insira uma Descrição
3. Selecione o Cliente (opcional)
4. Insira o Valor
5. Defina a Data de Vencimento
6. Selecione a Conta Contábil (opcional)
7. Clique em "Salvar"

**Registrar Recebimento**:
1. Clique no ícone de lápis para editar
2. Insira a Data de Recebimento
3. Altere o Status para "Recebido"
4. Clique em "Salvar"

---

## Módulo Administração

### Usuários

Gerencie os usuários do sistema.

**Acessar**: Menu lateral → **Usuários**

**Funções Disponíveis**:
- **Usuário**: Acesso básico ao sistema
- **Administrador**: Acesso completo e permissões de configuração

**Alterar Função de Usuário**:
1. Clique no ícone de lápis ao lado do usuário
2. Selecione a nova Função
3. Clique em "Atualizar Usuário"

**Nota**: Novos usuários são criados automaticamente ao fazer login via OAuth pela primeira vez.

### Configurações

Gerencie as configurações gerais do sistema.

**Acessar**: Menu lateral → **Configurações**

**Seções Disponíveis**:

**Configurações Gerais**: Informações da empresa (nome, CNPJ, email, telefone, endereço)

**Notificações**: Ative ou desative notificações por email e SMS

**Backup e Dados**: Configure backups automáticos do banco de dados

**Segurança**: Informações sobre autenticação OAuth e criptografia de dados

**Sobre**: Versão do sistema e informações de suporte

---

## Página Pública de Rastreamento

Clientes podem acompanhar seus despachos através de uma página pública.

**Acessar**: `http://seu-dominio.com/rastrear`

**Como Usar**:
1. Insira o Código de Rastreio do despacho
2. Clique em "Rastrear"
3. Visualize o Status e Histórico do despacho

**Informações Disponíveis**:
- Status atual (Pendente, Em Trânsito, Entregue)
- Data de despacho
- Transportadora responsável
- Observações adicionais

---

## Dicas e Boas Práticas

### Gestão de Estoque

1. **Atualize regularmente**: Registre todas as movimentações de estoque
2. **Use códigos padronizados**: Mantenha SKUs consistentes
3. **Monitore níveis críticos**: Estabeleça quantidades mínimas por produto
4. **Faça inventários periódicos**: Compare estoque do sistema com físico

### Gestão de Vendas

1. **Mantenha oportunidades atualizadas**: Atualize estágios regularmente
2. **Defina probabilidades realistas**: Baseie-se em histórico de conversão
3. **Acompanhe prazos**: Não deixe oportunidades estagnadas
4. **Registre feedback**: Documente motivos de perdas de oportunidades

### Gestão Financeira

1. **Reconcilie contas**: Compare registros do sistema com extratos bancários
2. **Acompanhe vencimentos**: Revise regularmente contas a pagar/receber
3. **Mantenha plano de contas atualizado**: Adicione novas contas conforme necessário
4. **Faça backups regulares**: Proteja dados financeiros críticos

---

## Troubleshooting Comum

### Não consigo fazer login

1. Verifique se está usando as credenciais corretas
2. Certifique-se de que a conta foi criada via OAuth
3. Limpe cache do navegador e tente novamente
4. Contate o administrador do sistema

### Erro ao criar registro

1. Verifique se todos os campos obrigatórios foram preenchidos
2. Confirme se os dados estão no formato correto
3. Tente novamente ou recarregue a página
4. Contate o suporte se o problema persistir

### Dados não aparecem na tabela

1. Verifique se há registros cadastrados
2. Tente recarregar a página (F5)
3. Limpe filtros se houver algum ativo
4. Verifique permissões de acesso

---

## Suporte e Contato

Para dúvidas, problemas ou sugestões:

- **Email**: suporte@despachosys.com.br
- **Documentação**: Consulte o arquivo `MANUAL_INSTALACAO.md` para questões técnicas
- **Feedback**: Suas sugestões ajudam a melhorar o sistema

---

**Versão do Manual**: 1.0  
**Data de Atualização**: Dezembro 2024  
**Desenvolvido por**: DespachoSys Team
