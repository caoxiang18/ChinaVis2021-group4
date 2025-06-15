function map_make(datalist, match_list, wholename_list){

    var data_list = [];

    if (datalist.length == 6) {
        // for overview (2013-2018)
        for (var k = 0; k < wholename_list.length; k++) {
            var countlist = [];
            var newjson = {};

            for (var i = 0; i < datalist.length; i++) {
                var yeardata = datalist[i];
                var cityvalue = yeardata.filter(function(event){ return event.province == wholename_list[k]; });
                for (var j = 0; j < cityvalue.length; j++) {
                    countlist.push(cityvalue[j]['AQI']);
                }
            }

            var count = 0;
            for (var p = 0; p < countlist.length; p++) {
                count += countlist[p];
            }
            var aqi_avg = count / countlist.length;

            newjson["name"] = match_list[k];
            newjson["value"] = Math.round(aqi_avg);
            data_list.push(newjson);
        }
    } else {
        // if specific year
        for (var i = 0; i < wholename_list.length; i++) {
            var cityvalue = datalist.filter(function(event){ return event.province == wholename_list[i]; });
            var newjson = {};
            var count = 0;
            for (var k = 0; k < cityvalue.length; k++) {
                count += cityvalue[k]['AQI'];
            }

            newjson["name"] = match_list[i];
            newjson["value"] = Math.round(count / cityvalue.length);
            data_list.push(newjson);
        }
    }

    var year_average = [];
    for (var a = 0; a < data_list.length; a++) {
        year_average.push(data_list[a]['value']);
    }

    function getMaximin(arr, maximin) {
        if (maximin == "max") {
            return Math.max.apply(Math, arr);
        } else if (maximin == "min") {
            return Math.min.apply(Math, arr);
        }
    }

    var max_year = getMaximin(year_average, "max");
    var min_year = getMaximin(year_average, "min");

    var piece_data = [];
    var gte1 = {
        value: 0,
        label: "No value",
        color: 'lightgrey'  // pollution theme
    };
    piece_data.push(gte1);

    var color = ["#C0C0C0", "#FFA07A", "#FF4500", "#8B0000", "#4B0082"]; // gray to deep purple/brown

    for (var b = 0; b < 5; b++) {
        var gte_piece = {};
        var r = Math.pow((max_year / min_year), 0.25);

        gte_piece["gte"] = min_year * Math.pow(r, b);
        gte_piece["lt"] = min_year * Math.pow(r, b + 1);
        gte_piece["color"] = color[b];

        piece_data.push(gte_piece);
    }

    var map = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#f0f0f0',
            borderColor: '#999',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            },
            formatter: 'Region:{b}<br/>AQI:{c}'
        },
        visualMap: {
            show: true,
            top: 'center',
            left: 'left',
            textStyle: {
                color: '#fff',
                fontSize: 15
            },
            pieces: piece_data,
        },
        series: [{
            type: 'map',
            mapType: 'china',
            roam: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: "#222"
                        }
                    }
                },
                zoom: 1.5,
                emphasis: {
                    borderWidth: 2,
                    borderColor: '#333',
                    areaColor: '#f5f5f5',
                    label: {
                        show: true
                    }
                }
            },
            top: "3%",
            data: data_list
        }]
    };

    return map;
}
