import type { TableType } from "../enums/TableType";

export const getTableConfig = (type: TableType) => {
  switch (type) {
    case "snooker":
      return { w: 190, h: 100, pad: 50 };
    case "air-hockey":
      return { w: 140, h: 70, pad: 40 };
    case "foosball":
      return { w: 120, h: 60, pad: 30 };
    default:
      return { w: 100, h: 100, pad: 20 };
  }
};