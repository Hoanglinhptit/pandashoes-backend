
const { Schema, model } = require('mongoose')
const User = new Schema({
    firstName: {
        type: String,
        required: [true]
    },
    lastName: {
        type: String,
        required: [true]
    },
    email: {
        type: String,
        required: [true],
        index: { unique: true }
    },
    phone: {
        type: String,
        required: true
    },
    passWord: {
        type: String,
        required: [true]
    },
    address: {
        type: String,
        required: [true]
    },
    initSecret: {
        type: String,
        required: [true]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    historyShopping: [
        {
            type: Schema.Types.ObjectId,
            ref: "Bill"
        }
    ],
    favourite: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    // time: {
    //     type: String,
    //     default: moment(new Date()).format('DD/MM/YYYY'),
    //     es_indexed: true
    // }


}, {
    timestamps: true,
})
User.index({ "$**": 'text' })
module.exports = model('User', User)
//User.plugin(mongoosastic)
// User.createMapping({
//     "settings": {
//         "analysis": {
//             "analyzer": {
//                 "my_analyzer": {
//                     "type": "custom",
//                     "tokenizer": "",
//                     "char_filter": ["my_pattern"],
//                     "filter": ["lowercase"]
//                 }
//             },
//             "char_filter": {
//                 "my_pattern": {
//                     "type": "pattern_replace",
//                     "pattern": "\\.",
//                     "replacement": " "
//                 }
//             }
//         }
//     },
//     "mappings": {
//         "User": {
//             "dynamic_templates": [{
//                 "strings": {
//                     "match_mapping_type": "string",
//                     "mapping": {
//                         "type": "text",
//                         "fields": {
//                             "keyword": {
//                                 "type": "keyword"
//                             }
//                         }
//                     }
//                 }
//             }],

//         }
//     }
// }, (err, mapping) => {
//     if (err) {
//         console.log('error creating mapping (you can safely ignore this)');
//         console.log(err);
//     } else {
//         console.log('mapping created!');
//         console.log(mapping);
//     }
//}
//);