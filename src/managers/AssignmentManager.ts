import { BaseManager } from "./BaseManager";
import { Client } from "../lib";
import { AssignmentLight } from "../classes";
import fetch from "cross-fetch";
import { JSDOM } from "jsdom";
import moment from "moment";

/**
 * Manages API methods for getting assignment information.
 * @extends {BaseManager}
 */
export class AssignmentManager extends BaseManager {
  /**
   * The client that instantiated this manager.
   * @type {Client}
   */
  public constructor(client: Client) {
    super(client);

    this.client = client;
  }

  // /**
  //  * Get an assignment by Id
  //  * @param assignmentId - The Id of the assignment
  //  * @deprecated
  //  */
  // public async get(assignmentId: string) {
  //   throw new Error("Method not implemented");
  //
  //   return await fetch(`https://www.lectio.dk/lectio/${this.client.schoolId}/ElevAflevering.aspx?elevid=${this.client.studentId}&exerciseid=${assignmentId}&prevurl=OpgaverElev.aspx`, {
  //     headers: {
  //       Cookie: `ASP.NET_SessionId=${this.client.sessionId};`,
  //     }
  //   })
  //     .then((res) => res.text())
  //     .then((res) => {
  //       const dom = new JSDOM(res).window.document;
  //     })
  //     .catch((error) => {
  //       throw error;
  //     });
  // }

  /**
   * Get all assignments
   */
  public async getAll() {
    return await fetch(`https://www.lectio.dk/lectio/${this.client.schoolId}/OpgaverElev.aspx?elevid=${this.client.studentId}`, {
      method: "POST",
      headers: {
        Cookie: `ASP.NET_SessionId=${this.client.sessionId};`,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        const dom = new JSDOM(res).window.document;

        return [...dom.querySelectorAll("#s_m_Content_Content_ExerciseGV tbody tr")]
          .filter((tr) => tr.firstElementChild?.textContent !== "Uge")
          .map((tr) => {
            const cells = [...(tr as HTMLTableRowElement).cells];

            return new AssignmentLight(this.client, {
              assignmentId: (cells[2].firstElementChild?.firstElementChild as HTMLAnchorElement)
                .href
                .split("exerciseid=")[1]
                .split("&")[0],
              group: {
                name: cells[1].firstElementChild?.textContent ?? "",
                groupId: cells[1].firstElementChild?.getAttribute("data-lectiocontextcard")?.toString().substring(2) ?? "",
              },
              title: cells[2].firstElementChild?.firstElementChild?.textContent ?? "",
              due: moment(cells[3].textContent ?? "", "DD/MM-YYYY hh:mm").toDate(),
              studentTime: Number(cells[4].textContent?.replace(",", ".")),
              status: cells[5].textContent === "Afleveret" ? "done" : "waiting",
              absence: (Number(cells[6].textContent?.replace("\u00A0%", "")) ?? 0) / 100,
              awaiting: cells[7].textContent === "L??rer" ? "teacher" : "student",
              assignmentNote: cells[8].textContent ?? "",
              grade: cells[9].textContent ?? "",
              studentNote: cells[10].textContent ?? "",
            });
          });
      })
      .catch((error) => {
        throw error;
      });
  }
}