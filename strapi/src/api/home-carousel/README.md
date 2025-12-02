# Home Carousel

API para gerenciar os banners do carrossel da página inicial.

## Especificações de Imagem

### Formato Recomendado
- **Dimensões**: 1800x720px
- **Proporção**: 5:2 (largura:altura)
- **Formato**: JPG ou PNG
- **Tamanho máximo**: 500KB (recomendado para performance)

### Campos de Imagem

#### Desktop (obrigatório)
- Campo principal usado em todos os dispositivos
- Mantém a proporção 5:2 em todas as telas (mobile, tablet, desktop)
- Use `object-fit: cover` para garantir que a imagem preencha todo o espaço

#### Mobile (opcional)
- Campo legado mantido para compatibilidade
- Atualmente não é usado no frontend
- Pode ser removido em futuras versões

## Estrutura de Dados

```json
{
  "nome": "Nome do banner para identificação",
  "instituicao": {
    "slug": "unama"
  },
  "desktop": {
    "url": "https://...",
    "alternativeText": "Descrição da imagem para acessibilidade"
  }
}
```

## Ordenação

Os banners são ordenados alfabeticamente pelo campo `nome` em ordem ascendente.

## Uso

Os banners são exibidos automaticamente no carrossel da home, com:
- Transição automática a cada 5 segundos
- Animação de slide (deslizamento) entre banners
- Pausa temporária (10s) quando o usuário navega manualmente
