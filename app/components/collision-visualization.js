import BaseD3Plane from './base-d3-plane';
import d3 from 'npm:d3';

export default BaseD3Plane.extend({
  tagName: 'canvas',
  attributeBindings: ['canvasWidth:width', 'canvasHeight:height'],

  elementClass: 'collision-vis',
  canvasHeight: 960,
  canvasWidth: 960,

  canvas: null,
  context: null,
  width: null,
  height: null,
  tau: null,
  nodes: null,
  simulation: null,

  didInsertElement() {
    this._super(...arguments);

    this._initializeProps();
    this._initializeNodes();
    this._initializeSimulation();
  },

  _initializeProps() {
    const canvas = document.querySelector('canvas'),
          context = canvas.getContext('2d'),
          width = canvas.width,
          height = canvas.height,
          tau = 2 * Math.PI;

    this.setProperties({
      canvas,
      context,
      width,
      height,
      tau,
    });
  },

  _initializeNodes() {
    const nodes = d3.range(1000).map(() => {
      return {
        r: Math.random() * 14 + 4,
      };
    });

    this.set('nodes', nodes);
  },

  _initializeSimulation() {
    const nodes = this.get('nodes');

    const simulation = d3.forceSimulation(nodes)
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(0.002))
    .force('y', d3.forceY().strength(0.002))
    .force('collide', d3.forceCollide().radius((d) => d.r + 0.5).iterations(2))
    .on('tick', this.ticked());

    this.set('simulation', simulation);
  },

  ticked() {
    const {
      context,
      height,
      nodes,
      tau,
      width,
    } = this.getProperties(
      'context',
      'height',
      'nodes',
      'tau',
      'width'
    );

    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    nodes.forEach((d) => {
      context.moveTo(d.x + d.r, d.y);
      context.arc(d.x, d.y, d.r, 0, tau);
    });
    context.fillStyle = '#ddd';
    context.fill();
    context.strokeStyle = '#333';
    context.stroke();

    context.restore();
  },
});
