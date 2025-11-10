# Geo Courses Feature

Feature que exibe uma listagem de cursos filtrados por geolocalização. Inclui carousel responsivo (mobile) e grid (desktop) com cards de cursos.

## 📁 Estrutura de Arquivos

```
geo-courses/
├── index.tsx                 # Componente principal GeoCoursesSection
├── types.ts                  # Tipos internos da feature
├── styles.module.scss        # Estilos da seção
├── hooks.ts                  # Custom hook useGeoCourses
├── index-exports.ts          # Barrel exports
├── README.md                 # Este arquivo
├── course-card/
│   ├── index.tsx            # Componente CourseCard
│   ├── types.ts             # Types específicos do card
│   └── styles.module.scss   # Estilos do card
├── api/
│   ├── index.ts             # Funções de API e query keys
│   └── types.ts             # DTOs da API
└── mocks/
    └── index.ts             # Mock data para desenvolvimento
```

## 🚀 Como Usar

### Com Mock Data (Para Testes)

```typescript
import { GeoCoursesSection, MOCK_GEO_COURSES_DATA } from '@/features/geo-courses';

export function HomePage() {
  return (
    <GeoCoursesSection
      data={MOCK_GEO_COURSES_DATA}
      onCourseClick={(slug) => {
        console.log('Course clicked:', slug);
        // Navegar para página do curso
      }}
      onViewAllClick={() => {
        console.log('View all clicked');
        // Navegar para página de todos os cursos
      }}
    />
  );
}
```

### Com Hook useGeoCourses (Recomendado)

```typescript
import { GeoCoursesSection, useGeoCourses } from '@/features/geo-courses';

export function HomePage() {
  const { data, isLoading, error, refetch } = useGeoCourses({
    city: 'São José dos Campos',
    state: 'SP',
  });

  return (
    <GeoCoursesSection
      data={data}
      isLoading={isLoading}
      error={error}
      onCourseClick={(slug) => {
        console.log('Course clicked:', slug);
      }}
      onViewAllClick={() => {
        console.log('View all clicked');
      }}
    />
  );
}
```

### Com React Query / TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query';
import {
  GeoCoursesSection,
  fetchGeoCoursesSection,
  transformCourseDTO,
  GEO_COURSES_QUERY_KEYS,
} from '@/features/geo-courses';

export function HomePage() {
  const { data: dto, isLoading, error } = useQuery({
    queryKey: GEO_COURSES_QUERY_KEYS.list('São José dos Campos', 'SP'),
    queryFn: () => fetchGeoCoursesSection('São José dos Campos', 'SP'),
  });

  const data = dto
    ? {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        courses: dto.courses.map(transformCourseDTO),
      }
    : null;

  return (
    <GeoCoursesSection
      data={data}
      isLoading={isLoading}
      error={error?.message || null}
      onCourseClick={(slug) => {
        // Navigate to course
      }}
      onViewAllClick={() => {
        // Navigate to all courses
      }}
    />
  );
}
```

## 📊 Tipos de Dados

### CourseDTO (Vindo da API)

```typescript
type CourseDTO = {
  id: string;
  name: string;
  category: string;
  degree: string; // 'Bacharelado', 'Licenciatura', etc
  duration: string; // '5 anos (10 semestres)'
  modalities: CourseModality[]; // 'presencial' | 'semipresencial' | 'ead'
  price: number; // Em centavos, ex: 95010 = R$ 950,10
  campus: {
    name: string;
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  slug: string;
};
```

### CourseCardData (Interno)

```typescript
type CourseCardData = {
  id: string;
  category: string;
  title: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  priceFrom: string; // Formatado: "R$ 950,10"
  campusName: string;
  campusCity: string;
  campusState: string;
  slug: string;
};
```

## 🎨 Padrões Seguidos

✅ Componentes em **PascalCase**, estilos em **camelCase**
✅ **CSS Modules** com design tokens Reshaped
✅ **Icon component** centralizado (não SVGs inline)
✅ **Reshaped components** para Button
✅ **Tipos bem definidos** (Props, Data, DTO)
✅ **Geolocalização** com coordinates opcionais
✅ **Carrossel responsivo** (mobile) / Grid (desktop)
✅ **Acessibilidade** com ARIA labels

## 📱 Responsividade

- **Mobile**: Carrossel horizontal com scroll, pagination dots
- **Tablet (768px+)**: Grid com auto-fill
- **Desktop**: Grid completo com 4 colunas

## 🔌 Integração com API

A feature está preparada para integração com uma API REST:

```
GET /api/courses/geo?city=São%20José%20dos%20Campos&state=SP
```

Response esperado:
```json
{
  "title": "Encontre o seu curso e transforme sua carreira!",
  "description": "Explore nossa variedade...",
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
        "state": "SP"
      },
      "slug": "engenharia-civil"
    }
  ]
}
```

## 🧪 Exemplo com Mock

```typescript
import { MOCK_GEO_COURSES_DATA } from '@/features/geo-courses/mocks';

// Use para desenvolvimento e testes
console.log(MOCK_GEO_COURSES_DATA);
```

## 🔄 Transformação de Dados

A função `transformCourseDTO` converte dados da API para o formato interno:

```typescript
import { transformCourseDTO } from '@/features/geo-courses';

const courseData = transformCourseDTO(courseDTO);
// Formata preço, normaliza campos, etc
```

## 📌 Notas Importantes

- Preços na API vêm em centavos (número inteiro)
- A formatação de preço é feita automaticamente em BRL
- Coordenadas de geolocalização são opcionais
- Carrossel é automático com scroll, sem autoplay
- Botão "Ver todos os cursos" precisa de handler no pai
