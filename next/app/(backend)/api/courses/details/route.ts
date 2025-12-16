import { NextRequest, NextResponse } from 'next/server';
import {
  handleCourseDetailsFromStrapi,
  fetchCourseDetailsFromClientApi,
} from '@/packages/bff/handlers/courses';
import type {
  CourseDetailsErrorDTO,
  CourseDetailsResponseDTO,
} from '@/types/api/course-details';
import { getStrapiClient } from '../../services/bff';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query params
    const sku = searchParams.get('sku');
    const institution = searchParams.get('institution');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const unit = searchParams.get('unit');
    const admissionForm = searchParams.get('admissionForm');

    if (!sku) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        { error: 'sku query parameter is required' },
        { status: 400 },
      );
    }

    let courseDetails: CourseDetailsResponseDTO | null = null;

    // Try to get base course data from Strapi
    try {
      const strapiClient = getStrapiClient();
      courseDetails = await handleCourseDetailsFromStrapi(strapiClient, {
        courseSku: sku,
        courseSlug: sku,
      });
    } catch {
      // Strapi course not found, will try Client API only below
    }

    // If we have Client API params, fetch pricing data
    if (institution && state && city && unit) {
      try {
        const clientApiDetails = await fetchCourseDetailsFromClientApi({
          institution,
          state,
          city,
          unit,
          sku,
          admissionForm: admissionForm || undefined,
        });

        // If Strapi had data, enrich it; otherwise create from Client API
        if (courseDetails) {
          const unitIdNum = parseInt(unit, 10);
          const formattedCity =
            city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
          const formattedState = state.toUpperCase();

          // Check if unit exists, if not add it
          const unitExists = courseDetails.units.some(
            (u) => u.id === unitIdNum,
          );
          const enrichedUnits = unitExists
            ? courseDetails.units
            : [
                ...courseDetails.units,
                {
                  id: unitIdNum,
                  name: `Unidade ${formattedCity}`,
                  city: formattedCity,
                  state: formattedState,
                },
              ];

          // Keep modalities from Strapi if available, otherwise use Client API
          const enrichedModalities =
            courseDetails.modalities && courseDetails.modalities.length > 0
              ? courseDetails.modalities
              : [
                  {
                    id: 1,
                    name: clientApiDetails.Modalidade,
                    slug: clientApiDetails.Modalidade.toLowerCase(),
                  },
                ];

          courseDetails = {
            ...courseDetails,
            units: enrichedUnits,
            modalities: enrichedModalities,
            clientApiDetails,
          };
        } else {
          // Create course from Client API data with unit info from params
          const unitIdNum = parseInt(unit, 10);
          const formattedCity =
            city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
          const formattedState = state.toUpperCase();

          // Get pricing from first turno/forma/pagamento
          const firstTurno = clientApiDetails.Turnos?.[0];
          const firstForma = firstTurno?.FormasIngresso?.[0];
          const firstPagamento = firstForma?.TiposPagamento?.[0];
          const firstValor = firstPagamento?.ValoresPagamento?.[0];
          const price = firstValor ? parseFloat(firstValor.Mensalidade) : null;
          const priceFrom = price
            ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            : null;

          const duration = `${Math.floor(clientApiDetails.Periodo / 12)} anos`;

          courseDetails = {
            id: 0,
            name: clientApiDetails.Nome_Curso,
            slug: sku.toLowerCase().replace(/\./g, '-'),
            description: '',
            type: clientApiDetails.Modalidade,
            workload: null,
            category: { id: 0, name: 'Graduação' },
            duration,
            priceFrom,
            modalities: [
              {
                id: 1,
                name: clientApiDetails.Modalidade,
                slug: clientApiDetails.Modalidade.toLowerCase(),
              },
            ],
            units: [
              {
                id: unitIdNum,
                name: `Unidade ${formattedCity}`,
                city: formattedCity,
                state: formattedState,
              },
            ],
            offerings: [
              {
                id: 1,
                unitId: unitIdNum,
                modalityId: 1,
                periodId: 1,
                price,
                duration,
                enrollmentOpen: true,
                unit: {
                  id: unitIdNum,
                  name: `Unidade ${formattedCity}`,
                  city: formattedCity,
                  state: formattedState,
                },
                modality: {
                  id: 1,
                  name: clientApiDetails.Modalidade,
                  slug: clientApiDetails.Modalidade.toLowerCase(),
                },
                period: {
                  id: 1,
                  name: firstTurno?.Nome_Turno || 'Integral',
                },
              },
            ],
            clientApiDetails,
          };
        }
      } catch {
        if (!courseDetails) {
          throw new Error('Course not found in Strapi or Client API');
        }
      }
    }

    if (!courseDetails) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        {
          error: 'Course not found',
          message: `No course found for SKU: ${sku}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json<CourseDetailsResponseDTO>(courseDetails, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CourseDetailsErrorDTO>(
      {
        error: 'Failed to fetch course details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
