// Shortcut to create an XmlElement without "new";
export const xml = (tag) => new XmlElement(tag);
// Structured element with tag, attributes and children.
export class XmlElement {
    constructor(tag) {
        this.tag = tag;
        this.attributes = {};
        this.children = [];
    }
    render() {
        const attributes = this.renderAttributes();
        const content = this.renderChildren();
        if (content === "") {
            return `<${this.tag}${attributes}/>`;
        }
        return `<${this.tag}${attributes}>${content}</${this.tag}>`;
    }
    renderAttributes() {
        const attributes = Object.keys(this.attributes);
        if (attributes.length === 0)
            return "";
        let out = "";
        for (const attribute of attributes) {
            out += ` ${attribute}="${this.attributes[attribute]}"`;
        }
        return out;
    }
    renderChildren() {
        let out = "";
        for (const child of this.children) {
            out += child.render();
        }
        return out;
    }
}
