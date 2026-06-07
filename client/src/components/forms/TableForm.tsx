import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import useTableForm from "../../hooks/useTableForm";
import type { TableInterface } from "../../data/Table";

interface TableFormProps {
  onSubmit: (table: Omit<TableInterface, "id">) => void;
  submitLabel?: string;
}

const TableForm = ({ onSubmit, submitLabel = "Add Table" }: TableFormProps) => {
  const { formData, handleChange } = useTableForm({
    name: "",
    type: "snooker",
    category: "normal",
    color: "red",
    status: 5,
    position: {
      x: 0,
      y: 0,
    },
    isLocked: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      category: formData.category,
      color: formData.color,
      status: formData.status,
      position: formData.position,
      isLocked: formData.isLocked || false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ width: "100%", margin: "0 auto" }}>
        <TextField
          label="Table Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="table-type-label">Table Type</InputLabel>
          <Select
            labelId="table-type-label"
            label="Table Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value="snooker">Snooker</MenuItem>
            <MenuItem value="foosball">Foosball</MenuItem>
            <MenuItem value="air-hockey">Air Hockey</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="table-category-label">Table Category</InputLabel>
          <Select
            labelId="table-category-label"
            label="Table Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <MenuItem value="competition">Competition</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="kids">Kids</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="table-color-label">Color</InputLabel>
          <Select
            labelId="table-color-label"
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          >
            <MenuItem value="red">Red</MenuItem>
            <MenuItem value="green">Green</MenuItem>
            <MenuItem value="blue">Blue</MenuItem>
            <MenuItem value="yellow">Yellow</MenuItem>
            <MenuItem value="purple">Purple</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Status"
          name="status"
          type="number"
          value={formData.status}
          onChange={handleChange}
          slotProps={{ htmlInput: { min: 1, max: 10 } }}
          fullWidth
        />
        <TextField
          label="Position X"
          name="position.x"
          type="number"
          value={formData.position.x}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Position Y"
          name="position.y"
          type="number"
          value={formData.position.y}
          onChange={handleChange}
          fullWidth
        />
        <Button color="secondary" type="submit" variant="contained">
          {submitLabel}
        </Button>
        <FormHelperText>If you want a locked table, set it after creation using the admin controls.</FormHelperText>
      </Stack>
    </form>
  );
};

export default TableForm;