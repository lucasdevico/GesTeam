var mongoose = require('mongoose');

var contadorSchema = mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	sequence_value: {
		type: Number,
		required: true
	}
});

contadorSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

mongoose.model('Contador', contadorSchema);