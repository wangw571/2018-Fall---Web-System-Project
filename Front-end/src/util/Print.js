class _Print {
  graphs = {};
  
  constructor() {
    window.onbeforeprint = this._beforePrint;
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(mql => mql.matches? this._beforePrint(): null)
    }
  }

  _beforePrint = () => {
    const keys = Object.keys(this.graphs);
    keys.forEach(key => {
      const graph = this.graphs[key];
      graph.resize();
    });
  }

  addGraph = chart => this.graphs[chart.id] = chart;
  removeGraph = id => delete this.graphs[id];
}

/* Singleton for authentication object */
let instance;
export const Print = {
  getInstance: () => {
    if (!instance) {
      instance = new _Print();
    }
    return instance
  }
};