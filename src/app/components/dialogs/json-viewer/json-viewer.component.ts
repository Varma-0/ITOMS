export interface JsonNode {
  key: string;
  value: any;
  type: string;
  expanded: boolean;
  depth: number;
  children?: JsonNode[];
}

// json-viewer.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.scss'
})
export class JsonViewerComponent implements OnInit {
  @Input() jsonData: any;
  currentFormat: 'JSON' | 'XML' = 'JSON';
  jsonNodes: JsonNode[] = [];
  formattedXml: string = '';

  ngOnInit() {
    this.initializeNodes();
  }

  ngOnChanges() {
    this.initializeNodes();
  }

  setFormat(format: 'JSON' | 'XML') {
    this.currentFormat = format;
    if (format === 'XML') {
      this.formattedXml = this.formatXml(this.jsonToXml(this.jsonData));
    }
  }

  private jsonToXml(obj: any, parentKey: string = 'root'): string {
    let indent = 0;
    const INDENT_SIZE = 2;

    const getIndent = (level: number) => ' '.repeat(level * INDENT_SIZE);

    const toXml = (data: any, nodeName: string, level: number): string => {
      const currentIndent = getIndent(level);

      if (data === null || data === '') {
        return `${currentIndent}<${nodeName}/>`;
      }

      if (typeof data !== 'object') {
        return `${currentIndent}<${nodeName}>${this.escapeXml(String(data))}</${nodeName}>`;
      }

      if (Array.isArray(data)) {
        return data.map(item => toXml(item, 'item', level)).join('\n');
      }

      let xml = `${currentIndent}<${nodeName}>`;
      const childIndent = getIndent(level + 1);

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          xml += '\n' + toXml(data[key], key, level + 1);
        }
      }

      if (Object.keys(data).length > 0) {
        xml += '\n' + currentIndent;
      }
      xml += `</${nodeName}>`;
      return xml;
    };

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + toXml(obj, parentKey, 0);
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private formatXml(xml: string): string {
    // First escape the XML special characters
    const escapedXml = xml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // Then apply syntax highlighting
    return escapedXml
      // XML Declaration
      .replace(/(&lt;\?xml.*?\?&gt;)/g, '<span style="color: #808080">$1</span>')
      // Opening tags with attributes
      .replace(/(&lt;[^\/\s!?][^&]*?&gt;)/g, (match) => {
        return match.replace(/(&lt;[^\s&]+)/, '<span style="color: #569CD6">$1</span>')
                   .replace(/([^\s&]+)=(&quot;.*?&quot;)/g, '<span style="color: #9CDCFE">$1</span>=<span style="color: #CE9178">$2</span>');
      })
      // Closing tags
      .replace(/(&lt;\/[^&]*?&gt;)/g, '<span style="color: #569CD6">$1</span>')
      // Self-closing tags
      .replace(/(&lt;[^&]*?\/&gt;)/g, (match) => {
        return match.replace(/(&lt;[^\s&]+)/, '<span style="color: #569CD6">$1</span>')
                   .replace(/([^\s&]+)=(&quot;.*?&quot;)/g, '<span style="color: #9CDCFE">$1</span>=<span style="color: #CE9178">$2</span>');
      });
  }

  private initializeNodes() {
    const nodes: JsonNode[] = [];
    if (typeof this.jsonData === 'object' && this.jsonData !== null) {
      if (Array.isArray(this.jsonData)) {
        this.jsonData.forEach((item, index) => {
          nodes.push(this.createNode(item, index.toString(), 0));
        });
      } else {
        Object.keys(this.jsonData).forEach(key => {
          nodes.push(this.createNode(this.jsonData[key], key, 0));
        });
      }
    }
    this.jsonNodes = nodes;
  }

  private createNode(value: any, key: string, depth: number): JsonNode {
    const type = this.getType(value);
    const node: JsonNode = {
      key,
      value,
      type,
      expanded: depth === 0,
      depth,
      children: []
    };

    if (type === 'object' && value !== null) {
      if (Array.isArray(value)) {
        node.children = value.map((item, index) =>
          this.createNode(item, index.toString(), depth + 1)
        );
      } else {
        node.children = Object.keys(value).map(childKey =>
          this.createNode(value[childKey], childKey, depth + 1)
        );
      }
    }

    return node;
  }

  handleNodeToggle(node: JsonNode) {
    this.toggleNode(node);
  }

  toggleNode(node: JsonNode) {
    if (this.isExpandable(node)) {
      node.expanded = !node.expanded;
    }
  }

  expandAll() {
    this.setExpansionForAll(true);
  }

  collapseAll() {
    this.setExpansionForAll(false);
  }

  private setExpansionForAll(expanded: boolean) {
    const setExpansion = (nodes: JsonNode[]) => {
      nodes.forEach(node => {
        if (this.isExpandable(node)) {
          node.expanded = expanded;
          if (node.children) {
            setExpansion(node.children);
          }
        }
      });
    };
    setExpansion(this.jsonNodes);
  }

  isExpandable(node: JsonNode): boolean {
    return node.type === 'object' && node.children && node.children.length > 0;
  }

  getType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value) || typeof value === 'object') return 'object';
    return typeof value;
  }

  copyToClipboard() {
    const content = this.currentFormat === 'JSON'
      ? JSON.stringify(this.jsonData, null, 2)
      : this.jsonToXml(this.jsonData);
    navigator.clipboard.writeText(content);
  }

  closeModal() {
    // Implement your modal close logic here
  }
}
