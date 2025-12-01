import React, { useContext } from 'react'
import { seats } from '../data'
import SeatInputs from './SeatInputs'
import '../Css/SelectSeats.css'
import BsContext from '../Context/BsContext'

const SelectSeats = () => {

  const context = useContext(BsContext);
  const {noOfSeat,changeNoOfSeats} = context;

  return (
    <div className='SS_wrapper'>
      <h1 className='SS_heading'>Select Seats : </h1>
      <div className='SS_main_container'>
        {
          seats.map((el,index)=>{
            return (
              <SeatInputs 
                text={el} 
                key={index} 
                noOfSeat={noOfSeat} 
                changeNoOfSeats={changeNoOfSeats} 
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default SelectSeats;