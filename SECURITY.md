# Política de Segurança

## Versões Suportadas

| Versão | Suportada          |
|--------|--------------------|
| 0.1.x  | ✅                 |

## Reportando uma Vulnerabilidade

Se você encontrar uma vulnerabilidade de segurança no Yuzer Intelligence Engine:

1. **Não abra uma issue pública** — vulnerabilidades devem ser reportadas em privado
2. Envie um email para o mantenedor (disponível no perfil do GitHub)
3. Inclua:
   - Descrição do problema
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se aplicável)

### Processo

- Você receberá uma confirmação em até 48 horas
- O problema será avaliado e priorizado
- Correções serão implementadas e comunicadas
- Crédito será dado ao reportante (se desejado)

### Escopo

Este projeto é um motor de análise de dados puro (funções matemáticas/estatísticas). Não faz requisições de rede, não acessa sistema de arquivos e não executa código dinâmico. O risco de segurança é inerentemente baixo, mas bugs de lógica (ex: divisão por zero, NaN propagation) são tratados com a mesma seriedade.
