export const Routes = {
  textBox: '/text-box',
  practiceForm: '/automation-practice-form',
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];
