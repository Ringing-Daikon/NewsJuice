angular.module('smartNews.services', ['ngCookies'])

.factory('renderWatsonBubbleChart', function($rootScope, $http) {
  
  /* 
    returns a promise that will return tone analysis data for
    the given string input.
  */
  var analyzeText = (text) => {
    var data = {text};
    return $http.post('/toneAnalysis', data)
      .then((response)=>{
        return response.data;
      }, (error)=>{
        console.log(error);
        return null;
      });
  };

  // set dimensions outside of renderWatsonBubbleChart function
  // so that closure preserves its value with different
  // instances of the function.
  var dimensions = {}

  var renderWatsonBubbleChart = function(articleData, event) {
    
    var button = angular.element(event.target);
    // If a bubbleChart has already been rendered for that article,
    // don't render another one.
    if (button.hasClass('inactive')) {
      button.removeClass('inactive');

      // HANDLE UNRENDERING BUBBLE CHART HERE
      var svgNode = event.path[3].childNodes[4];
      var svg = d3.select(svgNode);

      svg.transition()
        .duration(200)
        .attr('height', 0)


    } else {
      button.addClass('inactive');

      var svgExists = false;
      var svg;

      var node = event.path[3].childNodes;

      //check if a bubble chart already exists for that article.
      for (var i = 0; i < node.length; i++) {
        if (node[i].tagName === 'svg') {
          svg = node[i];
          svgExists = true;
        }
      }
      if (svgExists) {
        d3.select(svg)
          .transition()
            .duration(200)
            .attr('height', dimensions[articleData.id].height)
      } else {

        // Send article text to watson, get tone data back.
        analyzeText(articleData.body)
          .then((responseData) => {
            var data = responseData.document_tone.tone_categories[0].tones;

            var rTotal = 0;
            for (var i = 0; i < data.length; i++) {
              data[i].r = (data[i].score * 75) + 10;
              rTotal += data[i].r;
            }

            // packSiblings takes in data with an 'r' (radius)
            // property, and generates 'x' and 'y' properties
            // on each item that will reflect their position
            // on the bubble chart.
            var circles = d3.packSiblings(data);

            // determine the dimensions of the bubble chart
            var farLeft = circles[0].x - circles[0].r;
            var farTop = circles[0].y - circles[0].r;
            var farRight = circles[0].x + circles[0].r;
            var farBottom = circles[0].y + circles[0].r;

            for (var i = 0; i < circles.length; i++) {
              var left = circles[i].x - circles[i].r;
              var top = circles[i].y - circles[i].r
              var right = circles[i].x + circles[i].r;
              var bottom = circles[i].y + circles[i].r;

              var farLeft = left < farLeft ? left : farLeft;
              var farTop = top < farTop ? top : farTop;
              var farRight = right > farRight ? right : farRight;
              var farBottom = bottom > farBottom ? bottom : farBottom;
            }

            dimensions[articleData.id] = {
              width: farRight - farLeft + 100,
              height: farBottom - farTop + 17
            }

            // create svg container with slide-down effect
            var svg = d3.select(event.path[3])
              .insert('svg', '.article-body')
              .attr('width', 0)
              .attr('height', 0)
              .attr('class', 'article-bubble-chart')
              .style('margin-bottom', '10px');
            svg.transition()
              .duration(200)
              .attr('width', dimensions[articleData.id].width)
              .attr('height', dimensions[articleData.id].height);

            // set up the bubble chart
            var nodes = svg.append('g')
              .attr('transform', `translate(${Math.abs(farLeft) + 50}, ${Math.abs(farTop) + 12})`)
              .selectAll('.bubble')
              .data(circles)
              .enter();

            // render the bubbles
            var bubble = nodes.append('circle')
              .attr('r', 0)
              .transition()
                .duration(500)
                .attr('r', (d) => {
                  return d.r - 0.5;
                });

            //increment the colorIndex to pick a different color for each bubble.
            var strokeIndex = 0;
            var fillIndex = 0;

            // colors for different bubbles
            var colors = {
              anger: '#E80521',
              disgust: '#592684',
              fear: '#325E2B',
              joy: '#FF8C23',
              sadness: '#086DB2'
            }
            var colorScheme = 0;
            var bubbleOpacity = .8;
            var strokeOpacity = 1;


            // style the bubbles
            bubble.attr('cx', (d) => d.x)
              .attr('cy', (d) => d.y - 5)
              .style('fill', (d) => colors[d.tone_id])
              .style('fill-opacity', bubbleOpacity);

            d3.selectAll('circle')
              .classed('small-bubble', (d) => {
                return d.r < 25;
              });
              
            // Add text to the bubbles.
            colorIndex = 0;

            nodes.filter((d) => d.r >= 25)
              .append('text')
              .attr('x', (d) => {
                return d.x;
              })
              .attr('y', (d) => d.y)
              .attr('text-anchor', 'middle')
              .attr('class', 'bubble-label')
              .text((d) => d.tone_name)
              .style('fill', 'white')
              .style('font-family', '"Karla", regular')
              .style('font-size', '14px')
              .style('letter-spacing', '0.01em')

            var smallBubbleLabel = d3.select('.bubble-label-svg');
            var toneId;
            d3.selectAll('circle')
              .on('mouseover', function(d) {
                d3.select(this)
                  .transition()
                    .duration(100)
                    .style('fill-opacity', '1');
                toneId = d.tone_id;
                var circle = angular.element(this);
                if (circle.hasClass('small-bubble')) {
                  
                  

                  nodes.filter((d) => d.r < 25 && d.tone_id === toneId)
                    .append('text')
                    .attr('x', (d) => d.x + d.r)
                    .attr('y', (d) => d.y - d.r)
                    .attr('class', 'bubble-label')
                    .text((d) => d.tone_name)
                    .style('fill', 'white')
                    .style('font-family', '"Karla", regular')
                    .style('font-size', '14px')
                    .style('letter-spacing', '0.01em')
                    .style('text-shadow', '0 0 5px black, 0 0 5px black, 0 0 5px black')

                  nodes.filter((d) => d.r < 25 && d.tone_id === toneId)
                    .append('line')
                    .attr('x1', d.x)
                    .attr('y1', d.y - 3)
                    .attr('x2', d.x + d.r - 1)
                    .attr('y2', d.y - d.r + 1)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '1')
                }
              })
              .on('mouseout', function(d) {
                d3.select(this)
                  .transition()
                    .duration(100)
                    .style('fill-opacity', bubbleOpacity)

                var lines = d3.selectAll('line')
                lines.remove();

                var text = d3.selectAll('text')
                  .filter((d) => d.tone_id === toneId && d.r < 25)
                  .transition()
                    .duration(200)
                    .style('opacity', 0)
                text.remove();
              });
          })    
      } 
    }
  }

  var removeBubbleChart = function(event) {
    var svg = d3.selectAll('svg')
      .transition()
        .duration(200)
        .attr('height', 0);

    d3.select('.inactive')
      .classed('inactive', false);

    svg.remove();
  }

  var hideBubbleChart = function(event) {
    var button = angular.element(event.target);
    if (button.hasClass('inactive')) {
      button.removeClass('inactive');
      var svg = event.path[3].children[2];
      d3.select(svg)
        .transition()
          .duration(200)
          .attr('height', 0);
      return false;
    }
    return true;
  }

  return {
    renderWatsonBubbleChart: renderWatsonBubbleChart,
    removeBubbleChart: removeBubbleChart,
    hideBubbleChart: hideBubbleChart
  }
})

.factory('renderGraph', function($rootScope) {
  var selectedDate = {
    startDate: 'NOW-2DAYS',
    endDate: 'NOW'
  };

  var renderGraph = function(dataObj) {

    data = dataObj.data.timeSeries;

    //clear out contents of graph prior to rendering, to prevent stacking graphs
    // using 'window' is necessary here due to lexical scope.
    if (window.graph.innerHTML !== undefined) {
      window.graph.innerHTML = '';
    }

    // set graph dimensions and margins
    var margin = { top: 0, right: 50, bottom: 50, left: 50 };

    // fixed size graph. These values are shorter than true innerWidth / innerHeight:
    var graph = document.getElementById('graph');
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight * 0.5 - margin.top - margin.bottom;
    height = height > 350 ? 350 : height;

    // parse UTC date/time
    var parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

    // set X & Y range
    // range is the raw data values scaled to fit the graph dimensions
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var svg = d3.select('#graph')
      .append('div')
      // .classed('svg-container', true) //container class to make it responsive
      .append('svg')
      // responsive SVG needs these two attr's and an absence of height and width attr's
      .attr('viewBox', '0 0 ' + (window.innerWidth) + ' ' + 400 )
      // append group element
      .append('g')
      // center group element on page by subtracting viewbox length from viewport length, halving, and spacing that many pixels
      .attr('transform', 'translate(' + ((window.innerWidth - width) / 2) + ',0)')
      .classed("svg-content-responsive", true);

    // div element for tooltip
    var div = d3.select('#graph').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // format data
    data.forEach(function(d) {
      d.date = parseTime(d.publishedAt);
      d.value = d.count;
    });

    // create line and set x/y values
    var valueline = d3.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.value);
      });

    // filled area definition
    var dataFill = d3.area()
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(d.value); });

    // set min and max values of data
    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    // create filled area
    svg.append('path')
      .datum(data)
      .attr('class', 'datafill')
      .attr('d', dataFill);

    // add valueline path to graph
    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', valueline);

    svg.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('width', width / data.length)
      .attr('height', height)
      .attr('x', function(d) {
        return x(d.date - (width / data.length / 2));
      })
      .attr('y', 0)
      .attr('class', 'tooltip-target')
      .on('mouseover', function(d) {
        d3.select(this)
          .classed('tooltip-target-on', true);
        div.transition()
          .duration(100)
          .style('opacity', 0.75);
        div.html(
            '<span class="tooltip-date">' + moment(d.date).format("MM/DD/YYYY") + '<br/>' + '<span class="tooltip-value">' + d.value + ' articles'
          )
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .classed('tooltip-target-on', false);
        div.transition()
          .duration(250)
          .style('opacity', 0);
      })
      .on('click', function(d) {
        var startDate = d.publishedAt.split('T')[0];
        selectedDate.startDate = new Date(startDate).toISOString();
        var endDate = new Date(startDate);
        endDate = endDate.setDate(endDate.getDate() + 1);
        selectedDate.endDate = new Date(endDate).toISOString();
        $rootScope.$broadcast('user:clickDate', selectedDate);
      });

    // add x-axis labels
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // add y-axis labels
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + '0' + ')')
      .call(d3.axisLeft(y));
  };

  return {
    renderGraph: renderGraph,
    selectedDate: selectedDate
  };
})

.factory('isAuth', function($cookies) {
  return function() {
    var auth = $cookies.get('authenticate');
    if (auth && auth !== 'undefined') {
      var parsedAuth = JSON.parse(auth.slice(2)).user;
      return {
        _facebookUniqueID: parsedAuth._facebookUniqueID,
        firstname: parsedAuth.firstname,
        lastname: parsedAuth.lastname,
        picture: parsedAuth.picture,
      };
    }
    return null;
  };
})

.factory('saveArticle', function($http) {
  return function(article) {
    $http({
      method: 'POST',
      data: article,
      url: '/article'
    })
      .then(function(data) {
        console.log('success posting', data);
      });
  };
})

.factory('unsaveArticle', function($http) {
  return function(article, cb) {
    var url = '/unsavearticle/' + article._id;
    $http({
      method: 'DELETE',
      url: url
    })
    .then(function(data) {
      console.log('success deleting', data);
      cb();
    });
  };
})

.factory('getSavedSearches', function($http) {
  return function(cb) {
    $http({
      method: 'GET',
      url: '/profile'
    })
    .then(function(data) {
      data.data.forEach(function(e) {
        e.formattedPublishDate = moment(e.publishDate).format('MMM DD YYYY');
        e.formattedSavedDate = moment(e.savedDate).format('MMM DD YYYY');
      });
      cb(data.data);
    });
  };
})

.factory('Comment', function($http, $q) {
  var url = '/comments/';
  return {
    get: function(article) {
      return $http({
        method: 'GET',
        url: url + article.id,
      });
    },
    save: function(commentText, user, article) {
      return $http({
        method: 'POST',
        url: url + article.id,
        data: {
          _facebookUniqueID: user._facebookUniqueID,
          text: commentText
        }
      });
    },
    edit: function(commentID, commentText) {
      return $http({
        method: 'PUT',
        url: url + commentID,
        data: {
          text: commentText
        }
      });
    },
    delete: function(commentID) {
      return $http({
        method: 'DELETE',
        url: url + commentID
      });
    },
    getUsers: function(fbIds) {
      return $q.all(fbIds.map(function (fbId) {
        return $http({
          method: 'GET',
          url: '/user/' + fbId
        })
      })).then(function (results) {
        var result = {};
        results.forEach(function (val, i) {
          result[fbIds[i]] = val.data;
        });
        return result;
      })
    }
  };
})

.factory('TopTrendsFactory', function($http) {
  function getPrimaryArticle (title) {
    title = title.replace('<b>', '')
      .replace('</b>', '')
      .replace('&#39;', '');
    var publishEnd = 'NOW';
    var publishStart = publishEnd + '-2DAYS';
    return $http({
      method: 'GET',
      url: 
        '/seearticle?input=' + title 
        + '&start=' + publishStart 
        + '&end=' + publishEnd 
        + '&limit=1'
    }).then(function(res) {
      return res.data.stories[0];
    });
  };
  function getGoogleTrends () {
    return $http({
      method: 'GET',
      url: '/api/news/topTrendsDetail'
    }).then(function(res) {
      return res.data.map(function(topic) {
        return {
          topic: topic.title[0],
          articleTitle: topic['ht:news_item'][0]['ht:news_item_title'][0],
          traffic: topic['ht:approx_traffic'][0],
          img: 'http://' + topic['ht:picture'][0].slice(2),
          articleLink: topic['ht:news_item'][0]['ht:news_item_url'][0],
          articleSource: topic['ht:news_item'][0]['ht:news_item_source'][0]
        };
      });
    });
  };
  return {
    getTrends: getGoogleTrends,
    getPrimaryArticle: getPrimaryArticle
  }
});