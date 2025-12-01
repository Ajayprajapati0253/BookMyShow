import { useEffect, useState } from "react";
import BsContext from "./BsContext";

const BsState = (props) => {
    const [errorPopup,setErrorPopup] = useState(false);
    const [errorMessage,setErrorMessage] = useState('')
    const [movie,changeMovie] = useState('');
    const [time,changeTime] = useState('');
    const [noOfSeat,changeNoOfSeats] = useState({
        A1:"",
        A2:"",
        A:"",
        A4:"",
        D1:"",
        D2:"",
    })

    const [lastBookingDetails,setLastBookingDetails] = useState(null);

   const handlePostBooking = async () => {
        // validate before sending
        if (!movie || !time) {
            setErrorPopup(true);
            setErrorMessage("Please select a movie and time slot!");
            return;
        }
         // ensure seat numbers are numbers
        const sanitizedSeats = {};
        Object.keys(noOfSeat).forEach(key => {
            sanitizedSeats[key] = Number(noOfSeat[key]) || 0;
        });

        try {
            const response = await fetch(`http://localhost:8080/api/booking`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movie, slot: time, seats: sanitizedSeats })
            });

            const data = await response.json();
            setErrorPopup(true);
            setErrorMessage(data.message);

            if (response.status === 200) {
                // update last booking immediately
                setLastBookingDetails(data.data);

                // reset inputs
                changeMovie("");
                changeTime("");
                changeNoOfSeats({
                    A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0
                });

                window.localStorage.clear();
            }
        }catch (error) {
            setErrorPopup(true);
            setErrorMessage("Something went wrong. Please try again.");
            console.error(error);
        }
    };


    const handleGetBooking = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/booking`);
            const data = await response.json();
            setLastBookingDetails(data.data);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const storedMovie = window.localStorage.getItem("movie");
        const storedSlot = window.localStorage.getItem("slot");
        const storedSeats = window.localStorage.getItem("seats");

        if (storedMovie) changeMovie(storedMovie);
        if (storedSlot) changeTime(storedSlot);
        if (storedSeats) changeNoOfSeats(JSON.parse(storedSeats));
    }, []);



    return (
        <BsContext.Provider 
            value={{
                movie,
                changeMovie,
                time,
                changeTime,
                noOfSeat,
                changeNoOfSeats,
                lastBookingDetails,
                setLastBookingDetails,
                handleGetBooking,
                handlePostBooking,
                errorMessage,errorPopup,
                setErrorMessage,
                setErrorPopup
            }}
        >
            {props.children}
        </BsContext.Provider>
    )
}

export default BsState;