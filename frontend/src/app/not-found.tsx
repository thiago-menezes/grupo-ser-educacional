import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main>
      <div>
        <h1>Página não encontrada</h1>
        <p>A página que você está procurando não existe.</p>
        <Link href="/">Voltar para a página inicial</Link>
      </div>
    </main>
  );
}
