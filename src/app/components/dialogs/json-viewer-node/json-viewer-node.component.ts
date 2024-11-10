export interface JsonNode {
  key: string;
  value: any;
  type: string;
  expanded: boolean;
  depth: number;
  children?: JsonNode[];
}

// json-viewer.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-json-viewer-node',
  templateUrl: './json-viewer-node.component.html',
  styleUrl: './json-viewer-node.component.scss'
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
