import type { Point } from "../enums/Point";
import type { TableInterface } from "../data/Table";
import { Group, Rect, Text } from "react-konva";
import { getTableConfig } from "../utils/tableConfig";
import { checkPhysicalOverlap, checkSpaceViolation } from "../utils/collisions";

interface TableItemProps {
  table: TableInterface;
  allTables: TableInterface[];
  selectTable: (id: string | null) => void;
  updateTablePosition: (id: string, pos: Point) => void;
  roomSize: Point;
  isSelected: boolean;
  canSelect: boolean;
  canDrag: boolean;
}

const TableItem = ({ table, allTables, selectTable, updateTablePosition, roomSize, isSelected, canSelect, canDrag }: TableItemProps) => {
    const config = getTableConfig(table.type);
    const isViolating = checkSpaceViolation(table, allTables, roomSize);
    const opacity = 0.3 + (table.status / 10) * 0.7;

    const handleDragMove = (e: any) => {
        e.target.x(Math.max(0, Math.min(e.target.x(), roomSize.x - config.w)));
        e.target.y(Math.max(0, Math.min(e.target.y(), roomSize.y - config.h)));
    };

    const handleDragEnd = (e: any) => {
        const newPos = { x: e.target.x(), y: e.target.y() };
        const tempTable = { ...table, position: newPos };

        let hasOverlap = false;
        for (const other of allTables) {
            if (other.id !== table.id && checkPhysicalOverlap(tempTable, other)) {
                hasOverlap = true; break;
            }
        }

        if (hasOverlap) {
            e.target.x(table.position.x);
            e.target.y(table.position.y);
        } else {
            updateTablePosition(table.id, newPos);
        }
    };

    return (
        <Group
            x={table.position.x}
            y={table.position.y}
            draggable={canDrag && !table.isLocked}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onClick={() => {
              if (canSelect) selectTable(table.id);
            }}
        >
            <Rect
                width={config.w}
                height={config.h}
                fill={table.color}
                opacity={opacity}
                stroke={isViolating ? "red" : (isSelected ? "yellow" : "black")}
                strokeWidth={isSelected ? 4 : (table.category === "competition" ? 5 : 1)}
                dash={table.category === "kids" ? [10, 5] : []}
            />
            <Text
                x={5}
                y={5}
                text={`${table.type}\nStatus: ${table.status}`}
                fill="white"
                fontSize={12}
                shadowColor="black"
                shadowBlur={2}
            />
        </Group>
    );
}

export default TableItem;