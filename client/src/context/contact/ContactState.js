import React, { useReducer } from "react";
import uuid from "uuid";
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER
} from "../types";

const ContactState = props => {
  // Create initial state
  const initialState = {
    // Just hard coding in contact for right now, ultimatly, this will be an empty array that gets filled with contacts
    contacts: [
      {
        id: 1,
        name: "Adam Ross",
        email: "adam@gmail.com",
        phone: "123-456-7890",
        type: "professional"
      },
      {
        id: 2,
        name: "Jake Ross",
        email: "jake@gmail.com",
        phone: "123-456-7890",
        type: "personal"
      },
      {
        id: 3,
        name: "john Ross",
        email: "john@gmail.com",
        phone: "123-456-7890",
        type: "personal"
      }
    ],
    current: null,
    filtered: null
  };

  // Pull out state and dispatch to reducer with useReducer hook
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // All of our actions go right here...

  // Add contact
  const addContact = contact => {
    // Make a unique ID for now, cause mongo does it, but we're just hard coding it.

    contact.id = uuid.v4();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };
  // Delete Contact

  const deleteContact = id => {
    dispatch({ type: DELETE_CONTACT, payload: id });
  };
  // Set current contact
  const setCurrent = contact => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // Clear current contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };
  // Update contact
  const updateContact = contact => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };
  // filter contacts
  const filterContacts = text => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };
  // clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };
  // return provider
  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        filterContacts,
        clearFilter,
        setCurrent,
        updateContact,
        clearCurrent,
        addContact,
        deleteContact
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
