import React, { Component } from 'react';
import {
  select,
  easeLinear,
  forceSimulation,
  forceLink,
  forceCollide,
  forceManyBody,
  forceCenter,
  event,
  drag,
  json,
  scaleOrdinal,
  scaleLinear,
  schemeCategory20,
  interpolate,
} from 'd3';
import _ from 'lodash';
import {SERVER_API_URL} from '../config';
import {withRouter} from 'react-router-dom';
import Measure from 'react-measure'

const d3tip = require("d3-tip");

import network from '../assets/css/network.css';

const emotionColors = {
  "anger": "red",
  "disgust": "red",
  "fear": "red",
  "joy": "green",
  "sadness": "red",
  "no_emotion": "grey"
};

class NetworkView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataNodes: [],
      dataLinks: [],
      tickStyle: "animated",
      dimensions: {
        width: 0,
        height: 0
      },
      transitionDuration: 100,
      avatarSize: 100,
      avatarSizeHover: 140,
      strikeSize: 7,
      strikeSizeHover: 10,
    };
    this.d3 = {
      link: null,
      node: null,
      simulation: null,
      gradiants: null,
      defs: null,
      svg: null,
      tip: null
    };
    this.internal = {
      dataNodesById: {},
      root: null,
      tickCounter: 0,
      color: scaleOrdinal(schemeCategory20),
      timer: null,
      init: false
    }
  }

  componentDidMount() {
  }

  _init() {
    if (this.internal.init)
      return;
    this.internal.init = true;

    this.d3.svg = select(this.internal.root);

    this.d3.defs = this.d3.svg.append("defs");
    this.d3.gradiants = this.d3.defs.append("g").attr("id", "gradiant_group");

    const filter = this.d3.defs.append("filter")
      .attr("id", "solid")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", 1);
    filter.append("feFlood").attr("flood-color", "yellow")
    filter
      .append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("operator", "xor")

    this.d3.tip = d3tip()
      .attr('class', network['d3-tip'])
      .offset([-9, -5])
      .html(function(d) {
        return `<span class="${network.nodetext}">${d.label}<span>`;
      })
    this.d3.svg.call(this.d3.tip);
    this.drawInitial();
    this.loadData();
    this.internal.timer = setInterval(this.loadData, 500);
  }

  componentWillUnmount = () => {
    clearInterval(this.internal.timer);
  };

  strokeEdge = (d) => {
    let source, target
    if (d.source === parseInt(d.source, 10))
      source = this.state.dataNodes[d.source];
    else
      source = d.source;
    if (d.target === parseInt(d.target, 10))
      target = this.state.dataNodes[d.target];
    else
      target = d.target;

    var gradient1 = this.d3.gradiants.append("linearGradient").attr("id",  d.id)
    let x2 = target.x - source.x;
    let y2 = target.y - source.y;
    let maxD = Math.max(Math.abs(x2), Math.abs(y2));
    let x1 = 0;
    let y1 = 0;
    x2 = (Math.round(x2 * 100 / maxD) || 0);
    y2 = (Math.round(y2 * 100 / maxD) || 0);
    if (x2 < 0) {
      x1 = -x2;
      x2 = 0;
    }
    if (y2 < 0) {
      y1 = -y2;
      y2 = 0;
    }
    gradient1
     .attr("x1", x1 + "%")
     .attr("y1",  y1 + "%")
     .attr("x2", x2 + "%")
     .attr("y2", y2 + "%");
    gradient1.append("stop").attr("offset", "20%").attr("stop-color", d.sourceColor);
    gradient1.append("stop").attr("offset", "80%").attr("stop-color", d.targetColor);
    return "url(#" + d.id + ")";
  };

  dragstarted = (d) => {
    if (!event.active) this.d3.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  dragged = (d) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  dragended = (d) => {
    if (!event.active) this.d3.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  ticked = () => {
    if (this.state.tickStyle === "direct") {
      this.d3.link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      this.d3.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    } else {
      const animationTime = 150;
      this.d3.link.transition().ease(easeLinear).duration(animationTime)
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      if (this.internal.tickCounter % 20 === 0 || this.internal.tickCounter < 2) {
        this.d3.gradiants.html("");
        this.d3.link.attr('stroke', this.strokeEdge);
        //this.d3.link.style("stroke-width", (d) => d.width);
      }
      this.internal.tickCounter++;

      this.d3.node.transition().ease(easeLinear).duration(animationTime)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
  };

  drawInitial = () => {
    this.d3.simulation = forceSimulation()
      .force("link", forceLink().id(function(d) { return d.id }).distance((d) => d.distance).iterations(16))
              //.force("collide",forceCollide( function(d){return d.r + 8 }).iterations(16) )
              .force("collide",forceCollide( function(d){return d.r + 60 }).iterations(16) )
              .force("charge", forceManyBody())
              .force("charge", () => -5000)
              .force("charge", forceManyBody().strength(3))
              .velocityDecay(0.5)
              .force("center", forceCenter(this.state.dimensions.width / 2, this.state.dimensions.height / 2))
              .on("tick", this.ticked);

    this.d3.link = this.d3.svg.append("g")
              .attr("class", "link")
              .selectAll("line");

    this.d3.node = this.d3.svg.append("g")
         .attr("class", network.nodes)
         .selectAll("circle");

    this.d3.simulation
         .nodes(this.state.dataNodes)
  };

  getColorByEmotion = (obj) => {
    if (typeof obj === "undefined") {
      return emotionColors["no_emotion"];
    } else {
      return emotionColors[_.maxBy(Object.keys(obj.emotion), (k) => obj.emotion[k])];
    }
  };

  updateGraph = () => {
    if (this.state.dataNodes.length === 0)
      return;
    const transitionType = easeLinear;

    // Apply the general update pattern to the nodes.
    this.d3.node = this.d3.node
      .data(this.state.dataNodes, function(d) { return d.id;});

    // Exit any old nodes.
    this.d3.node.exit()
      .transition()
      .duration(200)
      .ease(transitionType)
      .attr("r", 0).remove();

    const cl = this;
    this.d3.node = this.d3.node
      .enter()
      .append("svg:g")
      .attr("class", network.node)
      .call(drag()
             .on("start", this.dragstarted)
             .on("drag", this.dragged)
             .on("end", this.dragended))
      .on("click", (d) => {
          console.log("d", d);
          cl.props.history.push(`/left/profile/${d.id}/basic/right/network`);
      })
      .on( 'mouseenter', function(d) {
        const self = this;
        const rCircle = cl.state.avatarSizeHover / 2 + cl.state.strikeSizeHover;
        select( this.childNodes[0] )
          .transition()
          .attr("r", function(d) { return rCircle;})

           select( this.childNodes[1] )
            .transition()
          .attr("x", function(d) { return -cl.state.avatarSizeHover / 2;})
          .attr("y", function(d) { return -cl.state.avatarSizeHover / 2;})
           .attr("height", cl.state.avatarSizeHover)
           .attr("width", cl.state.avatarSizeHover)
          .on("end", function(){
            cl.d3.tip.show.call(self, d, self)
          });
      })
      .on( 'mouseleave', function (d) {
        select( this.childNodes[0] )
          .transition()
          .attr("r", function(d) { return cl.state.avatarSize / 2 + cl.state.strikeSize;})
            .attr("cx", function(d) { return 0;})
            .attr("cy", function(d) { return 0;})
           select( this.childNodes[1] )
             .transition()
             .attr("x", function(d) { return -cl.state.avatarSize / 2;})
             .attr("y", function(d) { return -cl.state.avatarSize / 2;})
           .attr("height", cl.state.avatarSize)
           .attr("width", cl.state.avatarSize)
            .on("end", function(){cl.d3.tip.hide(d)});
      })
      .merge(this.d3.node);

    this.d3.node
    .each(function(d) {
      const sel = select(this);
        if(this.childNodes.length === 0)
        {
          sel
          .append("circle")
          .attr("fill", "white")
          .call((node) => {
              node.transition()
              .duration(cl.state.transitionDuration)
              .ease(transitionType)
              .attr("r", function(d) { return cl.state.avatarSize / 2 + cl.state.strikeSize;});
          })
          sel.append("svg:image")
          .attr("xlink:href",  function(d) { return d.img;})
          .attr("x", function(d) { return -cl.state.avatarSize / 2;})
          .attr("y", function(d) { return -cl.state.avatarSize / 2;})
          .attr("height", 100)
          //.attr("clip-path", "url(#avatar_clip)")
          .attr("height", cl.state.avatarSize)
          .attr("width", cl.state.avatarSize)
          .attr("stroke-width", 2)
          .attr("stroke", "white")
        }
    });


    // images
    this.d3.node.transition()
      .duration(800)
      .delay(function(d, i) { return i * 5; })
      .attrTween("radius", function(d) {
        var i = interpolate(0, cl.state.avatarSize / 2 + 5);
        return function(t) { return d.radius = i(t); };
      });

    // Apply the general update pattern to the links.
    this.d3.link = this.d3.link.data(this.state.dataLinks, function(d) { return d.id; });
    this.d3.link.exit()
      .transition()
      .duration(200)
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

    this.d3.link = this.d3.link
      .enter()
      .append("line")
      .attr("stroke", this.strokeEdge)
      .merge(this.d3.link);
    this.d3.link
      .call((link) => {
        link
          .transition()
          .duration(20)
          .ease(transitionType)
          .attr("stroke-opacity", 1)
          .attr("stroke-width",(d) => {
            return d.width;
          });
      });

    // Update and restart the simulation.
    this.d3.simulation.nodes(this.state.dataNodes);
    this.d3.simulation.force("link").links(this.state.dataLinks);
    this.d3.simulation.alpha(1.2).restart();
  };

  _nodesMap = (e, i) => {
    e.r = e.r || 10;
    e.label = e.name;
    e.color = this.internal.color(e.id);
    e.img = SERVER_API_URL + "/avatar/" + e.id;
    return e;
  };

  loadData= () => {
    //json('./temp.json', (error, data) => {
    json(SERVER_API_URL + '/graph', (error, data) => {
      if (error) throw error;

      const dataNodes = data.nodes.map(this._nodesMap);
      _.each(dataNodes, (e) => {
        this.internal.dataNodesById[e.internal_id] = e;
      })
      const maxMsgs = _.reduce(_.values(data.graph), (acc, e) => {
        const f = _.reduce(_.values(e), (acc, e) => {
          return Math.max(e.nr_msgs, acc);
        }, 0);
        return Math.max(acc, f);
      }, 0);
      const scaleMsgs = scaleLinear().domain([1, maxMsgs + 1]).range([3, 20]);
      const dataLinks = []
      _.each(data.graph, (connections, personId)  => {
        _.each(connections, (connection, connectionId) => {
          //if (connection.nr_msgs < 2)
            //return;
          const sourceColor = this.getColorByEmotion(connection);
          const targetColor = this.getColorByEmotion((data.graph[connectionId] || {} )[personId]);
          const scaledWidth = scaleMsgs(connection.nr_msgs);
          const sourceId = personId;
          const targetId = connectionId;
          dataLinks.push({
            id: "S" + sourceId  +"T" + targetId,
            source: sourceId,
            target: targetId,
            sourceColor: sourceColor,
            targetColor: targetColor,
            width: scaledWidth,
            //distance: randomUniform(400, 550)()
            distance: 500
          });
        });
      });

      this.setState((state) => {
        const nodeEqual = state.dataNodes.length === dataNodes.length && _.isEqualWith(dataNodes, state.dataNodes, (a, b) => a.id === b.id);
        const linkEqual = state.dataNodes.length === dataNodes.length && _.differenceWith(state.dataLinks, dataLinks, (a, b) => {
          return a.id === b.id && a.width === b.width && a.targetColor === b.targetColor
        }).length === 0;
        const res = {};
        if (!nodeEqual) {
          res.dataNodes = dataNodes;
        }
        if (!linkEqual) {
          res.dataLinks = dataLinks;
        }
        return res;
      });
    });
  };

  componentDidUpdate() {
    this.updateGraph();
  }

  onMeasure= (dimensions) => {
    this.setState({dimensions}, () => {
      if (this.state.dimensions.width > 0)
        this._init();
    });
  };

  render() {
    return (
      <Measure onMeasure={this.onMeasure}>
        <svg
          ref={node => this.internal.root = node}
          width="100%"
          height="90%"
        />
    </Measure>
    )
  }
}
export default withRouter(NetworkView)
