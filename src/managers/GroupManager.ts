import { BaseManager } from "./BaseManager";
import { Client } from "../lib";
import { Group, Student } from "../classes";
import fetch from "cross-fetch";
import { JSDOM } from "jsdom";

export class GroupManager extends BaseManager {
  /**
   * The client that instantiated this manager.
   * @type {Client}
   */
  public constructor(client: Client) {
    super(client);

    this.client = client;
  }

  /**
   * Get a group
   * @param groupId - Id of the group
   * @return {Promise<Group>} - A {@link Group} objects
   * @async
   */
  public async get(groupId: string): Promise<Group> {
    return await fetch(`https://www.lectio.dk/lectio/${this.client.schoolId}/subnav/members.aspx?showstudents=1&klasseid=${groupId}`, {
      headers: {
        Cookie: `ASP.NET_SessionId=${this.client.sessionId};`,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        const dom = new JSDOM(res).window.document;

        const groupName = dom
          .querySelector("div#s_m_HeaderContent_subnav_div.ls-master-pageheader div.ls-subnav-container div#s_m_HeaderContent_MainTitle.maintitle")
          ?.textContent
          ?.split("Klassen ")[1]
          .split(" - Elever")[0];

        const students = dom.querySelector("span#s_m_Content_Content_additionalInfoLbl")?.textContent?.split(": ")[1] === "0" ? [] : [...dom.querySelectorAll("table#s_m_Content_Content_laerereleverpanel_alm_gv.ls-table-layout1.lf-grid tbody tr")]
          .filter((tr) => tr.querySelector("th")?.innerHTML !== "Foto")
          .map((tr) => {
            const anchorElement: HTMLAnchorElement | null = tr.querySelector(".printUpscaleFontFornavn a");
            const lastName = tr.querySelector(".printUpscaleFontFornavn")?.nextElementSibling?.firstElementChild?.textContent;
            const imageElement: HTMLImageElement | null = tr.querySelector("td img");

            return new Student(this.client, {
              studentId: anchorElement?.href.split("elevid=")[1] ?? "",
              name: `${anchorElement?.textContent ?? ""} ${lastName ?? ""}`,
              group: {name: groupName, groupId: groupId},
              imageId: imageElement?.src.split("pictureid=")[1] ?? "",
            });
          });

        return new Group(this.client, {
          name: groupName ?? "",
          groupId: groupId,
          students: students,
        });
      })
      .catch((error) => {
        throw error;
      });
  }
}