export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    );
    const data = await response.json();
    return data.display_name;
  }