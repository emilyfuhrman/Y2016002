window.onload = function(){

	return {

		//total time -- 01:11:57

		tot_hrs:1,
		tot_min:11,
		tot_sec:57,

		w:1280,
		h:1280,

		padding_top:45,

		ring_padding:6,
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
				nodeG,
				nodesG,
				nodes;
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
					return self.w/2 -12;
				})
				.attr('y',function(d){
					return self.h/2 +self.padding_top -self.ring_center -(+d.Minutes_Total*self.ring_padding) -12;
				})
				.attr('width',24)
				.attr('height',24)
				;
			nodes.exit().remove();
		}
	}
}().getData();