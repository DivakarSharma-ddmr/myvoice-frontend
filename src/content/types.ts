export type Link = { label: string; href: string };

export type Block =
  | { type: 'p'; text: string; links: Link[] }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export type LegalDoc = {
  slug: string;
  title: string;
  effective?: string;
  revised?: string;
  sections: { id: string; heading: string; blocks: Block[] }[];
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  links: Link[];
};

export type FaqCategory = { name: string; items: FaqItem[] };
