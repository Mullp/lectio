import { BaseManager } from "./BaseManager";
import { Client } from "../lib";
import { Student } from "../classes";
import fetch from "cross-fetch";
import { JSDOM } from "jsdom";

export class StudentManager extends BaseManager {
  /**
   * The client that instantiated this manager.
   * @type {Client}
   */
  public constructor(client: Client) {
    super(client);

    this.client = client;
  }

  /**
   * Get a student by Id
   * @async
   * @param studentId - Id of the student
   * @return {Promise<Student>} - A {@link Student} object
   */
  public async get(studentId: string): Promise<Student> {
    return await fetch(`https://www.lectio.dk/lectio/${this.client.schoolId}/SkemaNy.aspx?type=elev&elevid=${studentId}`, {
      headers: {
        Cookie: `ASP.NET_SessionId=${this.client.sessionId};`,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        const dom = new JSDOM(res).window.document;

        return new Student(this.client, {
          name: dom.querySelector("div.ls-subnav-container div#s_m_HeaderContent_MainTitle.maintitle")?.textContent?.split("Eleven ")[1].split(",")[0] ?? "",
          studentId: studentId,
          group: { name: dom.querySelector("div.ls-subnav-container div#s_m_HeaderContent_MainTitle.maintitle")?.textContent?.split(", ")[1].split(" - ")[0] ?? "" },
          imageId: (dom.querySelector("div#s_m_HeaderContent_thumb.thumber img#s_m_HeaderContent_picctrlthumbimage") as HTMLImageElement).src.split("pictureid=")[1] ?? "",
        });
      })
      .catch((error) => {
        throw error;
      });
  }


}