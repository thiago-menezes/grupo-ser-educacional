import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { isValidInstitution } from '@/config/institutions';
import { generateThemeInjectionScript } from '@/libs/themes/script-generator';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

export default async function InstitutionLayout({
  children,
  params,
}: InstitutionLayoutProps) {
  const { institution } = await params;

  // Validate institution slug - return 404 if invalid
  if (!isValidInstitution(institution)) {
    notFound();
  }

  // Generate theme injection script with institution slug
  // This prevents FOUC by injecting CSS before first paint
  const themeScript = generateThemeInjectionScript(institution);

  return (
    <>
      {/*
        CRITICAL: Blocking script that injects institution theme CSS.
        - Runs synchronously before React hydration
        - Prevents FOUC (Flash of Unstyled Content)
        - Do NOT add async or defer attributes
        - Small performance cost (~1-5ms) vs visual flash (~50-200ms)
      */}
      <script
        id="institution-theme-injection"
        dangerouslySetInnerHTML={{ __html: themeScript }}
      />
      <Header institution={institution} />
      {children}
    </>
  );
}
