export const API_BASE_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : '';

export async function safeFetchJson(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return { success: false, status: res.status };
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return { success: false, error: 'Response is not JSON' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
