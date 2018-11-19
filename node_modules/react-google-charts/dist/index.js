'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Script = require('react-load-script');

const DEFAULT_CHART_COLORS = [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#3B3EAC"
];

class ReactGoogleChartsLoader extends React.Component {
    constructor(props) {
        super(props);
        const documentScripts = document.getElementsByTagName("script");
        this.loadScript = true;
        for (let i = 0; i < documentScripts.length; i += 1) {
            if (documentScripts[i].src.includes("gstatic.com/charts/loader.js")) {
                this.loadScript = false;
            }
        }
    }
    componentDidMount() {
        if (this.loadScript === false) {
            this.props.onLoad();
        }
    }
    render() {
        const { onError, onLoad } = this.props;
        if (this.loadScript === true) {
            return (React.createElement(Script, { url: "https://www.gstatic.com/charts/loader.js", onError: () => {
                    onError();
                }, onLoad: onLoad }));
        }
        else {
            return null;
        }
    }
}

const GRAY_COLOR = "#CCCCCC";
let uniqueID = 0;
const generateUniqueID = () => {
    uniqueID += 1;
    return `reactgooglegraph-${uniqueID}`;
};
const chartDefaultProps = {
    graph_id: null,
    legend_toggle: false,
    graphID: null,
    options: {
        colors: null
    },
    data: null,
    rows: null,
    columns: null,
    diffdata: null,
    chartEvents: null,
    legendToggle: false,
    chartActions: null,
    getChartWrapper: (chartWrapper, google) => { },
    className: "",
    style: {},
    formatters: null
};
class Chart extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loadingStatus: "loading",
            google: null,
            hiddenColumns: []
        };
        this.graphID = null;
        this.chartWrapper = null;
        this.getGraphID = () => {
            const { graphID, graph_id } = this
                .props;
            let instanceGraphID;
            if (graphID === null && graph_id === null) {
                if (this.graphID === null) {
                    instanceGraphID = generateUniqueID();
                }
                else {
                    instanceGraphID = this.graphID;
                }
            }
            else if (graphID !== null && graph_id === null) {
                instanceGraphID = graphID;
            }
            else if (graph_id !== null && graphID === null) {
                instanceGraphID = graph_id;
            }
            else {
                instanceGraphID = graphID;
            }
            this.graphID = instanceGraphID;
            return this.graphID;
        };
        this.draw = () => {
            if (this.chartWrapper === null || this.state.google === null)
                return;
            const { data, diffdata, columns, rows, options, legend_toggle, legendToggle, chartType, formatters } = this.props;
            let dataTable;
            let chartDiff = null;
            if (diffdata !== null) {
                const oldData = this.state.google.visualization.arrayToDataTable(diffdata.old);
                const newData = this.state.google.visualization.arrayToDataTable(diffdata.new);
                chartDiff = this.state.google.visualization[chartType].prototype.computeDiff(oldData, newData);
            }
            if (data !== null) {
                if (Array.isArray(data)) {
                    dataTable = this.state.google.visualization.arrayToDataTable(data);
                }
                else {
                    dataTable = new this.state.google.visualization.DataTable(data);
                }
            }
            else if (rows !== null && columns !== null) {
                dataTable = this.state.google.visualization.arrayToDataTable([
                    columns,
                    ...rows
                ]);
            }
            else {
                dataTable = this.state.google.visualization.arrayToDataTable([]);
            }
            const columnCount = dataTable.getNumberOfColumns();
            for (let i = 0; i < columnCount; i += 1) {
                const columnID = this.getColumnID(dataTable, i);
                if (this.state.hiddenColumns.includes(columnID)) {
                    const previousColumnLabel = dataTable.getColumnLabel(i);
                    const previousColumnID = dataTable.getColumnId(i);
                    const previousColumnType = dataTable.getColumnType(i);
                    dataTable.removeColumn(i);
                    dataTable.addColumn({
                        label: previousColumnLabel,
                        id: previousColumnID,
                        type: previousColumnType
                    });
                }
            }
            const chart = this.chartWrapper.getChart();
            if (this.chartWrapper.getChartType() === "Timeline") {
                chart && chart.clearChart();
            }
            this.chartWrapper.setOptions(options);
            this.chartWrapper.setDataTable(dataTable);
            this.chartWrapper.draw();
            if (chartDiff !== null) {
                this.chartWrapper.setDataTable(chartDiff);
                this.chartWrapper.draw();
            }
            if (formatters !== null) {
                this.applyFormatters(dataTable, formatters);
                this.chartWrapper.setDataTable(dataTable);
                this.chartWrapper.draw();
            }
            if (legendToggle === true || legend_toggle === true) {
                this.grayOutHiddenColumns();
            }
        };
        this.applyFormatters = (dataTable, formatters) => {
            if (this.state.google === null)
                return;
            for (let formatter of formatters) {
                switch (formatter.type) {
                    case "ArrowFormat": {
                        const vizFormatter = new this.state.google.visualization.ArrowFormat(formatter.options);
                        vizFormatter.format(dataTable, formatter.column);
                        break;
                    }
                    case "BarFormat": {
                        const vizFormatter = new this.state.google.visualization.BarFormat(formatter.options);
                        vizFormatter.format(dataTable, formatter.column);
                        break;
                    }
                    case "ColorFormat": {
                        const vizFormatter = new this.state.google.visualization.ColorFormat(formatter.options);
                        const { ranges } = formatter;
                        for (let range of ranges) {
                            vizFormatter.addRange(...range);
                        }
                        vizFormatter.format(dataTable, formatter.column);
                        break;
                    }
                    case "DateFormat": {
                        const vizFormatter = new this.state.google.visualization.DateFormat(formatter.options);
                        vizFormatter.format(dataTable, formatter.column);
                        break;
                    }
                    case "NumberFormat": {
                        const vizFormatter = new this.state.google.visualization.NumberFormat(formatter.options);
                        vizFormatter.format(dataTable, formatter.column);
                        break;
                    }
                    case "PatternFormat": {
                        const vizFormatter = new this.state.google.visualization.PatternFormat(formatter.options);
                        vizFormatter.format(dataTable, formatter.column);
                        break;
                    }
                }
            }
        };
        this.grayOutHiddenColumns = () => {
            if (this.chartWrapper === null || this.state.google === null)
                return;
            const dataTable = this.chartWrapper.getDataTable();
            if (dataTable === null)
                return;
            const columnCount = dataTable.getNumberOfColumns();
            const hasAHiddenColumn = this.state.hiddenColumns.length > 0;
            if (hasAHiddenColumn === false)
                return;
            const { options } = this.props;
            const colors = Array.from({ length: columnCount - 1 }).map((dontcare, i) => {
                const columnID = this.getColumnID(dataTable, i + 1);
                if (this.state.hiddenColumns.includes(columnID)) {
                    return GRAY_COLOR;
                }
                else if (typeof options.colors !== "undefined" &&
                    options.colors !== null) {
                    return options.colors[i];
                }
                else {
                    return DEFAULT_CHART_COLORS[i];
                }
            });
            this.chartWrapper.setOptions(Object.assign({}, this.props.options, { colors }));
            this.chartWrapper.draw();
        };
        this.onResize = () => {
            if (this.chartWrapper === null)
                return;
            this.chartWrapper.draw();
        };
        this.setChartActions = (currentActions, previousActions) => {
            if (this.chartWrapper === null)
                return;
            const chart = this.chartWrapper.getChart();
            for (let chartAction of previousActions) {
                chart.removeAction(chartAction.id);
            }
            for (let chartAction of currentActions) {
                chart.setAction({
                    id: chartAction.id,
                    text: chartAction.text,
                    action: () => chartAction.action(this.chartWrapper)
                });
            }
        };
        this.getColumnID = (dataTable, columnIndex) => {
            return (dataTable.getColumnId(columnIndex) ||
                dataTable.getColumnLabel(columnIndex));
        };
        this.listenToChartEvents = () => {
            if (this.state.google === null || this.chartWrapper === null) {
                return;
            }
            this.state.google.visualization.events.removeAllListeners(this.chartWrapper);
            const { chartEvents, legend_toggle, legendToggle } = this
                .props;
            if (chartEvents !== null) {
                for (let event of chartEvents) {
                    const { eventName, callback } = event;
                    this.state.google.visualization.events.addListener(this.chartWrapper, eventName, (...args) => {
                        if (this.chartWrapper !== null && this.state.google !== null) {
                            callback({
                                chartWrapper: this.chartWrapper,
                                props: this.props,
                                google: this.state.google,
                                state: this.state,
                                eventArgs: args
                            });
                        }
                    });
                }
            }
            if (legendToggle === true || legend_toggle === true) {
                this.listenToLegendToggle();
            }
        };
        this.listenToLegendToggle = () => {
            if (this.state.google === null || this.chartWrapper === null) {
                return;
            }
            this.state.google.visualization.events.addListener(this.chartWrapper, "select", () => {
                if (this.chartWrapper === null)
                    return;
                const chart = this.chartWrapper.getChart();
                const selection = chart.getSelection();
                const dataTable = this.chartWrapper.getDataTable();
                if (selection.length === 0 ||
                    selection[0].row !== null ||
                    dataTable === null) {
                    return;
                }
                const columnIndex = selection[0].column;
                const columnID = this.getColumnID(dataTable, columnIndex);
                if (this.state.hiddenColumns.includes(columnID)) {
                    this.setState(state => (Object.assign({}, state, { hiddenColumns: [
                            ...state.hiddenColumns.filter(colID => colID !== columnID)
                        ] })), () => {
                        this.draw();
                    });
                }
                else {
                    this.setState(state => (Object.assign({}, state, { hiddenColumns: [...state.hiddenColumns, columnID] })), () => {
                        this.draw();
                    });
                }
            });
        };
        this.handleGoogleChartsLoaderScriptLoaded = (windowGoogleCharts) => {
            const { chartVersion: version, chartPackages: packages, chartLanguage: language, mapsApiKey } = this.props;
            windowGoogleCharts.charts.load(version || "current", {
                packages: packages || ["corechart"],
                language: language || "en",
                mapsApiKey
            });
            windowGoogleCharts.charts.setOnLoadCallback(() => {
                this.setState(state => (Object.assign({}, state, { loadingStatus: "ready", google: windowGoogleCharts })));
            });
        };
        this.handleGoogleChartsLoaderScriptErrored = () => {
            this.setState(state => (Object.assign({}, state, { loadingStatus: "errored" })));
        };
    }
    componentDidMount() {
        this.setState({ loadingStatus: "loading" });
        window.addEventListener("resize", this.onResize);
    }
    componentDidUpdate(prevProps, prevState) {
        const props = this.props;
        if (prevState.loadingStatus !== "ready" &&
            this.state.loadingStatus === "ready" &&
            this.state.google !== null) {
            const chartConfig = {
                chartType: this.props.chartType,
                options: this.props.options,
                containerId: this.getGraphID()
            };
            this.chartWrapper = new this.state.google.visualization.ChartWrapper(chartConfig);
            this.listenToChartEvents();
            this.draw();
            props.getChartWrapper(this.chartWrapper, this.state.google);
            return;
        }
        if (props.chartEvents !== prevProps.chartEvents) {
            this.listenToChartEvents();
        }
        if (props.chartActions !== null || prevProps.chartActions !== null) {
            if (props.chartActions !== prevProps.chartActions) {
                this.setChartActions(props.chartActions, prevProps.chartActions);
            }
        }
        if (props.data !== prevProps.data) {
            this.draw();
        }
        if (props.rows !== prevProps.rows || props.columns !== prevProps.columns) {
            this.draw();
        }
    }
    componentWillUnmount() {
        if (this.chartWrapper === null || this.state.google === null) {
            return;
        }
        window.removeEventListener("resize", this.onResize);
        this.state.google.visualization.events.removeAllListeners(this.chartWrapper);
        if (this.chartWrapper.getChartType() === "Timeline") {
            this.chartWrapper.getChart() && this.chartWrapper.getChart().clearChart();
        }
    }
    render() {
        const divStyle = Object.assign({ height: this.props.height || (this.props.options && this.props.options.height), width: this.props.width || (this.props.options && this.props.options.width) }, this.props.style);
        return (React.createElement("div", { id: this.getGraphID(), style: divStyle, className: this.props.className },
            React.createElement(ReactGoogleChartsLoader, { onError: this.handleGoogleChartsLoaderScriptErrored, onLoad: () => {
                    const windowWithGoogle = window;
                    if (windowWithGoogle.google) {
                        this.handleGoogleChartsLoaderScriptLoaded(windowWithGoogle.google);
                    }
                } }),
            this.state.loadingStatus === "loading" &&
                (this.props.loader ? this.props.loader : "Rendering Chart...")));
    }
}
Chart.defaultProps = chartDefaultProps;

exports.Chart = Chart;
exports.default = Chart;
