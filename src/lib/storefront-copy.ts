import type { ShopTenant } from "@/types/shop-tenant";

interface StorefrontCopyRecord {
  readonly [key: string]: unknown;
}

interface StorefrontCopyHomeFeature {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

export interface ResolvedStorefrontHomeCopy {
  readonly hero: {
    readonly eyebrow: string;
    readonly line1: string;
    readonly line2Italic: string;
    readonly line3: string;
    readonly welcomeLead: string;
    readonly primaryCtaLabel: string;
    readonly secondaryCtaLabel: string;
    readonly heroImageUrl: string;
    readonly heroImageAlt: string;
  };
  readonly statsCard: {
    readonly eyebrow: string;
    readonly scoreLine: string;
    readonly footnote: string;
  };
  readonly cornerCard: {
    readonly eyebrow: string;
    readonly title: string;
  };
  readonly sections: {
    readonly featuredTitle: string;
    readonly featuredEyebrow: string;
    readonly catalogTitle: string;
    readonly catalogEyebrow: string;
  };
  readonly categories: {
    readonly eyebrow: string;
    readonly sectionTitle: string;
    readonly ctaLabel: string;
  };
  readonly features: readonly StorefrontCopyHomeFeature[];
  readonly newsletter: {
    readonly eyebrow: string;
    readonly titlePrefix: string;
    readonly titleItalic: string;
    readonly body: string;
    readonly emailSrLabel: string;
    readonly emailPlaceholder: string;
    readonly idleLabel: string;
    readonly loadingLabel: string;
    readonly successLabel: string;
    readonly footnote: string;
  };
}

export interface ResolvedStorefrontFuturePhaseCopy {
  readonly products: Record<string, string>;
  readonly cart: Record<string, string>;
  readonly checkout: Record<string, string>;
  readonly account: Record<string, string>;
  readonly header: Record<string, string>;
  readonly footer: Record<string, string>;
  readonly errors: Record<string, string>;
}

export interface ResolvedStorefrontCopy {
  readonly home: ResolvedStorefrontHomeCopy;
  readonly futurePhases: ResolvedStorefrontFuturePhaseCopy;
}

export const STOREFRONT_COPY_PHASE_KEYS = {
  phase2: ["products"],
  phase3: ["cart", "checkout"],
  phase4: ["account"],
  phase5: ["header", "footer", "errors"],
} as const;

const DEFAULT_HOME_COPY: ResolvedStorefrontHomeCopy = {
  hero: {
    eyebrow: `Colecao · ${new Date().getFullYear()}`,
    line1: "Tudo comeca",
    line2Italic: "com um gesto",
    line3: "de cuidado",
    welcomeLead:
      "Curadoria cuidadosa para o cotidiano. Pecas que se tornam parte da historia de quem as escolhe.",
    primaryCtaLabel: "Ver produtos",
    secondaryCtaLabel: "Novidades",
    heroImageUrl: "/hero-image.jpg",
    heroImageAlt: "Imagem principal da colecao da loja",
  },
  statsCard: {
    eyebrow: "Avaliacao · 2.4k",
    scoreLine: "4.9",
    footnote: "clientes recomendam",
  },
  cornerCard: {
    eyebrow: "Curadoria",
    title: "pecas que duram",
  },
  sections: {
    featuredTitle: "Em destaque",
    featuredEyebrow: "Curadoria · a dedo",
    catalogTitle: "Todos os produtos",
    catalogEyebrow: "Catalogo completo",
  },
  categories: {
    eyebrow: "Colecoes · 2026",
    sectionTitle: "Por categoria",
    ctaLabel: "Explorar",
  },
  features: [
    {
      eyebrow: "01 · Entrega",
      title: "Frete gratis",
      description: "Em compras acima de R$ 199, seguro e rastreado.",
    },
    {
      eyebrow: "02 · Confianca",
      title: "Pagamento protegido",
      description: "Criptografia em todos os processos, sem excecao.",
    },
    {
      eyebrow: "03 · Tranquilidade",
      title: "7 dias para trocar",
      description: "Satisfacao garantida. O risco e nosso, nao seu.",
    },
  ],
  newsletter: {
    eyebrow: "Boletim editorial",
    titlePrefix: "Fique por",
    titleItalic: "dentro",
    body: "Historias de bastidores, lancamentos antecipados e convites exclusivos. Um e-mail por mes, sem ruido.",
    emailSrLabel: "Seu melhor email",
    emailPlaceholder: "voce@email.com",
    idleLabel: "Assinar",
    loadingLabel: "Enviando",
    successLabel: "Obrigada",
    footnote: "Sem spam · cancele quando quiser",
  },
};

const DEFAULT_FUTURE_PHASE_COPY: ResolvedStorefrontFuturePhaseCopy = {
  products: {},
  cart: {},
  checkout: {},
  account: {},
  header: {},
  footer: {},
  errors: {},
};

function asRecord(value: unknown): StorefrontCopyRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as StorefrontCopyRecord;
}

function asText(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function mergeFeature(
  value: unknown,
  fallback: StorefrontCopyHomeFeature,
): StorefrontCopyHomeFeature {
  const source = asRecord(value);
  if (!source) {
    return fallback;
  }
  return {
    eyebrow: asText(source.eyebrow, fallback.eyebrow),
    title: asText(source.title, fallback.title),
    description: asText(source.description, fallback.description),
  };
}

function mergeFeatures(value: unknown): readonly StorefrontCopyHomeFeature[] {
  if (!Array.isArray(value)) {
    return DEFAULT_HOME_COPY.features;
  }
  const resolved = DEFAULT_HOME_COPY.features.map((feature, index) =>
    mergeFeature(value[index], feature),
  );
  return resolved.length > 0 ? resolved : DEFAULT_HOME_COPY.features;
}

export function resolveStorefrontHomeCopy(
  tenant: ShopTenant | null | undefined,
): ResolvedStorefrontHomeCopy {
  const tenantDescription =
    typeof tenant?.description === "string" && tenant.description.trim().length > 0
      ? tenant.description.trim()
      : DEFAULT_HOME_COPY.hero.welcomeLead;
  const settings = asRecord(tenant?.settings);
  const storefrontCopy = asRecord(settings?.storefrontCopy);
  const home = asRecord(storefrontCopy?.home);
  const hero = asRecord(home?.hero);
  const statsCard = asRecord(home?.statsCard);
  const cornerCard = asRecord(home?.cornerCard);
  const sections = asRecord(home?.sections);
  const categories = asRecord(home?.categories);
  const newsletter = asRecord(home?.newsletter);

  return {
    hero: {
      eyebrow: asText(hero?.eyebrow, DEFAULT_HOME_COPY.hero.eyebrow),
      line1: asText(hero?.line1, DEFAULT_HOME_COPY.hero.line1),
      line2Italic: asText(hero?.line2Italic, DEFAULT_HOME_COPY.hero.line2Italic),
      line3: asText(hero?.line3, DEFAULT_HOME_COPY.hero.line3),
      welcomeLead: asText(hero?.welcomeLead, tenantDescription),
      primaryCtaLabel: asText(
        hero?.primaryCtaLabel,
        DEFAULT_HOME_COPY.hero.primaryCtaLabel,
      ),
      secondaryCtaLabel: asText(
        hero?.secondaryCtaLabel,
        DEFAULT_HOME_COPY.hero.secondaryCtaLabel,
      ),
      heroImageUrl: asText(hero?.heroImageUrl, DEFAULT_HOME_COPY.hero.heroImageUrl),
      heroImageAlt: asText(hero?.heroImageAlt, DEFAULT_HOME_COPY.hero.heroImageAlt),
    },
    statsCard: {
      eyebrow: asText(statsCard?.eyebrow, DEFAULT_HOME_COPY.statsCard.eyebrow),
      scoreLine: asText(statsCard?.scoreLine, DEFAULT_HOME_COPY.statsCard.scoreLine),
      footnote: asText(statsCard?.footnote, DEFAULT_HOME_COPY.statsCard.footnote),
    },
    cornerCard: {
      eyebrow: asText(cornerCard?.eyebrow, DEFAULT_HOME_COPY.cornerCard.eyebrow),
      title: asText(cornerCard?.title, DEFAULT_HOME_COPY.cornerCard.title),
    },
    sections: {
      featuredTitle: asText(
        sections?.featuredTitle,
        DEFAULT_HOME_COPY.sections.featuredTitle,
      ),
      featuredEyebrow: asText(
        sections?.featuredEyebrow,
        DEFAULT_HOME_COPY.sections.featuredEyebrow,
      ),
      catalogTitle: asText(
        sections?.catalogTitle,
        DEFAULT_HOME_COPY.sections.catalogTitle,
      ),
      catalogEyebrow: asText(
        sections?.catalogEyebrow,
        DEFAULT_HOME_COPY.sections.catalogEyebrow,
      ),
    },
    categories: {
      eyebrow: asText(categories?.eyebrow, DEFAULT_HOME_COPY.categories.eyebrow),
      sectionTitle: asText(
        categories?.sectionTitle,
        DEFAULT_HOME_COPY.categories.sectionTitle,
      ),
      ctaLabel: asText(categories?.ctaLabel, DEFAULT_HOME_COPY.categories.ctaLabel),
    },
    features: mergeFeatures(home?.features),
    newsletter: {
      eyebrow: asText(newsletter?.eyebrow, DEFAULT_HOME_COPY.newsletter.eyebrow),
      titlePrefix: asText(
        newsletter?.titlePrefix,
        DEFAULT_HOME_COPY.newsletter.titlePrefix,
      ),
      titleItalic: asText(
        newsletter?.titleItalic,
        DEFAULT_HOME_COPY.newsletter.titleItalic,
      ),
      body: asText(newsletter?.body, DEFAULT_HOME_COPY.newsletter.body),
      emailSrLabel: asText(
        newsletter?.emailSrLabel,
        DEFAULT_HOME_COPY.newsletter.emailSrLabel,
      ),
      emailPlaceholder: asText(
        newsletter?.emailPlaceholder,
        DEFAULT_HOME_COPY.newsletter.emailPlaceholder,
      ),
      idleLabel: asText(newsletter?.idleLabel, DEFAULT_HOME_COPY.newsletter.idleLabel),
      loadingLabel: asText(
        newsletter?.loadingLabel,
        DEFAULT_HOME_COPY.newsletter.loadingLabel,
      ),
      successLabel: asText(
        newsletter?.successLabel,
        DEFAULT_HOME_COPY.newsletter.successLabel,
      ),
      footnote: asText(newsletter?.footnote, DEFAULT_HOME_COPY.newsletter.footnote),
    },
  };
}

export function resolveStorefrontCopy(
  tenant: ShopTenant | null | undefined,
): ResolvedStorefrontCopy {
  const settings = asRecord(tenant?.settings);
  const storefrontCopy = asRecord(settings?.storefrontCopy);

  const coerceFutureRecord = (value: unknown): Record<string, string> => {
    const source = asRecord(value);
    if (!source) {
      return {};
    }
    return Object.entries(source).reduce<Record<string, string>>((acc, [key, item]) => {
      if (typeof item === "string" && item.trim().length > 0) {
        acc[key] = item.trim();
      }
      return acc;
    }, {});
  };

  return {
    home: resolveStorefrontHomeCopy(tenant),
    futurePhases: {
      products: coerceFutureRecord(storefrontCopy?.products),
      cart: coerceFutureRecord(storefrontCopy?.cart),
      checkout: coerceFutureRecord(storefrontCopy?.checkout),
      account: coerceFutureRecord(storefrontCopy?.account),
      header: coerceFutureRecord(storefrontCopy?.header),
      footer: coerceFutureRecord(storefrontCopy?.footer),
      errors: coerceFutureRecord(storefrontCopy?.errors),
    },
  };
}
