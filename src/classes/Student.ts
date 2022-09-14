import { BaseClass } from "./Base";
import { IGroup } from "../typings";
import { Client } from "../lib";
import { IGetStudentImageParams, IStudent } from "../typings/Student";
import fetch from "cross-fetch";

export class Student extends BaseClass {
  /**
   * Name of the student
   */
  public name: string;
  /**
   * Id of the student
   */
  public studentId: string;
  /**
   * Group (hold / klasse) the student is in
   * @example
   * {
   *   name: "1a DA",
   *   id: "75853936354"
   * }
   */
  public group: IGroup;
  /**
   * Id of the image
   */
  public imageId: string;

  public constructor(client: Client, data: IStudent) {
    super(client);

    this.client = client;

    this.name = data.name;
    this.studentId = data.studentId;
    this.group = data.group;
    this.imageId = data.imageId;
  }

  /**
   * Get the url of the image
   */
  public getImageUrl({ fullSize }: IGetStudentImageParams = { fullSize: true }): string {
    return `https://www.lectio.dk/lectio/${this.client.schoolId}/GetImage.aspx?pictureid=${this.imageId}&${fullSize ? "fullsize=1" : ""}`;
  }

  /**
   * Get the image as an {@link ArrayBuffer}
   * @param IGetStudentImageParams - Get image params
   * @return {ArrayBuffer} - yes
   */
  public async getImage({ fullSize }: IGetStudentImageParams = { fullSize: true }) {
    return await fetch(this.getImageUrl({ fullSize: fullSize }))
      .then((res) => res.arrayBuffer())
      .catch((error) => {
        throw error;
      });
  }
}