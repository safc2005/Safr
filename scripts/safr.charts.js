var safrCharts = safrCharts || {};

var data, options, chart;

safrCharts = {

      // Callback that creates and populates a data table, instantiates the pie chart, passes in the data and draws it.
    drawChart : function() {

        // Create the data table.
        data = new google.visualization.DataTable();
        data.addColumn('string', 'Incidents');
        data.addColumn('number', 'How many...');
        data.addRows([
            ['theft', 3],
            ['Onions', 1],
            ['Olives', 1],
            ['Zucchini', 1],
            ['Pepperoni', 2]
        ]);

        // Set chart options
        options = {'title':'Incidents this month',
                     'width':400,
                     'height':300};

        // Instantiate and draw our chart, passing in some options.
        chart = new google.visualization.PieChart(document.getElementById('arraycontent4'));
        
    },
    displayChart : function(){
        chart.draw(data, options);  
    }

}
// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(safrCharts.drawChart);