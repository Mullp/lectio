import { BaseClass } from "./Base";
import { Client } from "../lib";
import { IGroupData } from "../typings";
import { Student } from "./Student";

export class Group extends BaseClass {
  /**
   * Name of the group
   */
  public name: string;
  /**
   * Id of the group
   */
  public groupId: string;
  /**
   * Students of the group
   */
  public students: Student[];

  public constructor(client: Client, data: IGroupData) {
    super(client);

    this.client = client;

    this.name = data.name;
    this.groupId = data.groupId;
    this.students = data.students;
  }
}