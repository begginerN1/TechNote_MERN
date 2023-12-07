const router = require('express').Router();
const {deleteUser, getAllUsers, createNewUser, updateUser} = require('../controllers/usersControllers');

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = router;