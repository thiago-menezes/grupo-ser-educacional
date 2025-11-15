# DTO & API Reference

## DTO Layer

### Structure

```
dto/
├── courses/
│   ├── index.ts      # getCourses()
│   └── types.ts      # CourseData, CoursesResponseDTO, CourseModality
└── units/            # Reserved
```

### Pattern

- **`types.ts`**: Domain types and API response shapes
- **`index.ts`**: Async functions using `query()` from `libs/api/axios`

### Courses DTO

**Types:**

```typescript
type CourseData = {
  id: string;
  category: string;
  title: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  priceFrom: string; // Formatted string
  campusName: string;
  campusCity: string;
  campusState: string;
  slug: string;
};

type CoursesResponseDTO = {
  institution: string;
  state: string;
  city: string;
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
};

type CourseModality = 'presencial' | 'semipresencial' | 'ead';
```

**Function:**

```typescript
getCourses(
  institution: string,
  state: string,
  city: string,
  page: number,
  perPage: number,
): Promise<CoursesResponseDTO>
```

**Usage:**

```typescript
import { getCourses } from '@/dto/courses';

const data = await getCourses('uninassau', 'SP', 'São Paulo', 1, 12);
```

## Mock API Route

### `/api/mock/courses`

**File:** `app/api/mock/courses/route.ts`

**Query Params:**

- `institution` (required)
- `state` (required)
- `city` (required)
- `page` (optional, default: 1)
- `perPage` (optional, default: 12, max: 100)

**Response:** `CoursesResponseDTO`

**External API:**

- Path: `/p/{institution}/{state}/{city}/unidades/100/cursos`
- Base URL: `API_MOCK_BASE_URL` env var
- Transforms `CoursesDTO` → `CourseData[]`

**Types:**

```typescript
// app/api/mock/courses/types.ts
type Course = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
};

type CoursesDTO = {
  Cursos: Course[];
};
```

## Data Flow

```
Component/Hook
  ↓
getCourses()
  ↓
libs/api/axios.query()
  ↓
/api/mock/courses (dev) | External API (prod)
  ↓
CoursesResponseDTO
```

## Integration Points

- **React Query**: `features/course-search/course-grid/api/query.ts`
- **Components**: `components/course-card/types.ts`
- **Home Features**: `features/home/geo-courses/types.ts`

## Notes

- Development routes to `/api/mock/courses`
- Production uses `NEXT_PUBLIC_API_BASE_URL`
- Price currently hardcoded (should use API data)
- Some fields use placeholders ("NAO TEMOS INFORMACAO AINDA")
- Pagination done in-memory (consider server-side for large datasets)
