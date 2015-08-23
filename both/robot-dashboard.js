
Suites = new Mongo.Collection("suites");

this.eventType = function(data){
    map = {
        's': 'suite',
        't': 'test',
        'k': 'keyword'
    };
    id = data.attributes.id;
    return map[id.charAt(id.lastIndexOf('-')+1)];
}

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        runs: function () {
            return Suites.find({'top': true});
        }
    });

    Template.suite.helpers({
        children: function() {
            id = '^' + this.attributes.id + '-[stk]{1}\\d*$';
            return Suites.find({
              'run': this.run,
              'attributes.id': {'$regex': id}
            });
        },
        type: function(){
            return eventType(this);
        },
        typeIs: function(type){
            return eventType(this) === type;
        },
        statusClass: function(){
            if (this.attributes.status){
                return this.attributes.status.toLowerCase();
            }
            return;
        }
    });

    Template.test.helpers({
        statusClass: function(){
            if (this.attributes.status){
                return this.attributes.status.toLowerCase();
            }
            return;
        }
    });
}

Meteor.methods({
    startRun: function(data) {
        var stripeCustomersCreateSync = Meteor.wrapAsync(
            Suites.rawCollection().findAndModify,
            Suites.rawCollection()
        );

        var doc = stripeCustomersCreateSync({
            _id: 'counter'
        }, {}, {
            '$inc': {'runs': 1}
        }, {
            'upsert': true,
            'new': true
        });
        return { run: doc.runs };
    },
    startSuite: function (data) {
        // the first will be the tree root
        if (data.attributes.id.indexOf('-') == -1){
            data['top'] = true;
        }
        Suites.insert(data);
    },
    endSuite: function (data) {
        // the first will be the tree root
        if (data.attributes.id.indexOf('-') == -1){
            data['top'] = true;
        }

        Suites.rawCollection().findAndModify({
            run: data.run,
            'attributes.id': data.attributes.id
        }, {}, data, { 'upsert': true }, function(err, doc){
            if (err) throw err;
        });
    },
    startTest: function (data) {
        Suites.insert(data);
    },
    endTest: function (data) {
        Suites.rawCollection().findAndModify({
            run: data.run,
            'attributes.id': data.attributes.id
        }, {}, data, { 'upsert': true }, function(err, doc){
            if (err) throw err;
        });
    }
});
