import puppeteer, { Puppeteer } from "puppeteer";
import { JSDOM } from "jsdom";

interface ClientConstructorParams {
  schoolId: number;
  username: string;
  password: string;
  debug?: {
    headless?: boolean;
  };
}

interface GetStudentsParams {
  classId: string;
  responseHandler?: (response: puppeteer.HTTPResponse) => void;
}

/**
 * Represents the client.
 */
export class Client {
  private browser: puppeteer.Browser | undefined = undefined;
  private schoolId: number;
  private username: string;
  private password: string;
  private debug?: { headless?: boolean } = {};

  public constructor({ schoolId, username, password, debug }: ClientConstructorParams) {
    this.schoolId = schoolId;
    this.username = username;
    this.password = password;
    this.debug = debug;
  }

  /**
   * Launch the browser
   */
  public async launch() {
    this.browser = await puppeteer.launch({ headless: this.debug?.headless ?? true });
  }

  /**
   * Close the browser
   */
  public async close() {
    this.browser?.close();
  }

  /**
   * Sign in to Lectio
   */
  public async signIn() {
    if (!this.browser) throw new Error("Browser is not launched!");
    const page = await this.browser.newPage();
    await page.goto(`https://www.lectio.dk/lectio/${this.schoolId}/forside.aspx`);
    await page.type("#username", this.username);
    await page.type("#password", this.password);
    await page.click("#m_Content_AutologinCbx");
    await page.click("#m_Content_submitbtn2");
    await page.close();
  }

  /**
   * Get all classes
   * @returns An array of all classes
   */
  public async getAllClasses() {
    if (!this.browser) throw new Error("Browser is not launched!");
    const page = await this.browser.newPage();
    await page.goto(`https://www.lectio.dk/lectio/${this.schoolId}/FindSkema.aspx?type=stamklasse`);
    const dom = new JSDOM(await page.content()).window.document;
    await page.close();
    return [...dom.querySelectorAll("#m_Content_listecontainer div p a")].map((a) => {
      return {
        name: a.innerHTML,
        id: a.getAttribute("href")?.replace("/lectio/57/SkemaNy.aspx?type=stamklasse&klasseid=", ""),
      };
    });
  }

  /**
   * Gets all students in a class
   * @param {GetStudentsParams} class - The class to get the students from
   * @param {string} class.classId - The class id
   * @returns An aray of studens
   */
  public async getStudents({ classId, responseHandler }: GetStudentsParams) {
    if (!this.browser) throw new Error("Browser is not launched!");
    const page = await this.browser.newPage();
    await page.goto(
      `https://www.lectio.dk/lectio/${this.schoolId}/subnav/members.aspx?klasseid=${classId}&showstudents=1`,
    );
    await page.click("#s_m_Content_Content_IsPrintingHiResPicturesCB");
    await page.waitForNavigation();
    const dom = new JSDOM(await page.content()).window.document;
    if (dom.querySelector("#s_m_Content_Content_additionalInfoLbl")?.textContent?.split(": ")[1] === "0") return [];
    await page.close();
    if (responseHandler) page.on("response", (response) => responseHandler(response));
    return [...dom.querySelectorAll(".islandContent table tbody tbody tr")]
      .filter((tr) => tr.querySelector("th")?.innerHTML !== "Foto")
      .map(async (tr) => {
        const link: HTMLAnchorElement | null = tr.querySelector(".printUpscaleFontFornavn a");
        const lastName =
          tr.querySelector(".printUpscaleFontFornavn")?.nextElementSibling?.firstElementChild?.textContent;
        const image: HTMLImageElement | null = tr.querySelector("td img");
        return {
          studentId: link?.href.replace("/lectio/57/SkemaNy.aspx?type=elev&elevid=", ""),
          firstName: link?.textContent,
          lastName: lastName,
          imageUrl: image?.src,
        };
      });
  }
}
