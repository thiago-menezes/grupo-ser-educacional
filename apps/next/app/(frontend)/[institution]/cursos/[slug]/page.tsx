'use client';

// export async function generateMetadata({ params }: CourseDetailsPageProps) {
//   const { institution, slug } = await params;

//   try {
//     // Use relative URL for server-side fetch in Next.js
//     const baseUrl =
//       process.env.NEXT_PUBLIC_BASE_URL ||
//       (typeof window === 'undefined'
//         ? 'http://localhost:3000'
//         : window.location.origin);

//     const response = await fetch(`${baseUrl}/api/courses/${slug}`, {
//       next: { revalidate: 3600 },
//     });

//     if (!response.ok) {
//       return {
//         title: 'Curso não encontrado',
//       };
//     }

//     const course = await response.json();

//     return {
//       title: `${course.name} - ${institution}`,
//       description:
//         course.description || `Saiba mais sobre o curso ${course.name}`,
//     };
//   } catch {
//     return {
//       title: 'Curso',
//     };
//   }
// }

export default function CourseDetailsRoute() {
  return;
}
