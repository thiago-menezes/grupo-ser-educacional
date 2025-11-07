import {
  getAvailableInstitutions,
  getCurrentInstitution,
  getInstitutionTheme,
} from '@/config/institutions';
import styles from './page.module.scss';

const tokenSwatches = [
  {
    label: 'Primário sólido',
    variable: '--rs-color-background-primary',
    description: 'Aplicado em botões e CTAs principais.',
  },
  {
    label: 'Primário suave',
    variable: '--rs-color-background-primary-faded',
    description: 'Badges, estados focados e áreas de destaque suaves.',
  },
  {
    label: 'Contorno primário',
    variable: '--rs-color-border-primary',
    description: 'Bordas de cartões, inputs e steps ativos.',
  },
  {
    label: 'Texto primário',
    variable: '--rs-color-foreground-primary',
    description: 'Tipografia e ícones que refletem a cor da instituição.',
  },
] as const;

const componentTiles = [
  {
    title: 'Botão sólido',
    description: 'Fundo var(--rs-color-background-primary)',
    type: 'primary',
  },
  {
    title: 'Botão contorno',
    description: 'Borda var(--rs-color-border-primary)',
    type: 'outline',
  },
  {
    title: 'Botão ghost',
    description: 'Texto var(--rs-color-foreground-primary)',
    type: 'ghost',
  },
  {
    title: 'Badge',
    description: 'Usa var(--rs-color-background-primary-faded)',
    type: 'badge',
  },
] as const;

const buttonClassMap: Record<'primary' | 'outline' | 'ghost', string> = {
  primary: styles.buttonPrimary,
  outline: styles.buttonOutline,
  ghost: styles.buttonGhost,
};

const ThemePage = () => {
  const institutionId = getCurrentInstitution();
  const theme = getInstitutionTheme(institutionId);
  const availableInstitutions = getAvailableInstitutions();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <span className={styles.heroBadge}>Tematização dinâmica</span>
            <h1 className={styles.heroTitle}>
              Projeto base pronto para iniciar a primeira feature.
            </h1>
            <p className={styles.heroSubtitle}>
              A página abaixo mostra como o tema institucional é aplicado usando
              os tokens do Reshaped. Mude a variável
              <code> NEXT_PUBLIC_INSTITUTION </code>
              para validar outra marca antes de começar um novo fluxo.
            </p>
          </div>
          <div className={styles.heroInstitution}>
            <span>Instituição ativa</span>
            <strong>{theme.name}</strong>
            <small>Código: {theme.code}</small>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2>Paleta oficial</h2>
                <p>As cores abaixo vêm de {theme.name}.</p>
              </div>
              <span className={styles.metaBadge}>
                {availableInstitutions.length} instituições configuradas
              </span>
            </header>

            <div className={styles.palette}>
              <ColorSwatch
                label="Primária"
                hex={theme.primary}
                description="Botões, links e estados ativos."
              />
              <ColorSwatch
                label="Secundária"
                hex={theme.secondary}
                description="Realces, detalhes e badges."
              />
            </div>

            <ul className={styles.metaList}>
              <li>
                <span>Env var atual</span>
                <strong>{institutionId}</strong>
              </li>
              <li>
                <span>Opções disponíveis</span>
                <strong>{availableInstitutions.join(', ')}</strong>
              </li>
            </ul>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2>Tokens do Reshaped</h2>
                <p>Pré-visualização dos principais CSS custom properties.</p>
              </div>
            </header>

            <div className={styles.tokenList}>
              {tokenSwatches.map((token) => (
                <TokenSwatch key={token.variable} token={token} />
              ))}
            </div>
          </article>
        </section>

        <section className={styles.card}>
          <header className={styles.cardHeader}>
            <div>
              <h2>Componentes de referência</h2>
              <p>
                Blocos simples que usam os mesmos tokens do Reshaped. Use como
                checklist visual antes de iniciar a próxima feature.
              </p>
            </div>
          </header>

          <div className={styles.componentsBoard}>
            {componentTiles.map((tile) => (
              <ComponentTile key={tile.title} tile={tile} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

type TokenSwatchProps = (typeof tokenSwatches)[number];

const TokenSwatch = ({ token }: { token: TokenSwatchProps }) => (
  <div className={styles.token}>
    <div
      className={styles.tokenColor}
      style={{ backgroundColor: `var(${token.variable})` }}
    />
    <div className={styles.tokenMeta}>
      <span className={styles.tokenLabel}>{token.label}</span>
      <code className={styles.tokenVariable}>{token.variable}</code>
      <p>{token.description}</p>
    </div>
  </div>
);

const ColorSwatch = ({
  label,
  hex,
  description,
}: {
  label: string;
  hex: string;
  description: string;
}) => (
  <div className={styles.swatch}>
    <div className={styles.swatchColor} style={{ backgroundColor: hex }} />
    <div className={styles.swatchInfo}>
      <strong>{label}</strong>
      <span>{hex}</span>
      <p>{description}</p>
    </div>
  </div>
);

const ComponentTile = ({
  tile,
}: {
  tile: (typeof componentTiles)[number];
}) => (
  <div className={styles.componentTile}>
    <div className={styles.componentMeta}>
      <strong>{tile.title}</strong>
      <p>{tile.description}</p>
    </div>
    <div className={styles.componentPreview}>
      {tile.type === 'badge' ? (
        <span className={styles.badge}>Tema ativo</span>
      ) : (
        <button type="button" className={buttonClassMap[tile.type]}>
          Ação
        </button>
      )}
    </div>
  </div>
);

export default ThemePage;
