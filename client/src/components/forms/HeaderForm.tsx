import { Button } from "@mui/material"
import type { FormEvent } from "react"

interface RoomSize {
    x: number
    y: number
}

interface HeaderFormProps {
    setRoomSize: (size: RoomSize) => void
    roomSize: RoomSize
}

const HeaderForm = ({ setRoomSize, roomSize }: HeaderFormProps) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        console.log("submit");
        e.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number" 
                name="roomX"
                value={roomSize.x}
                min="1"
                onChange={(e) => setRoomSize({...roomSize, x: Number(e.target.value)})}
            />
            <input
                type="number" 
                name="roomY"
                value={roomSize.y}
                min="1"
                onChange={(e) => setRoomSize({...roomSize, y: Number(e.target.value)})}
            />
            <Button color="secondary" type="submit" variant="contained">Submit</Button>
        </form>
    );
}

export default HeaderForm