"use client";

import { useEffect, useState } from "react";
import { completeUpload, failUpload, setProcessing, startUpload } from "@/store/slices/uploadSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type PastUpload = {
  id: string;
  fileKey: string;
  fileName: string;
  uploadedAt: string;
};

export default function UploadPage() {
  const dispatch = useAppDispatch();
  const upload = useAppSelector((state) => state.upload);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastUploads, setPastUploads] = useState<PastUpload[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);

  const loadUploads = async () => {
    setIsLoadingUploads(true);
    try {
      const response = await fetch("/api/uploads", { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setPastUploads(data.uploads ?? []);
      }
    } finally {
      setIsLoadingUploads(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const uploadFile = async () => {
    if (!selectedFile) {
      dispatch(failUpload("Select a CSV file first"));
      return;
    }

    const fileName = selectedFile.name;
    dispatch(startUpload(fileName));
    dispatch(setProcessing());

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/uploads/csv", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(failUpload(data?.error ?? "Upload failed"));
        return;
      }

      dispatch(
        completeUpload({
          validRows: data.validRows,
          invalidRows: data.invalidRows,
          errors: data.errors,
        }),
      );
      await loadUploads();
    } catch {
      dispatch(failUpload("Upload failed"));
    }
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
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
              }}
            />
          </label>
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            {selectedFile?.name ?? "No file selected"}
          </p>
        </div>

        <button
          type="button"
          className="mt-4 rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white"
          onClick={uploadFile}
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

      <article className="card p-4">
        <h3 className="text-lg font-bold">Past Uploads</h3>
        {isLoadingUploads ? (
          <p className="mt-2 text-sm text-[color:var(--muted)]">Loading uploads...</p>
        ) : pastUploads.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--muted)]">No uploads yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--border)] text-[color:var(--muted)]">
                  <th className="px-2 py-2 font-semibold">Uploaded At</th>
                  <th className="px-2 py-2 font-semibold">File Name</th>
                  <th className="px-2 py-2 font-semibold">Download</th>
                </tr>
              </thead>
              <tbody>
                {pastUploads.map((item) => (
                  <tr key={item.id} className="border-b border-[color:var(--border)]">
                    <td className="px-2 py-2">{new Date(item.uploadedAt).toLocaleString()}</td>
                    <td className="px-2 py-2">{item.fileName}</td>
                    <td className="px-2 py-2">
                      <a
                        href={`/api/uploads/download/${encodeURIComponent(item.fileKey)}`}
                        className="font-semibold text-[color:var(--primary)]"
                      >
                        Download CSV
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
