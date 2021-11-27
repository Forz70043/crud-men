const Entity = require('../../entity');


class Dashboard extends Entity {
    constructor(){
        super();
        
        this.COLORS = [
            '#4dc9f6',
            '#f67019',
            '#f53794',
            '#537bc4',
            '#acc236',
            '#166a8f',
            '#00a950',
            '#58595b',
            '#8549ba'
        ];

        this.CHART_COLORS = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        this.NAMED_COLORS = [
            this.CHART_COLORS.red,
            this.CHART_COLORS.orange,
            this.CHART_COLORS.yellow,
            this.CHART_COLORS.green,
            this.CHART_COLORS.blue,
            this.CHART_COLORS.purple,
            this.CHART_COLORS.grey,
        ];

        this.MONTHS = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

    }

    /*export*/ color(index) {
        return this.COLORS[index % this.COLORS.length];
    }

    /*export*/ namedColor(index) {
        return this.NAMED_COLORS[index % NAMED_COLORS.length];
    }
    
    /*export*/ newDate(days) {
        return DateTime.now().plus({days}).toJSDate();
    }
      
    /*export*/ newDateString(days) {
        return DateTime.now().plus({days}).toISO();
    }
      
    /*export*/ parseISODate(str) {
        return DateTime.fromISO(str);
    }




}
module.exports = Dashboard;

