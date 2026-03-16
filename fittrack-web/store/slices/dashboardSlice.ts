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
  dateRange: { from: "2026-02-01", to: "2026-03-16" },
  selectedExerciseId: null,
  kpis: {
    weeklyVolume: 18420,
    avgEstimatedOneRM: 192,
    consistencyScore: 4.1,
  },
  charts: {
    volumeTrend: [
      { week: "W1", volume: 15100 },
      { week: "W2", volume: 16520 },
      { week: "W3", volume: 17240 },
      { week: "W4", volume: 18420 },
    ],
    oneRMTrend: [
      { date: "02/20", oneRM: 180 },
      { date: "02/27", oneRM: 184 },
      { date: "03/06", oneRM: 188 },
      { date: "03/13", oneRM: 192 },
    ],
    muscleDistribution: [
      { muscleGroup: "Chest", percent: 24 },
      { muscleGroup: "Back", percent: 27 },
      { muscleGroup: "Legs", percent: 33 },
      { muscleGroup: "Shoulders", percent: 16 },
    ],
    exerciseFrequency: [
      { exerciseName: "Bench", count: 8 },
      { exerciseName: "Squat", count: 6 },
      { exerciseName: "Deadlift", count: 4 },
      { exerciseName: "Row", count: 7 },
    ],
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
