// Private variables

const reports = [
  {
    title: "Report1",
    chart1: {
        title: "Report1",
        query: "data1",
        column: "1",
        id: "id",
        template: "template"
    },
    chart2: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart3: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart4: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart5: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart6: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
  },
  {
    title: "Report2",
    chart1: {
        title: "Report1",
        query: "data1",
        column: "1",
        id: "id",
        template: "template"
    },
    chart2: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart3: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart4: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart5: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
    chart6: {
      title: "Report1",
      query: "data1",
      column: "1",
      id: "id",
      template: "template"
    },
  }
]

/*const reports = [
  {
    title: "Report1"
  },
  {
    title: "Report2"
  }
]*/

const queries = [
  {
    name: "name1",
    id: "id1"
  },
  {
    name: "name2",
    id: "id2"
  },
  {
    name: "name3",
    id: "id3"
  }
]

const templates = [
  {
    name: "template1",
  },
  {
    name: "template2",
  },
  {
    name: "template3"
  }
]

const columns = [
  {
    name:"1",
  },
  {
    name:"2",
  },
  {
    name:"3"
  }
]

const data1 = [
    ["Year", "Visitations", { role: "style" }],
    ["2010", 10, "color: gray"],
    ["2020", 14, "color: #76A7FA"],
    ["2030", 16, "color: blue"],
    ["2040", 22, "stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF"],
    [
      "2050",
      28,
      "stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2"
    ]
];
  
const data2 = [
    ["Year", "Visitations", { role: "style" }],
    ["2010", 202, "color: gray"],
    ["2020", 242, "color: #76A7FA"],
    ["2030", 262, "color: blue"],
    ["2040", 222, "stroke-color: #703593; stroke-width: 4; fill-color: #C5A5CF"],
    [
      "2050",
      282,
      "stroke-color: #871B47; stroke-opacity: 0.6; stroke-width: 8; fill-color: #BC5679; fill-opacity: 0.2"
    ]
];

class _ReportsInfo {
  /*
    Checks to see if the user is logged in. If so, get the token from localstorage
    and check if valid.
  */
  constructor() {
  }
  
  getReports = () => {
    return reports;
  }

  getQueryList = () => {
      return queries;
  }

  getColumns = () => {
    return columns;
  }

  getTemplates = () => {
    return templates;
  }

  getData = (query, template, column, queryID, title) => {
    let active = 0;
    if (active === 0){
        return data1;
    } else {
        return data2;
    }
  }

  addReport = () => {
    // add report to the database

  }

  deleteReport = (key) => {
    // delete the data from the database

  }
}


/* Singleton for authentication object */
let instance;
export const ReportsInfo = {
  getInstance: () => {
    if (!instance) {
      instance = new _ReportsInfo();
    }
    return instance
  }
};