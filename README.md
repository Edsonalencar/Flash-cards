# Academic Hub Cards

> Sistema de revisão espaçada baseado no algoritmo SuperMemo-2 para otimização da retenção de conhecimento a longo prazo.

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Responsive-Mobile%20First-0f766e?style=flat" alt="Responsive">
  <img src="https://img.shields.io/badge/Storage-LocalStorage-c2410c?style=flat" alt="LocalStorage">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="License">
</p>

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Embasamento Científico](#embasamento-científico)
- [Funcionalidades](#funcionalidades)
- [Stack Técnica](#stack-técnica)
- [Começando](#começando)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Algoritmo de Revisão Espaçada](#algoritmo-de-revisão-espaçada)
- [Estrutura de Dados](#estrutura-de-dados)
- [Atalhos de Teclado](#atalhos-de-teclado)
- [Acessibilidade](#acessibilidade)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Sobre o Projeto

**Academic Hub Cards** é uma plataforma de curadoria e revisão de conteúdos desenvolvida para estudantes da **UFERSA** (Universidade Federal Rural do Semi-Árido). O sistema utiliza a técnica de **flashcards com repetição espaçada** para otimizar a retenção de conhecimento a longo prazo, combinando conceitos consolidados da psicologia cognitiva com uma interface moderna e intuitiva.

A aplicação funciona inteiramente no navegador, sem necessidade de backend, utilizando `LocalStorage` para persistência dos dados. Isso significa que seus cards e progresso ficam armazenados no próprio dispositivo, com privacidade total.

### Por que revisão espaçada?

Tradicionalmente, estudantes tendem a estudar intensivamente em curtos períodos antes das provas — uma prática conhecida como *cramming*. Embora possa produzir resultados imediatos, pesquisas demonstram que essa abordagem resulta em retenção precária a longo prazo. A revisão espaçada resolve esse problema ao programar revisões em intervalos crescentes, reforçando a memória justamente nos momentos em que ela começa a falhar.

---

## Embasamento Científico

O sistema é fundamentado em três pilares da psicologia cognitiva:

### 1. Curva do Esquecimento (Ebbinghaus, 1885)

Hermann Ebbinghaus demonstrou experimentalmente que a retenção de informações decai exponencialmente com o tempo. Sem revisão, retemos apenas cerca de 33% do conteúdo após 24 horas. Cada revisão bem-sucedida, porém, achata essa curva — tornando o esquecimento mais lento a cada ciclo.

### 2. Algoritmo SuperMemo-2 (Woźniak, 1985)

Desenvolvido por Piotr Woźniak, o SM-2 é um dos algoritmos mais influentes de repetição espaçada. Ele programa as próximas revisões baseando-se na avaliação subjetiva do estudante sobre sua recordação, multiplicando progressivamente os intervalos de cards bem memorizados.

### 3. Teoria da Carga Cognitiva (Sweller, 1988)

John Sweller demonstrou que a memória de trabalho possui capacidade limitada. Por isso, o sistema estabelece um **limite diário de 20 cards** para prevenir sobrecarga cognitiva e garantir sessões de estudo produtivas.

---

## Funcionalidades

- **Três modos de operação**: Estudar, Biblioteca e Progresso
- **Criação rápida de cards** com categorização
- **Algoritmo SM-2 simplificado** com quatro níveis de avaliação
- **Limite diário de 20 cards** para evitar sobrecarga cognitiva
- **Busca em tempo real** por pergunta, resposta ou categoria
- **Filtros por categoria** com contadores dinâmicos
- **Tema claro/escuro** com detecção automática da preferência do sistema
- **Estatísticas detalhadas** com distribuição por categoria
- **Design responsivo** (Mobile First) adaptado para qualquer dispositivo
- **Atalhos de teclado** para fluxo de estudo ágil
- **Persistência local** — todos os dados salvos no navegador
- **Acessibilidade** — ARIA labels, navegação por teclado, contraste WCAG AA
- **Cards de exemplo** pré-carregados na primeira execução

---

## Stack Técnica

| Tecnologia | Finalidade |
|------------|------------|
| **HTML5 Semântico** | Estrutura com `<main>`, `<section>`, `<article>`, `<nav>` |
| **CSS3 Moderno** | Flexbox, Grid, variáveis CSS, animações |
| **JavaScript ES6+** | Lógica da aplicação, manipulação DOM, algoritmo SM-2 |
| **LocalStorage API** | Persistência de dados no navegador |
| **Google Fonts** | Tipografia Fraunces, Inter e JetBrains Mono |

### Sem dependências externas

O projeto é construído inteiramente com tecnologias web nativas. **Zero frameworks, zero bibliotecas, zero build step.** Basta abrir o arquivo HTML no navegador.

---

## Começando

### Pré-requisitos

- Qualquer navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexão com a internet para carregar as fontes do Google Fonts (opcional — o app funciona offline com fontes de fallback)

### Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/academic-hub-cards.git
cd academic-hub-cards
```

Abra o arquivo `index.html` no navegador de sua preferência. Não há processo de build, instalação de dependências ou servidor necessário.

### Alternativa: servidor local

Caso prefira rodar em um servidor local (recomendado para desenvolvimento):

```bash
# Python 3
python -m http.server 8000

# Node.js (com http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Em seguida, acesse `http://localhost:8000` no navegador.

---

## Estrutura do Projeto

```
academic-hub-cards/
├── index.html          # Estrutura HTML semântica
├── styles.css          # Estilização com tema claro/escuro e responsividade
├── script.js           # Lógica da aplicação e algoritmo SM-2
└── README.md           # Este arquivo
```

O projeto segue uma arquitetura simples e direta, com separação clara entre estrutura, apresentação e comportamento.

---

## Como Usar

### Primeira execução

Ao abrir o aplicativo pela primeira vez, você encontrará quatro cards de exemplo pré-carregados, cobrindo tópicos variados (metacognição, algoritmos, circuitos, JavaScript). Eles servem como demonstração do funcionamento do sistema.

### Criando seus próprios cards

1. Navegue até a aba **Biblioteca**
2. Clique em **+ Novo card**
3. Preencha os três campos:
   - **Categoria**: Cálculo, JavaScript, Circuitos, etc. (você pode reutilizar ou criar novas)
   - **Pergunta**: O que você quer recordar
   - **Resposta**: A informação que deve ser retida
4. Clique em **Salvar card**

### Estudando

1. Acesse a aba **Estudar**
2. Leia a pergunta exibida no flashcard
3. Pense na resposta antes de revelá-la
4. Clique em **Revelar resposta** (ou pressione `Espaço`)
5. Avalie sua recordação em uma das quatro categorias:
   - **Errei** — não lembrei ou lembrei errado
   - **Difícil** — lembrei com muito esforço
   - **Bom** — lembrei normalmente
   - **Fácil** — lembrei instantaneamente

O sistema reprogramará automaticamente a próxima exibição do card com base em sua avaliação.

### Acompanhando o progresso

A aba **Progresso** oferece uma visão quantitativa do seu acervo:
- Total de cards e categorias
- Cards pendentes para hoje
- Cards dominados (intervalo ≥ 7 dias) vs. em aprendizado
- Distribuição visual por categoria

---

## Algoritmo de Revisão Espaçada

O sistema implementa uma versão simplificada do SM-2:

| Avaliação | Comportamento |
|-----------|---------------|
| **Errei** | Intervalo reiniciado para **1 dia** |
| **Difícil** | Intervalo reiniciado para **2 dias** |
| **Bom** | Se primeira revisão: **4 dias**. Caso contrário: intervalo atual × **2** |
| **Fácil** | Se primeira revisão: **7 dias**. Caso contrário: intervalo atual × **2.5** |

### Exemplo prático

Suponha que você crie um card hoje e o avalie como **Bom** nas próximas revisões:

| Revisão | Data | Intervalo | Próxima |
|---------|------|-----------|---------|
| 1ª      | Dia 0  | 1 dia  | Dia 1 |
| 2ª      | Dia 1  | 4 dias | Dia 5 |
| 3ª      | Dia 5  | 8 dias | Dia 13 |
| 4ª      | Dia 13 | 16 dias | Dia 29 |
| 5ª      | Dia 29 | 32 dias | Dia 61 |

Cards respondidos como **Fácil** crescem ainda mais rápido. Erros reiniciam o ciclo — garantindo que informações difíceis recebam mais atenção.

### Limite diário

O sistema limita a exibição a **20 cards por dia**, respeitando a Teoria da Carga Cognitiva. Cards pendentes excedentes serão apresentados no dia seguinte, priorizando sempre os mais atrasados.

---

## Estrutura de Dados

Os dados são armazenados no `LocalStorage` sob a chave `academicHubCards_v1`, seguindo o formato JSON:

```json
{
  "cards": [
    {
      "id": "1625061234",
      "pergunta": "O que é o motor V8?",
      "resposta": "Motor de execução JS do Google que usa compilação JIT.",
      "categoria": "JavaScript",
      "proximaRevisao": "2026-04-20",
      "intervalo": 4
    }
  ],
  "reviewedToday": ["1625061234"],
  "lastResetDate": "2026-04-16"
}
```

A preferência de tema é armazenada separadamente na chave `academicHubCards_theme` (`"light"` ou `"dark"`).

---

## Atalhos de Teclado

Durante a sessão de estudo, os seguintes atalhos aceleram o fluxo:

| Tecla | Ação |
|-------|------|
| `Espaço` | Revelar resposta |
| `1` | Avaliar como **Errei** |
| `2` | Avaliar como **Difícil** |
| `3` | Avaliar como **Bom** |
| `4` | Avaliar como **Fácil** |
| `Esc` | Fechar modal de edição/criação |

---

## Acessibilidade

O projeto foi construído considerando as diretrizes **WCAG 2.1 nível AA**:

- Marcação HTML semântica (`<main>`, `<section>`, `<article>`, `<nav>`, `<header>`)
- ARIA labels em todos os elementos interativos
- Navegação completa por teclado com `:focus-visible` de alta visibilidade
- Contraste de cores adequado em ambos os temas
- Respeito à preferência `prefers-reduced-motion` do sistema
- Hierarquia de cabeçalhos consistente
- Textos alternativos para elementos visuais
- Inputs com labels associados corretamente

---

## Roadmap

Funcionalidades planejadas para versões futuras:

- [ ] Exportação e importação de cards em JSON/CSV
- [ ] Suporte a imagens e fórmulas matemáticas (LaTeX) nos cards
- [ ] Modo de estudo reverso (resposta → pergunta)
- [ ] Histórico detalhado de desempenho por card
- [ ] Gráficos de evolução temporal da retenção
- [ ] Compartilhamento de decks entre usuários
- [ ] Sincronização opcional via conta externa
- [ ] PWA com suporte offline completo
- [ ] Agrupamento por decks/matérias além de categorias
- [ ] Estatísticas avançadas com curvas de retenção

---

## Contribuindo

Contribuições são bem-vindas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o projeto livre de dependências externas sempre que possível
- Preserve a compatibilidade com navegadores modernos
- Siga o padrão de código existente (tabs de 4 espaços, aspas simples em JS)
- Documente novas funcionalidades neste README
- Teste em ambos os temas (claro e escuro) e em dispositivos móveis

---

## Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.

---

## Referências

- Ebbinghaus, H. (1885). *Über das Gedächtnis: Untersuchungen zur experimentellen Psychologie.*
- Woźniak, P. A. (1990). *Optimization of learning: A new approach and computer application.*
- Sweller, J. (1988). *Cognitive load during problem solving: Effects on learning.* Cognitive Science, 12(2), 257–285.
- SuperMemo Research: [https://www.supermemo.com/en/archives1990-2015/english/ol/sm2](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)

---

<p align="center">
  Desenvolvido para estudantes da <strong>UFERSA</strong><br>
  <em>Sua consistência hoje se traduz em retenção de longo prazo.</em>
</p>
