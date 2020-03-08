const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
router.get("/", auth, async (req, res) => {
  // Find the contacts by the user.id from the request body...
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error..." });
  }
});

// Create a new contact for signed in user
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ msg: "Erros coming from here." });
    }

    const { name, email, phone, type } = req.body;
    try {
      const contact = new Contact({
        name,
        email,
        type,
        phone,
        user: req.user.id
      });

      await contact.save();
      res.json(contact);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error..." });
    }
  }
);

router.put("/:id", auth, async (req, res) => {
  // Pull out fields from res.body
  const { phone, email, name, type } = req.body;

  // Create contact field object
  const contactFields = {};

  // Create object with fields from req.body
  if (phone) contactFields.phone = phone;
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (type) contactFields.type = type;

  try {
    // Get the specific contact
    let contact = await Contact.findById(req.params.id);

    // If there isn't a contact, return 404
    if (!contact) return res.status(404).json({ msg: "Contact not found..." });

    // Make sure the user owns the contact.
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "They match..." });
    }

    // Actually update the contact.
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields
      },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ msg: "server error..." });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    // Get the specific contact - remember asynce, cause that just cost me about an hour and a half...
    let contact = await Contact.findById(req.params.id);

    // If there isn't a contact, return 404
    if (!contact) return res.status(404).json({ msg: "Contact not found..." });

    // Make sure the user owns the contact.
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized..." });
    }

    // Actually delete the contact.
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact deleted..." });
  } catch (error) {
    res.status(500).json({ msg: "server err..." });
  }
});

module.exports = router;
