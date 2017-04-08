import * as d3 from 'd3';
import _ from 'lodash';

import './style/style.less';

const svg = d3.select('#app').append('svg')
            .attr('width', 960)
            .attr('height', 800);

const margin = { top: 80, right: 80, bottom: 80, left: 80 };
const centerMargin = 100;

const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

const gLeft = g.append('g');
const gRight = g.append('g');

const x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

const yDate = d3.scaleBand()
    .rangeRound([0, height])
    .paddingInner(0.05);

const protDose = d3.scaleLinear()
    .range(['#d6e879', '#008000']);

const radDose = d3.scaleLinear()
    .range(['#ffff00', '#ff0000']);

const stack = d3.stack();
const timeFormatStr = '%d/%m/%Y';
const parseDate = d3.timeParse(timeFormatStr);
const formatDate = d3.timeFormat(timeFormatStr);

function type(d, i, columns) {
  let max = 0;
  for (let j = 2; j < columns.length; ++j) {
    if (max < d[columns[j]]) max = d[columns[j]];
  }
  d.date = parseDate(d.date);
  d.max = max;

  d.radiation = {
    equip: d.usedEquipment,
    shield: d.ceilingShield,
    glasses: d.leadGlasses,
    cabin: d.radiationProtectionCabin
  };

  d.protection = {
    equip: 1 - d.usedEquipment,
    shield: 1 - d.ceilingShield,
    glasses: 1 - d.leadGlasses,
    cabin: 1 - d.radiationProtectionCabin
  };

  console.log('max', d.max);
  return d;
}

d3.csv('testData.csv', type, (error, data) => {
  if (error) throw error;

  data.reduce((acc, d) => {
  });

  // data.sort((a, b) => b.total - a.total);
  console.log('data', data);

  x.domain(data.map(d => d.State));
  yDate.domain(data.map(d => d.date));

  const cols = ['usedEquipment', 'ceilingShield', 'leadGlasses', 'radiationProtectionCabin'];

  protDose.domain([0, d3.max(data, d => d.max)]);
  radDose.domain([0, d3.max(data, d => d.max)]);

  stack.keys(data.columns.slice(2));


  (function() {
  // right
    const barWidth = d3.scaleLinear()
      .rangeRound([0, width / 2 - (centerMargin / 2)])
      .domain([0, d3.max(data, d => d.max)]).nice();

    const xProtRight = d3.scaleLinear()
      .rangeRound([(width / 2) + (centerMargin / 2), width])
      .domain([0, d3.max(data, d => d.max)]).nice();

    const extractData = d => _.sortBy(Object.keys(d.protection)
      .map(key => ({ key, value: d.protection[key], date: d.date })), 'value').reverse();

    g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisTop(xProtRight)
                .tickSize(height, 0, 0)
                .tickFormat('')
            );

    const protBar = gRight.selectAll('.protBar')
      .data(data)
      .enter().append('g')
        .attr('class', 'protBar')
      .selectAll('rect')
      .data(extractData)
      .enter()
      .append('rect')
        .attr('class', d => d.key)
        .attr('y', d => yDate(d.date))
        .attr('x', d => (width / 2) + (centerMargin / 2))
        .attr('width', d => barWidth(d.value))
        .attr('height', yDate.bandwidth())
        .attr('fill', d => protDose(d.value))
        .style('stroke', 'black');

    gRight.append('g')
        .attr('class', 'axis axis--x')
        // .attr('transform', `translate(0,${height})`)
        .call(d3.axisTop(xProtRight));

    //
  }());

  (function() {
    const xRadLeft = d3.scaleLinear()
      .rangeRound([(width / 2) - (centerMargin / 2), 0])
      .domain([0, d3.max(data, d => d.max)]).nice();

    g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisTop(xRadLeft)
                .tickSize(height, 0, 0)
                .tickFormat('')
            );

    const extractData = d => _.sortBy(Object.keys(d.radiation)
      .map(key => ({ key, value: d.radiation[key], date: d.date })), 'value').reverse();

    const radBar = gLeft.selectAll('.radBar')
      .data(data)
      .enter().append('g')
        .attr('class', 'serie')
      .selectAll('rect')
      .data(extractData)
      .enter()
      .append('rect')
        .attr('class', d => d.key)
        .attr('x', d => xRadLeft(d.value))
        .attr('y', d => yDate(d.date))
        .attr('width', d => xRadLeft(0) - xRadLeft(d.value))
        .attr('height', yDate.bandwidth())
        .attr('fill', d => radDose(d.value))
        .style('stroke', 'black');

    console.log('radBarleft', radBar.data());

    gLeft.append('g')
        .attr('class', 'axis axis--x')
        // .attr('transform', `translate(0,${height})`)
        .call(d3.axisTop(xRadLeft));

    // gLeft.append('g')
    //     .attr('class', 'axis axis--x')
    //     .attr('transform', `translate(0,${height})`)
    //     .call(d3.axisBottom(yDate));

    //
    // g.append('g')
    //     .attr('class', 'axis axis--y')
    //     .call(d3.axisLeft(xRadLeft).ticks(10, 's'))
    //   .append('text')
    //     .attr('x', 2)
    //     .attr('y', xRadLeft(xRadLeft.ticks(10).pop()))
    //     .attr('dy', '0.35em')
    //     .attr('text-anchor', 'start')
    //     .attr('fill', '#000')
    //     .text('Population');
  }());

  const yAxis = g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(yDate)
        .tickFormat(formatDate)
        .tickSize(0)
      )
      .attr('transform', `translate(${width / 2},0)`);

  yAxis.selectAll('g text')
      .attr('font-size', 15)
      .attr('text-anchor', 'middle');

    // yAxis.select("path.domain")
      // .attr('dx', function() {
      //   var w = this.getBBox().width;
      //   console.log("w", w);
      //   return -w/4;
      //
      // })
  yAxis.append('text')
      // .attr('x', 2)
      // .attr('y', yDate)
      .attr('dy', '-10')
      // .attr('dx', '10')
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .attr('font-size', 15)
      .attr('font-weight', 'bold')
      .text('Time');

  const legend = g.append('g')
    .attr('transform', `translate(0,${height})`)
    .selectAll('.legend')
    .data(data.columns.slice(2).reverse())
    .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0,${i * 20})`)
      .style('font', '10px sans-serif');
  //
  legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', protDose);

  legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(d => d);
});

