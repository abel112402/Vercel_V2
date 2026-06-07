import { useEffect, useRef, useState } from "react";
import type { Point } from "../enums/Point";
import type { TableInterface } from "../data/Table"
import { Stage, Layer, Rect, Group, Line } from 'react-konva';
import type { Stage as StageType } from 'konva/lib/Stage';
import TableItem from "./TableItem";
import { getTableConfig } from "../utils/tableConfig";
import { checkPhysicalOverlap } from "../utils/collisions";


interface TableCanvasProps {
  tables: TableInterface[];
  roomSize: Point;
  selectTable: (id: string | null) => void;
  updateTablePosition: (tableId: string, newPosition: Point) => void;
  selectedTableId: string | null;
  pendingTable: TableInterface | null;
  onPlacePendingTable: (pos: Point) => void;
  canSelect: boolean;
  canDrag: boolean;
}

const TableCanvas = ({ tables, roomSize, selectTable, updateTablePosition, selectedTableId, pendingTable, onPlacePendingTable, canSelect, canDrag } : TableCanvasProps) => {
    const stageRef = useRef<StageType>(null);
    const containerRef = useRef<HTMLDivElement>(null);      
    const [stageSize, setStageSize] = useState({ width: roomSize.x, height: roomSize.y });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setStageSize({ width, height });
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const handleStageClick = (e: any) => {
        if (e.target === e.target.getStage() && !pendingTable) {
            selectTable(null);
        }

        if (pendingTable) {
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            if (!pointerPosition) return;

            const config = getTableConfig(pendingTable.type);
            const pos = {
                x: Math.max(0, Math.min(pointerPosition.x - config.w / 2, roomSize.x - config.w)),
                y: Math.max(0, Math.min(pointerPosition.y - config.h / 2, roomSize.y - config.h))
            };

            const tempTable = { ...pendingTable, position: pos };
            let hasOverlap = false;
            for (const t of tables) {
                if (checkPhysicalOverlap(tempTable, t)) {
                    hasOverlap = true; break;
                }
            }

            if (!hasOverlap) {
                onPlacePendingTable(pos);
            } else {
                alert("Cannot place table here due to overlap!");
            }
        }
    };

    return (
        <div 
            id="table-canvas" 
            ref={containerRef} 
            style={{ width: "100%", height: "100%", borderRadius: "10px", backgroundColor: "white", position: "relative", overflow: "hidden", cursor: pendingTable ? "crosshair" : "default" }}
        >
            {pendingTable && <div style={{position: "absolute", top: 10, left: 10, zIndex: 10, background: "rgba(255,255,255,0.8)", padding: "5px"}}>Click on the room to place the table!</div>}
            
            {stageSize.width > 0 && stageSize.height > 0 && (
                <Stage width={stageSize.width} height={stageSize.height} ref={stageRef} onClick={handleStageClick}>
                    <Layer>
                        <Group draggable>
                            <Line points={[0, 0, roomSize.x, 0, roomSize.x, roomSize.y, 0, roomSize.y, 0, 0]} stroke="black" strokeWidth={3} />
                            <Rect x={0} y={0} width={roomSize.x} height={roomSize.y} fill="transparent" />
                            {tables.map(table => (
                                <TableItem 
                                    key={table.id}
                                    table={table}
                                    allTables={tables}
                                    selectTable={selectTable}
                                    updateTablePosition={updateTablePosition}
                                    roomSize={roomSize}
                                    isSelected={selectedTableId === table.id}
                                    canSelect={canSelect}
                                    canDrag={canDrag}
                                />
                            ))}
                        </Group>
                    </Layer>
                </Stage>
            )}
        </div>
    );
}

export default TableCanvas;