export interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

export interface AudioChunkMessage extends WebSocketMessage {
  type: 'audio_chunk';
  data: string;
  timestamp: string;
}

export interface StartListeningMessage extends WebSocketMessage {
  type: 'start_listening';
  config: {
    language: string;
    sample_rate: number;
  };
}

export interface TextInputMessage extends WebSocketMessage {
  type: 'text_input';
  text: string;
}

export interface AudioInputMessage extends WebSocketMessage {
  type: 'audio_input';
  data: string;
  format?: string;
}

export interface TranscriptionMessage extends WebSocketMessage {
  type: 'transcription';
  text: string;
  confidence: number;
  is_final: boolean;
}

export interface AIResponseTextMessage extends WebSocketMessage {
  type: 'ai_response_text';
  text: string;
  timestamp: string;
}

export interface AIResponseAudioMessage extends WebSocketMessage {
  type: 'ai_response_audio';
  audio_data: string;
  audio_url: string;
}

export interface SessionStartedMessage extends WebSocketMessage {
  type: 'session_started';
  session_id: string;
}

export interface ListeningStateMessage extends WebSocketMessage {
  type: 'listening_started' | 'listening_stopped';
  message: string;
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  message: string;
  details?: string;
}

export type IncomingMessage = 
  | SessionStartedMessage 
  | ListeningStateMessage 
  | TranscriptionMessage 
  | AIResponseTextMessage 
  | AIResponseAudioMessage 
  | ErrorMessage;

export class CallWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, ((msg: IncomingMessage) => void)[]> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.baseUrl.replace(/^http/, 'ws');
        const fullUrl = `${wsUrl}/v1/call/ws/call/${sessionId}`;
        console.log('🔌 Connecting to WebSocket:', fullUrl);
        this.ws = new WebSocket(fullUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: IncomingMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket connection error:', {
            url: fullUrl,
            readyState: this.ws?.readyState,
            error
          });
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket closed:', event.code, event.reason);
          if (!event.wasClean) {
            console.error('❌ WebSocket connection closed unexpectedly');
            reject(new Error(`Connection closed: ${event.code} - ${event.reason}`));
          }
        };

        // 연결 타임아웃 (10초)
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            console.error('❌ WebSocket connection timeout');
            this.ws?.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);
      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }



  private handleMessage(message: IncomingMessage) {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }
    const allHandlers = this.messageHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => handler(message));
    }
  }

  on(type: string, handler: (msg: IncomingMessage) => void) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  off(type: string, handler: (msg: IncomingMessage) => void) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  startListening(language = 'ko-KR', sampleRate = 16000) {
    const message = {
      type: 'start_listening',
      config: { language, sample_rate: sampleRate },
    } as StartListeningMessage;
    console.log('📡 Sending start_listening:', message);
    this.send(message);
  }

  stopListening() {
    this.send({ type: 'stop_listening' });
  }

  sendTextInput(text: string) {
    if (!this.ws) return;
    
    console.log('📤 Sending text input:', text);
    
    this.send({
      type: 'text_input',
      text: text
    });
  }
  
  sendAudioInput(data: string, format: string = 'wav') {
    if (!this.ws) return;
    
    console.log('📤 Sending full audio input:', {
      format,
      dataLength: data.length
    });
    
    this.send({
      type: 'audio_input',
      data: data,
      format: format
    });
  }
  
  // Legacy audio chunk method (kept for reference, but text_input is now preferred)
  sendAudioChunk(data: string) {
    if (!this.ws) return;
    
    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(data);
    console.log('📤 Sending audio chunk:', {
      isBase64,
      length: data.length,
      preview: data.substring(0, 50) + '...'
    });
    
    this.send({
      type: 'audio_chunk',
      data: data,
      timestamp: Date.now()
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  console.log('🔄 ArrayBuffer to Base64:', {
    inputSize: buffer.byteLength,
    outputSize: base64.length,
    sample: base64.substring(0, 50) + '...'
  });
  return base64;
}

export function base64ToBlob(base64: string, mimeType = 'audio/mpeg'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
