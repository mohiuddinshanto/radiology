
import { AnnotateStudio } from "@/components/annotate/AnnotateStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annotation Studio — 404 Project Not Found",
};

export default function AnnotatePage() {
  return <AnnotateStudio />;
}
