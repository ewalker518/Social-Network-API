const router = require('express').Router();

const { getAllThoughts, addThought, addReaction, removeReaction, removeThought } = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts).post(addThought);
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/:reactionId').delete(removeReaction);
router.route('/:id').delete(removeThought);

module.exports = router;