export const formatPrice = (price: number): string => {
  const formattedPrice = price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formattedPrice;
};
