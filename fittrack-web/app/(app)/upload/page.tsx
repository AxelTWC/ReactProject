"use client";

import { useState } from "react";
import { completeUpload, setProcessing, startUpload } from "@/store/slices/uploadSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function UploadPage() {
  const dispatch = useAppDispatch();
  const upload = useAppSelector((state) => state.upload);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const processSampleFile = () => {
    const fileName = selectedFileName ?? "fittrack_upload.csv";
    dispatch(startUpload(fileName));
    dispatch(setProcessing());
    dispatch(
      completeUpload({
        validRows: 82,
        invalidRows: 4,
        errors: [
          { row: 12, message: "Missing reps value" },
          { row: 31, message: "Invalid date format" },
          { row: 45, message: "Unknown exercise name" },
          { row: 77, message: "Negative weight value" },
        ],
      }),
    );
  };

  return (
    <section className="space-y-4">
      <article className="card p-4">
        <h2 className="text-2xl font-bold">CSV Upload</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Import historical workouts and inspect parsing quality.
        </p>

        <div className="mt-4 rounded-xl border-2 border-dashed border-[color:var(--border)] bg-[color:var(--surface-muted)] p-5 text-center">
          <p className="text-sm text-[color:var(--muted)]">Drag a CSV here or choose a file.</p>
          <label className="mt-3 inline-block cursor-pointer rounded-md border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-semibold">
            Choose File
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(event) => {
                const fileName = event.target.files?.[0]?.name ?? null;
                setSelectedFileName(fileName);
              }}
            />
          </label>
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            {selectedFileName ?? "No file selected"}
          </p>
        </div>

        <button
          type="button"
          className="mt-4 rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white"
          onClick={processSampleFile}
        >
          Upload and Parse
        </button>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-bold">Parsing Summary</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--border)] p-3 text-sm">
            <p className="text-[color:var(--muted)]">Status</p>
            <p className="mt-1 font-semibold capitalize">{upload.status}</p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] p-3 text-sm">
            <p className="text-[color:var(--muted)]">Valid Rows</p>
            <p className="mt-1 font-semibold text-[color:var(--success)]">{upload.validRows}</p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] p-3 text-sm">
            <p className="text-[color:var(--muted)]">Invalid Rows</p>
            <p className="mt-1 font-semibold text-[color:var(--warning)]">{upload.invalidRows}</p>
          </div>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-bold">Invalid Row Details</h3>
        {upload.errors.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--muted)]">No parsing errors yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {upload.errors.map((error) => (
              <li
                key={`${error.row}-${error.message}`}
                className="rounded-md border border-[color:var(--border)] p-2"
              >
                Row {error.row}: {error.message}
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
