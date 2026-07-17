// DP Inside StudioOS — Data Hooks (API + localStorage Cache)
// These hooks replace the direct useState calls in App.tsx
// They fetch from MongoDB via the API, and cache in localStorage for offline speed

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './config';
import type { TeamMember, Client, JobCard, SocialPost } from './types';
import { INITIAL_TEAM, INITIAL_CLIENTS, INITIAL_JOBS, INITIAL_SOCIAL_POSTS } from './data/mockData';

// Normalize MongoDB _id → id so frontend code can always use .id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeId(obj: any): any {
  if (obj && obj._id && !obj.id) {
    return { ...obj, id: obj._id };
  }
  return obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeList(list: any[]): any[] {
  return list.map(normalizeId);
}

// Generic localStorage cache helper
function getCached<T>(key: string, fallback: T): T {
  try {
    const cached = localStorage.getItem(`dpinside_${key}`);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore parse errors */ }
  return fallback;
}

function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`dpinside_${key}`, JSON.stringify(data));
  } catch { /* ignore storage full errors */ }
}

// ========================================================
// useTeam — Fetch & manage team members
// ========================================================
export function useTeam() {
  const [team, setTeam] = useState<TeamMember[]>(getCached('team', INITIAL_TEAM));
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await apiFetch('/api/team');
      if (res.ok) {
        const raw = await res.json();
        const data = normalizeList(raw);
        setTeam(data);
        setCache('team', data);
        setApiAvailable(true);
      }
    } catch {
      // API not available, use cached/mock data
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const addTeamMember = useCallback(async (member: Omit<TeamMember, 'id'> & { id?: string }) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch('/api/team', {
          method: 'POST',
          body: JSON.stringify(member)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setTeam(prev => {
            const updated = [...prev, saved];
            setCache('team', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through to local */ }
    }
    // Fallback: local-only
    const localMember = { ...member, id: member.id || `usr-${Date.now()}` } as TeamMember;
    setTeam(prev => {
      const updated = [...prev, localMember];
      setCache('team', updated);
      return updated;
    });
    return localMember;
  }, [apiAvailable]);

  const updateTeamMember = useCallback(async (id: string, updates: Partial<TeamMember>) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/team/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setTeam(prev => {
            const updated = prev.map(t => t.id === id || (t as any)._id === id ? { ...t, ...saved } : t);
            setCache('team', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through */ }
    }
    // Fallback: local-only
    setTeam(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      setCache('team', updated);
      return updated;
    });
  }, [apiAvailable]);

  const deleteTeamMember = useCallback(async (id: string) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/team/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setTeam(prev => {
            const updated = prev.filter(t => t.id !== id && (t as any)._id !== id);
            setCache('team', updated);
            return updated;
          });
          return true;
        }
      } catch { /* fall through */ }
    }
    setTeam(prev => {
      const updated = prev.filter(t => t.id !== id);
      setCache('team', updated);
      return updated;
    });
    return true;
  }, [apiAvailable]);

  return { team, setTeam, loading, apiAvailable, addTeamMember, updateTeamMember, deleteTeamMember, refetch: fetchTeam };
}

// ========================================================
// useJobs — Fetch & manage job cards
// ========================================================
export function useJobs() {
  const [jobs, setJobs] = useState<JobCard[]>(getCached('jobs', INITIAL_JOBS));
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await apiFetch('/api/jobs');
      if (res.ok) {
        const raw = await res.json();
        const data = normalizeList(raw);
        setJobs(data);
        setCache('jobs', data);
        setApiAvailable(true);
      }
    } catch {
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const addJob = useCallback(async (job: Omit<JobCard, 'id'> & { id?: string }) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch('/api/jobs', {
          method: 'POST',
          body: JSON.stringify(job)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setJobs(prev => {
            const updated = [saved, ...prev];
            setCache('jobs', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through */ }
    }
    const localJob = { ...job, id: job.id || `job-${Date.now()}` } as JobCard;
    setJobs(prev => {
      const updated = [localJob, ...prev];
      setCache('jobs', updated);
      return updated;
    });
    return localJob;
  }, [apiAvailable]);

  const updateJob = useCallback(async (id: string, updates: Partial<JobCard>) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/jobs/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setJobs(prev => {
            const updated = prev.map(j => j.id === id || (j as any)._id === id ? { ...j, ...saved } : j);
            setCache('jobs', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through */ }
    }
    setJobs(prev => {
      const updated = prev.map(j => j.id === id ? { ...j, ...updates } : j);
      setCache('jobs', updated);
      return updated;
    });
  }, [apiAvailable]);

  const deleteJob = useCallback(async (id: string) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setJobs(prev => {
            const updated = prev.filter(j => j.id !== id && (j as any)._id !== id);
            setCache('jobs', updated);
            return updated;
          });
          return true;
        }
      } catch { /* fall through */ }
    }
    setJobs(prev => {
      const updated = prev.filter(j => j.id !== id);
      setCache('jobs', updated);
      return updated;
    });
    return true;
  }, [apiAvailable]);

  return { jobs, setJobs, loading, apiAvailable, addJob, updateJob, deleteJob, refetch: fetchJobs };
}

// ========================================================
// useClients — Fetch & manage clients
// ========================================================
export function useClients() {
  const [clients, setClients] = useState<Client[]>(getCached('clients', INITIAL_CLIENTS));
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const res = await apiFetch('/api/clients');
      if (res.ok) {
        const raw = await res.json();
        const data = normalizeList(raw);
        setClients(data);
        setCache('clients', data);
        setApiAvailable(true);
      }
    } catch {
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const addClient = useCallback(async (client: Omit<Client, 'id'> & { id?: string }) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch('/api/clients', {
          method: 'POST',
          body: JSON.stringify(client)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setClients(prev => {
            const updated = [...prev, saved];
            setCache('clients', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through */ }
    }
    const localClient = { ...client, id: client.id || `cli-${Date.now()}` } as Client;
    setClients(prev => {
      const updated = [...prev, localClient];
      setCache('clients', updated);
      return updated;
    });
    return localClient;
  }, [apiAvailable]);

  const deleteClient = useCallback(async (id: string) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/clients/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setClients(prev => {
            const updated = prev.filter(c => c.id !== id && (c as any)._id !== id);
            setCache('clients', updated);
            return updated;
          });
          return true;
        }
      } catch { /* fall through */ }
    }
    setClients(prev => {
      const updated = prev.filter(c => c.id !== id);
      setCache('clients', updated);
      return updated;
    });
    return true;
  }, [apiAvailable]);

  return { clients, setClients, loading, apiAvailable, addClient, deleteClient, refetch: fetchClients };
}

// ========================================================
// useSocialPosts — Fetch & manage social posts
// ========================================================
export function useSocialPosts() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(getCached('socialPosts', INITIAL_SOCIAL_POSTS));
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await apiFetch('/api/social');
      if (res.ok) {
        const raw = await res.json();
        const data = normalizeList(raw);
        setSocialPosts(data);
        setCache('socialPosts', data);
        setApiAvailable(true);
      }
    } catch {
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = useCallback(async (post: Omit<SocialPost, 'id'> & { id?: string }) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch('/api/social', {
          method: 'POST',
          body: JSON.stringify(post)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setSocialPosts(prev => {
            const updated = [saved, ...prev];
            setCache('socialPosts', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through */ }
    }
    const localPost = { ...post, id: post.id || `post-${Date.now()}` } as SocialPost;
    setSocialPosts(prev => {
      const updated = [localPost, ...prev];
      setCache('socialPosts', updated);
      return updated;
    });
    return localPost;
  }, [apiAvailable]);

  const updatePost = useCallback(async (id: string, updates: Partial<SocialPost>) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/social/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const saved = normalizeId(await res.json());
          setSocialPosts(prev => {
            const updated = prev.map(p => p.id === id || (p as any)._id === id ? { ...p, ...saved } : p);
            setCache('socialPosts', updated);
            return updated;
          });
          return saved;
        }
      } catch { /* fall through */ }
    }
    setSocialPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      setCache('socialPosts', updated);
      return updated;
    });
  }, [apiAvailable]);

  const deletePost = useCallback(async (id: string) => {
    if (apiAvailable) {
      try {
        const res = await apiFetch(`/api/social/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setSocialPosts(prev => {
            const updated = prev.filter(p => p.id !== id && (p as any)._id !== id);
            setCache('socialPosts', updated);
            return updated;
          });
          return true;
        }
      } catch { /* fall through */ }
    }
    setSocialPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      setCache('socialPosts', updated);
      return updated;
    });
    return true;
  }, [apiAvailable]);

  return { socialPosts, setSocialPosts, loading, apiAvailable, addPost, updatePost, deletePost, refetch: fetchPosts };
}

// ========================================================
// useAuth — Fetch & manage authentication
// ========================================================
export function useAuth() {
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(getCached('currentUser', null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (pin: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone: pin })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('dpinside_token', data.token);
        setCache('currentUser', data.user);
        setCurrentUser(data.user);
      } else {
        setError(data.error || 'Invalid PIN');
      }
    } catch (err) {
      setError('Network error connecting to API');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dpinside_token');
    localStorage.removeItem('dpinside_currentUser');
    setCurrentUser(null);
  }, []);

  return { currentUser, login, logout, loading, error };
}
