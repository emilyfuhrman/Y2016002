window.onload = function(){

	return {

		//total time -- 01:11:57

		tot_hrs:1,
		tot_min:11,
		tot_sec:57,

		w:1280,
		h:1280,

		padding_top:90,

		ring_padding:5,
		ring_center:60,
		
		getData:function(){
			var self = this;
			
			d3.csv('data/frames.csv',function(e,d){
				if(d){ self.generate(d); }
			});
		},
		generate:function(_d){
			var self = this,
				data = _d || [];

			var sum_min = (self.tot_hrs*60) +self.tot_min;

			var svg = d3.select('#vis');

			var detailLine,
				detailText;

			detailLine = svg.selectAll('rect.detailLine')
				.data(['']);
			detailLine.enter().append('rect')
				.classed('detailLine',true);
			detailLine
				.attr('x',0)
				.attr('y',150)
				.attr('width',self.w)
				.attr('height',0.5)
				;
			detailLine.exit().remove();

			detailText = svg.selectAll('text.detail')
				.data(['']);
			detailText.enter().append('text')
				.classed('detail',true);
			detailText
				.attr('x',self.w/2)
				.attr('y',120);
			detailText.exit().remove();

			var rings,
				cross,

				labels,

				nodeG,

				nodesG,
				nodes,
				cross_01,
				cross_02,

				conns;

			var coord_ctr_x = self.w/2,
				coord_ctr_y = self.h/2 +self.padding_top -self.ring_center;

			rings = svg.selectAll('circle.ring')
				.data(d3.range(sum_min));
			rings.enter().append('circle')
				.classed('ring',true);
			rings
				.attr('class',function(d,i){
					var last = i === data.length -1 ? ' last ' : '',
						num = ' _' +(i +1);
					var str = last +num + ' ring';
					return str;
				})
				.attr('cx',self.w/2)
				.attr('cy',self.h/2 +self.padding_top)
				.attr('r',function(d,i){
					return self.ring_center +i*self.ring_padding;
				});
			rings.exit().remove();

			var xH = 1000;

			cross = svg.selectAll('line.cross')
				.data([1,2]);
			cross.enter().append('line')
				.classed('cross',true);
			cross
				.attr('x1',function(d,i){
					return i === 0 ? coord_ctr_x -(xH/2) : coord_ctr_x;
				})
				.attr('y1',function(d,i){
					return i === 0 ? coord_ctr_y +self.ring_center : coord_ctr_y -(xH/2) +self.ring_center;
				})
				.attr('x2',function(d,i){
					return i === 0 ? coord_ctr_x +(xH/2) : coord_ctr_x;
				})
				.attr('y2',function(d,i){
					return i === 0 ? coord_ctr_y +self.ring_center : coord_ctr_y +(xH/2) +self.ring_center;
				});
			cross.exit().remove();

			var labelDist = xH/2;

			labels = svg.selectAll('text.label')
				.data(['Graphic conflict','Directional conflict','Conflict of scale','Spatial conflict']);
			labels.enter().append('text')
				.classed('label',true);
			labels
				.attr('class',function(d,i){
					return i%2 === 0 ? 'label left' : 'label right'
				})
				.attr('x',function(d,i){
					var dist_from_ctr = i%2 === 0 ? -labelDist : labelDist;
					return coord_ctr_x +dist_from_ctr;
				})
				.attr('y',function(d,i){
					var dist_from_ctr = i <= 1 ? -labelDist +10 : labelDist -10;
					return coord_ctr_y +self.ring_center +dist_from_ctr;
				})
				.text(function(d){ return d; })
			labels.exit().remove();

			var nodeW = 24;

			nodeG = svg.selectAll('g.nodeG')
				.data([data]);
			nodeG.enter().append('g')
				.classed('nodeG',true);
			nodeG.exit().remove();
			
			nodesG = nodeG.selectAll('g.nodesG')
				.data(function(d){ return d; });
			nodesG.enter().append('g')
				.classed('nodesG',true);
			nodesG
				.attr('transform',function(d,i){
					var dist_from_ctr_y = ((+d.Minutes_Total -1)*self.ring_padding) +self.ring_center;
					var ang,
						pos_x,
						pos_y;
					if(d.Type === 'Graphic'){
						ang = (180 +(Math.random() *90)) * Math.PI / 180;
					} else if(d.Type === 'Directional') {
						ang = (270 +(Math.random() *90)) * Math.PI / 180;
					} else if(d.Type === 'Scale'){
						ang = (90 +(Math.random() *90)) * Math.PI / 180;
					} else if(d.Type === 'Spatial'){
						ang = (360 +(Math.random() *90)) * Math.PI / 180;
					}
					pos_x = coord_ctr_x +Math.cos(ang)*dist_from_ctr_y;
					pos_y = coord_ctr_y +self.ring_center +Math.sin(ang)*dist_from_ctr_y;

					d.x = pos_x;
					d.y = pos_y;

					return 'translate(' +pos_x +',' +pos_y +')';
				});
			nodesG
				.on('mouseover',function(d){
					d3.selectAll('.focus').classed('focus',false);
					d3.select(this).classed('focus',true);
					d3.selectAll('.ring._' +d.Minutes_Total +', .bar.' +d.Type +'._' +d.Minutes_Total).classed('focus',true);

					var str = '0' +d.Hour +':' +d.Minute +':' +d.Second +' — ' +d.Notes;
					detailText.text(str);
				})
				.on('mouseout',function(d){
					d3.selectAll('.focus').classed('focus',false);
					detailText.text('');
				});
			nodesG.exit().remove();

			nodes = nodesG.selectAll('rect.node')
				.data(function(d){ return [d]; });
			nodes.enter().append('rect')
				.classed('node',true);
			nodes
				.attr('x',function(d){
					return -(nodeW/2);
				})
				.attr('y',function(d){
					return -(nodeW/2);
				})
				.attr('width',nodeW)
				.attr('height',nodeW)
				;
			nodes.exit().remove();

			var crossW = 1,
				crossH = 36;

			cross_01 = nodesG.selectAll('rect.cross_01')
				.data(function(d){ return [d]; });
			cross_01.enter().append('rect')
				.classed('cross_01',true);
			cross_01
				.attr('x',function(d){
					return -(crossW/2);
				})
				.attr('y',function(d){
					return -(crossH/2);
				})
				.attr('width',crossW)
				.attr('height',crossH)
				;
			cross_01.exit().remove();
			cross_02 = nodesG.selectAll('rect.cross_02')
				.data(function(d){ return [d]; });
			cross_02.enter().append('rect')
				.classed('cross_02',true);
			cross_02
				.attr('x',function(d){
					return -(crossH/2);
				})
				.attr('y',function(d){
					return -(crossW/2);
				})
				.attr('width',crossH)
				.attr('height',crossW)
				;
			cross_02.exit().remove();

			conns = nodeG.selectAll('line.conn')
				.data(function(d){ return d; });
			conns.enter().append('line')
				.classed('conn',true);
			conns
				.attr('x1',coord_ctr_x)
				.attr('y1',coord_ctr_y +self.ring_center)
				.attr('x2',function(d){
					return d.x;
				})
				.attr('y2',function(d){
					return d.y;
				});
			conns.exit().remove();

			//chart underneath
			var svg_02 = d3.select('#chart');
			var scale = d3.scale.linear()
				.domain([0,data.length])
				.range([0,300]);

			function generateCounts(_data,_type){
				var t = {};
				d3.range(0,data.length).forEach(function(_d){
					t[_d +1] = 0; 
				});
				_data.forEach(function(_d){
					if(_d.Type === _type){
						t[_d.Minutes_Total]++; 
					}
				});
				return t;
			}

			var data_graphic = generateCounts(data,'Graphic'),
				data_directional = generateCounts(data,'Directional'),
				data_scale = generateCounts(data,'Scale'),
				data_spatial = generateCounts(data,'Spatial');

			var rectW = 2,
				rectPad = Math.floor((self.w -(rectW*data.length))/data.length),
				axisPad = 0;

			var chartPaddingTop = 30,
				chartSpacing = 100;

			var chartLine_01,
				chart_01;
			chartLine_01 = svg_02.selectAll('line.graphic')
				.data([data_graphic]);
			chartLine_01.enter().append('line')
				.classed('graphic',true);
			chartLine_01
				.classed('chartLine',true)
				.attr('x1',0)
				.attr('y1',chartPaddingTop +chartSpacing)
				.attr('x2',self.w)
				.attr('y2',chartPaddingTop +chartSpacing)
			chartLine_01.exit().remove();
			chart_01 = svg_02.selectAll('rect.graphic')
				.data(d3.entries(data_graphic));
			chart_01.enter().append('rect')
				.classed('graphic',true);
			chart_01
				.attr('class',function(d){
					return 'Graphic bar _' +d.key;
				})
				.attr('width',rectW)
				.attr('height',function(d){
					return scale(d.value);
				})
				.attr('x',function(d,i){
					return i*rectPad;
				})
				.attr('y',function(d){
					return chartPaddingTop +chartSpacing -scale(d.value) -axisPad;
				});
			chart_01.exit().remove();

			var chartLine_02,
				chart_02;
			chartLine_02 = svg_02.selectAll('line.directional')
				.data([data_directional]);
			chartLine_02.enter().append('line')
				.classed('directional',true);
			chartLine_02
				.classed('chartLine',true)
				.attr('x1',0)
				.attr('y1',chartPaddingTop +(chartSpacing*2))
				.attr('x2',self.w)
				.attr('y2',chartPaddingTop +(chartSpacing*2))
			chartLine_02.exit().remove();
			chart_02 = svg_02.selectAll('rect.directional')
				.data(d3.entries(data_directional));
			chart_02.enter().append('rect')
				.classed('directional',true);
			chart_02
				.attr('class',function(d){
					return 'Directional bar _' +d.key;
				})
				.attr('width',rectW)
				.attr('height',function(d){
					return scale(d.value);
				})
				.attr('x',function(d,i){
					return i*(rectW +10);
				})
				.attr('y',function(d){
					return chartPaddingTop +(chartSpacing*2) -scale(d.value) -axisPad;
				});
			chart_02.exit().remove();

			var chartLine_03,
				chart_03;
			chartLine_03 = svg_02.selectAll('line.scale')
				.data([data_scale]);
			chartLine_03.enter().append('line')
				.classed('scale',true);
			chartLine_03
				.classed('chartLine',true)
				.attr('x1',0)
				.attr('y1',chartPaddingTop +(chartSpacing*3))
				.attr('x2',self.w)
				.attr('y2',chartPaddingTop +(chartSpacing*3))
			chartLine_03.exit().remove();
			chart_03 = svg_02.selectAll('rect.scale')
				.data(d3.entries(data_scale));
			chart_03.enter().append('rect')
				.classed('scale',true);
			chart_03
				.attr('class',function(d){
					return 'Scale bar _' +d.key;
				})
				.attr('width',rectW)
				.attr('height',function(d){
					return scale(d.value);
				})
				.attr('x',function(d,i){
					return i*(rectW +10);
				})
				.attr('y',function(d){
					return chartPaddingTop +(chartSpacing*3) -scale(d.value) -axisPad;
				});
			chart_03.exit().remove();

			var chartLine_04,
				chart_04;
			chartLine_04 = svg_02.selectAll('line.spatial')
				.data([data_spatial]);
			chartLine_04.enter().append('line')
				.classed('spatial',true);
			chartLine_04
				.classed('chartLine',true)
				.attr('x1',0)
				.attr('y1',chartPaddingTop +(chartSpacing*4))
				.attr('x2',self.w)
				.attr('y2',chartPaddingTop +(chartSpacing*4))
			chartLine_04.exit().remove();
			chart_04 = svg_02.selectAll('rect.spatial')
				.data(d3.entries(data_spatial));
			chart_04.enter().append('rect')
				.classed('spatial',true);
			chart_04
				.attr('class',function(d){
					return 'Spatial bar _' +d.key;
				})
				.attr('width',rectW)
				.attr('height',function(d){
					return scale(d.value);
				})
				.attr('x',function(d,i){
					return i*(rectW +10);
				})
				.attr('y',function(d){
					return chartPaddingTop +(chartSpacing*4) -scale(d.value) -axisPad;
				});
			chart_04.exit().remove();

			var chartLabels;
			chartLabels = svg_02.selectAll('text.chartLabel')
				.data(['Graphic conflict','Directional conflict','Conflict of scale','Spatial conflict']);
			chartLabels.enter().append('text')
				.classed('chartLabel',true);
			chartLabels
				.attr('x',0)
				.attr('y',function(d,i){
					return chartPaddingTop +chartSpacing*(i +1) +36;
				})
				.text(function(d){ return d; });
			chartLabels.exit().remove();

			var axisL;
			axisL = svg_02.selectAll('text.axisL')
				.data(['00:00:00','00:00:00','00:00:00','00:00:00']);
			axisL.enter().append('text')
				.classed('axisL',true);
			axisL
				.attr('x',0)
				.attr('y',function(d,i){
					return chartPaddingTop +chartSpacing*(i +1) +18;
				})
				.text(function(d){ return d; });
			axisL.exit().remove();
			axisR = svg_02.selectAll('text.axisR')
				.data(['01:11:57','01:11:57','01:11:57','01:11:57']);
			axisR.enter().append('text')
				.classed('axisR',true);
			axisR
				.attr('x',self.w)
				.attr('y',function(d,i){
					return chartPaddingTop +chartSpacing*(i +1) +18;
				})
				.text(function(d){ return d; });
			axisR.exit().remove();
		}
	}
}().getData();