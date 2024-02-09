export default class PivotTable {
  private mdx: string = "";
  styles = {
    rows: [] as number[],
    columns: [] as number[],
  };

  constructor(mdx: string = "") {
    this.mdx = mdx;
  }

  // MDX Generation logic
}
