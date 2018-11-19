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
      query: "data2",
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
      query: "data2",
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

const data1 = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: 'Canada',
        data: [10, 24, 31, 13, 24]
      },
      {
        label: 'USA',
        data: [21, 23, 12, 21, 1]
      }
    ]
  };
  
const data2 = {
  labels: ["USA", "France", "Tokyo", "China"],
  datasets: [{
    data: [10, 24, 31, 13]
  }]
};

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