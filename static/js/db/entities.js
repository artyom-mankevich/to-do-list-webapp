class Content {
    constructor(key, title, timestamp, type, tag, pinned) {
        this.key = key;
        this.title = title;
        this.timestamp = timestamp;
        this.type = type;
        this.tag = tag;
        this.pinned = pinned;
    }
}

export class Note extends Content {
    constructor(key, title, timestamp, type, tag, pinned, content) {
        super(key, title, timestamp, type, tag, pinned);
        this.content = content;
    }
}

export class List extends Content {
    constructor(key, title, timestamp, type, tag, pinned, listItems) {
        super(key, title, timestamp, type, tag, pinned);
        this.listItems = listItems;
    }
}
