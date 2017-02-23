

const Sequelize = require('sequelize'),
			express = require('express'),
			pug = require('pug'),
			morgan = require('morgan'),
			bodyParser = require('body-parser'),
			methodOverride = require('method-override');


var app = express(),
		sequelize = new Sequelize('bulletinboard', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
		dialect: 'postgres'
		});



var noticesRouter = require('./routes/notices');


var notice = sequelize.define('notice', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT
});


app.use(morgan('dev'));


app.use(bodyParser.urlencoded({extended:false}));


app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {

    var method = req.body._method
    delete req.body._method
    return method
		}})
	);


app.set('view engine', 'pug');



app.get('/', (request, response) => {
	response.redirect('/notices');
});


app.get('/board', (request, response) => {


  notice.findAll().then((notices) => {

    response.render('notices/board', { notices: notices });
  });
});


app.post('/notices', (request, response) => {



	notice.create(request.body).then(() => {

		response.redirect('/board');
	});
});



app.use('/notices', noticesRouter);


sequelize.sync().then(() => {
  console.log('Connected to database');

  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
