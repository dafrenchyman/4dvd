/**
 * Created by dafre on 7/9/2017.
 */

export class Dataset {
  public Name: string;
  public FullName: string;
  public Dataset_ID: number;
  public DatabaseStore: string;
  public OriginalLocation: string;
  public StartDate: string;
  public EndDate: string;
  public Units: string;
  public DefaultLevel: string;

  constructor(input: {
    Name: string;
    FullName: string;
    Dataset_ID: number;
    DatabaseStore: string;
    OriginalLocation: string;
    StartDate: string;
    EndDate: string;
    Units: string;
    DefaultLevel: string;
  }) {
    this.Name = input.Name;
    this.FullName = input.FullName;
    this.Dataset_ID = input.Dataset_ID;
    this.DatabaseStore = input.DatabaseStore;
    this.OriginalLocation = input.OriginalLocation;
    this.StartDate = input.StartDate;
    this.EndDate = input.EndDate;
    this.Units = input.Units;
    this.DefaultLevel = input.DefaultLevel;
  }
}
