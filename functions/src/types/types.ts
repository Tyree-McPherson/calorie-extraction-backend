export interface response {
  status: number;
  valid: boolean;
  message?: string;
  json?: any;
}

interface Documents {
  [key: string]: string[];
}

export const documents: Documents = {
  my_goals: [],
  my_meal_plan: [],
  my_routine: [],
  profile: [],
};
