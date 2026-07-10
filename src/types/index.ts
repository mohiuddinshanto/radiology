// src/types/index.ts

// ── Enums & Type Aliases ──
export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "inprogress" | "done";
export type AnnotationTool = "select" | "polygon";

// ── Task Related ──
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  tags: string[];
  assignee: string;
}

// ── Annotation Related ──
export interface Point {
  x: number;
  y: number;
}

export interface AnnotationPolygon {
  id: string;
  points: Point[];
  color: string;
  label: string;
  imageId: string;
}

export interface AnnotationImage {
  id: string;
  url: string;
  name: string;
}

// ── UI Related ──
export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  color: string;
  dot: string;
}

export interface User {
  name: string;
  email: string;
}

// ── Backend API Types ──
export interface BackendPolygon {
  id: number;
  points: Point[];
  label: string;
  color: string;
}

export interface BackendImage {
  id: number;
  image: string;
  polygons: BackendPolygon[];
}

// ── Auth Related ──
export interface AuthContextValue {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Tasks Board (Backend) Related ──
export interface BackendTask {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  due_date?: string;
  tags?: string[];
  assignee?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  due_date: string;
  tags: string[];
  assignee: string;
}


export interface RemotePattern {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
}