import { FC, useEffect, useState } from "react";
import LeftIc from "../assets/left.svg";
import RightIc from "../assets/right.svg";
import Modal from "./Modal"; // Import the modal

const Calendar: FC = () => {
  const [weekDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dates, setDates] = useState<(null | number)[]>([]);
  const [events, setEvents] = useState<Map<number, { name: string; title: string }>>(new Map()); // Store events
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [eventToEdit, setEventToEdit] = useState<{ name: string; title: string; date: number } | null>(null); // New state for event editing

  const today = new Date();

  useEffect(() => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 6) % 7;
    let daysArray: (null | number)[] = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setDates(daysArray);
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const openModal = (date: number) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
 const editEvent = (date: number, eventName: string, eventTitle: string) => {
    setEvents(new Map(events.set(date, { name: eventName, title: eventTitle })));
  };
  const saveEvent = (date: number, eventName: string, eventTitle: string) => {
    setEvents(new Map(events.set(date, { name: eventName, title: eventTitle })));
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="border rounded-lg p-12 shadow-lg w-full max-w-7xl">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-bold">
            {currentMonth.toLocaleString("en-US", { month: "long" })} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-6">
            <span onClick={handlePrevMonth} className="w-16 h-16 p-4 flex items-center justify-center cursor-pointer">
              <img src={LeftIc} alt="Previous" />
            </span>
            <span onClick={handleNextMonth} className="w-16 h-16 p-4 flex items-center justify-center cursor-pointer">
              <img src={RightIc} alt="Next" />
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-7 gap-6">
          {weekDays.map((weekDay, index) => (
            <div key={index} className="font-semibold text-2xl text-center border p-4 bg-gray-200 rounded-lg">
              {weekDay}
            </div>
          ))}

          {dates.map((date, index) => {
            const isToday = date && currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth() && date === today.getDate();
            const event = date ? events.get(date) : undefined;
            return (
              <div
                key={index}
                className={`text-2xl text-center h-16 flex items-center f justify-center p-4 rounded-lg ${date ? "border" : ""} ${isToday ? "bg-blue-600 text-white font-bold" : ""}`}
                onClick={() => date && openModal(date)}
              >
                {date}
                {event && (
                  <div className="mt-2 text-sm text-blue-600">{event.name}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => openModal(today.getDate())} className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Add Event
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        saveEvent={saveEvent}
        currentDate={selectedDate}
        editEvent={editEvent}
      />
    </div>
  );
};

export default Calendar;
