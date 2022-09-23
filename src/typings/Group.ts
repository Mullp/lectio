import { Student } from "../classes";

export interface IGroup {
  name?: string,
  groupId?: string
}

export interface IGroupData {
  name: string;
  groupId: string;
  students: Student[];
}