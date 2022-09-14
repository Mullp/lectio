import { IGroup } from "./Group";

export interface IStudent {
  name: string;
  studentId: string;
  group: IGroup;
  imageId: string;
}

export interface IGetStudentImageParams {
  fullSize: boolean;
}