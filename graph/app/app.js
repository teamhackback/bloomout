import * as d3 from 'd3';
import _ from 'lodash';

import './style/style.less';

const width = 600,
    height = 600;

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

const defs = svg.append("defs");
var chartLayer = svg.append("g").classed("chartLayer", true)

const app = document.getElementById("app");
app.style.display = "none";

//const gradient1 = defs.append("linearGradient").attr("id", "gradient1");
//gradient1.append("stop").attr("offset", "0%").attr("stop-color", "blue");
//gradient1.append("stop").attr("offset", "100%").attr("stop-color", "green");
//const color = d3.scaleOrdinal(d3.schemeCategory20);

d3.json('https://leap.hackback.tech/api/graph', (error, data) => {
  if (error) throw error;
  console.log(data);

  var dataNodes = [
      { r: 10, label: 'bar'},
      { r:10, label: 'foo'},
      { r:10, label: 'ee'}
  ];

  var dataLinks = [
    { source: 1, target: 0},
    { source: 1, target: 2},
    { source: 2, target: 0}
  ];

  //var force = d3.force()
      //.charge(-400)
      //.linkDistance(height/2)
      //.size([width, height])
      //.linkStrength(1.3)
      //.friction(0.8)
      //.gravity(0.9);
 var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.index }))
            .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, width / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))

  //var link = svg.selectAll(".link")
        //.data(dataLinks)
      //.enter().append("line")
        //.attr("class", "link")
        //.style("stroke",function(d){
            //var id = "S"+d.source.index +"T" + d.target.index;
            //var gradient1 = defs.append("linearGradient").attr("id",  id);
            //gradient1.append("stop").attr("offset", "0%").attr("stop-color", d.target.color);
            //gradient1.append("stop").attr("offset", "100%").attr("stop-color", d.source.color);
            //return "url(#" + id + ")";
        //});

  //var node = svg.selectAll(".node")
      //.data(dataNodes)
    //.enter().append("circle")
      //.attr("class", function(d){ return "node " + d.color})
      //.attr("r", width/20)
      //.call(simulation.drag);

  var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(dataLinks)
            .enter()
            .append("line")
            .attr("stroke", "black")

   var node = svg.append("g")
       .attr("class", "nodes")
       .selectAll("circle")
       .data(dataNodes)
       .enter().append("circle")
       .attr("r", function(d){  return d.r })
       .call(d3.drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));


   var ticked = function() {
       link
           .attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

       node
           .attr("cx", function(d) { return d.x; })
           .attr("cy", function(d) { return d.y; });
   }

   simulation
       .nodes(dataNodes)
       .on("tick", ticked);

   simulation.force("link")
       .links(dataLinks);

   function dragstarted(d) {
       if (!d3.event.active) simulation.alphaTarget(0.3).restart();
       d.fx = d.x;
       d.fy = d.y;
   }

   function dragged(d) {
       d.fx = d3.event.x;
       d.fy = d3.event.y;
   }

   function dragended(d) {
       if (!d3.event.active) simulation.alphaTarget(0);
       d.fx = null;
       d.fy = null;
   }
});
