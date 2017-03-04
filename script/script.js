var margin = {t:50,r:50,b:50,l:50},
    width = document.getElementById('map').clientWidth - margin.l - margin.r,
    height = document.getElementById('map').clientHeight - margin.t - margin.b;

var map = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',450+margin.t+margin.b)
    .append('g').attr('class','map')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var lngLatBoston = [-71.0589,42.3601]

var path;

//import GeoJSON data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.csv, "data/soilPoints.csv")
    .await(function(err, states, points){

        console.log(points);

        var albersProjection = d3.geo.albersUsa()
            .translate([width/2,height/2])
            .scale(900);

        path = d3.geo.path()
            .projection(albersProjection);

        //Draw states as separate <path> elements
        map.selectAll('.state')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class','state')
            .attr('d',path)
            .attr('transform','translate(20,250)')
            .attr('stroke','gray')
            .attr('fill','none')
            .attr('stroke-width',1);

        map.selectAll('.points')
            .data(points)
            .enter()
            .append('circle')
            .attr('cx',function(d){
                d.x = albersProjection([d.long,+d.lat])[0];
                return albersProjection([d.long,+d.lat])[0] +5;
            })
            .attr('cy',function(d){
                d.y = albersProjection([d.long,+d.lat])[1];
                return albersProjection([d.long,+d.lat])[1];
            })
            .attr('transform','translate(20,250)')
            .attr('r',2)
            .attr('fill-opacity',.5)
            .attr('fill','purple')
            .on('mouseover',function(d){
                d3.select(this).transition().attr('fill-opacity',1).attr('r',5);

                map.append('text')
                    .attr('x',d.x)
                    .attr('y',d.y)
                    .attr('font-size',12)
                    .attr('fill','gray')
                    .attr('transform','translate(20,250)')
                    .attr('class','text-label')
                    .text(d.name);
            })
            .on('mouseout',function(d){
                d3.select(this).transition().attr('fill-opacity',.5).attr('r',2);
                d3.selectAll('.text-label').remove();

            });


        /*
        //Draw counties as a single <path> element
        map.append('path')
            .datum(counties)
            .attr('class','counties')
            .attr('d',path);*/


        /*function drawCircle(selection){
            selection
                .attr('cx',function(d){
                    return albersProjection(d)[0];
                })
                .attr('cy',function(d){
                    return albersProjection(d)[1];
                })
                .attr('r',5);
        }*/


    });

