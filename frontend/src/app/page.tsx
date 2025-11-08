import Link from 'next/link';
import { Icon } from '@/components/icon';
import { getAvailableInstitutions, INSTITUTIONS } from '@/config/institutions';

export default function RootPage() {
  const institutions = getAvailableInstitutions();

  return (
    <main>
      <div>
        <header>
          <h1>Grupo SER Educacional</h1>
          <p>Selecione uma instituição para continuar</p>
        </header>

        <div>
          {institutions.map((id) => {
            const institution = INSTITUTIONS[id];
            const slug = id.toLowerCase();

            return (
              <Link
                key={id}
                href={`/${slug}`}
                style={
                  {
                    '--institution-primary': institution.primary,
                    '--institution-secondary': institution.secondary,
                  } as React.CSSProperties
                }
              >
                <div>
                  <h2>{institution.name}</h2>
                  <span>{institution.code}</span>
                </div>

                <div>
                  <div
                    style={{ backgroundColor: institution.primary }}
                    title={`Primária: ${institution.primary}`}
                  />
                  <div
                    style={{ backgroundColor: institution.secondary }}
                    title={`Secundária: ${institution.secondary}`}
                  />
                </div>

                <div>
                  <span>Acessar portal</span>
                  <Icon name="arrow-right" size={20} />
                </div>
              </Link>
            );
          })}
        </div>

        <footer>
          <p>
            {institutions.length} instituições disponíveis •{' '}
            <Link href="/uninassau">Ir para padrão (UNINASSAU)</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
