'use strict';

var lineColor = {
    'code': "#6AFC2D",
    'crime': "#35BAFC",
    'world': "#FAD511",
    'pancake': "#FC1E1E",
    'russia': "#BB53FC"
}

var TableView = function(activityModel) {
    this.model = activityModel
};

_.extend(TableView.prototype, {

    draw: function() {
        _.each(this.model.getDurations(), function(value, key) {
            document.getElementById(key + "-val").innerHTML = value;
        });
    }
});

var graph = document.getElementById("graph");

var padding = 30;
var graphSize = 500;

var GraphView = function(activityModel, graphModel) {
    this.activities = activityModel;
    this.graphs = graphModel;
};

_.extend(GraphView.prototype, {

    draw: function(eventType, eventTime, eventData) {
        var self = this;

        graph.width = graphSize + padding;
        graph.height = graphSize + padding;

        var c = graph.getContext('2d')
        c.lineWidth = 2;
        c.strokeStyle = '#333';
        c.font = '10pt sans-serif';
        c.textAlign = "center";

        c.clearRect(0, 0, graph.width, graph.height);

        c.beginPath();
        c.moveTo(padding, 0);
        c.lineTo(padding, graph.height - padding);
        c.lineTo(graph.width, graph.height - padding);
        c.stroke();

        c.save();
        c.rotate(-Math.PI/2);
        c.textAlign = "center";
        c.fillText("Health from Activity", -graphSize / 2, padding - 20);
        c.restore();

        c.fillText("Time Spent on Activity", graphSize / 2, graphSize + 20);

        _.each(self.graphs.getGraphs(), function(graph, graphName) {
            if(graph) {
                self.drawLine(graphName, c);
            }
        });
    },

    drawLine: function(graphName, c) {
        var temp = this.activities.getCoordinates(graphName)
        console.log(temp)

        if(temp.length == 0) return;
        var points = _.sortBy(temp, function(point) {
            return point.x;
        });
        c.strokeStyle = lineColor[graphName];
        c.beginPath();
        var p = formatPoint(points[0])
        c.moveTo(p.x, p.y);

        _.each(points, function(point) {
            var p = formatPoint(point)
            console.log(p)
            c.lineTo(p.x, p.y);
        });
        c.stroke();

    }
});

var formatPoint = function(point) {
    return {
        x: point.x * graphSize + padding,
        y: graphSize - point.y * graphSize
    }
}
