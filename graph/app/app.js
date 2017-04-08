import {
  select,
  range,
  easeLinear,
  forceSimulation,
  forceLink,
  forceCollide,
  forceManyBody,
  forceCenter,
  event,
  forceY,
  forceX,
  drag,
  json,
  scaleOrdinal,
  schemeCategory20,
  randomUniform,
  interpolate,
} from 'd3';
import _ from 'lodash';

import './style/style.less';

const width = 600,
    height = 600;

const svg = select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

const defs = svg.append("defs");
const app = document.getElementById("app");
app.style.display = "none";

const gradient1 = defs.append("linearGradient").attr("id", "gradient1");
gradient1.append("stop").attr("offset", "0%").attr("stop-color", "blue");
gradient1.append("stop").attr("offset", "100%").attr("stop-color", "green");
const color = scaleOrdinal(schemeCategory20);

var dataNodes = [];
var dataLinks = [];
var link, node, simulation;
var tickStyle = "direct";

function strokeEdge(d) {
  let source, target
  if (d.source === parseInt(d.source, 10))
    source = dataNodes[d.source];
  else
    source = d.source;
  if (d.target === parseInt(d.target, 10))
    target = dataNodes[d.target];
  else
    target = d.target;

  var id = "S" + source.id  +"T" + target.id;
  var gradient1 = defs.append("linearGradient").attr("id",  id);
  gradient1.append("stop").attr("offset", "0%").attr("stop-color", target.color);
  gradient1.append("stop").attr("offset", "100%").attr("stop-color", source.color);
  return "url(#" + id + ")";
}

function dragstarted(d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

const ticked = function() {
  if (tickStyle === "direct") {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    //node
        //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  } else {
    const animationTime = 150;
    link.transition().ease(easeLinear).duration(animationTime)
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.transition().ease(easeLinear).duration(animationTime)
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; });
  }
}

function drawInitial(){
  simulation = forceSimulation()
            //.force("link", forceLink().id(function(d) { return d.index }))
            .force("link", forceLink(dataLinks).distance(200))
            .force("collide",forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, width / 2))
            //.force("y", forceY(0))
            //.force("x", forceX(0));

  link = svg.append("g")
            .attr("class", "link")
            .selectAll("line");

   node = svg.append("g")
       .attr("class", "nodes")
       .selectAll("circle");

   simulation
       .nodes(dataNodes)
       .on("tick", ticked);

   simulation.force("link").links(dataLinks);
};

function updateGraph(){

  const transitionType = easeLinear;
  const transitionDuration = 1500;

  // Apply the general update pattern to the nodes.
  node = node.
    data(dataNodes, function(d) { return d.id;});

  // Exit any old nodes.
  node.exit()
    .transition()
    .duration(transitionDuration)
    .ease(transitionType)
    .attr("r", 0).remove();

  node = node
    .enter()
    .append("svg:g")
    .attr("class", "node")
    .call(drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended))
    .on("click", function(d) {
        console.log("d", d);
    })

  const nodeEnter = node
    .append("circle")
    //.attr("fill", function(d) { return color(d.id); })
    .call(function(node) {
        node.transition()
        .duration(transitionDuration)
        .ease(transitionType)
        .attr("r", 10); })

  const images = node.append("svg:image")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50);

  images.on( 'click', function (d) {
          console.log("d", d);
           })
          .on( 'mouseenter', function() {
            // select element in current context
            select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);
          })
          // set back
          .on( 'mouseleave', function() {
            select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 50)
              .attr("width", 50);
          });

  node.append("text")
      .attr("class", "nodetext")
      .attr("x", 20)
      .attr("y", 25+15)
      .attr("fill", "black")
      .text(function(d) { return d.label; });

  node = node.merge(node);

  node.transition()
    .duration(800)
    .delay(function(d, i) { return i * 5; })
    .attrTween("radius", function(d) {
      var i = interpolate(0, d.r);
      return function(t) { return d.radius = i(t); };
    });

  // Apply the general update pattern to the links.
  link = link.data(dataLinks, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit()
    .transition()
    .duration(transitionDuration)
    .ease(transitionType)
    .attr("stroke-opacity", 0)
    .attrTween("x1", function(d) { return function() {
      debugger;
        return d.source.x;
      };
    })
    .attrTween("x2", function(d) { return function() { return d.target.x; }; })
    .attrTween("y1", function(d) { return function() { return d.source.y; }; })
    .attrTween("y2", function(d) { return function() { return d.target.y; }; })
    .remove();

  link = link
    .enter()
    .append("line")
    .attr("stroke-width",function(d){
      return 10;
    })
    .attr("stroke", strokeEdge)
    .call(function(link) { link
        .transition()
        .duration(transitionDuration)
        .ease(transitionType)
        .attr("stroke-opacity", 1); })
    .merge(link);

  // Update and restart the simulation.
  simulation.nodes(dataNodes);
  simulation.force("link").links(dataLinks);
  simulation.alpha(1).restart();
}

function nodesMap(e, i) {
  i = i || dataNodes.length;
  return {
    id: i, r: e.r || 10,
    label: e.name,
    color: color(i),
    img: "https://dl.dropboxusercontent.com/u/19954023/marvel_force_chart_img/top_spiderman.png",
  };
}

json('https://leap.hackback.tech/api/graph', (error, data) => {
  if (error) throw error;

  drawInitial();

  data.nodes.push({name: "foo"});
  dataNodes = data.nodes.map(nodesMap);
  data.links = [
    { source: 1, target: 0},
    { source: 0, target: 2},
    { source: 1, target: 2},
  ];
  dataLinks = data.links;

  //setTimeout(function() {
    //tickStyle = "animation";
    //dataNodes.push(nodesMap({label: "bar", color: "green", r: 10}));
    //dataLinks.push({source: 0, target: 3});
    //updateGraph();
  //}, 1000);
  updateGraph();
});
