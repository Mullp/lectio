export type AssignmentStatus = "done" | "waiting";
export type AssignmentAwaiting = "student" | "teacher";

export interface IAssignmentLight {
  assignmentId: string;
  group: string;
  title: string;
  due: Date;
  studentTime: number;
  status: AssignmentStatus;
  absence: number;
  awaiting: AssignmentAwaiting;
  assignmentNote: string;
  grade: string;
  studentNote: string;
}