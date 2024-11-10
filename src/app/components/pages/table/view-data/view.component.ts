// json-viewer.types.ts
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
    template: `
      <div class="modal-container">
        <div class="modal-header">
          <div class="format-options">
            <button [class.active]="currentFormat === 'JSON'" (click)="setFormat('JSON')">JSON</button>
            <button [class.active]="currentFormat === 'XML'" (click)="setFormat('XML')">XML</button>
          </div>
          <div class="actions">
            <button (click)="expandAll()">Expand All</button>
            <button (click)="collapseAll()">Collapse All</button>
            <button (click)="copyToClipboard()">📋 Copy</button>
            <button (click)="closeModal()">✕ Close</button>
          </div>
        </div>
        <div class="json-content">
          <div class="tree-view" *ngIf="currentFormat === 'JSON'">
            <app-json-viewer-node
              *ngFor="let node of jsonNodes"
              [node]="node"
              [depth]="0"
              (onToggle)="handleNodeToggle($event)">
            </app-json-viewer-node>
          </div>
          <div class="xml-view" *ngIf="currentFormat === 'XML'">
            <pre [innerHTML]="formattedXml"></pre>
          </div>
        </div>
      </div>
    `,
    styles: [`
      .modal-container {
        background-color: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Consolas', 'Monaco', monospace;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        background-color: #252526;
        border-bottom: 1px solid #333;
      }

      .format-options button, .actions button {
        background: none;
        border: none;
        color: #999;
        padding: 4px 8px;
        cursor: pointer;
        margin-right: 8px;
      }

      .format-options button.active {
        color: #007acc;
      }

      .actions button:hover {
        color: #fff;
      }

      .json-content {
        padding: 16px;
        overflow: auto;
        flex-grow: 1;
      }

      .tree-view, .xml-view {
        font-size: 14px;
        line-height: 1.5;
      }

      .xml-view pre {
        margin: 0;
        white-space: pre-wrap;
      }

      .xml-tag { color: #569cd6; }
      .xml-attr { color: #9cdcfe; }
      .xml-value { color: #ce9178; }
    `]
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
      const toXml = (data: any, nodeName: string): string => {
        if (data === null) return `<${nodeName}/>`;

        if (typeof data !== 'object') {
          return `<${nodeName}>${this.escapeXml(String(data))}</${nodeName}>`;
        }

        if (Array.isArray(data)) {
          return data.map(item => toXml(item, 'item')).join('\n');
        }

        let xml = `<${nodeName}>`;
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            xml += '\n' + toXml(data[key], key);
          }
        }
        xml += `\n</${nodeName}>`;
        return xml;
      };

      return toXml(obj, parentKey);
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
      return xml
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(".*?")/g, '<span class="xml-value">$1</span>')
        .replace(/&lt;(\/?[a-zA-Z0-9_.-]+)(?=\s|&gt;)/g, '<span class="xml-tag">&lt;$1</span>')
        .replace(/([a-zA-Z0-9_.-]+)="([^"]*?)"/g, '<span class="xml-attr">$1</span>="<span class="xml-value">$2</span>"');
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

  // json-viewer-node.component.ts
  @Component({
    selector: 'app-json-viewer-node',
    template: `
      <div class="node-wrapper" [style.marginLeft.px]="depth * 20">
        <div class="tree-node">
          <span *ngIf="isExpandable(node)"
                class="expander"
                (click)="toggle()">
            {{ node.expanded ? '▼' : '▶' }}
          </span>
          <span *ngIf="!isExpandable(node)" class="expander-placeholder"></span>
          <span class="property">"{{ node.key }}":</span>
          <span [ngSwitch]="node.type" class="value">
            <ng-container *ngSwitchCase="'object'">
              <span class="bracket">
                {{ isArray(node.value) ? '[' : '{' }}
                <span *ngIf="!node.expanded">
                  {{ getCollapsedPreview(node.value) }}
                  {{ isArray(node.value) ? ']' : '}' }}
                </span>
              </span>
            </ng-container>
            <span *ngSwitchCase="'string'" class="string">"{{ node.value }}"</span>
            <span *ngSwitchCase="'number'" class="number">{{ node.value }}</span>
            <span *ngSwitchCase="'boolean'" class="boolean">{{ node.value }}</span>
            <span *ngSwitchCase="'null'" class="null">null</span>
          </span>
        </div>
        <div *ngIf="node.expanded && node.children" class="node-children">
          <app-json-viewer-node
            *ngFor="let child of node.children"
            [node]="child"
            [depth]="depth + 1"
            (onToggle)="onToggle.emit($event)">
          </app-json-viewer-node>
          <div *ngIf="node.children.length > 0" class="bracket-close">
            {{ isArray(node.value) ? ']' : '}' }}
          </div>
        </div>
      </div>
    `,
    styles: [`
      .node-wrapper {
        margin: 2px 0;
      }
      .tree-node {
        display: flex;
        align-items: center;
        padding: 2px 4px;
        cursor: pointer;
        border-radius: 2px;
      }
      .tree-node:hover {
        background-color: #2d2d2d;
      }
      .expander {
        cursor: pointer;
        width: 20px;
        display: inline-block;
        text-align: center;
        font-size: 10px;
      }
      .expander-placeholder {
        width: 20px;
        display: inline-block;
      }
      .node-children {
        margin-left: 20px;
      }
      .property { color: #9cdcfe; margin-right: 4px; }
      .string { color: #ce9178; }
      .number { color: #b5cea8; }
      .boolean { color: #569cd6; }
      .null { color: #569cd6; }
      .bracket { color: #d4d4d4; }
      .bracket-close {
        color: #d4d4d4;
        margin-top: 2px;
      }
      .value { margin-left: 4px; }
    `]
  })
  export class JsonViewerNodeComponent {
    @Input() node!: JsonNode;
    @Input() depth = 0;
    @Output() onToggle = new EventEmitter<JsonNode>();

    toggle() {
      this.onToggle.emit(this.node);
    }

    isExpandable(node: JsonNode): boolean {
      return node.type === 'object' && node.children && node.children.length > 0;
    }

    isArray(value: any): boolean {
      return Array.isArray(value);
    }

    getCollapsedPreview(value: any): string {
      if (Array.isArray(value)) {
        return value.length ? `...${value.length} items` : '';
      }
      const keys = Object.keys(value || {});
      return keys.length ? `...${keys.length} properties` : '';
    }
  }

