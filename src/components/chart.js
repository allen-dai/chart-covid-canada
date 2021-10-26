import * as d3 from "d3";
import { Line, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Typography, Grid, Slider, Box, Container } from "@mui/material";
import ChartAnimation from "./animation/chart";

const Chart = () => {
  const csv =
    "https://health-infobase.canada.ca/src/data/covidLive/covid19-download.csv";
  const vac_csv =
    "https://health-infobase.canada.ca/src/data/covidLive/vaccination-coverage-map.csv";

  const [displayLDS, setDisplayLDS] = useState([]);
  const [lineChartDS, setLineChartDS] = useState([]);

  const [displayBDS, setDisplayBDS] = useState([]);
  const [barChartDS, setBarChartDS] = useState([]);

  const [displayDate, setDisplayDate] = useState([]);
  const [date, setDate] = useState([]);

  const [length, setLength] = useState(600);

  const [displayVBDS, setDisplayVBDS] = useState([]);
  const [vacBarChartDS, setVacBarChartDS] = useState([]);

  const [value, setValue] = useState([0, length]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(
    () =>
      (async () => {
        const COLOR = {
          Canada: "#2a4858",
          Ontario: "#255566",
          "British Columbia": "#1c6373",
          Quebec: "#0b717e",
          Alberta: "#007f86",
          Saskatchewan: "#008d8c",
          Manitoba: "#009c8f",
          "New Brunswick": "#23aa8f",
          "Newfoundland and Labrador": "#3fb78d",
          "Nova Scotia": "#5bc489",
          "Prince Edward Island": "#77d183",
          "Northwest Territories": "#95dd7d",
          Nunavut: "#b5e877",
          Yukon: "#d7f171",
          "Repatriated travellers": "#fafa6e",
        };

        const DATA = {
          Canada: [],
          Ontario: [],
          "British Columbia": [],
          Quebec: [],
          Alberta: [],
          Saskatchewan: [],
          Manitoba: [],
          "New Brunswick": [],
          "Newfoundland and Labrador": [],
          "Nova Scotia": [],
          "Prince Edward Island": [],
          "Northwest Territories": [],
          Nunavut: [],
          Yukon: [],
          "Repatriated travellers": [],
          Date: [],
          Province: [],
        };

        const VAC_DATA = {
          Canada: [],
          Ontario: [],
          "British Columbia": [],
          Quebec: [],
          Alberta: [],
          Saskatchewan: [],
          Manitoba: [],
          "New Brunswick": [],
          "Newfoundland and Labrador": [],
          "Nova Scotia": [],
          "Prince Edward Island": [],
          "Northwest Territories": [],
          Nunavut: [],
          Yukon: [],
          "Repatriated travellers": [],
          Date: [],
          Province: [],
        };

        async function init() {
          let d = await d3.csv(csv);
          let v_d = await d3.csv(vac_csv);

          //Filter
          let regions = [
            "Canada",
            "Ontario",
            "British Columbia",
            "Quebec",
            "Alberta",
            "Saskatchewan",
            "Manitoba",
            "Nova Scotia",
          ];
          d.forEach((row, i) => {
            if (!regions.includes(row.prname)) {
              d.splice(i, 1);
            }
          });

          v_d.forEach((row, i) => {
            if (!regions.includes(row.prename)) {
              d.splice(i, 1);
            }
          });

          d.forEach((row) => {
            DATA[row.prname].push(row);

            //Getting unique date
            if (row.prname === "Canada") {
              DATA.Date.push(row.date);
            }
          });

          v_d.forEach((row) => {
            VAC_DATA[row.prename].push(+row.numtotal_atleast1dose);
          });

          //Getting all Province
          for (var key of Object.keys(DATA)) {
            if (
              key !== "Date" &&
              key !== "Province" &&
              key !== "Repatriated travellers" &&
              regions.includes(key)
            ) {
              DATA.Province.push(key);
            }
          }

          //Shifting the data array because some province had 0 data at the beginning
          let length = DATA.Canada.length;
          DATA.Province.forEach((region) => {
            if (region !== "Canada") {
              let regionLength = DATA[region].length;
              for (let i = 0; i < length - regionLength; i++) {
                DATA[region].unshift(DATA[region][0]);
              }
            }

            let vacLength = VAC_DATA[region].length;
            for (let i = 0; i < length - vacLength; i++) {
              VAC_DATA[region].unshift(0);
            }
          });
        }

        function chartDataSet(data, vacData) {
          let defaultHidden = ["Canada"];
          let lineDS = [];
          let barDS = [];
          let vacBarDS = [];
          data.Province.forEach((region) => {
            let caseNum = getCaseNum(data[region]);

            lineDS.push({
              label: region,
              data: caseNum.numConf,
              borderColor: COLOR[region],
              hidden: defaultHidden.includes(region) ? true : false,
            });

            barDS.push({
              label: region,
              data: caseNum.dailyNum,
              backgroundColor: COLOR[region],
              stack: "Stack 0",
              hidden: defaultHidden.includes(region) ? true : false,
            });

            vacBarDS.push({
              label: region,
              data: vacData[region],
              backgroundColor: COLOR[region],
              stack: "Stack 0",
              hidden: defaultHidden.includes(region) ? true : false,
            });
          });

          return { line: lineDS, bar: barDS, vacBar: vacBarDS };
        }

        function getCaseNum(arr) {
          let numConf = [];
          let dailyNum = [];
          arr.forEach((row) => {
            numConf.push(+row.numconf);
            dailyNum.push(+row.numtoday);
          });
          return { numConf: numConf, dailyNum: dailyNum };
        }
        // END init

        await init();
        let ds = chartDataSet(DATA, VAC_DATA);

        setLineChartDS(ds.line);
        setDisplayLDS(JSON.parse(JSON.stringify(ds.line)));

        setBarChartDS(ds.bar);
        setDisplayBDS(JSON.parse(JSON.stringify(ds.bar)));

        setVacBarChartDS(ds.vacBar);
        setDisplayVBDS(JSON.parse(JSON.stringify(ds.vacBar)));

        setDisplayDate(DATA.Date);
        setDate(DATA.Date);
        setLength(DATA.Date.length);
      })(),
    []
  );

  //Chart Data Config
  var lineChartData = {
    labels: displayDate,
    datasets: displayLDS,
  };
  var lineOptions = {
    datasets: {
      line: {
        pointRadius: 0, // disable for all `'line'` datasets
      },
    },

    animation: false,

    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        grid: { color: "gray" },
      },
      y: {
        grid: { color: "gray" },
      },
    },
  };

  var barChartData = {
    labels: displayDate,
    datasets: displayBDS,
  };
  var vacBarChartData = {
    labels: displayDate,
    datasets: displayVBDS,
  };
  var barOptions = {
    animation: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: "gray" },
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: { color: "gray" },
      },
    },
  };
  //END config

  ///slider

  useEffect(() => {
    function slider(left, right) {
      //Line Chart
      let newLDS = [];
      lineChartDS.forEach((row) => {
        let newRow = JSON.parse(JSON.stringify(row));
        newRow.data = newRow.data.slice(left, right);
        newLDS.push(newRow);
      });
      setDisplayLDS(newLDS);

      //Bar Chart
      let newBDS = [];
      barChartDS.forEach((row) => {
        let newRow = JSON.parse(JSON.stringify(row));
        newRow.data = newRow.data.slice(left, right);
        newBDS.push(newRow);
      });
      setDisplayBDS(newBDS);

      //Vacc Bar Chart
      let newVBDS = [];
      vacBarChartDS.forEach((row) => {
        let newVRow = JSON.parse(JSON.stringify(row));
        newVRow.data = newVRow.data.slice(left, right);
        newVBDS.push(newVRow);
      });
      setDisplayVBDS(newVBDS);

      setDisplayDate(date.slice(left, right));
    }
    slider(value[0], value[1]);
  }, [value, barChartDS, date, lineChartDS, vacBarChartDS]);

  //END slider

  return (
    <>
      <Container maxWidth="lg">
        <Grid container maxWidth="lg" spacing={2}>
          <Grid item xs={12}>
            <ChartAnimation position="top">
              <Typography variant="h5" color="inherit" textAlign="center">
                Total Confirm Cases
              </Typography>
              <Line data={lineChartData} options={lineOptions} />
            </ChartAnimation>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartAnimation position="left">
              <Typography variant="h6" color="inherit" textAlign="center">
                Daily Cases
              </Typography>
              <Bar data={barChartData} options={barOptions} />
            </ChartAnimation>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartAnimation position="right">
              <Typography variant="h6" color="inherit" textAlign="center">
                Vaccination Number (Received at least 1 dose)
              </Typography>
              <Bar data={vacBarChartData} options={barOptions} />
            </ChartAnimation>
          </Grid>
        </Grid>
      </Container>

      <Box
        width="100%"
        position="fixed"
        bottom="10px"
        style={{ backdropFilter: "blur(5px)" }}
      >
        <Container maxWidth="lg">
          <Slider
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            max={length}
            disableSwap
          />
        </Container>
      </Box>
    </>
  );
};

export default Chart;
