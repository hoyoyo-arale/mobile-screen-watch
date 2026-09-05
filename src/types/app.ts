export type Theme = "dark" | "light";

export type TimerPhase = "work" | "break";

export interface AppSettings {
  workDurationMinutes: number;
  breakDurationMinutes: number;
  soundEnabled: boolean;
  theme: Theme;
  showClockSeconds: boolean;
  changeColorOnBounce: boolean;
  /** 通常時に時計が画面を横断する秒数。値が小さいほど速く移動する。 */
  movementSpeedPixelsPerSecond: number;
}

export const DEFAULT_SETTINGS: Readonly<AppSettings> = {
  workDurationMinutes: 50,
  breakDurationMinutes: 10,
  soundEnabled: false,
  theme: "dark",
  showClockSeconds: false,
  changeColorOnBounce: false,
  movementSpeedPixelsPerSecond: 15,
};

export const SETTINGS_OPTIONS = {
  workDurationMinutes: [45, 50, 60, 75],
  breakDurationMinutes: [10, 15, 20],
  movementSpeedPixelsPerSecond: [10, 15, 25],
} as const;

export const UI_TIMINGS = {
  menuPreviewDurationMs: 30_000,
  menuAutoHideDurationMs: 30_000,
} as const;

export type TimerState =
  | { status: "idle" }
  | {
      status: "running";
      phase: TimerPhase;
      startedAt: number;
      endAt: number;
    }
  | {
      status: "paused";
      phase: TimerPhase;
      remainingMs: number;
    }
  | {
      status: "completed";
      phase: TimerPhase;
      completedAt: number;
    };

export const INITIAL_TIMER_STATE: Readonly<TimerState> = { status: "idle" };

export interface ClockMotionState {
  position: {
    x: number;
    y: number;
  };
  direction: {
    x: -1 | 1;
    y: -1 | 1;
  };
  isPaused: boolean;
}

export interface UiState {
  isMenuOpen: boolean;
  isSettingsOpen: boolean;
}

export interface AppState {
  settings: AppSettings;
  timer: TimerState;
  motion: ClockMotionState;
  ui: UiState;
}
