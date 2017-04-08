var width = 600,
    height = 600;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

      var defs = svg.append("defs");
      var gradient1 = defs.append("linearGradient").attr("id", "gradient1");
      gradient1.append("stop").attr("offset", "0%").attr("stop-color", "blue");
      gradient1.append("stop").attr("offset", "100%").attr("stop-color", "green");

var color = d3.scale.category20();

fetch('https://leap.hackback.tech/api/graph')
.then(function(response) {
  console.log(response);
})

function draw()
{

  var dataNodes = [
      { x:   width/3, y:   height/3 , group: 0, color: 'blue'},
      { x: 2*width/3, y:   height/3, group: 1, color: 'red' },
      { x:   width/2, y: 2*height/3, group: 2, color: 'green'}
  ];

  var dataLinks = [
    { source: 1, target: 0},
    { source: 1, target: 2},
    { source: 2, target: 0}
  ];

  var force = d3.layout.force()
      .charge(-400)
      .linkDistance(height/2)
      .size([width, height])
      .linkStrength(1.3)
      .friction(0.8)
      .gravity(0.9);

  force
      .nodes(dataNodes)
      .links(dataLinks)
      .start();

  var link = svg.selectAll(".link")
        .data(dataLinks)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke",function(d){
            var id = "S"+d.source.index +"T" + d.target.index;
            var gradient1 = defs.append("linearGradient").attr("id",  id);
            gradient1.append("stop").attr("offset", "0%").attr("stop-color", d.target.color);
            gradient1.append("stop").attr("offset", "100%").attr("stop-color", d.source.color);
            return "url(#" + id + ")";
        });

  var node = svg.selectAll(".node")
      .data(dataNodes)
    .enter().append("circle")
      .attr("class", function(d){ return "node " + d.color})
      .attr("r", width/20)
      .call(force.drag);

  node.append("title")
        .text(function(d) { return d.color; });


  force.on('tick', function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
  });
}
