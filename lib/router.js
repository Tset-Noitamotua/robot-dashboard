FlowRouter.route('/', {
    name: 'dashboard',
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {content: "runList"});
    }
});

FlowRouter.route('/suite/:runId', {
    name: 'suite-run',
    action: function(params, queryParams) {
        console.log("Suite run:", params.runId);
        BlazeLayout.render("mainLayout", {content: "suiteLayout"});
    }
});

