'use strict';

var ACTIVITIES = new ActivityStoreModel();
var GRAPHS = new GraphModel();
var GRAPHVIEW = new GraphView(ACTIVITIES, GRAPHS);
var TABLEVIEW = new TableView(ACTIVITIES);
var DATEVIEW = new DateView(ACTIVITIES);


window.addEventListener('load', function() {

    GRAPHS.addListener(_.bind(GRAPHVIEW.draw, GRAPHVIEW));
    ACTIVITIES.addListener(DATEVIEW.draw);


    var submit = document.getElementById('addData');
    submit.addEventListener('click', function() {
        var form = document.forms["activityForm"];
        var levels = {
            happy: parseInt(form.happy.value),
            energy: parseInt(form.energy.value),
            stress: parseInt(form.stress.value)
        };

        var reg = new RegExp(/^\d+$/g);
        if(!reg.test(form.time.value)) {
            alert("Please enter a valid number of minutes");
        } else {
            var data = new ActivityData(form.activity.value, levels, parseInt(form.time.value));
            ACTIVITIES.addActivityDataPoint(data);
        }

    });

    var form = document.getElementById('input');
    form.addEventListener('keypress', function(e){
        if(e && e.keyCode == 13) {
          submit.click();
        }
    });

    var toAnalysis = document.getElementById('toAnalysis');
    toAnalysis.addEventListener('click', function() {
        TABLEVIEW.draw();
        GRAPHVIEW.draw();
        document.getElementById('dataContainer').classList.add("hidden");
        document.getElementById('graphContainer').classList.remove("hidden");
    });

    var toData = document.getElementById('toData');
    toData.addEventListener('click', function() {
        document.getElementById('dataContainer').classList.remove("hidden");
        document.getElementById('graphContainer').classList.add("hidden");

    });

    _.each(document.querySelectorAll("tbody tr"), function(el) {
        el.addEventListener('click', function() {
            GRAPHS.selectGraph(el.id);
            el.classList.toggle("active");
        });
    });

});
