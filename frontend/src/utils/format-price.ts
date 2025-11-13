export const formatPrice = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR')}`;
};
