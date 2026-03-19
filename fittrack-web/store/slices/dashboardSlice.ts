import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DashboardState = {
  dateRange: { from: string; to: string };
  selectedExerciseId: string | null;
  kpis: {
    weeklyVolume: number;
    avgEstimatedOneRM: number;
    consistencyScore: number;
  };
  charts: {
    volumeTrend: Array<{ week: string; volume: number }>;
    oneRMTrend: Array<{ date: string; oneRM: number }>;
    muscleDistribution: Array<{ muscleGroup: string; percent: number }>;
    exerciseFrequency: Array<{ exerciseName: string; count: number }>;
  };
};

const initialState: DashboardState = {
  dateRange: { from: new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) },
  selectedExerciseId: null,
  kpis: {
    weeklyVolume: 0,
    avgEstimatedOneRM: 0,
    consistencyScore: 0,
  },
  charts: {
    volumeTrend: [],
    oneRMTrend: [],
    muscleDistribution: [],
    exerciseFrequency: [],
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ from: string; to: string }>,
    ) => {
      state.dateRange = action.payload;
    },
    setSelectedExerciseId: (state, action: PayloadAction<string | null>) => {
      state.selectedExerciseId = action.payload;
    },
  },
});

export const { setDateRange, setSelectedExerciseId } = dashboardSlice.actions;
export default dashboardSlice.reducer;
