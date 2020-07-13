Highcharts.chart('radiation_chart', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {

                // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                    var x = (new Date()).getTime(), // current time
                        y = Math.random();
                    series.addPoint([x, y], true, true);
                }, 1000);
            }
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Live random data'
    },

    accessibility: {
        announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
                if (newPoint) {
                    return 'New point added. Value: ' + newPoint.y;
                }
                return false;
            }
        }
    },

    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },

    yAxis: {
        title: {
            text: 'Value'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'Random data',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random()
                });
            }
            return data;
        }())
    }]
});

var gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
};

// The speed gauge
var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 200,
        title: {
            text: 'Speed'
        }
    },

    credits: {
        enabled: false
    },

    series: [{
        name: 'Speed',
        data: [80],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">km/h</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' km/h'
        }
    }]

}));

// The RPM gauge
var chartRpm = Highcharts.chart('container-rpm', Highcharts.merge(gaugeOptions, {
    yAxis: {
        min: 0,
        max: 5,
        title: {
            text: 'RPM'
        }
    },

    series: [{
        name: 'RPM',
        data: [1],
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y:.1f}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">' +
                '* 1000 / min' +
                '</span>' +
                '</div>'
        },
        tooltip: {
            valueSuffix: ' revolutions/min'
        }
    }]

}));

// Bring life to the dials
setInterval(function () {
    // Speed
    var point,
        newVal,
        inc;

    if (chartSpeed) {
        point = chartSpeed.series[0].points[0];
        inc = Math.round((Math.random() - 0.5) * 100);
        newVal = point.y + inc;

        if (newVal < 0 || newVal > 200) {
            newVal = point.y - inc;
        }

        point.update(newVal);
    }

    // RPM
    if (chartRpm) {
        point = chartRpm.series[0].points[0];
        inc = Math.random() - 0.5;
        newVal = point.y + inc;

        if (newVal < 0 || newVal > 5) {
            newVal = point.y - inc;
        }

        point.update(newVal);
    }
}, 2000);