import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface FoodNode {
  id: any;
  parentId: any;
  name: string;
  parent?: FoodNode;
  children?: FoodNode[];
}

@Injectable({
  providedIn: 'root'
})
export class TreedataService {



    apiUrl=('http://localhost:1337/api/food-nodes')
  constructor(private http:HttpClient) { }
  getData(){
    return this.http.get<any>('http://localhost:1337/api/food-nodes/create-food-nodes')
  }


  addNode(newNode: any): Observable<any> {
    const requestPayload = {
      data: {
        name: newNode.name,
        parent: newNode.parentId
      }
    };

    return this.http.post<any>(`${this.apiUrl}`, requestPayload);
  }


  deleteNode(nodeId: number): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${nodeId}`;

    return this.http.delete<any>(deleteUrl);
  }


  editNode(editedNode: FoodNode): Observable<any> {
    const editUrl = `${this.apiUrl}/${editedNode.id}`; // Adjust the URL here
    const requestPayload = {
      data: { // Add the 'data' property to the payload
        name: editedNode.name,
        parentId: editedNode.parentId,
        id: editedNode.id
      }
    };

    return this.http.put<any>(editUrl, requestPayload);
  }



}
