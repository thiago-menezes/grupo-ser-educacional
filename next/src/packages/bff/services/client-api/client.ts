/**
 * Client API Service Client
 * Handles communication with the external client API for fetching units data
 */

export interface ClientApiConfig {
  baseUrl: string;
  timeout?: number;
}

/**
 * Client API Response Types (Portuguese field names from API)
 */
export interface ClientApiUnit {
  ID: number;
  Nome_Unidade: string;
  Estado: string;
  Cidade: string;
}

export interface ClientApiUnitsResponse {
  Unidades: ClientApiUnit[];
}

export interface ClientApiCourse {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
}

export interface ClientApiCoursesResponse {
  Cursos: ClientApiCourse[];
}

/**
 * Client API Service Client
 * Framework-agnostic service for fetching data from client's legacy API
 */
export class ClientApiClient {
  private config: ClientApiConfig;

  constructor(config: ClientApiConfig) {
    this.config = config;
  }

  /**
   * Build URL with proper encoding for city names
   * Handles spaces and special characters in city names
   */
  private buildUnitsUrl(
    institution: string,
    state: string,
    city: string,
  ): string {
    // Normalize to lowercase as per API requirements
    const normalizedInstitution = institution.toLowerCase();
    const normalizedState = state.toLowerCase();

    // URL encode city name to handle spaces and special characters
    // Example: "São José" -> "s%C3%A3o%20jos%C3%A9"
    const encodedCity = encodeURIComponent(city.toLowerCase());

    return `${this.config.baseUrl}/p/${normalizedInstitution}/${normalizedState}/${encodedCity}/unidades`;
  }

  /**
   * Build URL for courses by unit
   * Handles spaces and special characters in city names
   */
  private buildCoursesUrl(
    institution: string,
    state: string,
    city: string,
    unitId: number,
  ): string {
    // Normalize to lowercase as per API requirements
    const normalizedInstitution = institution.toLowerCase();
    const normalizedState = state.toLowerCase();

    // URL encode city name to handle spaces and special characters
    const encodedCity = encodeURIComponent(city.toLowerCase());

    return `${this.config.baseUrl}/p/${normalizedInstitution}/${normalizedState}/${encodedCity}/unidades/${unitId}/cursos`;
  }

  /**
   * Fetch units from client API
   */
  async fetchUnits(
    institution: string,
    state: string,
    city: string,
  ): Promise<ClientApiUnitsResponse> {
    const url = this.buildUnitsUrl(institution, state, city);

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
          `Client API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Client API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching units');
    }
  }

  /**
   * Fetch courses for a specific unit from client API
   */
  async fetchCoursesByUnit(
    institution: string,
    state: string,
    city: string,
    unitId: number,
  ): Promise<ClientApiCoursesResponse> {
    const url = this.buildCoursesUrl(institution, state, city, unitId);

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
          `Client API request failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Client API request timed out');
        }
        throw error;
      }

      throw new Error('Unknown error occurred while fetching courses');
    }
  }
}

/**
 * Create a Client API client instance
 */
export function createClientApiClient(baseUrl: string): ClientApiClient {
  return new ClientApiClient({
    baseUrl,
    timeout: 10000, // 10 seconds
  });
}
