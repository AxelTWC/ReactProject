import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WorkoutSet = {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
};

type WorkoutState = {
  date: string;
  notes: string;
  sets: WorkoutSet[];
};

const initialState: WorkoutState = {
  date: "2026-03-16",
  notes: "",
  sets: [{ id: "set-1", exercise: "Bench Press", reps: 8, weight: 135 }],
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setWorkoutDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setWorkoutNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    addSet: (state) => {
      state.sets.push({
        id: `set-${state.sets.length + 1}`,
        exercise: "",
        reps: 0,
        weight: 0,
      });
    },
    updateSet: (
      state,
      action: PayloadAction<{
        id: string;
        field: "exercise" | "reps" | "weight";
        value: string | number;
      }>,
    ) => {
      const target = state.sets.find((set) => set.id === action.payload.id);
      if (!target) {
        return;
      }

      if (action.payload.field === "exercise") {
        target.exercise = String(action.payload.value);
      } else if (action.payload.field === "reps") {
        target.reps = Number(action.payload.value);
      } else {
        target.weight = Number(action.payload.value);
      }
    },
    removeSet: (state, action: PayloadAction<string>) => {
      state.sets = state.sets.filter((set) => set.id !== action.payload);
    },
    resetWorkout: () => initialState,
  },
});

export const {
  setWorkoutDate,
  setWorkoutNotes,
  addSet,
  updateSet,
  removeSet,
  resetWorkout,
} = workoutSlice.actions;
export default workoutSlice.reducer;
