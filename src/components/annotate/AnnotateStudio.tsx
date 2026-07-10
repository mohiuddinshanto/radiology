"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, MousePointer, Hexagon, Trash2, Undo2, Redo2,
  ZoomIn, ZoomOut, Save, Layers, Image as ImageIcon, Loader2,
  LayoutGrid, List, Square,
} from "lucide-react";
import toast from "react-hot-toast";
import type { AnnotationPolygon, AnnotationImage, Point, AnnotationTool } from "@/types";
import { POLYGON_COLORS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

interface BackendPolygon {
  id: number;
  points: Point[];
  label: string;
  color: string;
}

interface BackendImage {
  id: number;
  image: string;
  polygons: BackendPolygon[];
}

type ViewMode = "single" | "grid" | "stacked";

export function AnnotateStudio() {
  const [images, setImages] = useState<AnnotationImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [polygons, setPolygons] = useState<AnnotationPolygon[]>([]);
  const [history, setHistory] = useState<AnnotationPolygon[][]>([]);
  const [future, setFuture] = useState<AnnotationPolygon[][]>([]);
  const [tool, setTool] = useState<AnnotationTool>("select");
  const [currentPts, setCurrentPts] = useState<Point[]>([]);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [selectedPolyId, setSelectedPolyId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [editLabel, setEditLabel] = useState("");
  const [editColor, setEditColor] = useState("#EF4444");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("single");

  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedImage = images.find((i) => i.id === selectedImageId);
  const selectedPoly = polygons.find((p) => p.id === selectedPolyId);
  const imgPolys = polygons.filter((p) => p.imageId === selectedImageId);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Data Fetching Ã¢â€â‚¬Ã¢â€â‚¬
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch<BackendImage[]>('/api/images/');

      const fetchedImages: AnnotationImage[] = data.map((img) => ({
        id: String(img.id),
        url: img.image,
        name: img.image.split("/").pop() || `Image ${img.id}`,
      }));

      const fetchedPolygons: AnnotationPolygon[] = data.flatMap((img) =>
        img.polygons.map((poly) => ({
          id: String(poly.id),
          imageId: String(img.id),
          points: poly.points,
          label: poly.label || `Region ${poly.id}`,
          color: poly.color || "#EF4444",
        }))
      );

      setImages(fetchedImages);
      setPolygons(fetchedPolygons);

      if (fetchedImages.length > 0) {
        setSelectedImageId(fetchedImages[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Delete Image Ã¢â€â‚¬Ã¢â€â‚¬
  const handleDeleteImage = useCallback(async (imageId: string) => {
    const imageToDelete = images.find((img) => img.id === imageId);
    const pCount = polygons.filter((p) => p.imageId === imageId).length;
    
    if (!confirm(`Are you sure you want to delete "${imageToDelete?.name || 'this image'}" and all its ${pCount} annotations?`)) {
      return;
    }

    try {
      await apiFetch<void>(`/api/images/${imageId}/`, {
        method: "DELETE"
      });

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setPolygons((prev) => prev.filter((p) => p.imageId !== imageId));

      if (selectedImageId === imageId) {
        const remainingImages = images.filter((img) => img.id !== imageId);
        if (remainingImages.length > 0) {
          setSelectedImageId(remainingImages[0].id);
        } else {
          setSelectedImageId(null);
          setSelectedPolyId(null);
        }
      }

      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error(`Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [images, selectedImageId, polygons]);

  // Load data on mount
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await fetchData();
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Sync edit fields when the selected polygon changes.
  const [prevSelectedPolyId, setPrevSelectedPolyId] = useState<string | null>(null);
  if (selectedPolyId !== prevSelectedPolyId) {
    setPrevSelectedPolyId(selectedPolyId);
    if (selectedPoly) {
      setEditLabel(selectedPoly.label);
      setEditColor(selectedPoly.color);
    }
  }

  const commitPolygons = useCallback(
    (next: AnnotationPolygon[], prev: AnnotationPolygon[]) => {
      setHistory((h) => [...h.slice(-20), prev]);
      setFuture([]);
      setPolygons(next);
    },
    []
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Undo/Redo Ã¢â€â‚¬Ã¢â€â‚¬
  const handleUndo = useCallback(() => {
    if (!history.length) return;
    setFuture((f) => [polygons, ...f]);
    setPolygons(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    toast.success("Undo successful");
  }, [history, polygons]);

  const handleRedo = useCallback(() => {
    if (!future.length) return;
    setHistory((h) => [...h, polygons]);
    setPolygons(future[0]);
    setFuture((f) => f.slice(1));
    toast.success("Redo successful");
  }, [future, polygons]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Save Annotations Ã¢â€â‚¬Ã¢â€â‚¬
  const handleSaveAnnotations = useCallback(async () => {
    if (!selectedImageId) {
      toast.error("No image selected");
      return;
    }

    setIsSaving(true);
    try {
      const currentImagePolygons = polygons.filter(
        (p) => p.imageId === selectedImageId
      );

      if (currentImagePolygons.length === 0) {
        toast.error("No annotations to save");
        setIsSaving(false);
        return;
      }

      const savePromises = currentImagePolygons.map(async (poly) => {
        const isNew = poly.id.startsWith("temp_");
        const url = isNew ? `/api/polygons/` : `/api/polygons/${poly.id}/`;
        
        const payload = {
          image: Number(selectedImageId),
          points: poly.points,
          label: poly.label,
          color: poly.color,
        };

        const savedData = await apiFetch<{ id: number }>(url, {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        return {
          previousId: poly.id,
          polygon: isNew ? { ...poly, id: String(savedData.id) } : poly,
        };
      });

      const savedPolygons = await Promise.all(savePromises);

      setPolygons((prev) => {
        const updated = prev.map((p) => {
          const saved = savedPolygons.find((entry) => entry.previousId === p.id);
          return saved?.polygon || p;
        });
        return updated;
      });

      const selectedSavedPolygon = savedPolygons.find(
        (entry) => entry.previousId === selectedPolyId
      );
      if (selectedSavedPolygon) {
        setSelectedPolyId(selectedSavedPolygon.polygon.id);
      }

      toast.success(`Saved ${currentImagePolygons.length} annotations successfully!`);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(`Failed to save annotations: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  }, [polygons, selectedImageId, selectedPolyId]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Delete Polygon Ã¢â€â‚¬Ã¢â€â‚¬
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedPolyId) return;

    if (!selectedPolyId.startsWith("temp_")) {
      try {
        await apiFetch<void>(`/api/polygons/${selectedPolyId}/`, {
          method: "DELETE"
        });
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(`Failed to delete annotation: ${error instanceof Error ? error.message : "Unknown error"}`);
        return;
      }
    }

    commitPolygons(polygons.filter((p) => p.id !== selectedPolyId), polygons);
    setSelectedPolyId(null);
    toast.success("Annotation deleted");
  }, [selectedPolyId, polygons, commitPolygons]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Update Polygon Properties Ã¢â€â‚¬Ã¢â€â‚¬
  const handleUpdateProperties = useCallback(async () => {
    if (!selectedPoly) return;

    const updatedPoly = {
      ...selectedPoly,
      label: editLabel,
      color: editColor,
    };

    if (!selectedPoly.id.startsWith("temp_")) {
      try {
        await apiFetch<void>(`/api/polygons/${selectedPoly.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: Number(selectedImageId),
            points: updatedPoly.points,
            label: editLabel,
            color: editColor,
          }),
        });
      } catch (error) {
        console.error("Update error:", error);
        toast.error(`Failed to update properties: ${error instanceof Error ? error.message : "Unknown error"}`);
        return;
      }
    }

    setPolygons((p) =>
      p.map((poly) => (poly.id === selectedPolyId ? updatedPoly : poly))
    );
    toast.success("Properties updated");
  }, [selectedPoly, selectedPolyId, editLabel, editColor, selectedImageId]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Drawing Functions Ã¢â€â‚¬Ã¢â€â‚¬
  const getSVGCoords = useCallback((e: React.MouseEvent<SVGSVGElement>): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    
    const img = svg.previousElementSibling as HTMLImageElement;
    if (!img) return { x: 0, y: 0 };
    
    const imgRect = img.getBoundingClientRect();
    
    const x = (e.clientX - imgRect.left) / imgRect.width;
    const y = (e.clientY - imgRect.top) / imgRect.height;
    
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    };
  }, []);

  const finishPolygon = useCallback(() => {
    if (currentPts.length < 3 || !selectedImageId) return;

    const count = imgPolys.length;
    const newPoly: AnnotationPolygon = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      imageId: selectedImageId,
      points: [...currentPts],
      color: POLYGON_COLORS[count % POLYGON_COLORS.length],
      label: `Region ${String.fromCharCode(65 + count)}`,
    };

    commitPolygons([...polygons, newPoly], polygons);
    setCurrentPts([]);
    setSelectedPolyId(newPoly.id);
    setTool("select");
    toast.success("Polygon created! Click Save to persist.");
  }, [currentPts, selectedImageId, imgPolys.length, polygons, commitPolygons]);

  const handleSVGClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (tool !== "polygon" || !selectedImageId) return;
      const pt = getSVGCoords(e);

      if (currentPts.length >= 3) {
        const first = currentPts[0];
        const dx = Math.abs(pt.x * 1000 - first.x * 1000);
        const dy = Math.abs(pt.y * 750 - first.y * 750);
        if (dx < 28 && dy < 28) {
          finishPolygon();
          return;
        }
      }
      setCurrentPts((prev) => [...prev, pt]);
    },
    [tool, selectedImageId, currentPts, finishPolygon, getSVGCoords]
  );

  const handleSVGDblClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      e.preventDefault();
      if (tool !== "polygon" || currentPts.length < 3 || !selectedImageId) return;
      finishPolygon();
    },
    [tool, currentPts, selectedImageId, finishPolygon]
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Image Upload Ã¢â€â‚¬Ã¢â€â‚¬
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          
          const response = await apiFetch<BackendImage>('/api/images/', {
            method: "POST",
            body: formData,
          });
          return response;
        });

        const uploaded = await Promise.all(uploadPromises);

        const newImages: AnnotationImage[] = uploaded.map((img) => ({
          id: String(img.id),
          url: img.image,
          name: img.image.split("/").pop() || `Image ${img.id}`,
        }));

        setImages((prev) => [...prev, ...newImages]);
        if (newImages.length > 0) {
          setSelectedImageId(newImages[0].id);
        }

        await fetchData();
        toast.success(`Uploaded ${newImages.length} image${newImages.length > 1 ? "s" : ""} successfully!`);
        e.target.value = "";
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload images: ${error instanceof Error ? error.message : "Unknown error"}`);
        e.target.value = "";
      }
    },
    [fetchData]
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Keyboard shortcuts Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrentPts([]);
        setTool("select");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveAnnotations();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedPolyId) handleDeleteSelected();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo, handleSaveAnnotations, handleDeleteSelected, selectedPolyId]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Toolbar Helper Ã¢â€â‚¬Ã¢â€â‚¬
  const toolHint =
    tool === "polygon" && currentPts.length === 0
      ? "Click on the image to place vertices"
      : tool === "polygon"
        ? `${currentPts.length} vertices Ã¢â‚¬â€ click first point or double-click to close`
        : selectedPolyId
          ? "Polygon selected Ã¢â‚¬â€ edit in the panel"
          : "Select the polygon tool to begin";

  const tbBtn = (
    active: boolean,
    onClick: () => void,
    title: string,
    icon: React.ReactNode,
    label: string,
    danger = false
  ) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[11px] font-medium transition-colors",
        active
          ? "bg-[#7C3AED]/25 text-[#A78BFA]"
          : danger
            ? "text-[#94A3B8] hover:bg-red-500/15 hover:text-red-400"
            : "text-[#94A3B8] hover:bg-white/8 hover:text-white"
      )}
    >
      {icon} {label}
    </button>
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Render Single Image Ã¢â€â‚¬Ã¢â€â‚¬
  const renderSingleImage = () => (
    <div className="flex-1 overflow-auto flex items-start justify-center bg-[#0F172A]">
      {selectedImage ? (
        <div
          className="m-6 relative shadow-2xl rounded-xl overflow-hidden"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease",
            marginBottom: zoom > 1 ? `${zoom * 6}rem` : "1.5rem",
          }}
        >
          <Image
            src={selectedImage.url}
            alt={selectedImage.name}
            className="block w-full h-auto max-w-3xl"
            style={{ filter: "brightness(0.92) contrast(1.08)" }}
            width={1000}
            height={750}
          />
          <svg
            ref={svgRef}
            viewBox="0 0 1000 750"
            className="absolute inset-0 w-full h-full"
            style={{
              cursor: tool === "polygon" ? "crosshair" : "default",
              userSelect: "none",
            }}
            onClick={handleSVGClick}
            onDoubleClick={handleSVGDblClick}
            onMouseMove={(e) => {
              if (tool === "polygon") setMousePos(getSVGCoords(e));
            }}
            onMouseLeave={() => setMousePos(null)}
          >
            <defs>
              <filter id="lblShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.85)" />
              </filter>
            </defs>

            {imgPolys.map((poly) => {
              const sel = poly.id === selectedPolyId;
              const viewPortPoints = poly.points.map(p => ({
                x: p.x * 1000,
                y: p.y * 750
              }));
              
              const cx = viewPortPoints.reduce((s, p) => s + p.x, 0) / viewPortPoints.length;
              const cy = viewPortPoints.reduce((s, p) => s + p.y, 0) / viewPortPoints.length;
              
              return (
                <g key={poly.id}>
                  <polygon
                    points={viewPortPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill={poly.color + "38"}
                    stroke={poly.color}
                    strokeWidth={sel ? 2.5 : 1.5}
                    style={{
                      cursor: tool === "select" ? "pointer" : "crosshair",
                      transition: "stroke-width 0.1s",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tool === "select") setSelectedPolyId(sel ? null : poly.id);
                    }}
                  />
                  {viewPortPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={sel ? 5 : 3}
                      fill="white"
                      stroke={poly.color}
                      strokeWidth={sel ? 2 : 1.5}
                    />
                  ))}
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={13}
                    fontWeight="700"
                    filter="url(#lblShadow)"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {poly.label}
                  </text>
                </g>
              );
            })}

            {currentPts.length > 0 && (
              <g>
                <polyline
                  points={currentPts.map((p) => `${p.x * 1000},${p.y * 750}`).join(" ")}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  strokeDasharray="7,4"
                  strokeLinecap="round"
                />
                {mousePos && (
                  <line
                    x1={currentPts[currentPts.length - 1].x * 1000}
                    y1={currentPts[currentPts.length - 1].y * 750}
                    x2={mousePos.x * 1000}
                    y2={mousePos.y * 750}
                    stroke="#A78BFA"
                    strokeWidth={1.5}
                    strokeDasharray="5,3"
                  />
                )}
                {currentPts.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x * 1000}
                    cy={pt.y * 750}
                    r={i === 0 ? 8 : 5}
                    fill={i === 0 ? "#7C3AED" : "white"}
                    stroke={i === 0 ? "white" : "#7C3AED"}
                    strokeWidth={2}
                    style={{
                      cursor: i === 0 && currentPts.length >= 3 ? "pointer" : "crosshair",
                    }}
                  />
                ))}
                {currentPts.length >= 3 && (
                  <text
                    x={currentPts[0].x * 1000}
                    y={currentPts[0].y * 750 - 14}
                    textAnchor="middle"
                    fill="#A78BFA"
                    fontSize={10}
                    fontWeight="600"
                  >
                    Close
                  </text>
                )}
              </g>
            )}
          </svg>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ImageIcon size={48} className="text-[#1E293B] mb-4" />
          <p className="text-[#475569] font-medium text-sm">No image selected</p>
          <p className="text-[#334155] text-xs mt-1">
            Upload a medical image to begin annotating
          </p>
        </div>
      )}
    </div>
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Render Grid View Ã¢â€â‚¬Ã¢â€â‚¬
  const renderGridView = () => (
    <div className="flex-1 overflow-auto p-6 bg-[#0F172A]">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img) => {
          const pCount = polygons.filter((p) => p.imageId === img.id).length;
          const isSelected = selectedImageId === img.id;
          
          return (
            <div
              key={img.id}
              onClick={() => {
                setSelectedImageId(img.id);
                setSelectedPolyId(null);
                setCurrentPts([]);
                setViewMode("single");
              }}
              className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer transition-all group",
                isSelected 
                  ? "ring-2 ring-[#7C3AED] shadow-lg shadow-[#7C3AED]/30" 
                  : "hover:ring-2 hover:ring-[#7C3AED]/50"
              )}
            >
              <div className="aspect-square bg-[#1E293B]">
                <Image
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  width={1000}
                  height={750}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(img.id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Delete image"
              >
                <Trash2 size={12} />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium truncate">{img.name}</p>
                <p className="text-[#94A3B8] text-xs">
                  {pCount} annotation{pCount !== 1 ? "s" : ""}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 left-2 bg-[#7C3AED] text-white text-xs px-2 py-1 rounded">
                  Selected
                </div>
              )}
            </div>
          );
        })}
        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <ImageIcon size={48} className="text-[#1E293B] mb-4" />
            <p className="text-[#475569]">No images uploaded yet</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm hover:bg-[#6D28D9] transition-colors"
            >
              Upload Images
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Render Stacked View Ã¢â€â‚¬Ã¢â€â‚¬
  const renderStackedView = () => (
    <div className="flex-1 overflow-auto p-6 bg-[#0F172A] space-y-8">
      {images.map((img) => {
        const pCount = polygons.filter((p) => p.imageId === img.id).length;
        const isSelected = selectedImageId === img.id;
        
        return (
          <div
            key={img.id}
            onClick={() => {
              setSelectedImageId(img.id);
              setSelectedPolyId(null);
              setCurrentPts([]);
              setViewMode("single");
            }}
            className={cn(
              "relative rounded-xl overflow-hidden cursor-pointer transition-all group bg-[#1E293B] shadow-xl",
              isSelected && "ring-2 ring-[#7C3AED]"
            )}
          >
            <div className="relative">
              <Image
                src={img.url}
                alt={img.name}
                className="w-full h-auto max-h-[600px] object-contain"
                width={1000}
                height={750}
              />
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(img.id);
                }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Delete image"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{img.name}</h3>
                  <span className="text-[#94A3B8] text-sm bg-black/50 px-3 py-1 rounded">
                    {pCount} annotation{pCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-20 right-4 bg-[#7C3AED] text-white text-xs px-3 py-1 rounded">
                  Click to annotate
                </div>
              )}
              {imgPolys.length > 0 && (
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {imgPolys.slice(0, 3).map((poly, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: poly.color }}
                    />
                  ))}
                  {imgPolys.length > 3 && (
                    <span className="text-[10px] text-white bg-black/50 px-1.5 rounded">
                      +{imgPolys.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <ImageIcon size={48} className="text-[#1E293B] mb-4" />
          <p className="text-[#475569]">No images uploaded yet</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm hover:bg-[#6D28D9] transition-colors"
          >
            Upload Images
          </button>
        </div>
      )}
    </div>
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Sidebar Image List (with Delete) Ã¢â€â‚¬Ã¢â€â‚¬
  const renderSidebarImages = () => (
    <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
      {images.map((img) => {
        const pCount = polygons.filter((p) => p.imageId === img.id).length;
        return (
          <div key={img.id} className="relative group">
            <button
              onClick={() => {
                setSelectedImageId(img.id);
                setSelectedPolyId(null);
                setCurrentPts([]);
              }}
              className={cn(
                "w-full text-left rounded-xl overflow-hidden border transition-all",
                selectedImageId === img.id
                  ? "border-[#7C3AED] shadow-lg shadow-[#7C3AED]/20"
                  : "border-white/6 hover:border-white/15"
              )}
            >
              <div className="aspect-video bg-[#0F172A] overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.name}
                  width={1000}
                  height={750}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="p-2">
                <p className="text-[11px] text-[#E2E8F0] font-medium truncate">
                  {img.name}
                </p>
                <p className="text-[9px] text-[#475569] mt-0.5">
                  {pCount} annotation{pCount !== 1 ? "s" : ""}
                </p>
              </div>
            </button>
            
            {/* Delete Button on Hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(img.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Delete image"
            >
              <Trash2 size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
          <p className="text-[#94A3B8] text-sm">Loading annotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "#0F172A" }}>
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Toolbar Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="h-12 bg-[#1E293B] border-b border-white/8 flex items-center px-3 gap-1 shrink-0">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-medium transition-colors"
        >
          <Upload size={12} /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="w-px h-5 bg-white/10 mx-1" />

        {tbBtn(
          tool === "select",
          () => { setTool("select"); setCurrentPts([]); },
          "Select (V)",
          <MousePointer size={12} />,
          "Select"
        )}
        {tbBtn(
          tool === "polygon",
          () => { setTool("polygon"); setCurrentPts([]); },
          "Draw Polygon (P)",
          <Hexagon size={12} />,
          "Polygon"
        )}
        {tbBtn(
          false,
          handleDeleteSelected,
          "Delete selected (Del)",
          <Trash2 size={12} />,
          "Delete",
          true
        )}

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          onClick={handleUndo}
          disabled={!history.length}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={13} />
        </button>
        <button
          onClick={handleRedo}
          disabled={!future.length}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={13} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {viewMode === "single" && (
          <>
            <button
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-white/8 hover:text-white transition-colors"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="h-8 px-2 rounded-lg text-[11px] font-mono text-[#94A3B8] hover:bg-white/8 hover:text-white transition-colors min-w-[40px] text-center"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-white/8 hover:text-white transition-colors"
            >
              <ZoomOut size={13} />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
          </>
        )}

        <span className="text-[10px] text-[#475569] hidden lg:block ml-2 max-w-xs truncate">
          {toolHint}
        </span>

        <div className="ml-auto flex items-center gap-1">
          {/* View Mode Buttons */}
          <button
            onClick={() => setViewMode("single")}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
              viewMode === "single" 
                ? "bg-[#7C3AED]/25 text-[#A78BFA]" 
                : "text-[#475569] hover:text-white hover:bg-white/8"
            )}
            title="Single View"
          >
            <Square size={14} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
              viewMode === "grid" 
                ? "bg-[#7C3AED]/25 text-[#A78BFA]" 
                : "text-[#475569] hover:text-white hover:bg-white/8"
            )}
            title="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("stacked")}
            className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
              viewMode === "stacked" 
                ? "bg-[#7C3AED]/25 text-[#A78BFA]" 
                : "text-[#475569] hover:text-white hover:bg-white/8"
            )}
            title="Stacked View"
          >
            <List size={14} />
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            onClick={handleSaveAnnotations}
            disabled={isSaving || viewMode !== "single"}
            className={cn(
              "flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-medium transition-colors",
              viewMode === "single"
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                : "bg-[#1E293B] text-[#475569] cursor-not-allowed"
            )}
          >
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Main 3-pane Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Image list - Hidden in grid/stacked mode for more space */}
        {viewMode === "single" && (
          <div className="w-52 bg-[#1E293B] border-r border-white/8 flex flex-col overflow-hidden shrink-0">
            <div className="px-3 py-3 border-b border-white/8 flex items-center justify-between">
              <h3 className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest">
                Images ({images.length})
              </h3>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[#475569] hover:text-[#A78BFA] transition-colors"
              >
                <Upload size={14} />
              </button>
            </div>
            {renderSidebarImages()}
          </div>
        )}

        {/* Center: Image display */}
        {viewMode === "single" && renderSingleImage()}
        {viewMode === "grid" && renderGridView()}
        {viewMode === "stacked" && renderStackedView()}

        {/* Right: Annotations list + properties - Hidden in grid/stacked mode */}
        {viewMode === "single" && (
          <div className="w-52 bg-[#1E293B] border-l border-white/8 flex flex-col overflow-hidden shrink-0">
            <div className="px-3 py-3 border-b border-white/8">
              <h3 className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest">
                Annotations ({imgPolys.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {imgPolys.length === 0 ? (
                <div className="py-10 text-center">
                  <Layers size={22} className="text-[#1E293B] mx-auto mb-2 opacity-70" />
                  <p className="text-[11px] text-[#475569]">No annotations yet</p>
                  <p className="text-[10px] text-[#334155] mt-0.5">Use the polygon tool</p>
                </div>
              ) : (
                imgPolys.map((poly) => (
                  <button
                    key={poly.id}
                    onClick={() =>
                      setSelectedPolyId(selectedPolyId === poly.id ? null : poly.id)
                    }
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all",
                      selectedPolyId === poly.id
                        ? "bg-[#7C3AED]/20 border border-[#7C3AED]/30"
                        : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: poly.color }}
                    />
                    <span className="text-[11px] text-[#E2E8F0] truncate flex-1">
                      {poly.label}
                    </span>
                    <span className="text-[9px] text-[#475569] shrink-0">
                      {poly.points.length}pt
                    </span>
                    {poly.id.startsWith("temp_") && (
                      <span className="text-[8px] text-yellow-500 bg-yellow-500/20 px-1 rounded">
                        NEW
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Properties editor */}
            {selectedPoly && (
              <div className="border-t border-white/8 p-3 space-y-3">
                <h3 className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest">
                  Properties
                </h3>
                <div>
                  <label className="text-[10px] font-medium text-[#475569] block mb-1">
                    Label
                  </label>
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg bg-white/6 border border-white/10 text-[11px] text-[#E2E8F0] focus:outline-none focus:border-[#7C3AED] transition-colors"
                    placeholder="Enter label..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#475569] block mb-1">
                    Color
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {POLYGON_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setEditColor(c)}
                        className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          outline: editColor === c ? "2px solid white" : "none",
                          outlineOffset: "1px",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-[#475569]">
                  <span>Vertices</span>
                  <span className="text-[#94A3B8] font-mono">
                    {selectedPoly.points.length}
                  </span>
                </div>
                <button
                  onClick={handleUpdateProperties}
                  className="w-full h-8 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-medium transition-colors"
                >
                  Apply Changes
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="w-full h-8 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-[11px] font-medium transition-colors"
                >
                  Delete Annotation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}