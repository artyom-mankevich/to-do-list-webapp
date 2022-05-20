class AbstractNote {
  key: string | null;
  title: string;
  timestamp: number;
  type: string;
  tag: string;
  pinned: boolean;
  image: string;

  constructor(key: string | null, title: string, timestamp: number, type: string, tag: string, pinned: boolean, image: string) {
    this.key = key;
    this.title = title;
    this.timestamp = timestamp;
    this.type = type;
    this.tag = tag;
    this.pinned = pinned;
    this.image = image;
  }
}

export class ListItem {
  key: string | null;
  body: string;
  checked: boolean;

  constructor(key: string | null,body: string, checked: boolean) {
    this.key = key;
    this.body = body;
    this.checked = checked;
  }
}

export class Note extends AbstractNote {
  listItems: ListItem[] = [];
  content: string;

  constructor(key: string | null, title: string, timestamp: number, type: string, tag: string, pinned: boolean, content: string, image: string) {
    super(key, title, timestamp, type, tag, pinned, image);
    this.content = content;
  }
}

export class List extends AbstractNote {
  listItems: ListItem[] = [];
  content: string = "";

  constructor(key: string | null, title: string, timestamp: number, type: string, tag: string, pinned: boolean, listItems: any, image: string) {
    super(key, title, timestamp, type, tag, pinned, image);
    this.listItems = listItems;
  }
}

export class Reminder {
  key: string;
  content: string;
  eventTimestamp: number;
  timestamp: number;

  constructor(key: string, content: string, eventTimestamp: number, timestamp: number) {
    this.key = key;
    this.content = content;
    this.eventTimestamp = eventTimestamp;
    this.timestamp = timestamp;
  }
}
