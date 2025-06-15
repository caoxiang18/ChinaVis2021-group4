// ==== pcp_whole ====
function pcp_whole(wholelist, match_list, wholename_list, prov){
	const yearlist = ['2013','2014','2015','2016','2017','2018'];
    var data_list = [];

    for (var i=0; i<wholelist.length; i++) {
    	var yeardata = wholelist[i];
    	for (var k=0; k<wholename_list.length; k++) {
    		var cityvalue = yeardata.filter(function(event){ return event.province==wholename_list[k]});
    		var small_list = [];
    		const province = match_list[k];
    		const year = yearlist[i];
    		var count_aqi = 0, count_pm10 = 0, count_pm25 = 0, count_so2 = 0;
    		var count_no2 = 0, count_co = 0, count_o3 = 0, count_temp = 0, count_velo = 0;

    		for (var j=0; j<cityvalue.length; j++) {
    			count_aqi += cityvalue[j]['AQI'];
    			count_pm10 += cityvalue[j]['PM10(微克每立方米)'];
    			count_pm25 += cityvalue[j]['PM2.5(微克每立方米)'];
    			count_so2 += cityvalue[j]['SO2(微克每立方米)'];
    			count_no2 += cityvalue[j]['NO2(微克每立方米)'];
    			count_co += cityvalue[j]['CO(毫克每立方米)'];
    			count_o3 += cityvalue[j]['O3(微克每立方米)'];
    			count_temp += (cityvalue[j]['TEMP(K)']-273.15);
    			count_velo += Math.sqrt(Math.pow(cityvalue[j]['U(m/s)'],2) + Math.pow(cityvalue[j]['V(m/s)'],2));
    		}

    		var avg_aqi = count_aqi/12;
    		var level = avg_aqi <= 50 ? 'Good' :
    					avg_aqi <= 100 ? 'Moderate' :
    					avg_aqi <= 150 ? 'Lightly\nPolluted' :
    					avg_aqi <= 200 ? 'Moderately\nPolluted' :
    					avg_aqi <= 300 ? 'Heavily\nPolluted' : 'Serverly\nPolluted';

    		small_list.push(province, year, avg_aqi, count_pm10/12, count_pm25/12, count_so2/12, count_no2/12, count_co/12, count_o3/12, count_temp/12, count_velo/12, level);
	    	data_list.push(small_list);
    	}
    }

	const axislab = {
		show:true, interval:"auto", inside:true, color: '#CCCCCC', rotate:0, fontWeight: 'normal'
	};

	const mytextStyle = {
	    color:"#DDDDDD", fontStyle:"normal", fontWeight:'normal', fontFamily:"Arial", fontSize:12
	};

	let provlist = prov == 'whole' ? match_list : match_list.map(p => p == prov ? {value:p, textStyle:{color:'#FFD700'}} : p);

	return {
		backgroundColor: "#1E1E1E",
		parallel:[{width:500, layout: "vertical"}],
	    parallelAxis: [
	        {
	        	dim: 0, name: 'Prov', type: 'category',
	        	nameLocation:"start", nameTextStyle:mytextStyle,
	        	axisLabel:{show:true, interval:"auto", inside:true, color: '#333333', fontSize:10, rotate:90},
	        	axisTick: {show:true, alignWithLabel:false, inside:true},
	        	areaSelectStyle:{ borderWidth:1, borderColor:'#888888', color: '#444444', opacity:0.4 },
	        	data: provlist
	        },
	        {dim: 1, name: 'Year', type: 'category', nameTextStyle:mytextStyle, axisLabel: axislab, data: yearlist},
	        {dim: 2, name: 'AQI', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 3, name: 'PM10\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 4, name: 'PM2.5\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 5, name: 'SO2\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 6, name: 'NO2\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 7, name: 'CO\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 8, name: 'O3\n(mg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 9, name: 'Temp\n(°C)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 10, name: 'Wind\nSpeed', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {
	            dim: 11, name: 'Level', type: 'category',
	            nameTextStyle: mytextStyle,
	            axisLabel:{ show:true, interval:0, inside:true, color: '#AAAAAA', fontSize:12 },
	            data: ['Good', 'Moderate', 'Lightly\nPolluted', 'Moderately\nPolluted','Heavily\nPolluted','Serverly\nPolluted']
	        }
	    ],
	    series: {
	        type: 'parallel',
	        lineStyle: {
	            width: 2,
	            color: '#FFA500' // smog orange
	        },
	        data: data_list
	    }
	};
}


// ==== pcp_make ====
function pcp_make(data, match_list, wholename_list, prov){
	var cal_list = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const calendar = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var data_list = [];

    for (var i=0; i<data.length; i++) {
    	var small_list = [];
    	const month = cal_list[calendar.indexOf(data[i]['month'])];
    	const province = match_list[wholename_list.indexOf(data[i]['province'])];
    	const AQI = data[i]['AQI'];
    	const pm25 = data[i]['PM2.5(微克每立方米)'];
    	const pm10 = data[i]['PM10(微克每立方米)'];
    	const so2 = data[i]['SO2(微克每立方米)'];
    	const no2 = data[i]['NO2(微克每立方米)'];
    	const co = data[i]['CO(毫克每立方米)'];
    	const o3 = data[i]['O3(微克每立方米)'];
    	const temp = data[i]['TEMP(K)']-273.15;
    	const velo = Math.sqrt(Math.pow(data[i]['U(m/s)'],2) + Math.pow(data[i]['V(m/s)'],2));
	    const level = AQI <= 50 ? 'Good' :
			AQI <= 100 ? 'Moderate' :
			AQI <= 150 ? 'Lightly\nPolluted' :
			AQI <= 200 ? 'Moderately\nPolluted' :
			AQI <= 300 ? 'Heavily\nPolluted' : 'Serverly\nPolluted';

    	small_list.push(province, month, AQI, pm10, pm25, so2, no2, co, o3, temp, velo, level);
    	data_list.push(small_list);
    }

	const axislab = {
		show:true, interval:"auto", inside:true, color: '#CCCCCC', rotate:0, fontWeight: 'normal'
	};

	const mytextStyle = {
	    color:"#DDDDDD", fontStyle:"normal", fontWeight:'normal', fontFamily:"Arial", fontSize:12
	};

	let provlist = prov == 'whole' ? match_list : match_list.map(p => p == prov ? {value:p, textStyle:{color:'#FFD700'}} : p);

	return {
		backgroundColor: "#1E1E1E",
		parallel:[{width:500, layout: "vertical"}],
	    parallelAxis: [
	        {
	        	dim: 0, name: 'Prov', type: 'category', nameTextStyle:mytextStyle,
	        	axisLabel:{ show:true, interval:"auto", inside:true, color: '#333333', fontSize:10, rotate:90 },
	        	areaSelectStyle:{ borderWidth:1, borderColor:'#888888', color: '#444444', opacity:0.4 },
	        	data: provlist
	        },
	        {
	        	dim: 1, name: 'Month', type: 'category',
	        	nameTextStyle:mytextStyle,
	            axisLabel:{ show:true, interval:"auto", inside:true, color: 'white' },
	        	data: cal_list
	        },
	        {dim: 2, name: 'AQI', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 3, name: 'PM10\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 4, name: 'PM2.5\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 5, name: 'SO2\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 6, name: 'NO2\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 7, name: 'CO\n(μg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 8, name: 'O3\n(mg/m³)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 9, name: 'Temp\n(°C)', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {dim: 10, name: 'Wind\nSpeed', nameTextStyle:mytextStyle, axisLabel: axislab},
	        {
	            dim: 11, name: 'Level', type: 'category', nameTextStyle: mytextStyle,
	            axisLabel:{ show:true, interval:0, inside:true, color: '#AAAAAA', fontSize:12 },
	            data: ['Good', 'Moderate', 'Lightly\nPolluted', 'Moderately\nPolluted','Heavily\nPolluted','Serverly\nPolluted']
	        }
	    ],
	    series: {
	        type: 'parallel',
	        lineStyle: {
	            width: 2,
	            color: '#FF6347' // Tomato red for pollution effect
	        },
	        data: data_list
	    }
	};
}
