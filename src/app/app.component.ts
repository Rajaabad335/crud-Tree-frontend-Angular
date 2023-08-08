import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { TreeControl } from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,MatTreeModule,
    MatButtonModule,
    MatFormFieldModule,FormsModule,
    MatInputModule,
    MatIconModule,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

   _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


findNodeByName(nodes: FoodNode[], nodeName: string): FoodNode | null {
  for (const node of nodes) {
    if (node.name === nodeName) {
      return node; // Return the node if it matches the provided name
    }

    if (node.children) {
      const foundNode = this.findNodeByName(node.children, nodeName);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null; // Node not found
}

deleteNode(node: ExampleFlatNode) {
  const findAndDelete = (data: any[], nodeName: string): boolean => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === nodeName) {
        data.splice(i, 1);
        return true;
      } else if (data[i].children) {
        const childDeleted = findAndDelete(data[i].children, nodeName);
        if (childDeleted) return true;
      }
    }
    return false;
  };

  findAndDelete(this.dataSource.data, node.name);

  this.dataSource.data = [...this.dataSource.data];
}

addNode(node: ExampleFlatNode) {
  const userInput = window.prompt('Please enter node name:', '');

  if (userInput !== null) {
    const newNode: FoodNode = { name: userInput };
    let parentNode = this.findNodeByName(this.dataSource.data, node.name);

    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
        this.treeControl.expand(node);
      }
      parentNode.children.push(newNode);
      this.dataSource.data = [...this.dataSource.data];
    } else {
      window.alert('Invalid parent node.');
    }
  } else {
    window.alert('Please enter a valid name.');
  }
}

editNode(node: ExampleFlatNode) {
  const userInput = window.prompt('Please enter new node name:', '');
  if (userInput !== null) {
    const editedNode = this.findNodeByName(this.dataSource.data, node.name);

    if (editedNode) {
      editedNode.name = userInput;
      this.dataSource.data = [...this.dataSource.data];
    }
  } else {
    window.alert('Please enter a valid name');
  }
}


}


