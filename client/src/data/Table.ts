import type { TableCategory } from "../enums/TableCategory";
import type { TableType } from "../enums/TableType";

export interface TableInterface {
  id: string;
  name: string;
  type: TableType;
  category: TableCategory;
  color: string;
  status: number;
  position: {
    x: number;
    y: number;
  };
  isLocked: boolean;
}