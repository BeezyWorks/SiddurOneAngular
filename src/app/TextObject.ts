export class TextObject {
  flags: string[];
  text: string;
  rawtext: string;
  or: ConditionObject[];
  and: ConditionObject[];
  openingTag: string = "";
  closingTag: string = "";

  constructor(unparsed: Object) {
    if (unparsed.toString() == "linebreak") {
      this.text = '<br>';
    }

    if (unparsed.hasOwnProperty('text')) {
      this.text = unparsed['text'] as string;
    }

    if (unparsed.hasOwnProperty('flags')) {
      this.flags = unparsed['flags'];
      for (var flag of this.flags) {
        if (flag == "bold") {
          this.openingTag += "<b>";
          this.closingTag += "</b>";
        }
        if (flag == "small") {
          this.openingTag += "<small>";
          this.closingTag += "</small>";
        }
        if (flag == "subtitle") {
          this.openingTag += "<h3>";
          this.closingTag += "</h3>";
        }
        if (flag == "special_color") {
          this.openingTag += "<span style=\"color:#9C27B0\">";
          this.closingTag += "</span>";
        }

      }
      console.log(this.openingTag);
      console.log(this.closingTag);
      this.text = this.openingTag + this.text + this.closingTag;
    }


  }
}

export class ConditionObject {
  condition: string;
  value: boolean;
}
