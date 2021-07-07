const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ParpreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    auteur: {
        type: String
    },
    date_de_creation: {
        type: String,
    },
    Arret: {
        type: Array
    },
    Relance: {
        type: Array
    },
    POS: {
        type: Array
    },
    variables: {
        type: Object
    }

}, { timestamps: true })

const Parpre = mongoose.model('Parpre',ParpreSchema)

module.exports = Parpre