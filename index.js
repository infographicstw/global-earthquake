d3.json("volcano.json", function(volcano) {
d3.json("quake.json", function(quake) {
d3.json("world.json", function(world) {

var projection = d3.geo.orthographic().scale(225).translate([300,300]).clipAngle(90);
var path = d3.geo.path().projection(projection);
var pathQuake = d3.geo.path().projection(projection).pointRadius(function(it) { return magmap(parseFloat(it.properties.mag)); });
var pathVolcano = d3.geo.path().projection(projection).pointRadius(function(it) { return 5; });
var countries = topojson.feature(world, world.objects.countries).features;
var color = d3.scale.category20();

var polygon = d3.select("#svg").selectAll("path").data(countries)
  .enter().append("path").attr({
    "d":path,
    "stroke":function(){return "#bbb";},
    "fill":function(d){return "#ccc";}
  }); 

d3.select("#svg").selectAll("g.volcano").data(volcano.features)
  .enter().append("g").attr("class", "volcano");

d3.select("#svg").selectAll("g.earthquake").data(quake.features)
  .enter().append("g").attr("class", "earthquake");

function magmap(it) {
  return Math.pow(3.162, it) / 100;
}
var circleEarthquake = d3.select("#svg").selectAll("g.earthquake").append("path");
var circleVolcano = d3.select("#svg").selectAll("g.volcano").append("path");
var updateVolcanoLocation = function() {
  circleVolcano.attr({
    d: pathVolcano,
    fill: "rgba(128,96,28,0.5)",
    stroke: "rgba(128,96,28,0.9)"
  });
};

var updateQuakeLocation = function() {
  circleEarthquake.attr({
    d: pathQuake,
    fill: "none",
    stroke: "#f00"
  });
};


// legend
magtick = [2,3,4,5,6,7,8];
d3.select("#svg").selectAll("circle").data(magtick).enter().append("circle").attr({
  cx: function(it,idx) { return idx * 10 + magmap(it) + 500; },
  cy: function(it,idx) { return 500; },
  r: function(it,idx) { return magmap(it); },
  fill: "none",
  stroke: "#f00"
});
d3.select("#svg").selectAll("text").data(magtick).enter().append("text").attr({
  x: function(it,idx) { return idx * 10 + magmap(it) + 500; },
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
    updateVolcanoLocation();
  }));

updateQuakeLocation();
updateVolcanoLocation();

});
});
});
