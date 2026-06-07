import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTableMutation } from "../state/tableApiSlice";
import {
  Container,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";

const AddTablePage = () => {
  const navigate = useNavigate();
  const [createTable, { isLoading, error }] = useCreateTableMutation();
  const [name, setName] = useState("");
  const [type, setType] = useState("snooker");
  const [category, setCategory] = useState("normal");
  const [color, setColor] = useState("red");
  const [status, setStatus] = useState(5);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTable({
        name: name || undefined,
        type: type as any,
        category: category as any,
        color,
        status,
        position: { x, y },
        isLocked,
      }).unwrap();
      navigate("/tables");
    } catch (err) {
      console.error("Failed to create table", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Add Table</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Table Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="table-type-label">Table Type</InputLabel>
            <Select labelId="table-type-label" label="Table Type" value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="snooker">Snooker</MenuItem>
              <MenuItem value="foosball">Foosball</MenuItem>
              <MenuItem value="air-hockey">Air Hockey</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="table-category-label">Category</InputLabel>
            <Select labelId="table-category-label" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="competition">Competition</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="kids">Kids</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="table-color-label">Color</InputLabel>
            <Select labelId="table-color-label" label="Color" value={color} onChange={(e) => setColor(e.target.value)}>
              <MenuItem value="red">Red</MenuItem>
              <MenuItem value="green">Green</MenuItem>
              <MenuItem value="blue">Blue</MenuItem>
              <MenuItem value="yellow">Yellow</MenuItem>
              <MenuItem value="purple">Purple</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Status" type="number" slotProps={{ htmlInput: { min: 1, max: 10 } }} value={status} onChange={(e) => setStatus(Number(e.target.value))} fullWidth />
          <TextField label="Position X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} fullWidth />
          <TextField label="Position Y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} fullWidth />
          <FormControlLabel control={<Checkbox checked={isLocked} onChange={(e) => setIsLocked(e.target.checked)} />} label="Locked" />
          <Button type="submit" variant="contained" disabled={isLoading}>Create Table</Button>
          {error && <Typography color="error">Unable to create table. Please check input and try again.</Typography>}
        </Stack>
      </form>
    </Container>
  );
};

export default AddTablePage;
