const User = require('../model/Users.model');

// Login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = user.generateToken();
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Register controller
const register = async (req, res) => {
    try {
        const { username, password, organizationName } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, password, organizationName });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add a contact to logged-in user
const createContact = async (req, res) => {
    try {
        const { name, email, phone, note, lastContactedOn, meansOfContact } = req.body;
        const user = await User.findById(req.user.id);

        user.contacts.push({ name, email, phone, note, lastContactedOn, meansOfContact });
        await user.save();

        res.status(201).json(user.contacts[user.contacts.length - 1]); // return the newly added contact
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all contacts for logged-in user
const getContact = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.contacts);
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a specific contact
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, note, lastContactedOn, meansOfContact } = req.body;

        const user = await User.findById(req.user.id);
        const contact = user.contacts.id(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.set({ name, email, phone, note, lastContactedOn, meansOfContact });
        await user.save();

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a specific contact
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);

        const contact = user.contacts.id(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.remove();
        await user.save();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login, register, createContact, getContact, updateContact, deleteContact };
