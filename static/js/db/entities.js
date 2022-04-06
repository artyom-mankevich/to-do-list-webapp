class Content {
    constructor(title, timestamp, type, tag, pinned) {
        this.title = title;
        this.timestamp = timestamp;
        this.type = type;
        this.tag = tag;
        this.pinned = pinned;
    }
}

export class Note extends Content {
    constructor(title, timestamp, type, tag, pinned, content) {
        super(title, timestamp, type, tag, pinned);
        this.content = content;
    }
}

export class List extends Content {
    constructor(title, timestamp, type, tag, pinned, listItems) {
        super(title, timestamp, type, tag, pinned);
        this.listItems = listItems;
    }
}
