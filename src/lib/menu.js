export const CATEGORIES = [
  { id: "burgers", label: "Hambúrgueres", emoji: "🍔" },
  { id: "pizzas", label: "Pizzas", emoji: "🍕" },
  { id: "acai", label: "Açaí", emoji: "🍇" },
  { id: "porcoes", label: "Porções", emoji: "🍟" },
  { id: "bebidas", label: "Bebidas", emoji: "🥤" },
  { id: "sobremesas", label: "Sobremesas", emoji: "🍰" },
];

export const MENU = [
  // Hambúrgueres
  {
    id: "x-burger",
    category: "burgers",
    name: "X-Burger Clássico",
    description: "Pão brioche, hambúrguer 150g, queijo prato, alface, tomate e maionese da casa.",
    price: 22.9,
    emoji: "🍔",
  },
  {
    id: "x-bacon",
    category: "burgers",
    name: "X-Bacon",
    description: "Hambúrguer 150g, queijo cheddar, bacon crocante e barbecue.",
    price: 26.9,
    emoji: "🥓",
  },
  {
    id: "smash-duplo",
    category: "burgers",
    name: "Smash Duplo",
    description: "Dois smash burgers de 90g, queijo americano duplo e cebola caramelizada.",
    price: 29.9,
    emoji: "🍔",
  },
  {
    id: "x-salada",
    category: "burgers",
    name: "X-Salada",
    description: "Hambúrguer 150g, queijo, alface americana, tomate e milho.",
    price: 23.9,
    emoji: "🥬",
  },
  {
    id: "burger-veg",
    category: "burgers",
    name: "Burger Vegetariano",
    description: "Hambúrguer de grão-de-bico, queijo coalho, rúcula e tomate seco.",
    price: 25.9,
    emoji: "🌱",
  },

  // Pizzas
  {
    id: "pizza-margherita",
    category: "pizzas",
    name: "Pizza Margherita",
    description: "Molho de tomate, muçarela, tomate fresco e manjericão.",
    price: 39.9,
    emoji: "🍕",
  },
  {
    id: "pizza-calabresa",
    category: "pizzas",
    name: "Pizza Calabresa",
    description: "Calabresa fatiada, cebola roxa e azeitonas pretas.",
    price: 42.9,
    emoji: "🍕",
  },
  {
    id: "pizza-portuguesa",
    category: "pizzas",
    name: "Pizza Portuguesa",
    description: "Presunto, ovos, ervilha, cebola, azeitona e muçarela.",
    price: 45.9,
    emoji: "🍕",
  },
  {
    id: "pizza-4-queijos",
    category: "pizzas",
    name: "Pizza Quatro Queijos",
    description: "Muçarela, provolone, gorgonzola e parmesão.",
    price: 47.9,
    emoji: "🧀",
  },
  {
    id: "pizza-frango",
    category: "pizzas",
    name: "Pizza Frango c/ Catupiry",
    description: "Frango desfiado temperado coberto com catupiry original.",
    price: 44.9,
    emoji: "🍗",
  },

  // Açaí
  {
    id: "acai-300",
    category: "acai",
    name: "Açaí 300ml",
    description: "Açaí cremoso com banana e granola. Acompanha leite condensado.",
    price: 14.9,
    emoji: "🍇",
  },
  {
    id: "acai-500",
    category: "acai",
    name: "Açaí 500ml",
    description: "Açaí cremoso com 2 acompanhamentos à sua escolha.",
    price: 19.9,
    emoji: "🍇",
  },
  {
    id: "acai-700",
    category: "acai",
    name: "Açaí 700ml",
    description: "Açaí cremoso com 3 acompanhamentos à sua escolha.",
    price: 24.9,
    emoji: "🍇",
  },
  {
    id: "barca-acai",
    category: "acai",
    name: "Barca de Açaí",
    description: "1L de açaí com morango, banana, kiwi, granola, paçoca e nutella. Serve 2.",
    price: 39.9,
    emoji: "🛶",
  },

  // Porções
  {
    id: "batata-frita",
    category: "porcoes",
    name: "Batata Frita",
    description: "Porção de 400g com sal e orégano. Acompanha maionese da casa.",
    price: 18.9,
    emoji: "🍟",
  },
  {
    id: "batata-cheddar",
    category: "porcoes",
    name: "Batata c/ Cheddar e Bacon",
    description: "Porção de 400g coberta com cheddar cremoso e bacon em cubos.",
    price: 26.9,
    emoji: "🍟",
  },
  {
    id: "onion-rings",
    category: "porcoes",
    name: "Onion Rings",
    description: "Anéis de cebola empanados e crocantes, 300g.",
    price: 19.9,
    emoji: "🧅",
  },
  {
    id: "nuggets",
    category: "porcoes",
    name: "Nuggets (10 un.)",
    description: "Nuggets de frango crocantes com molho à escolha.",
    price: 16.9,
    emoji: "🍗",
  },

  // Bebidas
  {
    id: "refri-lata",
    category: "bebidas",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Fanta ou Sprite — 350ml.",
    price: 6.5,
    emoji: "🥤",
  },
  {
    id: "suco-natural",
    category: "bebidas",
    name: "Suco Natural 500ml",
    description: "Laranja, limão, abacaxi ou maracujá.",
    price: 9.9,
    emoji: "🍊",
  },
  {
    id: "milkshake",
    category: "bebidas",
    name: "Milk-shake 400ml",
    description: "Chocolate, morango ou ovomaltine com chantilly.",
    price: 15.9,
    emoji: "🥛",
  },
  {
    id: "agua",
    category: "bebidas",
    name: "Água Mineral",
    description: "Com ou sem gás — 500ml.",
    price: 4.0,
    emoji: "💧",
  },

  // Sobremesas
  {
    id: "brownie",
    category: "sobremesas",
    name: "Brownie c/ Sorvete",
    description: "Brownie de chocolate quente com bola de sorvete de creme.",
    price: 16.9,
    emoji: "🍫",
  },
  {
    id: "pudim",
    category: "sobremesas",
    name: "Pudim de Leite",
    description: "Fatia generosa de pudim com calda de caramelo.",
    price: 10.9,
    emoji: "🍮",
  },
  {
    id: "sorvete",
    category: "sobremesas",
    name: "Sorvete 2 Bolas",
    description: "Sabores: creme, chocolate, morango ou flocos.",
    price: 9.9,
    emoji: "🍨",
  },
];

export function formatPrice(value) {
  return value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
