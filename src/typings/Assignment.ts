import { IGroup } from "./Group";

export type AssignmentStatus = "done" | "waiting";
export type AssignmentAwaiting = "student" | "teacher";

export interface IAssignmentLight {
  assignmentId: string;
  group: IGroup;
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

export interface IAssignment extends IAssignmentLight {
  gradingScale: string;
  teacher: string;
  describeInLesson: boolean;
}
