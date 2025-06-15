function each_pollute(datalist, pollute_name, label_name, match_list, wholename_list) {
  var value_data = [];

  if (datalist.length == 6) {
    // overview for 2013 - 2018
    for (var k = 0; k < wholename_list.length; k++) {
      var countlist = [];

      for (var i = 0; i < datalist.length; i++) {
        var yeardata = datalist[i];
        var cityvalue = yeardata.filter(event => event.province == wholename_list[k]);
        for (var j = 0; j < cityvalue.length; j++) {
          countlist.push(cityvalue[j]['AQI']);
        }
      }

      var count = 0;
      for (var p = 0; p < countlist.length; p++) {
        count += countlist[p];
      }

      var aqi_avg = count / countlist.length;
      value_data.push(aqi_avg);
    }

  } else {
    // specific year
    for (var i = 0; i < wholename_list.length; i++) {
      var cityvalue = datalist.filter(event => event.province == wholename_list[i]);
      var count = 0;
      for (var k = 0; k < cityvalue.length; k++) {
        count += cityvalue[k][pollute_name];
      }
      value_data.push(count / cityvalue.length); // average
    }
  }

  var sortlist = [];
  for (var i = 0; i < value_data.length; i++) {
    sortlist.push({ city: match_list[i], value: value_data[i] });
  }

  sortlist.sort((a, b) => b.value - a.value);

  var valuelist = sortlist.map(item => item.value);
  var citylist = sortlist.map(item => item.city);

  const labelname = 'Average ' + label_name;

  const data = {
    labels: citylist,
    datasets: [
      {
        label: labelname,
        data: valuelist,
        backgroundColor: 'rgba(180, 80, 80, 0.6)',  // 灰红污染色
        borderColor: 'rgba(140, 40, 40, 0.9)',      // 边框更深红
        borderWidth: 1.5,
        hoverBackgroundColor: 'rgba(200, 100, 100, 0.8)', // 鼠标悬停颜色
      },
    ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          display: true,
          position: 'left',
          reverse: false,
          ticks: {
            color: '#cccccc', // 雾霾灰字体
            font: {
              size: 12,
              weight: 'normal'
            }
          }
        },
        x: {
          display: true,
          reverse: false,
          grid: {
            color: 'rgba(100,100,100,0.2)'  // 辅助线淡灰色
          },
          ticks: {
            color: '#cccccc',
            font: {
              size: 12,
              weight: 'normal'
            }
          }
        }
      },
      elements: {
        bar: {
          borderWidth: 2,
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#dddddd',
          borderColor: '#888888',
          borderWidth: 1
        }
      }
    },
  };

  return config;
}
