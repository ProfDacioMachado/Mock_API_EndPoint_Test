# Seleção e roteamento de LLM para tarefas de Engenharia de Software — bibliografia anotada

**Tema:** escolher o LLM (ou conjunto) ideal por tarefa de SE — geração de testes, reparo de código (APR), detecção de bugs — otimizando qualidade × custo de API × latência. Enquadramento SBSE.

**Data do levantamento:** 2026-09-01
**Verificação:** todo arXiv ID abaixo foi conferido contra a arXiv API (título + data de publicação batem). Itens sem arXiv foram conferidos na página do publisher. Os poucos não verificados estão na seção final.

---

## Eixo A — Roteamento, cascatas e ensembles de LLM (base geral, fora de SE)

Este é o corpo de método que o trabalho vai importar. Nenhum destes trata de Engenharia de Software.

### A.1 Trabalhos fundacionais

| Ref | Título | Ano | ID |
|---|---|---|---|
| Chen et al. | FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance | 2023 | arXiv:2305.05176 |

Cascata sequencial: consulta modelos do mais barato ao mais caro até um *scorer* aceitar a resposta. É o artigo que estabeleceu a métrica de trade-off custo × acurácia como objeto de pesquisa. Reporta redução de custo de até 98% em alguns datasets. **Papel no seu artigo:** baseline de cascata e origem do enquadramento econômico.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Jiang et al. | LLM-Blender: Ensembling Large Language Models with Pairwise Ranking and Generative Fusion | 2023 | arXiv:2306.02561 |

Ensemble: consulta N modelos, ranqueia par a par (PairRanker) e funde as melhores saídas (GenFuser). Contraponto ao roteamento — em vez de escolher um, combina todos. **Papel:** representa o extremo "custo alto, qualidade alta" do espaço de decisão.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Aggarwal et al. | AutoMix: Automatically Mixing Language Models | 2023 | arXiv:2310.12963 |

Auto-verificação: o modelo pequeno avalia a própria resposta e decide se escala pro grande. Usa um meta-verificador POMDP pra lidar com ruído da auto-avaliação. **Papel:** relevante direto pro seu tema, porque em SE existe sinal de verificação forte e barato (o teste roda ou não roda) que substitui a auto-avaliação ruidosa.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Ding et al. | Hybrid LLM: Cost-Efficient and Quality-Aware Query Routing | 2024 | arXiv:2404.14618 |

Roteador binário (pequeno vs. grande) treinado com rótulos de preferência, com knob explícito de qualidade-alvo. **Papel:** formalização mais limpa do roteamento binário.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Ong et al. | RouteLLM: Learning to Route LLMs with Preference Data | 2024 | arXiv:2406.18665 |

Framework de treino de roteadores com dados de preferência (Chatbot Arena) + data augmentation. Reporta ~85% de redução de custo mantendo ~95% da qualidade do GPT-4. É o trabalho mais citado da área. **Papel:** baseline obrigatório e fonte do vocabulário (*strong/weak model*, *cost threshold*, *call-performance threshold*).

### A.2 Benchmarks e avaliação de roteadores

| Ref | Título | Ano | ID |
|---|---|---|---|
| Hu et al. | RouterBench: A Benchmark for Multi-LLM Routing System | 2024 | arXiv:2403.12031 |
| Huang et al. | RouterEval: A Comprehensive Benchmark for Routing LLMs to Explore Model-level Scaling Up in LLMs | 2025 | arXiv:2503.10657 |
| — | LLMRouterBench: A Massive Benchmark and Unified Framework for LLM Routing | 2026 | arXiv:2601.07206 |
| — | RouteJudge: An Open Platform for Reproducible and Preference-Aware LLM Routing | 2026 | arXiv:2606.18774 |
| — | MMR-Bench: A Comprehensive Benchmark for Multimodal LLM Routing | 2026 | arXiv:2601.17814 |

RouterBench introduziu o protocolo (405k resultados de inferência pré-computados, curvas custo × qualidade). LLMRouterBench unifica 10 baselines em 21 datasets e mede o *gap* pro oráculo — reporta que ensemble routing bate qualquer política de modelo fixo em ~7% de acurácia média, mas ainda fica ~19% (relativo) abaixo do oráculo. **Papel:** esse gap pro oráculo é o argumento mais forte de que o problema está aberto. E: **nenhum desses benchmarks inclui tarefa de SE com execução de teste como sinal.** Esse é um dos seus gaps.

### A.3 Surveys e trabalho recente

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Dynamic Model Routing and Cascading for Efficient LLM Inference: A Survey | 2026 | arXiv:2603.04445 |
| — | LLM Router: Rethinking Routing with Prefill Activations | 2026 | arXiv:2603.20895 |
| — | CascadeDebate: Multi-Agent Deliberation for Cost-Aware LLM Cascades | 2026 | arXiv:2604.12262 |

O survey de 2026 organiza o espaço de projeto em três eixos — *quando* a decisão é tomada (pré-request, durante a inferência, pós-primeira-resposta), *que informação* alimenta a decisão (features da query, metadados do modelo, desempenho histórico) e *como* é computada (regras, classificador, RL, cascata). **Papel:** é a taxonomia que sua Revisão de Literatura deve adotar ou contestar.

---

## Eixo B — Roteamento / cascata / ensemble aplicado a CÓDIGO

Aqui a literatura afina, e é onde seu artigo se posiciona.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Model Cascading for Code: A Cascaded Black-Box Multi-Model Framework for Cost-Efficient Code Completion with Self-Testing | 2024 | arXiv:2405.15842 |

**O artigo mais próximo do seu, no eixo de método.** Combina cascata com auto-teste: usa testes gerados pelo próprio modelo tanto pra melhorar acurácia quanto pra decidir a escalada na cascata. Reporta redução média de custo de 26% (até 70% no melhor caso) mantendo ou melhorando acurácia. **Papel:** baseline direto. A limitação dele — só *code completion*, não cobre APR nem geração de teste — é sua abertura.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Ensemble Learning for Large Language Models in Text and Code Generation: A Survey | 2025 | arXiv:2503.13505 |

Taxonomia de 7 famílias: weight merging, knowledge fusion, mixture-of-experts, reward ensemble, output ensemble, routing, cascading. **Papel:** vocabulário canônico. Cite pra justificar que "roteamento" e "ensemble" são pontos de um mesmo espectro, não alternativas disjuntas.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Wisdom and Delusion of LLM Ensembles for Code Generation and Repair | 2025 | arXiv:2510.21513 |

**Achado central pro seu argumento:** mede o potencial teórico do ensemble em geração e reparo de código e mostra que a união dos modelos resolve muito mais do que qualquer modelo isolado — mas os mecanismos práticos de seleção capturam só uma fração disso. Ou seja: o oráculo é rico, o seletor é pobre. **Papel:** essa é a evidência de que existe folga a explorar, e ela é específica de código.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | SmartLLMs Scheduler: A Framework for Cost-Effective LLMs Utilization | 2025 | arXiv:2508.03258 |

Escalonador que aloca requisições entre LLMs sob restrição de orçamento. **Papel:** trata a mesma decisão do ponto de vista de sistema/scheduling, não de busca. Contraste metodológico útil.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Triage: Routing Software Engineering Tasks to Cost-Effective LLM Tiers via Code Quality Signals | 2026 | arXiv:2604.07494 |

**O trabalho mais próximo do seu tema, ponto.** Usa métricas de saúde de código (code health) como sinal de roteamento e faz decisão **em nível de tarefa** — escolhe o tier do modelo antes de gerar. Formula duas condições falsificáveis pra que o roteamento compense: (1) a taxa de acerto do tier leve em código saudável tem que superar a razão de custo entre tiers; (2) a métrica de saúde tem que discriminar o tier necessário com pelo menos efeito pequeno. O próprio artigo afirma que roteamento em nível de tarefa é *"a natural but unexplored granularity for SE"*.
**Papel: leitura obrigatória antes de escrever uma linha.** Ou você constrói em cima dele, ou precisa dizer por que sua formulação difere. Ele resolve parte do que seu contexto descreve.

---

## Eixo C — LLMs para geração de casos de teste (a tarefa-alvo)

| Ref | Título | Ano | ID |
|---|---|---|---|
| Schäfer et al. | An Empirical Evaluation of Using Large Language Models for Automated Unit Test Generation | 2023 | arXiv:2302.06527 (TSE / IEEE 10329992) |

TestPilot. Geração end-to-end de testes JavaScript, sem fine-tuning. **Papel:** baseline histórico e fonte de métricas (statement coverage, assertion quality).

| Ref | Título | Ano | ID |
|---|---|---|---|
| Chen et al. | ChatUniTest: A Framework for LLM-Based Test Generation | 2023 | arXiv:2305.04764 (FSE'24 Companion, 10.1145/3663529.3663801) |

Ciclo geração → validação → reparo, com contexto focal adaptativo. Java. **Papel:** o loop de reparo dele é literalmente uma cascata implícita (mesmo modelo, N tentativas) — vale contrastar com cascata entre modelos diferentes.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Pizzorno & Berger | CoverUp: Effective High Coverage Test Generation for Python | 2024 | arXiv:2403.16218 |

Geração guiada por cobertura: mede o que não foi coberto e realimenta o prompt. **Papel:** exemplo de sinal barato e objetivo (cobertura) guiando a decisão — exatamente o tipo de feature que um roteador de SE pode usar e que roteadores gerais não têm.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | On the Evaluation of Large Language Models in Unit Test Generation | 2024 | arXiv:2406.18181 |

Avaliação de 5 LLMs open-source em 17 projetos Java. **Papel:** evidência empírica de que os modelos têm pontos fortes complementares — pré-requisito lógico pra qualquer roteador fazer sentido.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | A Large-scale Empirical Study on Fine-tuning Large Language Models for Unit Testing | 2024 | arXiv:2412.16620 |

37 modelos, >3.000 GPU-hours A100. **Papel:** a maior matriz modelo × tarefa disponível pra teste unitário. Fonte potencial de dados pra treinar/avaliar um roteador sem gastar API.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Lira, Santos Neto, Avelino & Osório | Evaluating the Effectiveness and Cost-Efficiency of Large Language Models in Automated Unit Test Generation | 2025 | SBQS 2025, p. 108-119, doi:10.5753/sbqs.2025.13853 |

**Artigo brasileiro, SBQS.** Avalia LLMs em geração de teste unitário por cobertura de linha, cobertura de branch, hit rate **e custo**. Conclui que modelos baratos (Gemini 1.5 Flash, GPT-4o Mini) alcançam resultado competitivo com prompt otimizado. **Papel:** evidência empírica direta da premissa do seu contexto, em venue nacional — bom pra posicionar o artigo se o alvo for SBQS/SBES/CBSoft.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | EvoGPT: Leveraging LLM-Driven Seed Diversity to Improve Search-Based Test Suite Generation | 2025 | arXiv:2505.12424 |

Híbrido SBSE + LLM: usa o LLM pra gerar sementes diversas e a busca evolutiva pra refinar. Bate EvoSuite e TestART em cobertura e mutação. **Papel:** exemplo concreto de casamento SBSE × LLM na sua tarefa-alvo. Note a direção: aqui a busca otimiza *testes*, não *escolha de modelo*. Seu trabalho inverte isso.

---

## Eixo D — LLMs para reparo de código (APR) e o custo dos agentes

| Ref | Título | Ano | ID |
|---|---|---|---|
| Xia, Deng, Dunn & Zhang | Agentless: Demystifying LLM-based Software Engineering Agents | 2024 | arXiv:2407.01489 (FSE 2025) |

Processo fixo de três fases (localizar → reparar → validar), sem autonomia de ferramenta. Em SWE-bench Lite: 32,00% (96 correções) a **US$0,70 por instância**, melhor que agentes open-source mais caros. **Papel:** prova de que arquitetura mais simples e barata pode dominar — é o argumento de que o eixo custo não é secundário.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Dissecting the SWE-Bench Leaderboards: Profiling Submitters and Architectures of LLM- and Agent-Based Repair Systems | 2025 | arXiv:2506.17208 |

Perfila arquiteturas e submissões dos leaderboards. **Papel:** fonte secundária de dados custo × resolução por sistema — útil pra montar a fronteira de Pareto empírica sem rodar nada.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Evaluating Agent-based Program Repair at Google | 2025 | arXiv:2501.07531 |

APR agêntico em base industrial real. **Papel:** validade externa — o benchmark público não é a produção.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | A Survey of LLM-based Automated Program Repair: Taxonomies, Design Paradigms, and Applications | 2025 | arXiv:2506.23749 |
| — | A Comprehensive Survey on Benchmarks and Solutions in Software Engineering of LLM-Empowered Agentic System | 2025 | arXiv:2510.09721 |

Os dois surveys de enquadramento pro capítulo de literatura do lado APR/agentes.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | To Run or Not to Run: Analyzing the Cost-Effectiveness of Code Execution in LLM-Based Program Repair | 2026 | arXiv:2606.26978 |

Analisa quando *vale a pena* pagar pra executar o código durante o reparo. **Papel:** é uma decisão de roteamento de outro tipo — escolher a *ação* cara, não o *modelo* caro. Mesma estrutura de custo, e reforça que a decisão de orçamento em SE tem mais de um eixo.

---

## Eixo E — Detecção de bugs e vulnerabilidades

| Ref | Título | Ano | ID |
|---|---|---|---|
| Liu et al. | VulDetectBench: Evaluating the Deep Capability of Vulnerability Detection with Large Language Models | 2024 | arXiv:2406.07595 |

Cinco tarefas de dificuldade crescente. Modelos passam de 80% em identificação/classificação, mas caem abaixo de 30% em análise detalhada. **Papel:** perfil de dificuldade não-uniforme por subtarefa — exatamente a condição que torna roteamento por subtarefa vantajoso.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | LLMs in Software Security: A Survey of Vulnerability Detection Techniques and Insights | 2025 | arXiv:2502.07049 |

Survey de enquadramento pro terceiro tipo de tarefa.

---

## Eixo F — A raiz teórica: SBSE, algorithm selection e hiper-heurísticas

| Ref | Título | Ano | ID |
|---|---|---|---|
| Rice, J. R. | The Algorithm Selection Problem | 1976 | Advances in Computers, v.15, p.65-118 |

O enquadramento original: dado um espaço de problemas, um espaço de algoritmos e uma métrica de desempenho, aprender o mapeamento problema → algoritmo. **Papel: esta é a formalização de que seu artigo precisa.** "Escolher o LLM certo por instância" é o Algorithm Selection Problem de Rice com o portfólio trocado por LLMs e a métrica trocada por um vetor (qualidade, custo, latência). Citar Rice é o que transforma o trabalho de engenharia aplicada em contribuição SBSE. *(DOI a conferir na fonte original — não verifiquei automaticamente.)*

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | Search-Based Software Engineering and AI Foundation Models: Current Landscape and Future Roadmap | 2025 | arXiv:2505.19625 |

**Artigo âncora do enquadramento SBSE.** Mapeia o estado da interseção SBSE × modelos de fundação: prompting guiado por busca, otimização de prompt, sistemas híbridos, LLM como função de fitness / operador de crossover e mutação. **Papel:** é onde você localiza sua contribuição no roadmap deles, e provavelmente a melhor fonte pra achar o "future direction" que seu artigo atende.

| Ref | Título | Ano | ID |
|---|---|---|---|
| — | LLM-Driven Instance-Specific Heuristic Generation and Selection (InstSpecHH) | 2025 | arXiv:2506.00490 |

Particiona a classe de problema em subclasses pra gerar e selecionar heurísticas por instância, equilibrando custo de design automático × qualidade da solução. **Papel:** é a estrutura exata que você quer, aplicada a heurísticas em vez de modelos. Analogia forte e citável.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Callan & Petke | Multi-objective Genetic Improvement: A Case Study with EvoSuite | 2022 | SSBSE 2022, doi:10.1007/978-3-031-21251-2_8 |

Estende o Gin com NSGA-II pra otimizar tempo de execução e memória do EvoSuite (até 77,8% e 9,2%). **Papel:** precedente metodológico direto de otimização multiobjetivo aplicada a ferramenta de teste. É o modelo de como estruturar seus objetivos.

| Ref | Título | Ano | ID |
|---|---|---|---|
| Hou et al. | Large Language Models for Software Engineering: A Systematic Literature Review | 2023 | arXiv:2308.10620 (TOSEM) |

SLR canônica de LLM4SE. **Papel:** citação de contexto na Introdução.

**Sinal de venue:** existe chamada de artigos aberta na Springer — *"Search-Based Software Engineering in the Era of LLMs and Agentic Systems"* (coleção `link.springer.com/collections/jjcfecffai`). Se o alvo for internacional, é o encaixe mais óbvio.

---

## O gap — o que a literatura NÃO cobre

1. **Nenhum benchmark de roteamento usa sinal de verificação de SE.** RouterBench, RouterEval, LLMRouterBench e RouteJudge decidem com features da query e histórico. Em SE existe um oráculo barato e objetivo que texto geral não tem: *o teste passou, o patch compilou, a cobertura subiu*. Roteamento pós-hoc com verificação executável é estruturalmente diferente de roteamento por preferência humana.

2. **A folga medida não foi explorada.** *Wisdom and Delusion* (2510.21513) mostra que a união dos modelos resolve muito mais do que o melhor modelo isolado em código, e que os seletores atuais capturam pouco disso. LLMRouterBench mede ~19% relativo de gap pro oráculo. Ninguém atacou esse gap com busca multiobjetivo.

3. **Roteamento em SE é single-task e single-objective.** Model Cascading for Code (2405.15842) cobre só code completion. Triage (2604.07494) faz nível de tarefa mas com sinal único (code health) e roteamento por tier, e ele próprio declara a granularidade "unexplored". Ninguém tratou geração de teste + APR + detecção de bug sob uma formulação única.

4. **Latência é quase sempre ignorada.** A esmagadora maioria otimiza só qualidade × custo. Latência aparece como métrica reportada, raramente como objetivo. Em CI/CD ela é restrição dura.

5. **Falta a ponte formal com Rice.** A literatura de roteamento de LLM praticamente não cita Algorithm Selection nem hiper-heurísticas, apesar de estar reinventando o problema. Fazer essa ponte é contribuição conceitual barata e defensável.

---

## Não verificados

Apareceram nas buscas mas **não confirmei** título/ID contra a arXiv API — não cite sem conferir:
- RouteNLP: Closed-Loop LLM Routing with Conformal Cascading and Distillation Co-Optimization (arXiv:2604.23577)
- From Sampled Outcomes to Capability Distributions: Rethinking Supervision for LLM Routing (arXiv:2606.06924)
- xRouter: Training Cost-Aware LLMs Orchestration System via Reinforcement Learning (arXiv:2510.08439)
- SGAgent (arXiv:2602.23647), SWE-EVO (arXiv:2512.18470), SWE-Bench+ (arXiv:2410.06992)
- Ding et al. como autoria do Hybrid LLM e Ong et al. como autoria do RouteLLM: títulos e IDs verificados, **autoria não**.
