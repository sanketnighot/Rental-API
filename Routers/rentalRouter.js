const router = require('express').Router();
const { updateRewards, updateMerkleRoot, getMerkleProof, claimRewards, getRewards, getTotalRewards, updateMainRewards } = require('../Controller/rentalController');

router.route('/updateRewards').post(updateRewards);
router.route('/updateMainRewards').post(updateMainRewards);
router.route('/updateMerkleRoot').get(updateMerkleRoot);
router.route('/getMerkleProof').post(getMerkleProof);
router.route('/claimRewards').post(claimRewards);
router.route('/getTotalRewards').get(getTotalRewards);
router.route('/getRewards').get(getRewards);

module.exports = router;