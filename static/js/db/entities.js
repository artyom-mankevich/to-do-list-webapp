class AbstractNote {
    constructor(key, title, timestamp, type, tag, pinned, image) {
        this.key = key;
        this.title = title;
        this.timestamp = timestamp;
        this.type = type;
        this.tag = tag;
        this.pinned = pinned;
        this.image = image;
    }
}

export class Note extends AbstractNote {
    constructor(key, title, timestamp, type, tag, pinned, content, image) {
        super(key, title, timestamp, type, tag, pinned, image);
        this.content = content;
    }
}

export class List extends AbstractNote {
    constructor(key, title, timestamp, type, tag, pinned, listItems, image) {
        super(key, title, timestamp, type, tag, pinned, image);
        this.listItems = listItems;
    }
}

export class Reminder {
    constructor(key, content, eventTimestamp, timestamp) {
        this.key = key;
        this.content = content;
        this.eventTimestamp = eventTimestamp;
        this.timestamp = timestamp;
    }
}
