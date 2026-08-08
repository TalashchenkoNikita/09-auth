import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/serverApi";

import Notes from "./Notes.client";

interface NotesFilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

function resolveTag(slug?: string[]) {
  const tagParam = slug?.[0];

  return tagParam && tagParam !== "all" ? tagParam : undefined;
}

export async function generateMetadata({
  params,
}: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;

  const tag = resolveTag(slug);
  const title = tag
    ? `Notes filtered by: ${tag} | NoteHub`
    : "All notes | NoteHub";
  const description = tag
    ? `Browse notes filtered by the "${tag}" tag on NoteHub.`
    : "Browse all your notes on NoteHub.";
  const url = `https://notehub.com/notes/filter/${tag ?? "all"}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;

  const tag = resolveTag(slug);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
