export function buildSearchParams(data: {
  city?: string;
  course?: string;
  modalities?: string[];
}): URLSearchParams {
  const params = new URLSearchParams();

  if (data.city?.trim()) {
    params.append('city', data.city.trim());
  }

  if (data.course?.trim()) {
    params.append('course', data.course.trim());
  }

  if (data.modalities?.length) {
    data.modalities.forEach((m) => params.append('modalities', m));
  }

  return params;
}
