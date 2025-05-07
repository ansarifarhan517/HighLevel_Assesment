const express = require('express');
const router = express.Router();
const userController = require('../controllers/user'); // this is an object with function references
const authenticate = require('../middleware/auth'); // if using auth

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/contacts', authenticate, userController.createContact);
router.get('/contacts', authenticate, userController.getContact);
router.put('/contacts/:id', authenticate, userController.updateContact);
router.delete('/contacts/:id', authenticate, userController.deleteContact);

module.exports = router;
