import { BaseManager } from "./BaseManager";
import { Client } from "../lib";
import fetch from "cross-fetch";
import { Student } from "../classes/Student";
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

  /**
   * Get all students in a group
   * @param groupId - Id of the group
   * @return {Promise<Student[]>} - An array of {@link Student} objects
   * @async
   */
  public async getFromGroup(groupId: string): Promise<Student[]> {
    return await fetch(`https://www.lectio.dk/lectio/${this.client.schoolId}/subnav/members.aspx?showstudents=1&klasseid=${groupId}`, {
      headers: {
        Cookie: `ASP.NET_SessionId=${this.client.sessionId};`,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        const dom = new JSDOM(res).window.document;

        if (dom.querySelector("span#s_m_Content_Content_additionalInfoLbl")?.textContent?.split(": ")[1] === "0") return [] as Student[];

        const groupName = dom
          .querySelector("div#s_m_HeaderContent_subnav_div.ls-master-pageheader div.ls-subnav-container div#s_m_HeaderContent_MainTitle.maintitle")
          ?.textContent
          ?.split("Klassen ")[1]
          .split(" - Elever")[0];

        return [...dom.querySelectorAll("table#s_m_Content_Content_laerereleverpanel_alm_gv.ls-table-layout1.lf-grid tbody tr")]
          .filter((tr) => tr.querySelector("th")?.innerHTML !== "Foto")
          .map((tr) => {
            const anchorElement: HTMLAnchorElement | null = tr.querySelector(".printUpscaleFontFornavn a");
            const lastName = tr.querySelector(".printUpscaleFontFornavn")?.nextElementSibling?.firstElementChild?.textContent;
            const imageElement: HTMLImageElement | null = tr.querySelector("td img#s_m_Content_Content_laerereleverpanel_alm_gv_ctl02_Thumbview1thumbimage");

            return new Student(this.client, {
              studentId: anchorElement?.href.split("elevid=")[1] ?? "",
              name: `${anchorElement?.textContent ?? ""} ${lastName ?? ""}`,
              group: { name: groupName, id: groupId },
              imageId: imageElement?.src.split("pictureid=")[1] ?? "",
            });
          });
      })
      .catch((error) => {
        throw error;
      });
  }
}