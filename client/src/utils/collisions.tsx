import type { Point } from "../enums/Point";
import type { TableInterface } from "../data/Table";
import { getTableConfig } from "./tableConfig";

export const checkPhysicalOverlap = (t1: TableInterface, t2: TableInterface) => {
    const c1 = getTableConfig(t1.type);
    const c2 = getTableConfig(t2.type);
    return !(
        t1.position.x + c1.w <= t2.position.x || t1.position.x >= t2.position.x + c2.w ||
        t1.position.y + c1.h <= t2.position.y || t1.position.y >= t2.position.y + c2.h
    );
};

export const checkSpaceViolation = (table: TableInterface, allTables: TableInterface[], roomSize: Point) => {
    const c = getTableConfig(table.type);

    if (
        table.position.x - c.pad < 0 ||
        table.position.y - c.pad < 0 ||
        table.position.x + c.w + c.pad > roomSize.x ||
        table.position.y + c.h + c.pad > roomSize.y
    ) {
        return true;
    }

    for (const other of allTables) {
        if (other.id === table.id) continue;
        const oc = getTableConfig(other.type);
        const padOverlap = !(
            table.position.x - c.pad >= other.position.x + oc.w ||
            table.position.x + c.w + c.pad <= other.position.x ||
            table.position.y - c.pad >= other.position.y + oc.h ||
            table.position.y + c.h + c.pad <= other.position.y
        );
        
        if (padOverlap) return true;
    }
    return false;
};