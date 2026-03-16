import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UploadError = {
  row: number;
  message: string;
};

type UploadState = {
  fileName: string | null;
  status: "idle" | "uploading" | "processing" | "done" | "error";
  validRows: number;
  invalidRows: number;
  errors: UploadError[];
};

const initialState: UploadState = {
  fileName: null,
  status: "idle",
  validRows: 0,
  invalidRows: 0,
  errors: [],
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    startUpload: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
      state.status = "uploading";
      state.validRows = 0;
      state.invalidRows = 0;
      state.errors = [];
    },
    setProcessing: (state) => {
      state.status = "processing";
    },
    completeUpload: (
      state,
      action: PayloadAction<{
        validRows: number;
        invalidRows: number;
        errors: UploadError[];
      }>,
    ) => {
      state.status = "done";
      state.validRows = action.payload.validRows;
      state.invalidRows = action.payload.invalidRows;
      state.errors = action.payload.errors;
    },
    failUpload: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.errors = [{ row: 0, message: action.payload }];
    },
  },
});

export const { startUpload, setProcessing, completeUpload, failUpload } =
  uploadSlice.actions;
export default uploadSlice.reducer;
