import { FC, useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  saveEvent: (date: number, eventName: string, eventTitle: string) => void;
  currentDate: number | null;
  eventToEdit?: { name: string; title: string; date: number } | null; // Optional eventToEdit
  editEvent?: (date: number, eventName: string, eventTitle: string) => void; // Optional editEvent function
}

const Modal: FC<ModalProps> = ({ isOpen, closeModal, saveEvent, currentDate, eventToEdit, editEvent }) => {
  const [eventName, setEventName] = useState<string>(eventToEdit ? eventToEdit.name : "");
  const [eventTitle, setEventTitle] = useState<string>(eventToEdit ? eventToEdit.title : "");

  const today = new Date();
  const defaultDate = currentDate || today.getDate();

  const [eventDate, setEventDate] = useState<string>(new Date(today.getFullYear(), today.getMonth(), defaultDate).toISOString().split("T")[0]);

  useEffect(() => {
    if (eventToEdit) {
      setEventName(eventToEdit.name);
      setEventTitle(eventToEdit.title);
      setEventDate(new Date(today.getFullYear(), today.getMonth(), eventToEdit.date).toISOString().split("T")[0]);
    } else {
      const newDate = new Date(today.getFullYear(), today.getMonth(), currentDate || today.getDate());
      setEventDate(newDate.toISOString().split("T")[0]);
    }
  }, [eventToEdit, currentDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (eventDate && eventTitle && eventName) {
      if (eventToEdit && editEvent) {
        // Editing an existing event
        editEvent(Number(eventDate.split("-")[2]), eventName, eventTitle); // Edit the event
      } else {
        // Adding a new event
        saveEvent(Number(eventDate.split("-")[2]), eventName, eventTitle); // Save new event
      }
      closeModal();
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4">{eventToEdit ? "Edit Event" : "Add Event"}</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Event name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Event Title</label>
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Event title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md ml-2"
          >
            {eventToEdit ? "Save Changes" : "Save Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
