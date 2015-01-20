'use strict';

var expect = chai.expect;
describe('First unit test', function() {

    it('Some tests', function() {
        /*
         We're using Mocha and Chai to do unit testing.

         Mocha is what sets up the tests (the "describe" and "it" portions), while
         Chai does the assertion/expectation checking.

         Links:
         Mocha: http://mochajs.org
         Chai: http://chaijs.com

         Note: This is a bunch of tests in one it; you'll probably want to separate them
         out into separate groups to make debugging easier. It's also more satisfying
         to see a bunch of unit tests pass on the results page :)
        */

        // Here is the most basic test you could think of:
        expect(1==1, '1==1').to.be.ok;

        // You can also for equality:
        expect(1, '1 should equal 1').to.equal(1);

        // JavaScript can be tricky with equality tests
        expect(1=='1', "1 should == '1'").to.be.true;

        // Make sure you understand the differences between == and ===
        expect(1==='1', "1 shouldn't === '1'").to.be.false;

        // Use eql for deep comparisons
        expect([1] == [1], "[1] == [1] should be false because they are different objects").to.be.false;

        expect([1], "[1] eqls [1] should be true").to.eql([1]);
    });

    it('Callback demo unit test', function() {
        /*
        Suppose you have a function or object that accepts a callback function,
        which should be called at some point in time (like, for example, a model
        that will notify listeners when an event occurs). Here's how you can test
        whether the callback is ever called.
         */

        // First, we'll create a function that takes a callback, which the function will
        // later call with a single argument. In tests below, we'll use models that
        // take listeners that will be later called
        var functionThatTakesCallback = function(callbackFn) {
            return function(arg) {
                callbackFn(arg);
            };
        };

        // Now we want to test if the function will ever call the callbackFn when called.
        // To do so, we'll use Sinon's spy capability (http://sinonjs.org/)
        var spyCallbackFn = sinon.spy();

        // Now we'll create the function with the callback
        var instantiatedFn = functionThatTakesCallback(spyCallbackFn);

        // This instantiated function should take a single argument and call the callbackFn with it:
        instantiatedFn("foo");

        // Now we can check that it was called:
        expect(spyCallbackFn.called, 'Callback function should be called').to.be.ok;

        // We can check the number of times called:
        expect(spyCallbackFn.callCount, 'Number of times called').to.equal(1);

        // And we can check that it got its argument correctly:
        expect(spyCallbackFn.calledWith('foo'), 'Argument verification').to.be.true;

        // Or, equivalently, get the first argument of the first call:
        expect(spyCallbackFn.args[0][0], 'Argument verification 2').to.equal('foo');

        // This should help you understand the listener testing code below
    });

    it('Listener unit test for GraphModel', function() {
        var graphModel = new GraphModel();
        var firstListener = sinon.spy();

        graphModel.addListener(firstListener);
        graphModel.graphs.push('GraphModel');
        graphModel.selectGraph("GraphModel");

        expect(firstListener.called, 'GraphModel listener should be called').to.be.ok;
        expect(firstListener.calledWith('GRAPH_SELECTED_EVENT', sinon.match.any, 'GraphModel'), 'GraphModel argument verification').to.be.true;

        var secondListener = sinon.spy();
        graphModel.addListener(secondListener);
        graphModel.selectGraph("GraphModel");
        expect(firstListener.callCount, 'GraphModel first listener should have been called twice').to.equal(2);
        expect(secondListener.called, "GraphModel second listener should have been called").to.be.ok;
    });
});

describe('Activity Management', function() {
    var activityModel = new ActivityStoreModel();
    var health = {
        happy: 1,
        energy: 2,
        stress: 3
    };
    var activity = new ActivityData('code', health, 45);
    var listener = sinon.spy();
    activityModel.addListener(listener);

    it('Add Activity', function() {

        activityModel.addActivityDataPoint(activity);
        expect(listener.calledWith('ACTIVITY_DATA_ADDED_EVENT', sinon.match.any, listener));

        expect(activityModel.getActivityDataPoints().length, 'Data should be added').to.equal(1);

    });

    it('Remove Activity', function() {

        activityModel.removeActivityDataPoint(activity);
        expect(listener.calledWith('ACTIVITY_DATA_REMOVED_EVENT', sinon.match.any, listener));
        expect(activityModel.getActivityDataPoints().length, 'Data should be added').to.equal(0);

    });


});

describe('Activity Helpers', function() {
    var activityModel = new ActivityStoreModel();
    var health = {
        happy: 1,
        energy: 2,
        stress: 3
    };
    var activity1 = new ActivityData('code', health, 45);
    var activity2 = new ActivityData('code', health, 45);
    var activity3 = new ActivityData('russia', health, 45);
    activityModel.addActivityDataPoint(activity1);
    activityModel.addActivityDataPoint(activity2);
    activityModel.addActivityDataPoint(activity3);

    it('Groups', function() {
        var groups = activityModel.getGroups();
        expect(groups['code'].length, "Number of code should be 2").to.equal(2);
    });

    it('Duractions', function() {
        var durations = activityModel.getDurations();
        expect(durations['code'], "Code should be 90").to.equal(90);
    });

    it('Coordinates', function() {
        var points = activityModel.getCoordinates('code');
        expect(points[0]["x"], "X should be 1").to.equal(1);
    });
});
