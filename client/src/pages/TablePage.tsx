import { useState } from 'react';
import '../App.css';
import HeaderForm from '../components/forms/HeaderForm';
import { Button, Grid, Stack, Typography, Paper, Container, CircularProgress } from '@mui/material';
import TableCanvas from '../components/TableCanvas';
import DetailsForm from '../components/forms/DetailsForm';
import type { TableInterface } from '../data/Table';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUserRole } from '../state/authSlice';
import {
  useGetAllQuery,
  useUpdateTableMutation,
  useUpdateTablePositionMutation,
  useDeleteTableMutation,
} from '../state/tableApiSlice';
import { useNavigate } from 'react-router-dom';

export interface Point {
  x: number;
  y: number;
}

const currentRoomSize: Point = { x: 800, y: 600 };

function TablePage() {
  const [roomSize, setRoomSize] = useState(currentRoomSize);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(selectUserRole);
  const isAdmin = role === 'admin';
  const canSelect = isLoggedIn;
  const canDrag = isAdmin;
  const navigate = useNavigate();

  const { data: tables = [], isLoading, error } = useGetAllQuery();
  const [updateTablePosition] = useUpdateTablePositionMutation();
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const handleRoomSizeChange = (newSize: Point) => {
    setRoomSize(newSize);
  };

  const handleSelectTable = (id: string | null) => {
    if (!canSelect) return;
    setSelectedTableId(id);
  };

  const handleUpdateTable = async (table: TableInterface) => {
    if (!isAdmin) return;
    try {
      await updateTable({
        id: Number(table.id),
        body: {
          name: table.name,
          type: table.type,
          category: table.category,
          color: table.color,
          status: table.status,
          isLocked: table.isLocked,
        },
      }).unwrap();
    } catch (err) {
      console.error('Update table failed', err);
    }
  };

  const handleUpdateTablePosition = async (tableId: string, newPosition: Point) => {
    if (!isAdmin) return;
    try {
      await updateTablePosition({ id: Number(tableId), position: newPosition }).unwrap();
    } catch (err) {
      console.error('Update table position failed', err);
    }
  };

  const handleRemoveTable = async (tableId: string) => {
    if (!isAdmin) return;
    try {
      await deleteTable(Number(tableId)).unwrap();
      if (selectedTableId === tableId) {
        setSelectedTableId(null);
      }
    } catch (err) {
      console.error('Remove table failed', err);
    }
  };

  const getStats = (type: string) => {
    const filtered = tables.filter((t) => t.type === type);
    const avg = filtered.length > 0 ? (filtered.reduce((sum, t) => sum + t.status, 0) / filtered.length).toFixed(1) : '0';
    return { count: filtered.length, avg };
  };

  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ padding: 2 }}>
        <Typography color="error">Unable to load room tables.</Typography>
      </Container>
    );
  }

  return (
    <>
      <header
        style={{
          padding: '10px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HeaderForm setRoomSize={handleRoomSizeChange} roomSize={roomSize} />
        {isAdmin && (
          <Button variant="contained" color="success" onClick={() => navigate('/admin/add-table')}>
            Add New Table
          </Button>
        )}
      </header>

      <Paper
        elevation={3}
        sx={{
          m: 2,
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: 'wrap',
          gap: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h6">Statistics:</Typography>
        <Typography>Table Number: {tables.length}</Typography>
        <Typography>Snooker: {getStats('snooker').count} (Avg status: {getStats('snooker').avg})</Typography>
        <Typography>Foosball: {getStats('foosball').count} (Avg status: {getStats('foosball').avg})</Typography>
        <Typography>Air Hockey: {getStats('air-hockey').count} (Avg status: {getStats('air-hockey').avg})</Typography>
      </Paper>

      <div
        id="app-main-div"
        className="App"
        style={{
          width: '100%',
          minHeight: '80vh',
          height: 'auto',
          borderRadius: '10px',
          backgroundColor: 'lightgray',
          padding: '10px',
          boxSizing: 'border-box',
        }}
      >
        <Grid container spacing={2} sx={{ width: '100%', height: '100%', justifyContent: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }} sx={{ minHeight: '50vh' }}>
            <TableCanvas
              tables={tables}
              roomSize={roomSize}
              selectTable={handleSelectTable}
              updateTablePosition={handleUpdateTablePosition}
              selectedTableId={selectedTableId}
              pendingTable={null}
              onPlacePendingTable={() => {}}
              canSelect={canSelect}
              canDrag={canDrag}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div id="table-form-div" style={{ width: '100%', padding: '20px', borderRadius: '10px', backgroundColor: 'white' }}>
              <Stack spacing={2}>
                {!selectedTable && (
                  <Typography>
                    {isLoggedIn ? 'Select a table to see details and actions.' : 'Visitor mode: log in to reserve or manage tables.'}
                  </Typography>
                )}
                {selectedTable && (
                  <DetailsForm
                    table={selectedTable}
                    removeTable={handleRemoveTable}
                    setSelectedTableId={setSelectedTableId}
                    updateTable={handleUpdateTable}
                  />
                )}
              </Stack>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default TablePage;