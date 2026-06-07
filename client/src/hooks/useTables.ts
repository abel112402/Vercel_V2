import { useEffect, useState } from "react"
import type { TableInterface } from "../data/Table"

const useTables = () => {
    const [tables, setTables] = useState<TableInterface[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("table-values");
        if (saved) {
            setTables(JSON.parse(saved));
        }
    }, []);

    const saveToLocalStorage = () => {
        localStorage.setItem("table-values", JSON.stringify(tables));
        console.log("saved");
    }

    const clearTables = () => setTables([]);

    const addTables = (newTable: TableInterface) => {
        setTables(prevTables => [...prevTables, newTable])
    }

    const removeTables = (tableId: string) => {
        setTables(prevTables => prevTables.filter(table => table.id !== tableId))
    }

    const updateTable = (updatedTable: TableInterface) => {
        setTables(prevTables => prevTables.map(table => table.id === updatedTable.id ? updatedTable : table))
    }
         
    return {tables, addTables, removeTables, updateTable, selectedTableId, setSelectedTableId, saveToLocalStorage, clearTables}
}
export default useTables