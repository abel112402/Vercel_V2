import { useState } from "react"
import type { TableCategory } from "../enums/TableCategory"
import type { TableType } from "../enums/TableType"
import type { SelectChangeEvent } from "@mui/material"

interface TableFormValues {
  name: string;
  status: number;
  type: TableType;
  category: TableCategory;
  color: string;
  position: {
    x: number;
    y: number;
  };
  isLocked?: boolean;
}

const useTableForm = (initialValues: TableFormValues) => {
    const [formData, setFormData] = useState<TableFormValues>(initialValues);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent) => {
        const { name, value } = e.target;
        console.log(`feild changed: ${name}, new: ${value}`);
        if (name === "position.x") {
            setFormData(prevData => ({
                ...prevData,
                position: {
                    ...prevData.position,
                    x: Number(value)
                }
            }));
        } else if (name === "position.y") {
            setFormData(prevData => ({
                ...prevData,
                position: {
                    ...prevData.position,
                    y: Number(value)
                }
            }));
        } else if (name === "isLocked") {
            setFormData(prevData => ({
                ...prevData,
                isLocked: value === "true"
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: name === "status" ? Number(value) : value
            }));
        }
    }
    return { formData, handleChange };
}

export default useTableForm
