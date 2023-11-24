export default class RESTDatasource {
  public url = null;
  public id = null as unknown as string;
  public caption = null;
  public type = "REST";

  constructor(id, url, caption) {
    this.id = id;
    this.url = url;
    this.caption = caption;
  }

  async getData(url) {
    const req = await fetch(`${this.url}${url}`);
    return await req.json();
  }

  getState() {
    return {
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    };
  }
}
