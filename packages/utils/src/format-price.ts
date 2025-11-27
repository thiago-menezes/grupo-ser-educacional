export const formatPrice = (priceInCents: number): string => {
  if (priceInCents === 0) {
    return "R$ 0,00";
  }

  const priceInReais = priceInCents / 100;

  const formattedPrice = priceInReais.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedPrice;
};
