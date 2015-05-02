d3.json("quake.json", function(quake) {
d3.json("world.json", function(world) {

var projection = d3.geo.orthographic().scale(225).translate([400,300]).clipAngle(90);
var path = d3.geo.path().projection(projection);
var pathQuake = d3.geo.path().projection(projection).pointRadius(function(it) { return magmap(parseFloat(it.properties.mag)); });
var countries = topojson.feature(world, world.objects.countries).features;
var color = d3.scale.category20();

var polygon = d3.select("#svg").selectAll("path").data(countries)
  .enter().append("path").attr({
    "d":path,
    "stroke":function(){return "#bbb";},
    "fill":function(d){return "#ccc";}
  }); 

d3.select("#svg").selectAll("g").data(quake.features)
  .enter().append("g");

function magmap(it) {
  return Math.pow(10, it/2) / 100;
}
var circles = d3.select("#svg").selectAll("g").append("path")
var updateQuakeLocation = function() {
  circles.attr({
    d: pathQuake,
    fill: "none",
    stroke: "#f00"
  });
};


// legend
magtick = [2,3,4,5,6,7,8];
d3.select("#svg").selectAll("circle").data(magtick).enter().append("circle").attr({
  cx: function(it,idx) { return idx * 10 + magmap(it) + 600; },
  cy: function(it,idx) { return 500; },
  r: function(it,idx) { return magmap(it); },
  fill: "none",
  stroke: "#f00"
});
d3.select("#svg").selectAll("text").data(magtick).enter().append("text").attr({
  x: function(it,idx) { return idx * 10 + magmap(it) + 600; },
  y: function(it,idx) { return 530; }
}).style({
  "text-anchor": "middle"
}).text(function(it) { return it});

d3.select("#svg").call(d3.behavior.drag()
    .origin(function() {
      r = projection.rotate();
      return {x: r[0], y: -r[1]};
    })
    .on("drag", function() {
    rotate = projection.rotate();
    projection.rotate([d3.event.x, -d3.event.y, rotate[2]]);
    d3.select("#svg").selectAll("path").attr("d", path);
    updateQuakeLocation();
  }));

updateQuakeLocation();

});
});
