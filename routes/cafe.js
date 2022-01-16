var express = require('express');
var router = express.Router();

// Требующиеся модули контроллеров.
var table_controller = require('../controllers/tableController');


router.get('/home', table_controller.cafe_description);
router.get('/menu', table_controller.cafe_menu);
router.get('/reservation/day', table_controller.reserv_day_select_get);
router.post('/reservation/day', table_controller.reserv_day_select_post);
router.get('/reservation/join/:day/:time1/:time2', table_controller.reserv_date_join_get);
router.get('/reservation/:time1/:time2/form', table_controller.reserv_get);

router.get('/reservation/wrong/:time1/:time2', table_controller.invalid_client_number_get);
router.post('/reservation/wrong/:time1/:time2', table_controller.invalid_client_number_post);

router.post('/reservation/:time1/:time2/form', table_controller.reserv_post);
router.post('/reservation/:day:time1:time2/form', table_controller.reserv_post);

router.get('/reservation/success', table_controller.success_get);
router.post('/reservation/success', table_controller.success_post);




module.exports = router;