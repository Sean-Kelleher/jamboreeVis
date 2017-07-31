var polWords = ["russia",'congress','media','obama',"politician","election", "news", "vote", "republican", "democrat","administration"];
var scoutWords =["troop",'citizenship','service','prepared','fellowship','friendship','youth','character','leadership','conscience','kindness', 'merit'];
var polCount = 0;
var scoutCount = 0;
var polColor = '#ff0f0f';
var polStroke = '#4512c7';
var scoutColor = '#a67f14';
var scoutStroke = '#316b0a';
var vis = d3.select('#pie').append('svg').attr('width', '450').attr('height','450');
var g = vis.append("g");
var gap = 60;
var polWordsCounts = {};
//media:0,russia:0,congress:0, obama:0,election : 0, news:0, politician:0, vote:0, republican:0, democrat:0, administration:0
//troop:0,citizenship:0,service:0,prepared:0,fellowship:0,friendship:0,youth:0,character: 0, leadership:0, oath: 0, kindness: 0, conscience:0,merit:0
var scoutWordsCounts = {};
var y = d3.scaleLinear()
		.domain([0, 10])
		.range([0, 200]);

d3.text('transcript.txt',function(error,data){
	//Put each word of the transcript into an array, all lowercase, getting problematic line breaks out of the way
	var modded = data.toLowerCase().replace(/(\r\n|\n|\r)/gm," ");
	var transcript = modded.split(' ');

	function fillStuff(words, wordsCounts){
		words.forEach(function(elem){
			wordsCounts[elem] = 0;
		})
		//Use includes() due to punctuation marks
		words.forEach(function(elem){
			for(var i = 0; i < transcript.length; i++)
			{
				if(transcript[i].includes(elem))
				{
					wordsCounts[elem]++;
				}
			}
		})
	}
	function countUp(words){
		var count = 0;
		words.forEach(function(elem){
			for(var i = 0; i < transcript.length; i++)
			{
				if(transcript[i].includes(elem))
				{
					count++;
				}
			}
		})	
		return count;
	}
	
	fillStuff(polWords, polWordsCounts);
	fillStuff(scoutWords, scoutWordsCounts);
	polCount = countUp(polWords);
	scoutCount = countUp(scoutWords);

	function makeWordLists(){
		var polStr = '';
		var scoutStr = '';
		polWords.forEach(function(elem){
			polStr += elem + ", "
		})
		scoutWords.forEach(function(elem){
			scoutStr += elem + ", "
		})
		polStr = polStr.substring(0, polStr.length-2);
		scoutStr = scoutStr.substring(0, scoutStr.length-2);
		d3.select("#polList").text(polStr);
		d3.select("#scoutList").text(scoutStr);
	}
	makeWordLists();

	function viewBars(d){
		var source;
		var color;
		if(d.value > 15)
		{
			//bars for polwordscounts
			source = d3.entries(polWordsCounts);
			color = polColor;
		}
		else
		{
			//bars for scoutwordscounts
			source = d3.entries(scoutWordsCounts);
			color = scoutColor;
		}
		var vis = d3.select("#bars").append('svg').attr('width',1000).attr('height',220).attr('id','barsView');
		var bars = vis.selectAll('g').data(source)
			.enter()
			.append('g')
			.attr('class','bar');
		d3.selectAll('.bar').append('rect')
			.attr('width','30')
			.attr('height', function(d){
				if(d.value==0)
					return 2;
				else
					return y(d.value);})
			.attr('x', function(d, i){return i * gap})
			.attr('y',function(d){
				if(d.value==0)
					return 188;
				else
					return 190-y(d.value)})
			.attr('fill',color)
		d3.selectAll('.bar').append('text')
			.text(function(d){return d.key;})
			.attr('x', function(d, i){return i * gap})
			.attr('y', '200')
			.attr('class','barLabel')
			.style('font-size','10px')
			
		d3.selectAll('.bar').append('text')
			.text(function(d){return d.value;})
			.attr('x', function(d, i){return i * gap})
			.attr('y', function(d){return 186-y(d.value)})
			.attr('class','barNum')
			.style('font-size','10px')
	}
	function removeBars(){
		d3.selectAll('#barsView').remove();
	}
	var dataset = [polCount, scoutCount];
	
	var arcData = d3.pie()(dataset);
	
	var pie = d3.pie()
    	.sort(null)
    	.value(function(d) {return d});
	
	var path = d3.arc()
	    .outerRadius(200)
	    .innerRadius(0);

	var arc = g.selectAll(".arc")
    	.data(pie(dataset))
    	.enter().append("g")
      	.attr("class", "arc");

  	arc.append("path")
      .attr("d", path)
      .attr('transform',"translate(210,210)")
      .attr('class','slice')
      .attr("fill", function(d, i){
      	if(i == 0)
    		return polColor;
      	else
    		return scoutColor;
    		})
      .attr("stroke", function(d, i){
      	if(i == 0)
      		return polStroke;
      	else
      		return scoutStroke;
      	})
      .attr('stroke-width','4px')
      .on('mouseover',viewBars)
      .on('mouseout',removeBars);

    arc.append("text")
    	.attr('class','label')
    	.attr('dy', '0.33em')
    	.text(function(d){return d.value})
    	.attr('x', function(d){return path.centroid(d)[0]})
    	.attr('y', function(d){return path.centroid(d)[1]})
    	.attr('transform','translate(210,210)');
})