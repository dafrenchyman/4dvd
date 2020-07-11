import { FlatTreeControl, NestedTreeControl } from "@angular/cdk/tree";
import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from "@angular/material/dialog";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNestedDataSource
} from "@angular/material/tree";

// The Json Object passed from View Component consist of title,FullName and children
<<<<<<< HEAD
interface IDataNode {
  title: string;
  FullName: string;
  children?: IDataNode[];
}

interface IExampleDataNode {
=======
interface DataNode {
  title: string;
  FullName: string;
  children?: DataNode[];
}
interface ExampleDataNode {
>>>>>>> SI: Data Tree functionality is implemented.  New component DataTreeComponent was added Data-tree-component which has the mat-tree functionality.
  expandable: boolean;
  title: string;
  FullName: string;
  level: number;
}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: "app-dataset-tree",
  templateUrl: "./dataset-tree.component.html",
  styleUrls: ["./dataset-tree.component.css"]
})
export class DatasetTreeComponent implements OnInit, AfterViewInit {
<<<<<<< HEAD
  treeControl = new FlatTreeControl<IExampleDataNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    (node: IDataNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        title: node.title,
        level,
        FullName: node.FullName
      };
    },
=======
  treeControl = new FlatTreeControl<ExampleDataNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
>>>>>>> SI: Data Tree functionality is implemented.  New component DataTreeComponent was added Data-tree-component which has the mat-tree functionality.
    node => node.level,
    node => node.expandable,
    node => node.children
  );
<<<<<<< HEAD

  public dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );
=======
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private _transformer = (node: DataNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      level,
      FullName: node.FullName
    };
  };
>>>>>>> SI: Data Tree functionality is implemented.  New component DataTreeComponent was added Data-tree-component which has the mat-tree functionality.

  // retrieve Data passed by View Component which is a json object
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DatasetTreeComponent>
  ) {
    this.dataSource.data = data;
    this.dialogRef = dialogRef;
  }

<<<<<<< HEAD
  ngOnInit(): void {}

=======
  hasChild = (_: number, node: ExampleDataNode) => node.expandable;

  SelectDataset(dataset) {
    // return the select Dataset name to View Component
    this.dialogRef.close(dataset);
  }

  ngOnInit(): void {}
>>>>>>> SI: Data Tree functionality is implemented.  New component DataTreeComponent was added Data-tree-component which has the mat-tree functionality.
  ngAfterViewInit() {
    this.treeControl.dataNodes[0].title = "Choose a Dataset";
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }
<<<<<<< HEAD

  hasChild = (_: number, node: IExampleDataNode) => node.expandable;

  private SelectDataset(dataset) {
    // return the select Dataset name to View Component
    this.dialogRef.close(dataset);
  }
=======
>>>>>>> SI: Data Tree functionality is implemented.  New component DataTreeComponent was added Data-tree-component which has the mat-tree functionality.
}
