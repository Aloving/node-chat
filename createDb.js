var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({
 name: 'Zildjian' 
});

kitty.save()
	.then(res => console.log(res))
	.catch(err => console.log(err));