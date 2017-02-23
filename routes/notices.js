// requiring modules
const express = require('express'),
      Sequelize = require('sequelize');

// initiating the router - setting express as the router
const router = express.Router();

// connecting to database bulletinboard through sequelize
const sequelize = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
			dialect: 'postgres'
		});

var notice = sequelize.define('notice', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
});

// get request to render the index.pug file - to add a new notice
router.get('/', (request, response) => {
    response.render('notices/index');
});

// gets the unique id
router.get('/:id', (request, response) => {
  // method to find the full row of data from the id
  notice.findById(request.params.id).then((notice) => {
    // renders the show.pug file
    response.render('notices/show', { notice: notice });
  });
});

router.delete('/:id', (request, response) => {
  console.log(request.params.id);
  notice.destroy({
    where: {
      id: request.params.id
    }
  }).then(() => {
    response.redirect('/board');
  });
});

router.get('/:id/edit', (req, res) => {
  notice.findOne({
    where: {
      id: req.params.id
    }
  }).then((notice) => {
    res.render('notices/edit', { notice: notice });
  });
});

router.put('/:id', (request, response) => {
  console.log(request.params.id);
  console.log(request.body);
  notice.update(request.body, {
    where: {
      id: request.params.id,
    }
  }).then(() => {
    response.redirect('/notices/' + request.params.id);
  });
});

// make this file available for other files to include it as a module (export it)
module.exports = router;
