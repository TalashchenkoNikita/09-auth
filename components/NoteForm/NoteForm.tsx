"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { CreateNoteRequest, NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

const noteTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      clearDraft();

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  const handleFieldChange = (field: keyof CreateNoteRequest, value: string) => {
    setDraft({ [field]: value });
  };

  const handleSubmit = async (formData: FormData) => {
    const note: CreateNoteRequest = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      tag: (formData.get("tag") ?? "Todo") as NoteTag,
    };

    createMutation.mutate(note);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={(event) => handleFieldChange("title", event.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          name="content"
          id="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(event) => handleFieldChange("content", event.target.value)}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          name="tag"
          id="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={(event) => handleFieldChange("tag", event.target.value)}
        >
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {createMutation.isError && (
        <p className={css.error}>Failed to create note. Please try again.</p>
      )}
    </form>
  );
}

export default NoteForm;
