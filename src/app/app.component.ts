import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TreeControl } from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TreedataService } from './treedata.service';
// import { DataServiceService } from './data-service.service';

interface FoodNode {

  parentId: number;
  id: number;
  name: string;
  level: number;
  parent?: FoodNode;
  children?: FoodNode[];
}

interface ExampleFlatNode {
  parentId: number;
  id: number;
  expandable: boolean;
  name: string;
  children?: FoodNode[];
  level: number;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,MatTreeModule,
    MatButtonModule,
    MatFormFieldModule,FormsModule,
    MatInputModule,MatProgressBarModule,
    MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit{
  isLoading: boolean = true;


  constructor(private tdService:TreedataService) {}

  ngOnInit(): void {
     this.fetchData();
  }


  fetchData(): void{
    this.isLoading = true; // Show the progress bar
    setTimeout(() => {
      this.tdService.getData().subscribe(
        (res) => {
          this.dataSource.data = res.nestedData;
          this.isLoading = false; // Hide the progress bar once data is fetched
        },
        (error) => {
          console.error('Error fetching data:', error);
          this.isLoading = false; // Hide the progress bar in case of an error
        }
      );
    }, 1000);
  }


   _transformer = (node: FoodNode, level: number): ExampleFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      parentId: node.parentId,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


findNodeById(nodes: FoodNode[], nodeId: number): FoodNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node; // Return the node if it matches the provided name
    }

    if (node.children) {
      const foundNode = this.findNodeById(node.children, nodeId);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null; // Node not found
}



addNode(node: FoodNode) {
  const userInput = window.prompt('Please enter node name:', '');

  if (userInput !== null) {
    const newNode: FoodNode = {
      name: userInput,
      parentId: node.id,
      id: 0,
      level: 0
    };

    const parentNode = this.findNodeById(this.dataSource.data, node.id);

    this.tdService.addNode(newNode).subscribe(
      (response) => {
        if (parentNode) {
          if (!parentNode.children) {
            parentNode.children = [];

          }

          parentNode.children.push(response.data);
          this.dataSource.data = [...this.dataSource.data];

          this.fetchData();
        }
      },
      (error) => {
        console.error('Error adding node:', error);
      }
    );
  }
}



deleteNodeAndDescendants(node: FoodNode) {
  console.log(node);

  if (confirm('Are you sure you want to delete this node and its descendants?')) {
    this.tdService.deleteNodeAndDescendants(node).subscribe(
      () => {
        const parentNode = this.findNodeById(this.dataSource.data, node.id);

          this.fetchData();

      },
      (error) => {
        console.error('Error deleting node:', error);
      }
    );
  }
}




editNode(node: FoodNode) {
  const userInput = window.prompt('Please enter new node name:', '');

  if (userInput !== null) {
    const editedNode: FoodNode = {
      name: userInput,
      parentId: node.parentId,
      id: node.id,
      level: 0
    };

    this.tdService.editNode(editedNode).subscribe(
      () => {
        // Update the node's name in the frontend
        const foundNode = this.findNodeById(this.dataSource.data, node.id);
        if (foundNode) {
          foundNode.name = userInput;
          this.dataSource.data = [...this.dataSource.data];

          this.fetchData();

        }
      },
      (error) => {
        console.error('Error editing node:', error);
      }
    );
  }
}

}

