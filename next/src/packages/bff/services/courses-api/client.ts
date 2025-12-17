/**
 * Courses API Client
 * Cliente HTTP para consumir a API fake de cursos (JSON Server)
 */

import type {
  CourseAPIRaw,
  CoursesAPIParams,
  CoursesAPIResponse,
} from './types';

export interface CoursesApiConfig {
  baseUrl: string;
  timeout?: number;
}

/**
 * Cliente para a API externa de cursos
 */
export class CoursesApiClient {
  private config: CoursesApiConfig;

  constructor(config: CoursesApiConfig) {
    this.config = config;
  }

  /**
   * Constrói URL com query params para JSON Server
   * JSON Server usa os nomes dos campos diretamente e operadores especiais
   */
  private buildCoursesUrl(params?: CoursesAPIParams): string {
    const url = new URL(`${this.config.baseUrl}/cursos`);

    if (params) {
      // JSON Server usa os nomes dos campos exatamente como estão no JSON
      if (params.nivel_ensino) {
        url.searchParams.append('Nivel_Ensino', params.nivel_ensino);
      }
      if (params.cidade) {
        url.searchParams.append('Cidade', params.cidade);
      }
      if (params.estado) {
        url.searchParams.append('Estado', params.estado);
      }
      if (params.modalidade) {
        url.searchParams.append('Modalidade', params.modalidade);
      }
      // Para busca parcial no nome do curso, JSON Server usa o operador _like
      if (params.curso_nome) {
        url.searchParams.append('Curso_Nome_like', params.curso_nome);
      }
      if (params.turno) {
        url.searchParams.append('Turno_Nome', params.turno);
      }
      // JSON Server usa operadores _gte (greater than or equal) e _lte (less than or equal)
      if (params.valor_min !== undefined) {
        url.searchParams.append('Valor_gte', params.valor_min.toString());
      }
      if (params.valor_max !== undefined) {
        url.searchParams.append('Valor_lte', params.valor_max.toString());
      }
    }

    return url.toString();
  }

  /**
   * Busca cursos no JSON Server
   * Retorna sempre um array de cursos
   */
  async fetchCourses(params?: CoursesAPIParams): Promise<CourseAPIRaw[]> {
    const url = this.buildCoursesUrl(params);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 10000,
    );

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Courses API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // A API fake pode retornar apenas um array ou um objeto com { cursos: [] }
      // Vamos suportar ambos os formatos
      if (Array.isArray(data)) {
        return data;
      }

      if (data.cursos && Array.isArray(data.cursos)) {
        return data.cursos;
      }

      throw new Error('Invalid response format from Courses API');
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Courses API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching courses');
    }
  }
}

/**
 * Factory para criar instância do cliente
 */
export function createCoursesApiClient(baseUrl: string): CoursesApiClient {
  return new CoursesApiClient({
    baseUrl,
    timeout: 15000, // 15 segundos (API mock pode ser mais lenta)
  });
}
