import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main>
      <div>
        <h1>Page not found</h1>
        <p>The page you’re looking for doesn’t exist.</p>
        <Link href="/">Go back home</Link>
      </div>
    </main>
  );
}
