
Suites = new Mongo.Collection("suites");
Messages = new Mongo.Collection("messages");


this.eventType = function(data){
    map = {
        's': 'suite',
        't': 'test',
        'k': 'keyword'
    };
    id = data.attributes.id;
    return map[id.charAt(id.lastIndexOf('-')+1)];
}

this.elapsedTimeFormated = function (elem) {
    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }
    var time = elem.attributes.elapsedtime
    var milliseconds = time % 1000;
    var seconds = Math.floor((time / 1000) % 60);
    var minutes = Math.floor((time / (60 * 1000)) % 60);
    var hours = Math.floor((time / (60 * 60 * 1000)) % 60);
    return pad(hours, 2) + ":" + pad(minutes, 2) + ":" +
           pad(seconds, 2) + "." + pad(milliseconds, 3);
}

this.helpers = {
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
    },
    status: function(){
        if (this.attributes.status){
            return this.attributes.status;
        }
        return 'RUNNING';
    },
    elapsedTimeFormated: function() {
        return elapsedTimeFormated(this);
    },
    timingDetails: function() {
        var details = this.attributes.starttime;
        if (this.attributes.endtime){
            details = details + ' / ' + this.attributes.endtime;
        }
        if (this.attributes.elapsedtime){
            details = details + ' / ' + elapsedTimeFormated(this);
        }
        return details;
    }
}

if (Meteor.isClient) {
    // This code only runs on the client

    // Run list
    Template.runList.onCreated(function() {
        var self = this;
        self.autorun(function() {
            self.subscribe('runs');
        });
    });
    Template.run.helpers(helpers);
    Template.runList.helpers({
        runs: function () {
            return Suites.find({'attributes.id':'s1'}, {sort: {'run': -1}});
        }
    });

    // Suite page
    Template.suiteLayout.onCreated(function() {
        var self = this;
        self.autorun(function() {
            var runId = FlowRouter.getParam('runId');
            self.subscribe('suite', runId);
            self.subscribe('messages', runId);
        });
    });
    Template.suiteLayout.helpers({
        runs: function () {
            return Suites.find({'attributes.id':'s1'});
        }
    });

    Template.statistics.helpers({
        stats: function() {
            if (!this.attributes.statistics)
                return null
            var stat = this.attributes.statistics.match(/[0-9]+/g)
            return {
                critical: {
                    test:   stat[0],
                    passed: stat[1],
                    failed: stat[2],
                },
                criticalClass: (stat[2] == 0) ? 'pass' : 'fail',
                total: {
                    test:   stat[3],
                    passed: stat[4],
                    failed: stat[5],
                },
                totalClass: (stat[5] == 0) ? 'pass' : 'fail',
            };
        }
    });

    Template.suite.helpers(helpers);
    Template.test.helpers(helpers);
    Template.test.helpers({
        criticalText: function() {
            if (this.attributes.critical == 'yes')
                return '(critical)';
        }
    })
    Template.keyword.helpers(helpers);
    Template.keyword.helpers({
        messages: function(){
            return Messages.find({run: this.run, id: this.attributes.id})
        }
    });

    Template.message.helpers({
        levelClass: function(){
            if (this.message.level){
                return this.message.level.toLowerCase();
            }
            return;
        },
        timestamp: function(){
            return this.message.timestamp.split(' ')[1];
        }
    });

} else {
    Meteor.publish("runs", function () {
        return Suites.find({'top': true}, {sort: {'run': -1}});
    });
    Meteor.publish("suite", function (run) {
        return Suites.find({'run': parseInt(run)});
    });
    Meteor.publish("messages", function (run) {
        return Messages.find({'run': parseInt(run)});
    });

    Suites._ensureIndex({"run" : 1, "attributes.id" : 1});
    Messages._ensureIndex({"run" : 1, "id" : 1});
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
    },
    startKeyword: function (data) {
        Suites.insert(data);
    },
    endKeyword: function (data) {
        Suites.rawCollection().findAndModify({
            run: data.run,
            'attributes.id': data.attributes.id
        }, {}, data, { 'upsert': true }, function(err, doc){
            if (err) throw err;
        });
    },

    logMessage: function (data){
        Messages.insert(data);
    }
});
