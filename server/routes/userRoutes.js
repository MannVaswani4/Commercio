const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    refreshAccessToken,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', registerUser);
router.post('/auth', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);

router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin Routes
router.route('/').get(protect, admin, getUsers);
router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
