# Exemplo de Integração - Geo Courses

## Como Integrar na Página Home

### 1. Opção Simples (Com Mock Data)

```typescript
// src/app/page.tsx (ou arquivo da home)

import { HomeHero } from '@/features/home-hero';
import { GeoCoursesSection, MOCK_GEO_COURSES_DATA } from '@/features/geo-courses';

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Geo Courses Section - Logo abaixo da hero */}
      <GeoCoursesSection
        data={MOCK_GEO_COURSES_DATA}
        onCourseClick={(slug) => {
          // TODO: Navegar para página do curso
          console.log('Curso clicado:', slug);
        }}
        onViewAllClick={() => {
          // TODO: Navegar para página de todos os cursos
          console.log('Ver todos os cursos');
        }}
      />
    </>
  );
}
```

### 2. Opção com Hook Customizado (Recomendado)

```typescript
// src/app/page.tsx

import { useRouter } from 'next/navigation';
import { HomeHero } from '@/features/home-hero';
import { GeoCoursesSection, useGeoCourses } from '@/features/geo-courses';

export default function HomePage() {
  const router = useRouter();

  // Hook faz o fetch automático
  const { data, isLoading, error } = useGeoCourses({
    city: 'São José dos Campos',
    state: 'SP',
  });

  const handleCourseClick = (slug: string) => {
    router.push(`/courses/${slug}`);
  };

  const handleViewAllClick = () => {
    router.push('/courses');
  };

  return (
    <>
      <HomeHero />

      <GeoCoursesSection
        data={data}
        isLoading={isLoading}
        error={error}
        onCourseClick={handleCourseClick}
        onViewAllClick={handleViewAllClick}
      />
    </>
  );
}
```

### 3. Opção Avançada (Com React Query)

```typescript
// src/app/page.tsx

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { HomeHero } from '@/features/home-hero';
import {
  GeoCoursesSection,
  fetchGeoCoursesSection,
  transformCourseDTO,
  GEO_COURSES_QUERY_KEYS,
} from '@/features/geo-courses';

export default function HomePage() {
  const router = useRouter();

  const { data: coursesSectionDTO, isLoading, error } = useQuery({
    queryKey: GEO_COURSES_QUERY_KEYS.list('São José dos Campos', 'SP'),
    queryFn: () => fetchGeoCoursesSection('São José dos Campos', 'SP'),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Transformar DTO em dados internos
  const geoCoursesData = coursesSectionDTO
    ? {
        title: coursesSectionDTO.title,
        description: coursesSectionDTO.description,
        location: coursesSectionDTO.location,
        courses: coursesSectionDTO.courses.map(transformCourseDTO),
      }
    : null;

  const handleCourseClick = (slug: string) => {
    router.push(`/courses/${slug}`);
  };

  const handleViewAllClick = () => {
    router.push('/courses');
  };

  return (
    <>
      <HomeHero />

      <GeoCoursesSection
        data={geoCoursesData}
        isLoading={isLoading}
        error={error?.message || null}
        onCourseClick={handleCourseClick}
        onViewAllClick={handleViewAllClick}
      />
    </>
  );
}
```

## 🎯 Configuração do Environment

Adicione ao seu arquivo `.env.local`:

```bash
# API base URL (será usado por fetchGeoCoursesSection)
NEXT_PUBLIC_API_URL=http://localhost:8000
# ou para produção
NEXT_PUBLIC_API_URL=https://api.seudominio.com
```

## 🔌 Estrutura da API Esperada

A API deve responder no seguinte endpoint:

```
GET /api/courses/geo?city=São%20José%20dos%20Campos&state=SP
```

Com a seguinte resposta:

```json
{
  "title": "Encontre o seu curso e transforme sua carreira!",
  "description": "Cursos perto de você",
  "location": {
    "city": "São José dos Campos",
    "state": "SP",
    "coordinates": {
      "latitude": -23.1814,
      "longitude": -45.8883
    }
  },
  "courses": [
    {
      "id": "1",
      "name": "Engenharia civil",
      "category": "Engenharia & Tecnologia",
      "degree": "Bacharelado",
      "duration": "5 anos (10 semestres)",
      "modalities": ["presencial"],
      "price": 95010,
      "campus": {
        "name": "Unidade Aquarius",
        "city": "São José dos Campos",
        "state": "SP",
        "coordinates": {
          "latitude": -23.1813,
          "longitude": -45.8877
        }
      },
      "slug": "engenharia-civil"
    }
    // ... mais cursos
  ]
}
```

## ✅ Checklist de Integração

- [ ] Importar `GeoCoursesSection` no arquivo da home
- [ ] Decidir entre Mock Data, Hook ou React Query
- [ ] Implementar handlers `onCourseClick` e `onViewAllClick`
- [ ] Configurar `NEXT_PUBLIC_API_URL` no `.env.local`
- [ ] Testar responsividade (mobile/tablet/desktop)
- [ ] Testar carrossel (mobile)
- [ ] Testar grid (desktop)
- [ ] Testar estados de loading/error
- [ ] Validar acessibilidade (ARIA labels)

## 🎨 Personalizações Possíveis

### Alterar Localização
```typescript
// Para buscar cursos de outra cidade
const { data } = useGeoCourses({
  city: 'São Paulo',
  state: 'SP',
});
```

### Detectar Localização do Usuário (Futuro)
```typescript
// TODO: Implementar detecção automática baseada no IP/GPS
const [userLocation, setUserLocation] = useState({
  city: 'São José dos Campos',
  state: 'SP',
});

const { data } = useGeoCourses({
  city: userLocation.city,
  state: userLocation.state,
});
```

### Customizar Estilos
Edite `src/features/geo-courses/styles.module.scss` conforme necessário.

### Adicionar Mais Informações ao Card
Edite `src/features/geo-courses/course-card/index.tsx` e `types.ts`.
