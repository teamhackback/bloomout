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

const width = 800,
    height = 800;

const svg = select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

const defs = svg.append("defs");
const app = document.getElementById("app");
app.style.display = "none";

const color = scaleOrdinal(schemeCategory20);

var dataNodes = [];
var dataNodesById = {};
var dataLinks = [];
var link, node, simulation;
var tickStyle = "direct";

const emotionColors = {
  "anger": "red",
  "disgust": "blue",
  "fear": "orange",
  "joy": "pink",
  "sadness": "green"
}

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
  var gradient1 = defs.append("linearGradient").attr("id",  id)
  gradient1.append("stop").attr("offset", "0%").attr("stop-color", d.sourceColor);
   //.attr("offset", "0%")
   //.attr("offset", "100%")
   //.attr("x1", "0%")
   //.attr("x2", "100%")
   //.attr("y1", "0%")
   //.attr("y2", "100%");
  gradient1.append("stop").attr("offset", "100%").attr("stop-color", d.targetColor);
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
            .force("link", forceLink().id(function(d) { return d.index }).distance(350))
            //.force("link", forceLink(dataLinks).distance(200))
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

function getColorByEmotion(obj) {
  if (typeof obj === "undefined") {
    return "black";
  } else {
    console.log(_.maxBy(Object.keys(obj.emotion), (k) => obj.emotion[k]));
    return emotionColors[_.maxBy(Object.keys(obj.emotion), (k) => obj.emotion[k])];
  }
}

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
    .attr("fill", function(d) { return color(d.id); })
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
  e.internal_id = e.id;
  e.id = i;
  e.r = e.r || 10;
  e.label = e.name;
  e.color = color(e.id);
  e.img = "https://leap.hackback.tech/api/images/" + e.internal_id;
  return e;
}

json('https://leap.hackback.tech/api/graph', (error, data) => {
  if (error) throw error;

  drawInitial();

  dataNodes = data.nodes.map(nodesMap);
  _.each(dataNodes, (e) => {
    //dataNodesById[e.id] = e;
    dataNodesById[e.internal_id] = e;
  })
  console.log(data.nodes);
  console.log(dataNodesById);
  data.links = []
  _.each(data.graph, (connections, personId)  => {
    _.each(connections, (connection, connectionId) => {
      const sourceColor = getColorByEmotion(connection);
      const targetColor = getColorByEmotion((data.graph[connectionId] || {} )[personId]);
      data.links.push({
        source: dataNodesById[personId].id,
        target: dataNodesById[connectionId].id,
        sourceColor: sourceColor,
        targetColor: sourceColor,
      });
    });
  });
  dataLinks = data.links;
  console.log(data.links);

  var removedNode, removedLinks = [];
  //setTimeout(function() {
    ////tickStyle = "animation";
    //removedNode = dataNodes.pop();
    //dataLinks = _.remove(dataLinks, (link)  => {
      //if (link.source.id === removedNode.id || link.target.id === removedNode.id) {
          //console.log(link);
          //return false;
      //} else {
          //return true;
      //}
    //});
    //updateGraph();
  //}, 100);
  updateGraph();
});
