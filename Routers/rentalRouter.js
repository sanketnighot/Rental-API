const router = require('express').Router();
const { updateRewards, updateMerkleRoot, getMerkleProof, claimRewards, getRewards, getTotalRewards, updateMainRewards } = require('../Controller/rentalController');
const { addTile, getMap, getTile, updateTile, addTransfer, addAllTiles, getTileById, addIPFS, rename, getStatus, setStatus, getMapMerkleProof} = require('../Controller/mapController');

// Rental API
router.route('/updateRewards').post(updateRewards);
router.route('/updateMainRewards').post(updateMainRewards);
router.route('/updateMerkleRoot').get(updateMerkleRoot);
router.route('/getMerkleProof').post(getMerkleProof);
router.route('/claimRewards').post(claimRewards);
router.route('/getTotalRewards').get(getTotalRewards);
router.route('/getRewards').get(getRewards);

// Map API
router.route('/addTile').post(addTile);
router.route('/getMap').get(getMap);
router.route('/getTile').get(getTile);
router.route('/updateTile').post(updateTile);
router.route('/addTransfer').post(addTransfer);
router.route('/addAllTiles').post(addAllTiles);
router.route('/getTileById').get(getTileById);
router.route('/addIPFS').post(addIPFS);
router.route('/rename').post(rename);
router.route('/getStatus').get(getStatus);
router.route('/setStatus').post(setStatus);
router.route('/getMapMerkleProof').post(getMapMerkleProof);

module.exports = router;