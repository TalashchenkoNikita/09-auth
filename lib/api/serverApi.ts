import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";

import { api } from "./api";
import type { CheckSessionResponse } from "./clientApi";

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();

  const response: AxiosResponse<FetchNotesResponse> =
    await api.get<FetchNotesResponse>("/notes", {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const cookieStore = await cookies();

  const response: AxiosResponse<Note> = await api.get<Note>(
    `/notes/${noteId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return response.data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const response: AxiosResponse<User> = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

// Used from proxy.ts, where next/headers "cookies()" is not available,
// so the raw Cookie header string is passed in explicitly.
export async function checkSession(
  cookieHeader: string,
): Promise<AxiosResponse<CheckSessionResponse>> {
  return api.get<CheckSessionResponse>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}
