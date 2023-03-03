const {register,login,doctorLogin,doctorRegister,getAll,updateMessages,therapyNeeded,therapyProvide} = require('../controllers/userControllers');

const router = require('express').Router();


router.post('/register',register);
router.post('/login',login);
router.post('/doctorLogin',doctorLogin);
router.post('/doctorRegister',doctorRegister);
router.get('/getAll',getAll)
router.post('/therapyNeeded/:id',therapyNeeded)
router.post('/therapyProvide/:id',therapyProvide);
router.post('/updateMessages/:id',updateMessages);

module.exports = router;