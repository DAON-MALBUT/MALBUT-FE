import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://malbut-1096666471.ap-southeast-2.elb.amazonaws.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface VoiceCloneRequest {
  name: string;
  description?: string;
  user_id?: string;
  files: File[];
}

export interface VoiceResponse {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  sample_count?: number;
  total_duration?: number;
  status: string;
}

export interface TextToSpeechRequest {
  voice_id: string;
  text: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
  save_to_file?: boolean;
  filename?: string;
  user_id?: string;
  use_cache?: boolean;
}

export const voiceApi = {
  cloneVoice: async (data: VoiceCloneRequest): Promise<VoiceResponse> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.user_id) formData.append('user_id', data.user_id);
    data.files.forEach(file => formData.append('files', file));

    const response = await apiClient.post<VoiceResponse>('/v1/voice/voice-clone', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  textToSpeech: async (data: TextToSpeechRequest): Promise<Blob> => {
    const response = await apiClient.post('/v1/voice/text-to-speech', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  textToSpeechStream: async (params: {
    voice_id: string;
    text: string;
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  }): Promise<ReadableStream> => {
    const response = await fetch(
      `${apiClient.defaults.baseURL}/v1/voice/text-to-speech/stream?${new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      )}`,
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error('Stream failed');
    return response.body!;
  },

  listVoices: async (user_id?: string) => {
    const response = await apiClient.get('/v1/voice/voices', {
      params: user_id ? { user_id } : undefined,
    });
    return response.data;
  },

  getVoiceInfo: async (voice_id: string) => {
    const response = await apiClient.get(`/v1/voice/voices/${voice_id}`);
    return response.data;
  },

  deleteVoice: async (voice_id: string, user_id?: string) => {
    const response = await apiClient.delete(`/v1/voice/voices/${voice_id}`, {
      params: user_id ? { user_id } : undefined,
    });
    return response.data;
  },

  previewVoice: async (voice_id: string, text?: string): Promise<Blob> => {
    const response = await apiClient.get(`/v1/voice/voices/${voice_id}/preview`, {
      params: text ? { text } : undefined,
      responseType: 'blob',
    });
    return response.data;
  },
};

export interface CharacterCreateRequest {
  name: string;
  description?: string;
  persona: string;
  personality_traits?: string[];
  speaking_style?: string;
  background_story?: string;
  voice_id?: string;
  conversation_style?: string;
  response_length?: string;
  use_emojis?: boolean;
  formality_level?: string;
  knowledge_areas?: string[];
  interests?: string[];
  expertise_level?: string;
  prohibited_topics?: string[];
  is_public?: boolean;
}

export interface CharacterResponse {
  character_id: string;
  name: string;
  description?: string;
  persona: string;
  personality_traits?: string[];
  speaking_style?: string;
  background_story?: string;
  voice_id?: string;
  conversation_style: string;
  response_length: string;
  use_emojis: boolean;
  formality_level: string;
  knowledge_areas?: string[];
  interests?: string[];
  expertise_level: string;
  is_public: boolean;
  is_active: boolean;
  usage_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface CharacterStats {
  total_duration: number;
  last_used: string;
  average_rating: number;
  usage_count: number;
}

export const characterApi = {
  createCharacter: async (data: CharacterCreateRequest): Promise<CharacterResponse> => {
    const response = await apiClient.post<CharacterResponse>('/v1/character/characters', data);
    return response.data;
  },

  listCharacters: async (): Promise<CharacterResponse[]> => {
    const response = await apiClient.get<{ characters: CharacterResponse[] }>('/v1/character/characters');
    return response.data.characters;
  },

  getCharacter: async (characterId: string): Promise<CharacterResponse> => {
    const response = await apiClient.get<CharacterResponse>(`/v1/character/characters/${characterId}`);
    return response.data;
  },

  deleteCharacter: async (characterId: string) => {
    const response = await apiClient.delete(`/v1/character/characters/${characterId}`);
    return response.data;
  },

  logUsage: async (characterId: string, callDuration: number) => {
    const response = await apiClient.post(`/v1/character/characters/${characterId}/usage`, null, {
      params: { call_duration: callDuration },
    });
    return response.data;
  },

  getStats: async (characterId: string): Promise<CharacterStats> => {
    const response = await apiClient.get<CharacterStats>(`/v1/character/characters/${characterId}/stats`);
    return response.data;
  },

  getEnhancedPersona: async (characterId: string): Promise<{ persona: string }> => {
    const response = await apiClient.get<{ persona: string }>(`/v1/character/characters/${characterId}/persona`);
    return response.data;
  },
};

export interface CallSessionResponse {
  session_id: string;
  voice_id: string;
  persona: string;
  websocket_url: string;
  status: string;
}

export interface CallSessionStatus {
  session_id: string;
  status: string;
  persona: string;
  started_at: string;
  conversation: Array<{
    type: string;
    content: string;
    timestamp: string;
  }>;
}

export const callApi = {
  startSession: async (characterId?: string): Promise<CallSessionResponse> => {
    const response = await apiClient.post<CallSessionResponse>('/v1/call/start', null, {
      params: characterId ? { character_id: characterId } : undefined,
    });
    return response.data;
  },

  getSessionStatus: async (sessionId: string): Promise<CallSessionStatus> => {
    const response = await apiClient.get<CallSessionStatus>(`/v1/call/${sessionId}/status`);
    return response.data;
  },

  endSession: async (sessionId: string) => {
    const response = await apiClient.post(`/v1/call/${sessionId}/end`);
    return response.data;
  },

  listActiveSessions: async () => {
    const response = await apiClient.get('/v1/call/sessions');
    return response.data;
  },
};
