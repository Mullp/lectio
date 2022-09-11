import { BaseClass } from "./Base";
import { Client } from "../lib";
import { AssignmentAwaiting, AssignmentStatus, IAssignmentLight, IGroup } from "../typings";

/**
 * Represents a light assignment
 * @extends {BaseClass}
 */
export class AssignmentLight extends BaseClass {
  /**
   * Represents the assignmentId
   * @example
   * // Get the full Assignment
   * client.assignment.get("23856813356")
   */
  public assignmentId: string;
  /**
   * Group (hold / klasse) the assignment was created for
   * @example
   * {
   *   name: "1a DA",
   *   id: "75853936354"
   * }
   */
  public group: IGroup;
  /**
   * Title of the assignment
   */
  public title: string;
  /**
   * Date where the assignment is due
   */
  public due: Date;
  /**
   * Amount of hours the teacher expects the student to use for the assignment
   */
  public studentTime: number;
  /**
   * Whether the assignment has been delivered or not
   */
  public status: AssignmentStatus;
  /**
   * Percentage of absence the student has received for the assignment
   */
  public absence: number;
  /**
   * Who the assignment is awaiting a response from
   */
  public awaiting: AssignmentAwaiting;
  /**
   * Teacher's note on the assignment
   */
  public assignmentNote: string;
  /**
   * Which grade was given for the assignment
   */
  public grade: string;
  /**
   * Student's note on the assignment
   */
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