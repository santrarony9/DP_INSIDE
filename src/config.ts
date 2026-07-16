// API Configuration for DP Inside StudioOS
// This connects your frontend to the MongoDB backend on your VPS

// In production, set VITE_API_URL in .env file, or it defaults to empty string to use Vercel rewrites
// For local development, it falls back to the VPS IP
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://160.187.68.243:4000');

// Helper function for authenticated API calls
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('dpinside_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  // If unauthorized, clear token and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('dpinside_token');
    localStorage.removeItem('dpinside_user');
  }

  return response;
}

// Auth helpers
export function saveAuth(token: string, user: any): void {
  localStorage.setItem('dpinside_token', token);
  localStorage.setItem('dpinside_user', JSON.stringify(user));
}

export function getStoredUser(): any | null {
  const stored = localStorage.getItem('dpinside_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('dpinside_token');
}

export function clearAuth(): void {
  localStorage.removeItem('dpinside_token');
  localStorage.removeItem('dpinside_user');
}
