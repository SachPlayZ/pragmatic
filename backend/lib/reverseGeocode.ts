export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        'User-Agent': 'pragmatic-app/1.0 (srijan399@example.com)', // use your actual email
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Reverse geocoding failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.display_name;
}
