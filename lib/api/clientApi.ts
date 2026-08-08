import type { AxiosResponse } from "axios";

import type { Note, CreateNoteRequest } from "@/types/note";
import type { User } from "@/types/user";

import { api } from "./api";

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
  const response: AxiosResponse<FetchNotesResponse> =
    await api.get<FetchNotesResponse>("/notes", { params });

  return response.data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.get<Note>(`/notes/${noteId}`);

  return response.data;
}

export async function createNote(note: CreateNoteRequest): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post<Note>("/notes", note);

  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete<Note>(
    `/notes/${noteId}`,
  );

  return response.data;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  username?: string;
}

export interface CheckSessionResponse {
  success: boolean;
}

export async function register(payload: RegisterRequest): Promise<User> {
  const response: AxiosResponse<User> = await api.post<User>(
    "/auth/register",
    payload,
  );

  return response.data;
}

export async function login(payload: LoginRequest): Promise<User> {
  const response: AxiosResponse<User> = await api.post<User>(
    "/auth/login",
    payload,
  );

  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<CheckSessionResponse> {
  const response: AxiosResponse<CheckSessionResponse> =
    await api.get<CheckSessionResponse>("/auth/session");

  return response.data;
}

export async function getMe(): Promise<User> {
  const response: AxiosResponse<User> = await api.get<User>("/users/me");

  return response.data;
}

export async function updateMe(payload: UpdateMeRequest): Promise<User> {
  const response: AxiosResponse<User> = await api.patch<User>(
    "/users/me",
    payload,
  );

  return response.data;
}
