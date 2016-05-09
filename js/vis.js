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
				.classed('last',function(d,i){
					return i === data.length -1;
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
					var dist_from_ctr_y = (+d.Minutes_Total*self.ring_padding) +(+d.Second/60*self.ring_padding) +self.ring_center;
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
		}
	}
}().getData();