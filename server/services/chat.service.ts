import { WebSocket } from "ws";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "admin" | "player";
  clubId: string;
  assessmentId?: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatSession {
  id: string;
  assessmentId: number;
  clubId: string;
  playerPhone: string;
  playerName: string;
  playerEmail: string;
  adminId?: string;
  createdAt: Date;
  messages: ChatMessage[];
  isActive: boolean;
}

export class ChatService {
  private sessions: Map<string, ChatSession> = new Map();
  private clients: Map<string, Set<WebSocket>> = new Map();
  private messageHistory: ChatMessage[] = [];

  createSession(
    assessmentId: number,
    clubId: string,
    playerPhone: string,
    playerName: string,
    playerEmail: string
  ): ChatSession {
    const sessionId = `${clubId}-${assessmentId}`;
    
    if (!this.sessions.has(sessionId)) {
      const session: ChatSession = {
        id: sessionId,
        assessmentId,
        clubId,
        playerPhone,
        playerName,
        playerEmail,
        createdAt: new Date(),
        messages: [],
        isActive: true,
      };
      this.sessions.set(sessionId, session);
    }
    
    return this.sessions.get(sessionId)!;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  addMessage(
    sessionId: string,
    senderId: string,
    senderName: string,
    senderType: "admin" | "player",
    message: string
  ): ChatMessage {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId,
      senderName,
      senderType,
      clubId: session.clubId,
      assessmentId: session.assessmentId,
      message,
      timestamp: new Date(),
      read: false,
    };

    session.messages.push(chatMessage);
    this.messageHistory.push(chatMessage);

    return chatMessage;
  }

  registerClient(sessionId: string, client: WebSocket): void {
    if (!this.clients.has(sessionId)) {
      this.clients.set(sessionId, new Set());
    }
    this.clients.get(sessionId)!.add(client);
  }

  unregisterClient(sessionId: string, client: WebSocket): void {
    const clients = this.clients.get(sessionId);
    if (clients) {
      clients.delete(client);
      if (clients.size === 0) {
        this.clients.delete(sessionId);
      }
    }
  }

  broadcastMessage(sessionId: string, message: any): void {
    const clients = this.clients.get(sessionId);
    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  getSessionHistory(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }

  closeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
    }
  }
}

export const chatService = new ChatService();
