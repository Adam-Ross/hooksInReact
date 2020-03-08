import React, { useContext, Fragment } from "react";
import ContactContext from "../../context/contact/contactContext";
import ContactItem from "../contacts/ContactItem";

const Contacts = () => {
  const contactContext = useContext(ContactContext);
  const { contacts, filtered } = contactContext;

  if (contacts.length === 0) {
    return <h4>Please enter a contact.</h4>;
  }

  // if (filtered !== null) {
  //   return (
  //     <Fragment>
  //       {filtered.map(contact => (
  //         <ContactItem key={contact.id} contact={contact} />
  //       ))}
  //     </Fragment>
  //   );
  // }

  return (
    <Fragment>
      {filtered !== null
        ? filtered.map(contact => (
            <ContactItem key={contact.id} contact={contact} />
          ))
        : contacts.map(contact => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
    </Fragment>
  );
};

export default Contacts;
