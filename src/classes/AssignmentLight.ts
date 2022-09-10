import { BaseClass } from "./Base";
import { Client } from "../lib";
import { AssignmentAwaiting, AssignmentStatus, IAssignmentLight } from "../typings";

/**
 * Represents a light assignment
 * @extends {BaseClass}
 */
export class AssignmentLight extends BaseClass {
  public assignmentId: string;
  public group: string;
  public title: string;
  public due: Date;
  public studentTime: number;
  public status: AssignmentStatus;
  public absence: number;
  public awaiting: AssignmentAwaiting;
  public assignmentNote: string;
  public grade: string;
  public studentNote: string;

  public constructor(client: Client, data: IAssignmentLight) {
    super(client);

    this.client = client;

    this.assignmentId = data.assignmentId;
    this.group = data.group;
    this.title = data.title;
    this.due = data.due;
    this.studentTime = data.studentTime;
    this.status = data.status;
    this.absence = data.absence;
    this.awaiting = data.awaiting;
    this.assignmentNote = data.assignmentNote;
    this.grade = data.grade;
    this.studentNote = data.studentNote;
  }
}