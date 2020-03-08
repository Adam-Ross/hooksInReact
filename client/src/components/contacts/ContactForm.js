import React, { useState, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";
const ContactForm = () => {
  const contactContext = useContext(ContactContext);

  const { current, clearFilter } = contactContext;

  useEffect(() => {
    if (current !== null) {
      setContact(current);
    } else {
      setContact({
        name: "",
        email: "",
        phone: "",
        type: "professional"
      });
    }
  }, [contactContext, current]);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    type: "professional"
  });

  const { name, email, phone, type } = contact;

  // When the clear button is clicked
  const clearAll = () => {
    contactContext.clearCurrent();
    clearFilter();
  };

  // On change is basically going to set the component state of what is entered.
  const onChange = e =>
    setContact({ ...contact, [e.target.name]: e.target.value });
  // On submit, we're going to change the contact state in contactState.js with our component level state
  // Run add contact
  // Change local form back to blank
  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      contactContext.addContact(contact);
    } else {
      contactContext.updateContact(contact);
    }
    clearAll();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{current ? "Edit Contact" : "Add Contact"}</h1>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Phone Number"
        name="phone"
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input
        type="radio"
        name="type"
        value="personal"
        checked={type === "personal"}
        onChange={onChange}
      />{" "}
      Personal{" "}
      <input
        type="radio"
        name="type"
        value="professional"
        checked={type === "professional"}
        onChange={onChange}
      />{" "}
      Professional{" "}
      <div>
        <input
          type="submit"
          className="btn btn-primary btn-block"
          value={current ? "Update Contact" : "Add Contact"}
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
