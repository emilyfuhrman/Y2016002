window.onload = function(){

	return {

		//total time -- 01:11:57

		tot_hrs:1,
		tot_min:11,
		tot_sec:57,

		w:1280,
		h:1024,

		padding_top:45,

		ring_padding:3.5,
		
		getData:function(){
			var self = this;
			
			d3.csv('data/frames.csv',function(e,d){
				if(d){ self.generate(d); }
			});
		},
		generate:function(_d){
			var self = this,
				data = _d || [];

			var sum_min = (self.tot_hrs*60) +self.tot_sec;

			var rings = d3.select('#vis').selectAll('circle.ring')
				.data(d3.range(sum_min));
			rings.enter().append('circle')
				.classed('ring',true);
			rings
				.classed('highlight',function(d,i){
					return i%2 === 0;
				})
				.attr('cx',self.w/2)
				.attr('cy',self.h/2 +self.padding_top)
				.attr('r',function(d,i){
					return 30 +i*self.ring_padding;
				});
			rings.exit().remove();
		}
	}
}().getData();