const router = require('express').Router();

const { getAllThoughts, getThoughtById, addThought, addReaction, removeReaction, removeThought, updateThought } = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts).post(addThought);
router.route('/:id').get(getThoughtById).put(updateThought).delete(removeThought);
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/:reactionId').delete(removeReaction);


module.exports = router;