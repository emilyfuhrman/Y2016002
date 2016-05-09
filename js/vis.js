window.onload = function(){

	return {

		//total time -- 01:11:57

		tot_hrs:1,
		tot_min:11,
		tot_sec:57,

		w:1280,
		h:1280,

		padding_top:45,

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

			var crossH = 1000;

			cross = svg.selectAll('line.cross')
				.data([1,2]);
			cross.enter().append('line')
				.classed('cross',true);
			cross
				.attr('x1',function(d,i){
					return i === 0 ? coord_ctr_x -(crossH/2) : coord_ctr_x;
				})
				.attr('y1',function(d,i){
					return i === 0 ? coord_ctr_y +self.ring_center : coord_ctr_y -(crossH/2) +self.ring_center;
				})
				.attr('x2',function(d,i){
					return i === 0 ? coord_ctr_x +(crossH/2) : coord_ctr_x;
				})
				.attr('y2',function(d,i){
					return i === 0 ? coord_ctr_y +self.ring_center : coord_ctr_y +(crossH/2) +self.ring_center;
				});
			cross.exit().remove();

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
			nodesG.exit().remove();

			nodes = nodesG.selectAll('rect.node')
				.data(function(d){ return [d]; });
			nodes.enter().append('rect')
				.classed('node',true);
			nodes
				.attr('x',function(d){
					return coord_ctr_x -(nodeW/2);
				})
				.attr('y',function(d){
					var dist_from_ctr = (+d.Minutes_Total*self.ring_padding) +(+d.Second/60*self.ring_padding);
					return coord_ctr_y -(dist_from_ctr) -(nodeW/2);
				})
				.attr('width',nodeW)
				.attr('height',nodeW)
				;
			nodes.exit().remove();

			var crossW = 0.5,
				crossH = 36;

			cross_01 = nodesG.selectAll('rect.cross_01')
				.data(function(d){ return [d]; });
			cross_01.enter().append('rect')
				.classed('cross_01',true);
			cross_01
				.attr('x',function(d){
					return coord_ctr_x -(crossW/2);
				})
				.attr('y',function(d){
					var dist_from_ctr = (+d.Minutes_Total*self.ring_padding) +(+d.Second/60*self.ring_padding);
					return coord_ctr_y -(dist_from_ctr) -(crossH/2);
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
					return coord_ctr_x -(crossH/2);
				})
				.attr('y',function(d){
					var dist_from_ctr = (+d.Minutes_Total*self.ring_padding) +(+d.Second/60*self.ring_padding);
					return coord_ctr_y -(dist_from_ctr) -(crossW/2);
				})
				.attr('width',crossH)
				.attr('height',crossW)
				;
			cross_02.exit().remove();

			conns = nodesG.selectAll('line.conn')
				.data(function(d){ return [d]; });
			conns.enter().append('line')
				.classed('conn',true);
			conns
				.attr('x1',coord_ctr_x)
				.attr('y1',coord_ctr_y)
				.attr('x2',function(d){
					return coord_ctr_x;
				})
				.attr('y2',function(d){
					var dist_from_ctr = (+d.Minutes_Total*self.ring_padding) +(+d.Second/60*self.ring_padding);
					return coord_ctr_y -(dist_from_ctr);
				});
			conns.exit().remove();
		}
	}
}().getData();