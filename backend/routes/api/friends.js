const express = require('express');
const asyncHandler = require('express-async-handler');

const { Friend, User, sequelize } = require('../../db/models');

const router = express.Router();

router.get(
	'/:userId',
	asyncHandler(async (req, res) => {
		const { userId } = req.params;
		const friends = await Friend.findAll({
			where: {
				userId: Number(userId),
			},
			include: [{ model: User, as: 'friend' }],
		});
		console.log(userId);
		return res.json(friends);
	})
);

router.post(
	'/',
	asyncHandler(async (req, res) => {
		const { id, username } = req.body;
		const user = await User.findOne({
			where: {
				username,
			},
		});

		const friend = await Friend.create({
			userId: id,
			friendId: user.id,
		});

		const friends = await Friend.findAll({
			where: {
				userId: id,
			},
			include: [{ model: User, as: 'friend' }],
		});

		return res.json({
			friends,
		});
	})
);

router.delete(
	'/',
	asyncHandler(async (req, res) => {
		const { id } = req.body;
		const friend = await Friend.findByPk(id);
		await friend.destroy();
		return res.json({
			friend,
		});
	})
);

module.exports = router;
