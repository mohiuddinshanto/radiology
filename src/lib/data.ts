import type { Task, AnnotationPolygon, AnnotationImage, KanbanColumn } from "@/types";

export const SAMPLE_TASKS: Task[] = [
  {
    id: "t1",
    title: "Design authentication flow",
    description: "Create wireframes for login, registration, and password reset flows with accessibility in mind.",
    status: "todo",
    priority: "high",
    dueDate: "2026-07-10",
    tags: ["Design", "Auth"],
    assignee: "Sarah K.",
  },
  {
    id: "t2",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing, linting, and deployment to staging.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-07-15",
    tags: ["DevOps"],
    assignee: "Mike T.",
  },
  {
    id: "t3",
    title: "Image compression pipeline",
    description: "Integrate Sharp.js for server-side image optimization on upload before storing to S3.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-07-18",
    tags: ["Backend", "Performance"],
    assignee: "Alex R.",
  },
  {
    id: "t4",
    title: "Implement annotation API",
    description: "Build REST API endpoints for polygon annotation storage, retrieval, and versioning.",
    status: "inprogress",
    priority: "high",
    dueDate: "2026-07-08",
    tags: ["Backend", "API"],
    assignee: "Alex R.",
  },
  {
    id: "t5",
    title: "Write unit tests for task management",
    description: "Add Jest test coverage for task CRUD operations, Kanban logic, and edge cases.",
    status: "inprogress",
    priority: "low",
    dueDate: "2026-07-20",
    tags: ["Testing"],
    assignee: "Jordan L.",
  },
  {
    id: "t6",
    title: "Database schema design",
    description: "Finalize PostgreSQL schema for projects, tasks, users, and annotation data with migrations.",
    status: "done",
    priority: "high",
    dueDate: "2026-06-30",
    tags: ["Database", "Backend"],
    assignee: "Chris M.",
  },
  {
    id: "t7",
    title: "User onboarding flow",
    description: "Build guided tour for new users with interactive tooltips and contextual hints.",
    status: "done",
    priority: "medium",
    dueDate: "2026-06-28",
    tags: ["Frontend"],
    assignee: "Sarah K.",
  },
];

export const SAMPLE_IMAGES: AnnotationImage[] = [
  {
    id: "img1",
    url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format",
    name: "brain_mri_001.jpg",
  },
  {
    id: "img2",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&auto=format",
    name: "chest_xray_034.jpg",
  },
  {
    id: "img3",
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop&auto=format",
    name: "pathology_slide_012.jpg",
  },
];

export const SAMPLE_POLYGONS: AnnotationPolygon[] = [
  {
    id: "p1",
    imageId: "img1",
    color: "#EF4444",
    label: "Region A",
    points: [
      { x: 330, y: 140 }, { x: 490, y: 120 }, { x: 600, y: 190 },
      { x: 575, y: 330 }, { x: 440, y: 355 }, { x: 310, y: 280 },
    ],
  },
  {
    id: "p2",
    imageId: "img1",
    color: "#3B82F6",
    label: "Region B",
    points: [
      { x: 640, y: 440 }, { x: 750, y: 415 },
      { x: 790, y: 530 }, { x: 665, y: 565 },
    ],
  },
];

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo", label: "To Do", color: "#94A3B8", dot: "#CBD5E1" },
  { id: "inprogress", label: "In Progress", color: "#F59E0B", dot: "#FCD34D" },
  { id: "done", label: "Done", color: "#22C55E", dot: "#86EFAC" },
];

export const ALL_TAGS = [
  "Design", "Auth", "Backend", "Frontend",
  "DevOps", "API", "Testing", "Database", "Performance",
];

export const POLYGON_COLORS = [
  "#EF4444", "#F97316", "#22C55E", "#3B82F6",
  "#A855F7", "#F59E0B", "#EC4899", "#06B6D4",
];